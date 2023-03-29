

import { useTokensInfoForIndexes, usePoolsInfoForIndexes, PoolValueInfo, 
    PoolValueInfoMap, TokenBalanceMapforIndexMap, TokenBalanceInfo, PoolValueMapForIndexMap } from "../../../hooks/usePoolInfo"
import { usePoolInfoArray } from '../../../hooks/useIndex'

import { PoolInfo } from "../../../utils/pools"
import { Token } from "../../../types/Token"
import { BigNumber } from "ethers"
import { fromDecimals } from "../../../utils/formatter"

import { PieChartsData, ChartData } from "../../shared/VPieChart"


type TokenBalances = { [x: string]: { symbol: string, decimals: number, value: BigNumber, balance: BigNumber } }

type IndexData = {
    poolId: string,
    tokenInfoArray: TokenBalanceInfo[],
    totalValue: BigNumber
}

type PortfolioInfo = {
    totalValue: BigNumber,
    tokenBalances: TokenBalances
}

export type PoolSummary = {
    poolId: string,
    name: string,
    weight: number,
    value?: BigNumber
}

export type IndexModel = {
    portfolioInfo: PortfolioInfo;
    chartValueByAsset: ChartData,
    chartValueByPool: ChartData,
    indexInfo: IndexData,
    poolsInfo: PoolSummary[]
}


export const useIndexModel = (chainId: number, indexId: string, tokens: Token[], depositToken: Token, account?: string): IndexModel => {

    const tokensBalances : TokenBalanceMapforIndexMap = useTokensInfoForIndexes(chainId, [indexId], tokens, account)
    const poolsBalances : PoolValueMapForIndexMap = usePoolsInfoForIndexes(chainId, [indexId], tokens, account)

    // get the array of pools in this index, their ids and weights
    const poolInfoArray = usePoolInfoArray(chainId, indexId) ?? []
    const poolIds = poolInfoArray?.map( ( el ) => el.name!.toLowerCase() )
    const weights = poolInfoArray?.map( ( el ) => el.weight! )

    // the info fot each pool in this index (name, weight, value)
    const poolsValueInfoMap = poolsBalances[indexId] // .poolBalances

    const poolsInfo : PoolSummary[] = poolIds?.map ( (poolId : string, idx: number) => {
       const info =  PoolInfo(chainId, poolId)

       return {
            poolId: poolId,
            name: info["name"],
            weight: weights[idx],
            value: poolsValueInfoMap[poolId].value
       }
    })

    // Sum up balance and value across all pools 
    // if an account is connected return his share if balance and value, otherwise return the pool totals
    let initValues = tokens.reduce((acc, val) => {
        acc[val.symbol] = { symbol: val.symbol, decimals: val.decimals, value: BigNumber.from(0), balance: BigNumber.from(0) }
        return acc
    }, {} as TokenBalances)

   
    // aggregate token balances by symbol across all pools
    const valueByTokenMap: TokenBalances = tokensBalances && Object.values(tokensBalances).reduce((acc, indexBalances): TokenBalances => {
        let totals = acc
        Object.keys(acc).forEach(symbol => {
            const tokenInfo = indexBalances[symbol]
            if (tokenInfo.value) {
                totals[symbol].value = (account && tokenInfo.accountValue) ? totals[symbol].value.add(tokenInfo.accountValue) :
                                        tokenInfo.value ? totals[symbol].value.add(tokenInfo.value) : totals[symbol].value
            }
            if (tokenInfo.balance) {
                totals[symbol].balance = (account && tokenInfo.accountBalance) ? totals[symbol].balance.add(tokenInfo.accountBalance) :
                    tokenInfo.balance ? totals[symbol].balance.add(tokenInfo.balance) : totals[symbol].balance
            }
        })

        return totals

    }, initValues)


    // the total value in this index (aggregated across all tokens)
    const totalValue: BigNumber = valueByTokenMap && Object.values(valueByTokenMap).reduce((total, token): BigNumber => {
        return total.add(token.value)
    }, BigNumber.from(0))

  
    //// Indexes Info by token
 
    const indexInfo = poolInfoFromBalances(chainId,  tokensBalances) ?? []

    //// Charts   ////

    //  Chart 1: valueByAasset chart
    const chartValues: PieChartsData[] = valueByTokenMap && Object.values(valueByTokenMap).map((item) => {
        return {
            name: item.symbol,
            value: Number(fromDecimals(item.value, depositToken.decimals, 2)),
        }

    }).filter(it => it.value > 0)


    //// Chart 2: Value by Pools/Indexes////
    const valueByPool: PieChartsData[] = valueByPoolChartData(chainId, depositToken, poolsBalances[indexId])

    return {
        portfolioInfo: { tokenBalances: valueByTokenMap, totalValue: totalValue },
        chartValueByAsset: { title: "Asset Allocation", data: chartValues, width: 250, height: 300 },
        chartValueByPool: { title: "Pool Allocation", data: valueByPool, width: 250, height: 300 },
        indexInfo,
        poolsInfo,
    }

}


// 
const poolInfoFromBalances = (chainId: number, poolsBalances: TokenBalanceMapforIndexMap ): IndexData => {

    return poolsBalances && Object.keys(poolsBalances).map((poolId: string): IndexData => {

        const { depositToken: depositTokenSymbol, investTokens: investTokenSymbols } = PoolInfo(chainId, poolId)
        const poolTokenSymbols = [depositTokenSymbol, ...investTokenSymbols] as string[]
        // the array of tokens balances for pool poolId
        const tokenInfoArray = Object.values(poolsBalances[poolId])
        const tokensArrayFiltered = tokenInfoArray.filter(it => poolTokenSymbols.includes(it.symbol))

        const totalValue: BigNumber = tokensArrayFiltered.reduce((acc, val) => {
            if (val.accountValue) acc = acc.add(val.accountValue)
            return acc
        }, BigNumber.from(0))

        return { poolId, tokenInfoArray: tokensArrayFiltered, totalValue }
    })[0]
}




const valueByPoolChartData = (chainId: number, depositToken : Token, poolBalances : PoolValueInfoMap ): PieChartsData[] => {
 
    
    // account for the share of each pool owned by the index
    const valueByPool = Object.values(poolBalances).map( (poolInfo : PoolValueInfo) => {
        const { name } = PoolInfo(chainId, poolInfo.poolId)
        return {
            name: name,
            value: Number(fromDecimals(poolInfo.value, depositToken.decimals, 2))
        }
    }).filter(it => it.value > 0)

    return valueByPool
}