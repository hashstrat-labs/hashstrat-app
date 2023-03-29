
import { BigNumber } from 'ethers'

import { Feed, PriceData } from "../../pricefeed/PricefeedService"
import { PoolTokensSwapsInfo } from "../../../types/PoolTokensSwapsInfo";
import { SwapInfo } from '../../../types/SwapInfo'
import { round } from '../../../utils/formatter'
import { Strategy, StrategyPrices } from "./Strategy"
import { Token } from "../../../types/Token"

import { RingBuffer } from "../../../utils/ringBuffer"

/**
 * Strategy using an approximation of Monthly RSI to determine when to DCA in/out the risk asset
 * Rules: 
 * 1. Accumulates when RSI is below 30 
 * 2. Divest when RSI is above 70
 * 3. Trade size is set to 10% of the asset to spend
 * 4. Don't trade when allocation of the asset to spend drops below 10% of pool value.
 * 
 * Eval Frequency: Strategy evaluated every 5 days. RSI updated every 30 days.
 */
export class Momentum implements Strategy {

    feed: Feed;
    depositToken: Token
    investToken: Token

    readonly highRSILevel = 70
    readonly lowRSILevel = 30

    readonly rsiPeriod = 30              // 30 days day RSI
    readonly minAllocationPerc = 0.2     // 10% min allocation to both assets
    readonly tokensToSwapPerc = 0.1      // 10% of the value of the asset sold

    readonly executionInterval = 5 * 86400  // buy/sell every 5 days
    readonly priceFeedDecimals = 8

    private lastEvalTime = 0  // lhe last time the strategy was evalued


    private lastPrice = 0   // the latest price of the risk asset
    private lastPriceTime : number | undefined
    private previousPrice : number | undefined  // the previous price used to calculate the RSI
    private previousPriceTime : number | undefined

    private gains = new RingBuffer<number>(14);
    private losses = new RingBuffer<number>(14);

    public RSI : number | undefined     // the RSI

    // asset balances
    private investTokenBalance = 0
    private depositTokenBalance = 0


    constructor(feed: Feed, depositToken : Token, investToken : Token) {
        this.depositToken = depositToken
        this.investToken = investToken
        this.feed = feed
    }


    simulate(from: Date, to: Date, amount: number): PoolTokensSwapsInfo | undefined {

        // set the initial RSI
        // this.rsiCalc(from, this.rsiPeriod)
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
    getPrices(from: Date, to: Date) : StrategyPrices[]  {

        // set initialvalue of moving average
        this.rsiCalc(from, this.rsiPeriod)

        console.log(">>> getPrices", this.RSI, this.lastPriceTime ? new Date(this.lastPriceTime * 1000).toISOString().split('T')[0] : 'n/a' )
        
        this.lastEvalTime = ( from.getTime() / 1000 )
        
        let response : StrategyPrices[] = []
        const rsiInterval = this.rsiPeriod * 86400

        this.feed.getPrices(from, to).forEach( (it, idx) => {
            
            // update RSI only when after the RSI interval (e.g. 1/7/30 days) elapses
            this.updateRSI(it.price, it.date)
            response.push({
                date: it.date,
                price: it.price,
                RSI: this.RSI
            })
        })

        return response
    }



    getSwaps(from: Date, to: Date, initialDepositTokenBalance: number) : SwapInfo[] | undefined {

        this.depositTokenBalance = initialDepositTokenBalance

        // init RSI
        this.rsiCalc(from, this.rsiPeriod)

        // filter for price range
        const prices = this.feed.getPrices(from, to)

        let response : SwapInfo[] = []

        prices.forEach( (it, idx) => {

            if (this.lastPrice === 0) {
                return
            }
            if (idx > 0 && (it.date.getTime() / 1000) < this.lastEvalTime + this.executionInterval) {
                return
            }

            this.lastEvalTime = round(it.date.getTime() / 1000, 0)
         
            // update current price, moving average and lastEvalTimestamp
            this.updateRSI(it.price, it.date)

            // evaluate strategy
            const { action, amountIn } = this.evaluateTrade()

            let shouldBuy : boolean = action === 'BUY'
            let shouldSell: boolean = action === 'SELL'
            let amount = amountIn

            // if (action !== undefined) {
            //     console.log(">>> getSwaps: ", it.date.toISOString().split('T')[0], round(this.RSI ?? 0), it.price, "action", action, "amountIn", amountIn)
            // }

            // 3. handle rebalancing situations when either token balance is too low
            const depositTokensToSell = this.rebalanceDepositTokensAmount()
            if (depositTokensToSell > 0) {
                const maxAmount = (action === 'BUY') && (amountIn > depositTokensToSell) ? amountIn : depositTokensToSell;
                shouldBuy = true
                amount = maxAmount

                // shouldBuy = false
            }


            const investTokensToSell = this.rebalanceInvestTokensAmount();
            if (investTokensToSell > 0) {
                const maxAmount = (action === 'SELL') && (amountIn > investTokensToSell) ? amountIn : investTokensToSell;
                shouldSell = true
                amount = maxAmount
                // shouldBuy = false
            }

            const bought = shouldSell ? this.formatAmount(amount * this.lastPrice, this.depositToken.decimals) :
                            shouldBuy ? this.formatAmount(amount / this.lastPrice, this.investToken.decimals) : ''


            const sold = shouldSell ? this.formatAmount(amount, this.investToken.decimals) : 
                            shouldBuy ? this.formatAmount(amount, this.depositToken.decimals) : ''
                        
            if (shouldSell || shouldBuy) {

                const depositTokenDelta = shouldSell ? amount * this.lastPrice : shouldBuy ? -amount : 0
                const investTokenDelta = shouldSell ? -amount  : shouldBuy ? amount / this.lastPrice : 0

                this.depositTokenBalance += depositTokenDelta
                this.investTokenBalance += investTokenDelta


                // console.log(">>> REBALANCE trade: ", new Date(this.lastEvalTime * 1000).toISOString().split('T')[0], ".depositTokenBalance ", this.depositTokenBalance , "investTokenBalance", this.investTokenBalance  )

                response.push({
                    timestamp: `${this.lastEvalTime}`,
                    side: shouldBuy ? 'BUY' : 'SELL',
                    feedPrice: this.formatAmount(this.lastPrice, this.priceFeedDecimals),
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


    evaluateTrade() : { action: string | undefined, amountIn: number} {
        
        let action : string | undefined = undefined
        let amountIn: number = 0
     
        const poolValue = this.portfolioValue()
        const investPerc = this.investPercent()
        const depositPerc = poolValue > 0 ? 1 - investPerc : 0

        const shouldSell = this.RSI && this.RSI > this.highRSILevel && investPerc > this.minAllocationPerc

        if (shouldSell) {
            // need to SELL invest tokens buying deposit tokens
            action = "SELL";
            amountIn = this.investTokenBalance * this.tokensToSwapPerc
        }

        const shouldBuy =  this.RSI && this.RSI < this.lowRSILevel && depositPerc > this.minAllocationPerc

        if (shouldBuy) {
            // need to BUY invest tokens spending depositTokens
            action = "BUY"
            amountIn = this.depositTokenBalance * this.tokensToSwapPerc
        }


        return { action, amountIn };
    }


    // Returns the RSI value at the date 'to' and for the number of days 'period'


  
    rsiCalc(to: Date, period: number) {

        const from = new Date( ( (to.getTime() / 1000) - (period * 86400 * 14)) * 1000 )
        const prices = this.feed.getPrices(from, to)
      
        prices.forEach( d => {
            this.updateRSI(d.price, d.date)
        })

        console.log(">>> rsiCalc", "from: ", from.toISOString().split('T')[0] , "RSI:", this.RSI)
    }
    


    updateRSI(price: number, date: Date) {

        if (this.previousPrice === undefined || this.previousPriceTime === undefined) {
            this.previousPriceTime = round(date.getTime() / 1000, 0)
            this.previousPrice = price
            return
        }

        this.lastPriceTime = round(date.getTime() / 1000, 0) 
        this.lastPrice = price

        const daysSinceRSIUpdate = round( (this.lastPriceTime - this.previousPriceTime) / 86400, 0)

        if (daysSinceRSIUpdate >= this.rsiPeriod) {
            
            const change = this.lastPrice - this.previousPrice
            const gain = change > 0 ? change : 0
            const loss = change < 0 ? -change : 0

            this.gains.add(gain)
            this.losses.add(loss)

            const avgGain = this.gains.isFull() ? 
                this.gains.toArray().reduce( (acc: number, val: number) => { return acc + val }, 0) / this.gains.getSize() 
                : undefined

            const avgLoss = this.losses.isFull() ?
                this.losses.toArray().reduce( (acc: number, val: number) => { return acc + val }, 0) / this.losses.getSize()
                : undefined
            
            const rs = (avgGain !== undefined && avgLoss !== undefined) ? avgGain / avgLoss : undefined
        
            // set RSI and the last price used
            this.RSI = (rs !== undefined) ? (100 - (100 / (1+ rs))) : undefined

            // console.log(">>> RSI >>> ", round(this.RSI ?? 0))

            // remember last price used to update the RSI
            this.previousPrice = this.lastPrice 
            this.previousPriceTime = this.lastPriceTime
        }
    }




    rebalanceDepositTokensAmount() {
        const investPerc = this.investPercent()
        let amountIn = 0;

        if (investPerc < this.minAllocationPerc * 0.5) {
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

        let amountIn = 0;

        if (depositPerc < this.minAllocationPerc * 0.5) {
            const price = this.lastPrice
            // calculate amount of invest tokens to sell (to BUY deposit tokens)

            // need to SELL some investment tokens
            const poolValue = this.portfolioValue();
            const investTokenValue = this.riskAssetValue();

            const targetInvestPerc = 1 - this.minAllocationPerc;  //  (e.g. 80%)
            const targetInvestTokenValue = poolValue * targetInvestPerc

            // calcualte amount of investment tokens to SELL
            amountIn = (investTokenValue - targetInvestTokenValue) / price;
        }

        return amountIn;
    }


    investPercent() : number {
        const investTokenValue = this.investTokenBalance * this.lastPrice
        const portfolioValue = this.portfolioValue()
        const investPerc = investTokenValue / portfolioValue

        console.log(">>> REBALANCE ", new Date(this.lastEvalTime * 1000).toISOString().split('T')[0], "lastPrice", this.lastPrice, "investTokenBalance", this.investTokenBalance, "investPerc", investPerc) 

        return investPerc
    }

    portfolioValue() : number {
        const investTokenValue = this.investTokenBalance * this.lastPrice
        const depositTokenValue = this.depositTokenBalance
        const portfolioValue = depositTokenValue + investTokenValue

        return portfolioValue
    }

    riskAssetValue() : number {
        return this.investTokenBalance * this.lastPrice
    }


    // Format the numeric amount into a BigNumber with the required decimals and return its string representation
    formatAmount(amount: number, decimals: number) : string {

        if ( amount === Infinity) {
            throw Error("amoount is infinite!")
        }

        if (decimals < 8) {
            const amountInt = round(amount * 10 ** decimals, 0)
            return `${amountInt}`
        }

        console.log(">>> amount: ", amount, "decimals", decimals)
        const aaa = round( amount * 10 ** 6, 0) 
        console.log(">>> aaa: ", aaa)

        const priceInt = BigNumber.from( aaa.toString() )
        const price = BigNumber.from(10).pow(decimals - 6).mul( priceInt )
        return price.toString()
    }

}