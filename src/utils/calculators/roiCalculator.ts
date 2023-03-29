import { Token } from "../../types/Token"
import { PoolTokensSwapsInfo } from "../../types/PoolTokensSwapsInfo"
import { roiDataForPrices } from "./swapsRoiCalculator"
import { RoiInfo, RoiInfoForPool } from "../../types/RoiInfo"
import { BigNumber } from "ethers"

/**
 * Given the PoolTokensSwapsInfo[] array containing data for the trades of the Pools in an Index,
 * returns the array RoiInfo[] containing aggregated data about the performance and the assets in the Index 
 * at different point in time (e.g daily ROI, drawdowns, asset allocation)
 * 
 * This allows to produce charts about the Index status and performance over time.
 * 
 * @param swapsInfo an array with the info about the trades for each Pool in the Index
 * @param depositToken the stable asset (USDC)
 * @param investTokens the risk assets in the Index (WBTC, WETH)
 * @param initialInvestment 
 * @param maxItems the max number of RoiInfo[] to return
 * 
 * @returns the array of RoiInfo[] with the Index performance and status information chronologically ordered 
 */

export const roiDataForSwaps = (
        swapsInfo : PoolTokensSwapsInfo[], 
        depositToken: Token, 
        investTokens: Token[],
        initialInvestment: number = 100,
        maxItems?: number
    ) : RoiInfo[] => {


    // map[symbol] => Token
    const investTokensMap = investTokens.reduce( (acc , val ) => {
        acc[val.symbol.toLowerCase()] = val
        return acc
    }, {} as {[x : string] : Token})

    // the the roi data for each pool
  
    const poolsROI : RoiInfoForPool[][] = swapsInfo.map( (item : PoolTokensSwapsInfo) => {
        const investToken = item.priceInfo ? investTokensMap[item.priceInfo?.symbol.toLowerCase()] : undefined //investTokens.find( it => it.symbol.toLowerCase() === item.priceInfo?.symbol.toLowerCase())
        
        const poolROI = investToken && roiDataForPrices(item, depositToken, investToken, initialInvestment)
        const respone = poolROI?.map( it => { 
            return { ...it, poolId: item.poolId } as RoiInfoForPool
        }) ?? []
        return respone
    })

   

    let indexROI : RoiInfo[] = []

    // the total weight of all pools in the Index
    const totalWeight = swapsInfo.map( it => it.weight )
                                 .reduce( (acc, val) => { return  acc + val } , 0)

    // list of swaps for the first timestamp (after ts 0) to use to calculate ROI
    
    let roiInfos = findNextROIInfo(poolsROI, 0)

    // a map of the last swap applied for each pool in the Index, identified by the idx in the swapsInfo array
    let poolIdToSwapInfoMap : { [poolId: string]: RoiInfoForPool } = {} 

    // console.log("roiDataForSwaps - start: ", new Date().toISOString().split('T')[1])

    // map[poolId] => pool_weight
    const poolWeights = swapsInfo.reduce( (acc , val ) => {
        acc[val.poolId] = val.weight
        return acc
    }, {} as {[x : string] : number})

    while (roiInfos.length > 0) {

        if (indexROI.length === 0) {
            // calculate first data point weighting contribution by each pool
            let first : RoiInfo = {
                date: 0,
                buyAndHoldValue: 0,
                buyAndHoldROI: 0,
                strategyROI: 0,
                strategyValue: 0,
                investTokenPerc: 0,
                depositTokenPerc: 0,
                strategyDrawdownPerc: 0,
                buyAndHoldDrawdownPerc: 0,
                maxStrategyDrawdownPerc: 0,
                maxBuyAndHoldDrawdownPerc: 0,
                depositTokenAmount: 0,
                investTokenAmount: 0,
            }

            let indexWeightPerc = 0

            roiInfos.forEach( it => {  
               const poolWeight = poolWeights[it.poolId] / totalWeight
               indexWeightPerc += poolWeight
               
               first.date = it.date
               first.buyAndHoldValue += it.buyAndHoldValue * poolWeight
               first.buyAndHoldROI += it.buyAndHoldROI * poolWeight
               first.strategyValue += it.strategyValue * poolWeight
               first.strategyROI += it.strategyROI * poolWeight

               first.investTokenPerc += it.investTokenPerc * poolWeight
               first.depositTokenPerc += it.depositTokenPerc * poolWeight

               first.strategyDrawdownPerc += it.strategyDrawdownPerc * poolWeight
               first.buyAndHoldDrawdownPerc += it.buyAndHoldDrawdownPerc * poolWeight
               first.maxStrategyDrawdownPerc += it.maxStrategyDrawdownPerc * poolWeight
               first.maxBuyAndHoldDrawdownPerc += it.maxBuyAndHoldDrawdownPerc * poolWeight

               first.depositTokenAmount += it.depositTokenAmount * poolWeight
               first.investTokenAmount += it.investTokenAmount * poolWeight

               // remember the ROI info for pool of idx poolIndex
               poolIdToSwapInfoMap[ it.poolId ] = it
            })

            // account for initial investment not allocated at time t0
            if (indexWeightPerc < 1) {
                const initialValueLeft = initialInvestment * (1 - indexWeightPerc)
                first.buyAndHoldValue += initialValueLeft
                first.strategyValue += initialValueLeft
                first.depositTokenPerc = 1 - first.investTokenPerc 
            }
            indexROI.push(first)

        } else {

            // calculate subsequent data points weighting contribution by each pool
            // starting from the prior data point

            // initialize next data point with the prior data point
            let next =  {
                date : indexROI[indexROI.length-1].date,
                buyAndHoldROI: indexROI[indexROI.length-1].buyAndHoldROI,
                buyAndHoldValue: indexROI[indexROI.length-1].buyAndHoldValue,
                strategyROI: indexROI[indexROI.length-1].strategyROI,
                strategyValue: indexROI[indexROI.length-1].strategyValue,

                investTokenPerc: indexROI[indexROI.length-1].investTokenPerc,
                depositTokenPerc: indexROI[indexROI.length-1].depositTokenPerc,

                strategyDrawdownPerc: indexROI[indexROI.length-1].strategyDrawdownPerc,
                buyAndHoldDrawdownPerc: indexROI[indexROI.length-1].buyAndHoldDrawdownPerc,
                maxStrategyDrawdownPerc: indexROI[indexROI.length-1].maxStrategyDrawdownPerc,
                maxBuyAndHoldDrawdownPerc: indexROI[indexROI.length-1].maxBuyAndHoldDrawdownPerc,

                depositTokenAmount: indexROI[indexROI.length-1].depositTokenAmount,
                investTokenAmount: indexROI[indexROI.length-1].investTokenAmount,
            }

            // process all roi data points for the next timestamp and update the roi info
            // replacing the previous roi values for a pool with the latest ones
            roiInfos.forEach( it => {

                const poolWeight = poolWeights[it.poolId] / totalWeight

                // subtract the contribution of the current pool
                const prevSwaps = poolIdToSwapInfoMap[it.poolId]
                if (prevSwaps) {
                    next.buyAndHoldROI -= (prevSwaps.buyAndHoldROI * poolWeight)
                    next.buyAndHoldValue -= (prevSwaps.buyAndHoldValue * poolWeight)
                    next.strategyROI -= (prevSwaps.strategyROI * poolWeight)
                    next.strategyValue -= (prevSwaps.strategyValue * poolWeight)

                    next.investTokenPerc -= (prevSwaps.investTokenPerc * poolWeight)
                    next.depositTokenPerc -= (prevSwaps.depositTokenPerc * poolWeight)

                    next.strategyDrawdownPerc -= (prevSwaps.strategyDrawdownPerc * poolWeight)
                    next.buyAndHoldDrawdownPerc -= (prevSwaps.buyAndHoldDrawdownPerc * poolWeight)
                    next.maxStrategyDrawdownPerc -= (prevSwaps.maxStrategyDrawdownPerc * poolWeight)
                    next.maxBuyAndHoldDrawdownPerc -= (prevSwaps.maxBuyAndHoldDrawdownPerc * poolWeight)

                    next.depositTokenAmount -= (prevSwaps.depositTokenAmount * poolWeight)
                    next.investTokenAmount -= (prevSwaps.investTokenAmount * poolWeight)
                }

                // add the contribution of the current pool
                next.date = it.date
                next.buyAndHoldROI += (it.buyAndHoldROI * poolWeight)
                next.buyAndHoldValue += (it.buyAndHoldValue * poolWeight)
                next.strategyROI += (it.strategyROI  * poolWeight)
                next.strategyValue += (it.strategyValue  * poolWeight)

                next.investTokenPerc += (it.investTokenPerc  * poolWeight)
                next.depositTokenPerc += (it.depositTokenPerc  * poolWeight)

                next.strategyDrawdownPerc += (it.strategyDrawdownPerc * poolWeight)
                next.buyAndHoldDrawdownPerc += (it.buyAndHoldDrawdownPerc * poolWeight)
                next.maxStrategyDrawdownPerc += (it.maxStrategyDrawdownPerc * poolWeight)
                next.maxBuyAndHoldDrawdownPerc += (it.maxBuyAndHoldDrawdownPerc * poolWeight)

                next.depositTokenAmount += (it.depositTokenAmount * poolWeight)
                next.investTokenAmount += (it.investTokenAmount * poolWeight)

                // remember the ROI info for pool of idx poolIndex
                poolIdToSwapInfoMap[ it.poolId ] = it
             })
           
             indexROI.push(next)
        }

        // get next swaps
        const ts = roiInfos[0].date
        roiInfos = findNextROIInfo(poolsROI, ts, true)
    }

    // console.log("roiDataForSwaps - end: ", new Date().toISOString().split('T')[1], "indexROI:", indexROI.length)

    let response : RoiInfo[] = []

    if (maxItems && indexROI.length > maxItems) {
        const skip = Math.round(indexROI.length / maxItems)
        indexROI.forEach((it, idx) => {
            if (idx % skip === 0) {
                response.push(it)
            }
        })
        // ensure the last ROI item is always included in the reposne
        if (indexROI.length % skip > 0) {
            response.push(indexROI[indexROI.length-1])
        }
    } else {
        response = [...indexROI]
    }
    
    return response
}


// Re-arrange the RoiInfoForPool[][] into a map of { timestamp =>  RoiInfoForPool[] }
// Returns an object having: 
// - as keys the timestamps of all RoiInfoForPool in input 
// - as values the RoiInfoForPool[] with that same timestamp chronologically ordered
const joinRoiInfoArrays = (infoArrays: RoiInfoForPool[][])  => {

    let res = {} as { [ x : number] : RoiInfoForPool[] }

    infoArrays.forEach( infoArray => {
        infoArray.forEach( it => {
            let v = res[ it.date ] ?? []
            v.push(it)
            res[it.date] = v
        })
    })

    return res
}


// cache RoiInfoForPool itmes and ROI timestamps
let roiMap : { [ x : number] : RoiInfoForPool[] } | undefined
let timestamps : number[] | undefined

// Returns an array of RoiInfo for the trades happend after the provided 'timestamp'. 
const findNextROIInfo = (roiInfoArray: RoiInfoForPool[][], timestamp: number, useCashe : boolean = false) : RoiInfoForPool[] => {
    if (useCashe === false || roiMap === undefined || timestamps === undefined) {
        roiMap = joinRoiInfoArrays(roiInfoArray) 
        timestamps = Object.keys(roiMap).map(it => Number(it)).sort()
    }

    const nextTimestamp = timestamps.find( it => (it > timestamp) )
    return nextTimestamp ? roiMap[nextTimestamp] : []
}