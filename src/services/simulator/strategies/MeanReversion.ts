
import { BigNumber } from 'ethers'

import { Feed, PriceData } from "../../pricefeed/PricefeedService"
import { PoolTokensSwapsInfo } from "../../../types/PoolTokensSwapsInfo";
import { SwapInfo } from '../../../types/SwapInfo'
import { round } from '../../../utils/formatter'
import { Strategy, StrategyPrices} from "./Strategy"
import { Token } from "../../../types/Token"


export class MeanReversion implements Strategy {

    feed: Feed;
    depositToken: Token
    investToken: Token

    readonly minAllocationPerc = 0.20     // 20% min allocation to both assets
    readonly tokensToSwapPerc = 0.05        // 5% of the value of the asset sold
    readonly targetPricePercDown = -0.33 // 33% below long term trend
    readonly targetPricePercUp = 0.66 // 66% above long term trend
    readonly movingAveragePeriod = 350   // 350 day Moving Average
    readonly executionInterval = 5 * 86400  // buy/sell every 5 days
    
    readonly priceFeedDecimals = 8

    private movingAverage = 0 // the price of the MA
    private latestPrice = 0   // the latest price of the risk asset
    private lastEvalTime = 0  // lhe last time the strategy was evalued


    // asset balances
    private investTokenBalance = 0
    private depositTokenBalance = 0


    constructor(feed: Feed, depositToken : Token, investToken : Token) {
        this.depositToken = depositToken
        this.investToken = investToken
        this.feed = feed
    }


    simulate(from: Date, to: Date, amount: number): PoolTokensSwapsInfo | undefined {

        // set moving average
        this.movingAverage = this.averagePrice(from, this.movingAveragePeriod) /// 47,957 (350D)
        this.lastEvalTime = ( from.getTime() / 1000 )

        const priceFrom = this.feed.getPrice(from)
        const priceTo = this.feed.getPrice(to)
        const swaps : SwapInfo[] | undefined = this.getSwaps(from, to, amount)

        if (priceFrom && priceTo && swaps) {
            const startTimestamp = round( from.getTime() / 1000, 0);
            const endTimestamp = round( to.getTime() / 1000, 0);

            const priceFromFormatted =  BigNumber.from(`${ round(priceFrom * 10**this.priceFeedDecimals, 0) }`)
            const priceToFormatted =  BigNumber.from(`${ round(priceTo * 10**this.priceFeedDecimals, 0) }`)

            const response = {
                poolId: "0",
                weight: 1,
                priceInfoStart: {
                    symbol: this.investToken.symbol,
                    price: priceFromFormatted,
                    timestamp: startTimestamp,
                },
                priceInfo: {
                    symbol: this.investToken.symbol,
                    price: priceToFormatted,
                    timestamp: endTimestamp,
                },
                swaps: swaps
            }
            return response
        }
    }


    
    /**
     * @returns price information fot this trategy, including moving averages
     * and other relevant indicators
     */
    getPrices(from: Date, to: Date) : StrategyPrices []  {

        // set initialvalue of moving average
        this.movingAverage = this.averagePrice(from, this.movingAveragePeriod)
        this.lastEvalTime = ( from.getTime() / 1000 )

        let response : StrategyPrices[] = []
        
        this.feed.getPrices(from, to).forEach( (it, idx) => {
            
            // update MA only when the strategy is supposed to execute
            if ((it.date.getTime() / 1000) >= this.lastEvalTime + this.executionInterval) {
                this.updateMovingAverage(it.price, it.date)
            }
            
            response.push({
                date: it.date,
                price: it.price,
                ma: this.movingAverage,
                upper: this.movingAverage * (1 + this.targetPricePercUp),
                lower: this.movingAverage * (1 + this.targetPricePercDown),
            })
        })

        return response
    }



    getSwaps(from: Date, to: Date, initialDepositTokenBalance: number) : SwapInfo[] | undefined {

        this.depositTokenBalance = initialDepositTokenBalance

        // filter for price range
        const prices = this.feed.getPrices(from, to)

        let response : SwapInfo[] = []

        prices.forEach( (it, idx) => {

            if (idx > 0 && (it.date.getTime() / 1000) < this.lastEvalTime + this.executionInterval) {
                return
            }

            // update current price, moving average and lastEvalTimestamp
            this.updateMovingAverage(it.price, it.date)

            // evaluate strategy
            const { action, amountIn } = this.evaluateTrade()

            let shouldBuy : boolean = action === 'BUY'
            let shouldSell: boolean = action === 'SELL'
            let amount : number = amountIn

            // 3. handle rebalancing situations when either token balance is too low
            const depositTokensToSell = this.rebalanceDepositTokensAmount()
            if (depositTokensToSell > 0) {
                const maxAmount = (action === 'BUY') && (amountIn > depositTokensToSell) ? amountIn : depositTokensToSell;
                shouldBuy = true
                amount = maxAmount
            }

            const investTokensToSell = this.rebalanceInvestTokensAmount();
            if (investTokensToSell > 0) {
                const maxAmount = (action === 'SELL') && (amountIn > investTokensToSell) ? amountIn : investTokensToSell;
                shouldSell = true
                amount = maxAmount
            }

            // console.log("this.latestPrice", this.latestPrice)
            
            const bought = shouldSell ? this.formatAmount(amount * this.latestPrice, this.depositToken.decimals) :
                            shouldBuy ? this.formatAmount(amount / this.latestPrice, this.investToken.decimals) : ''


            const sold = shouldSell ? this.formatAmount(amount, this.investToken.decimals) : 
                            shouldBuy ? this.formatAmount(amount, this.depositToken.decimals) : ''
                        
            if (shouldSell || shouldBuy) {

                // console.log("eval: ", it.date.toISOString().split('T')[0], it.price, action )

                const depositTokenDelta = shouldSell ? amount * this.latestPrice : shouldBuy ? -amount : 0
                const investTokenDelta = shouldSell ? -amount  : shouldBuy ? amount / this.latestPrice : 0

                this.depositTokenBalance += depositTokenDelta
                this.investTokenBalance += investTokenDelta

                response.push({
                    timestamp: `${this.lastEvalTime}`,
                    side: shouldBuy ? 'BUY' : 'SELL',
                    feedPrice: this.formatAmount(this.latestPrice, this.priceFeedDecimals),
                    bought: bought,
                    sold: sold,
                    depositTokenBalance: this.formatAmount(this.depositTokenBalance, this.depositToken.decimals),
                    investTokenBalance: this.formatAmount(this.investTokenBalance, this.investToken.decimals),
                    portfolioValue: this.formatAmount(this.portfolioValue(), this.depositToken.decimals),
                })
            }
            
        })


        return response
    }


    formatSwap(action: string, bought: string, sold: string)  {
        return {
            timestamp: `${this.lastEvalTime}`,
            side: action,
            feedPrice: this.formatAmount(this.latestPrice, this.priceFeedDecimals),
            bought: bought,
            sold: sold,
            depositTokenBalance: this.formatAmount(this.depositTokenBalance, this.depositToken.decimals),
            investTokenBalance: this.formatAmount(this.investTokenBalance, this.investToken.decimals),
            portfolioValue: this.formatAmount(this.portfolioValue(), this.depositToken.decimals),
        }
    }
    


    evaluateTrade() : { action: string | undefined, amountIn: number} {
        
        let action : string | undefined = undefined
        let amountIn: number = 0

        const poolValue = this.portfolioValue()
        const deltaPricePerc = (this.latestPrice - this.movingAverage) / this.movingAverage    // the % of price above/below the moving average

        const investPerc = this.investPercent()
        const depositPerc = poolValue > 0 ? 1 - investPerc : 0
   
        const shouldSell = deltaPricePerc >=  this.targetPricePercUp && investPerc > this.minAllocationPerc

        if (shouldSell) {
            // need to SELL invest tokens buying deposit tokens
            action = "SELL";
            amountIn = this.investTokenBalance * this.tokensToSwapPerc
        }

        const shouldBuy = deltaPricePerc <= this.targetPricePercDown && depositPerc > this.minAllocationPerc

        if (shouldBuy) {
            // need to BUY invest tokens spending depositTokens
            action = "BUY"
            amountIn = this.depositTokenBalance * this.tokensToSwapPerc
        }


        return { action, amountIn };
    }


    rebalanceDepositTokensAmount() {
        const investPerc = this.investPercent()
        let amountIn = 0;

        if (investPerc < this.minAllocationPerc) {
            // calculate amount of deposit tokens to sell (to BUY invest tokens)
            const maxPerc = 1 - this.minAllocationPerc  //  1 - this.minAllocationPerc)
            const poolValue = this.portfolioValue()
            const maxDepositValue = poolValue * maxPerc
            const depositTokenValue = this.depositTokenBalance

            amountIn = (depositTokenValue > maxDepositValue) ? depositTokenValue - maxDepositValue : 0
        }

        return amountIn;
    }


    rebalanceInvestTokensAmount() {

        const investPerc = this.investPercent()
        const depositPerc = 1 - investPerc

        const targetDepositPerc = this.minAllocationPerc
        let amountIn = 0;

        if (depositPerc < targetDepositPerc) {
            const price = this.latestPrice
            // calculate amount of invest tokens to sell (to BUY deposit tokens)

            // need to SELL some investment tokens
            const poolValue = this.portfolioValue();
            const investTokenValue = this.riskAssetValue();

            const targetInvestPerc = 1 - targetDepositPerc;  //  (e.g. 80%)
            const targetInvestTokenValue = poolValue * targetInvestPerc
           
            // calcualte amount of investment tokens to SELL
            amountIn = (investTokenValue - targetInvestTokenValue) / price;
        }

        return amountIn;
    }


    // Returns the simple moving average up to the date 'to' and for the number of days 'period'
    averagePrice(to: Date, period: number) : number {

        const from = new Date( ( (to.getTime() / 1000) - (period * 86400)) * 1000 )
        const prices = this.feed.getPrices(from, to)

        const sum = prices.reduce( (acc: number, val: PriceData) => {
            return acc + val.price
        }, 0)

        return round(sum / prices.length)
    }


    updateMovingAverage(price: number, date: Date) {

        const dateTImeSecs = round(date.getTime() / 1000, 0) 
        const secondSinceLastUpdate: number = dateTImeSecs - this.lastEvalTime
        const daysSinceLasUpdate = round(secondSinceLastUpdate / 86400, 0)

        // remember when the moving average was updated
        this.latestPrice = price
        this.lastEvalTime = dateTImeSecs
        
        if (daysSinceLasUpdate === 0) return;

        if (daysSinceLasUpdate >= this.movingAveragePeriod) {
            this.movingAverage = price
        } else {
            // update the moving average, using the average price for 'movingAveragePeriod' - 'daysSinceLasUpdate' days 
            // and the current price for the last 'daysSinceLasUpdate' days
            const oldPricesWeight = this.movingAverage * ( this.movingAveragePeriod - daysSinceLasUpdate);
            const newPriceWeight = daysSinceLasUpdate * price;
            this.movingAverage = (oldPricesWeight + newPriceWeight ) / this.movingAveragePeriod;
        }
    }


    investPercent() : number {
        const investTokenValue = this.investTokenBalance * this.latestPrice
        const portfolioValue = this.portfolioValue()
        const investPerc = investTokenValue / portfolioValue

        return investPerc
    }

    portfolioValue() : number {
        const investTokenValue = this.investTokenBalance * this.latestPrice
        const depositTokenValue = this.depositTokenBalance
        const portfolioValue = depositTokenValue + investTokenValue

        return portfolioValue
    }

    riskAssetValue() : number {
        return this.investTokenBalance * this.latestPrice
    }


    // Format the numeric amount into a BigNumber with the required decimals and return its string representation
    formatAmount(amount: number, decimals: number) : string {

        // console.log("formatAmount - amount", amount)

        if (decimals < 8) {
            const amountInt = round(amount * 10 ** decimals, 0)
            return `${amountInt}`
        }

        const aaa = round( amount * 10 ** 8, 0) 
        console.log(">>> aaa: ", aaa)
        const priceInt = BigNumber.from( aaa.toString() )
        const price = BigNumber.from(10).pow(decimals - 8).mul( priceInt )
        return price.toString()
    }

}