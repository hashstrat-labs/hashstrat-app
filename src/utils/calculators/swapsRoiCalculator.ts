import { BigNumber } from 'ethers'
import { fromDecimals, round } from "../formatter"
import { Token } from "../../types/Token"
import { SwapInfo } from "../../types/SwapInfo"
import { RoiInfo } from "../../types/RoiInfo"

import { PoolTokensSwapsInfo } from "../../types/PoolTokensSwapsInfo"

import { Feed, BTCFeed, ETHFeed } from "../../services/pricefeed/PricefeedService"


/** 
 * Calculates the RoiInfo data for a chronologically ordered array of timestamps.
 * 
 * These timestamps include those in SwapInfo[] and the 'priceTimestamp' of the latest priceRaw
 * as well as the timestamp of the opening prices of the weekly price feed assocaited to the 'investToken' provided.
 *  
 */ 

//TODO
// use PriceService

export const roiDataForPrices = (

    poolInfo: PoolTokensSwapsInfo,
    // swaps: SwapInfo[], 
    // priceRaw: BigNumber , 
    // priceTimestamp: number, 
    depositToken: Token, 
    investToken: Token,
    initialInvestment: number = 100
) : RoiInfo[] => {

    // const feed = investToken.symbol === 'WETH' ? eth_feed : investToken.symbol === 'WBTC'?  btc_feed : undefined

    const feed = investToken.symbol === 'WBTC' ? BTCFeed :  
                        investToken.symbol === 'WETH' ? ETHFeed : undefined
                  
    const swaps = poolInfo.swaps
    const lastTimestamp = poolInfo.priceInfo?.timestamp ?? 0

    if (!feed || swaps.length === 0 || !feed) return []

    let swapsForFeed : SwapInfo[] = []
    swaps.forEach( (it, idx) => {
        
        if (idx > 0) {
            // add SwapInfo items between current and previous SwapInfo
            const from = swaps[idx-1]
            const swapsResp = findSwapInfoItems(feed, 8, from, Number(it.timestamp)) // priceFeed dacimals is 8
            swapsForFeed.push(...swapsResp)
        }

        swapsForFeed.push(it)

        if (idx === swaps.length-1) {
            // add SwapInfo items after last swap
            const swapsResp = findSwapInfoItems(feed, 8, it, lastTimestamp)
            swapsForFeed.push(...swapsResp)
        }
    })

    return roiInfoForSwaps(swapsForFeed, poolInfo.priceInfoStart, poolInfo.priceInfo, depositToken, investToken, initialInvestment)
}



const roiInfoForSwaps = (
        swaps: SwapInfo[], 
        priceInforStart: {
            symbol: string,
            price: BigNumber,
            timestamp: number,
        } | undefined,
        priceInforEnd: {
            symbol: string,
            price: BigNumber,
            timestamp: number,
        }| undefined,
        depositToken: Token, 
        investToken: Token,
        initialInvestment: number = 100
    ) : RoiInfo[] => {




    // A model investment of $100
    let riskAssetAmount = 0;
    let stableAssetAmount = initialInvestment


    // drawdowns 
    let stratPeakValue = initialInvestment
    let buyAndHoldPeakValue = initialInvestment
    let strategyDrawdownPerc = 0
    let buyAndHoldDrawdownPerc = 0
    let maxStrategyDrawdownPerc = 0
    let maxBuyAndHoldDrawdownPerc = 0


    // calculate buy & hold amount at time 0
    //FIXME use first price from time 0
    //onst firstPrice =       //swaps.length > 0 ? parseFloat(fromDecimals(BigNumber.from(swaps[0].feedPrice), 8, 2)) : 0
    const priceFirst = priceInforStart?.price ?? BigNumber.from("0")
    const firstPrice = parseFloat(fromDecimals(priceFirst, 8, 2))
    const buyAndHoldAmount = firstPrice ? (initialInvestment / firstPrice) : 0



    // calculate ROI data
    const roidData : RoiInfo[] = []

    swaps.forEach((data, idx) => {

        const timestamp = Number(data.timestamp)
        const price = parseFloat(fromDecimals(BigNumber.from(data.feedPrice), 8, 2))
        const investTokenBalance = parseFloat(fromDecimals(BigNumber.from(data.investTokenBalance), investToken.decimals, 6))
        const depositTokenBalance = parseFloat(fromDecimals(BigNumber.from(data.depositTokenBalance), depositToken.decimals, 2))

        const deltaInvestTokens = data.side === 'BUY' ? parseFloat(fromDecimals(BigNumber.from(data.bought), investToken.decimals, 6)) :
                                  data.side === 'SELL' ? parseFloat(fromDecimals(BigNumber.from(data.sold), investToken.decimals, 6)) : 0

        const deltaDepositTokens = data.side === 'BUY' ? parseFloat(fromDecimals(BigNumber.from(data.sold), depositToken.decimals, 2)) :
                                   data.side === 'SELL' ? parseFloat(fromDecimals(BigNumber.from(data.bought), depositToken.decimals, 2)) : 0


        // percent of the risk asset traded
        const investTokens = investTokenBalance + (data.side === 'SELL' ? deltaInvestTokens : 0)
        const riskAssetPercTraded = investTokens === 0 ? 0 : deltaInvestTokens / investTokens

        // percent of the stable asset traded
        const depositTokens =  depositTokenBalance + (data.side === 'BUY' ? deltaDepositTokens : 0)
        const stableAssetPercTraded = depositTokens === 0 ? 0 : deltaDepositTokens / depositTokens

        // if there was a swap also record roi info (e.g token percentages) before the swap happened
        let riskAssetAmountBefore = riskAssetAmount
        let stableAssetAmountBefore = stableAssetAmount
     
        //// update token balances according to the swap performed 
        // the computed stableAssetAmount/riskAssetAmount balances don't take into account the actual balance of the pools (depositTokenBalance/investTokenBalance) that can vary due to deposits & withdrawals
        if (data.side === 'BUY') {
            const stableAssetSold = stableAssetAmount * stableAssetPercTraded
            stableAssetAmount -= stableAssetSold
            riskAssetAmount += (stableAssetSold / price)
            // stableAssetAmount = depositTokenBalance
            // riskAssetAmount = investTokenBalance
        }
        if (data.side === 'SELL') {
            const riskAssetSold = riskAssetAmount * riskAssetPercTraded
            stableAssetAmount += (riskAssetSold * price)
            riskAssetAmount -= riskAssetSold
            // stableAssetAmount = depositTokenBalance
            // riskAssetAmount = investTokenBalance
        }


        // Strategy value and ROI at current price
        const strategyValue = riskAssetAmount * price + stableAssetAmount
        const strategyROI = 100 * (strategyValue - initialInvestment) / initialInvestment

        // Buy & Hold value and ROI at current price
        const buyAndHoldValue = buyAndHoldAmount * price
        const buyAndHoldROI = 100 * (buyAndHoldValue - initialInvestment) / initialInvestment

        const investTokenPerc = 100 * riskAssetAmount * price / strategyValue
        const depositTokenPerc = 100 * stableAssetAmount / strategyValue


        stratPeakValue = Math.max(strategyValue, stratPeakValue)
        buyAndHoldPeakValue = Math.max(buyAndHoldValue, buyAndHoldPeakValue)

        // dd% in the range [-100%, 0%]
        strategyDrawdownPerc = (strategyValue < stratPeakValue) ? 100 * (strategyValue - stratPeakValue) / stratPeakValue : 0
        buyAndHoldDrawdownPerc = (buyAndHoldValue < buyAndHoldPeakValue) ? 100 * (buyAndHoldValue - buyAndHoldPeakValue) / buyAndHoldPeakValue : 0

        // max dd%
        maxStrategyDrawdownPerc = Math.min(strategyDrawdownPerc, maxStrategyDrawdownPerc)
        maxBuyAndHoldDrawdownPerc = Math.min(buyAndHoldDrawdownPerc, maxBuyAndHoldDrawdownPerc)

        const item : RoiInfo = {
            date: timestamp,
            strategyROI: round(strategyROI),
            strategyValue: round(strategyValue),
            buyAndHoldROI: round(buyAndHoldROI),
            buyAndHoldValue: round(buyAndHoldValue),

            strategyDrawdownPerc: round(strategyDrawdownPerc),
            buyAndHoldDrawdownPerc: round(buyAndHoldDrawdownPerc),
            maxStrategyDrawdownPerc: round(maxStrategyDrawdownPerc),
            maxBuyAndHoldDrawdownPerc: round(maxBuyAndHoldDrawdownPerc),

            investTokenPerc: round(investTokenPerc),
            depositTokenPerc: round(depositTokenPerc),

            depositTokenAmount: round(stableAssetAmount),
            investTokenAmount: round(riskAssetAmount, 6),
        }

        // if thre was a trade, include data before swap happened
        const preStapInfo = stableAssetPercTraded > 0 || riskAssetPercTraded > 0 ? { ...item } : undefined
        if (preStapInfo) {
            preStapInfo.date = item.date - 1
            preStapInfo.depositTokenAmount = round(stableAssetAmountBefore)
            preStapInfo.investTokenAmount = round(riskAssetAmountBefore, 6)
            preStapInfo.depositTokenPerc = round(100 * stableAssetAmountBefore / strategyValue)
            preStapInfo.investTokenPerc = round(100 * riskAssetAmountBefore * price / strategyValue)

            roidData.push(preStapInfo)
        }


        roidData.push(item)
    })


    // Update ROI
    const priceLast = priceInforEnd?.price ?? BigNumber.from("0")
    const lastPrice = parseFloat(fromDecimals(priceLast, 8, 2))
    const lastTimestamp = priceInforEnd?.timestamp ?? 0

    const strategyValue = riskAssetAmount * lastPrice + stableAssetAmount
    const strategyROI = 100 * (strategyValue - initialInvestment) / initialInvestment
    const buyAndHoldValue = buyAndHoldAmount * lastPrice
    const buyAndHoldROI = 100 * (buyAndHoldValue - initialInvestment) / initialInvestment


    // Update Drawdown
    stratPeakValue = Math.max(strategyValue, stratPeakValue)
    buyAndHoldPeakValue = Math.max(buyAndHoldValue, buyAndHoldPeakValue)
    strategyDrawdownPerc = (strategyValue < stratPeakValue) ? 100 * (strategyValue - stratPeakValue) / stratPeakValue : 0
    buyAndHoldDrawdownPerc = (buyAndHoldValue < buyAndHoldPeakValue) ? 100 * (buyAndHoldValue - buyAndHoldPeakValue) / buyAndHoldPeakValue : 0
    maxStrategyDrawdownPerc = Math.min(strategyDrawdownPerc, maxStrategyDrawdownPerc)
    maxBuyAndHoldDrawdownPerc = Math.min(buyAndHoldDrawdownPerc, maxBuyAndHoldDrawdownPerc)


    const investTokenPerc = 100 * riskAssetAmount * lastPrice / strategyValue
    const depositTokenPerc = 100 * stableAssetAmount / strategyValue

    const latest : RoiInfo = {
        date: lastTimestamp,
        strategyROI: round(strategyROI),
        strategyValue: round(strategyValue),
        buyAndHoldROI: round(buyAndHoldROI),
        buyAndHoldValue: round(buyAndHoldValue),

        strategyDrawdownPerc: round(strategyDrawdownPerc),
        buyAndHoldDrawdownPerc: round(buyAndHoldDrawdownPerc),
        maxStrategyDrawdownPerc: round(maxStrategyDrawdownPerc),
        maxBuyAndHoldDrawdownPerc: round(maxBuyAndHoldDrawdownPerc),

        investTokenPerc: round(investTokenPerc),
        depositTokenPerc: round(depositTokenPerc),

        depositTokenAmount: round(stableAssetAmount, 2),
        investTokenAmount: round(riskAssetAmount, 6),
    }

    return [ ...roidData, latest ]
}



// Returns the array of SwapInfo items between the 'from' SwapInfo and 'lastTimestamp', 
// including prices from the datafeed 
const findSwapInfoItems = (feed : Feed, feedDecimals: number, from: SwapInfo, lastTimestamp? : number) : SwapInfo[] => {

    // [ts0, ..., ts1] the time interval to use to filter the pricefeed
    // use the last feed price if to SwapInfo is not provided
    const fromDate =  new Date( Number(from.timestamp) * 1000)
    const toDate = lastTimestamp ? new Date(lastTimestamp * 1000) : new Date()

    let response : SwapInfo[] = []

    for (const priceData of feed.getPrices(fromDate, toDate)) {

        const dateTs = round(priceData.date.getTime() / 1000, 0)
        const priceInt = BigNumber.from( round( priceData.price * 100, 0) )
        const price = BigNumber.from(10).pow(feedDecimals - 2).mul( priceInt )

        response.push(
            {
                timestamp: `${dateTs}`,
                side: from.side,
                feedPrice: price.toString(),
                bought: "0",
                sold: "0",
                depositTokenBalance: from.depositTokenBalance,
                investTokenBalance: from.investTokenBalance
            }
        )
    }

    return response
}
