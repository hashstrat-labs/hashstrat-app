

import { useTokensInfoForPools, useTokensInfoForIndexes, TokenBalanceMapforIndexMap } from "../../hooks/usePoolInfo"
import { PoolIds, PoolInfo, IndexesIds } from "../../utils/pools"
import { Token } from "../../types/Token"
import { BigNumber } from "ethers"
import { fromDecimals } from "../../utils/formatter"

import { PieChartsData, ChartData } from "../shared/VPieChart"
import { TokenInfo } from "../../types/TokenInfo"

type TokenBalances = {[ x: string] : { symbol: string, decimals: number, value: BigNumber, balance: BigNumber, loaded: boolean }}


export type PoolData =  { 
    poolId: string, 
    tokenInfoArray: TokenInfo[], 
    totalValue: BigNumber 
}

type PortfolioInfo = {
    totalValue: BigNumber,
    tokenBalances: TokenBalances
}

export type DashboadModel = {

    // poolsBalances: {[x: string] : any};
    // indexBalances: {[x: string] : any};
    portfolioInfo: PortfolioInfo,
    chartValueByAsset: ChartData,
    chartValueByPool: ChartData,
    poolsInfo: PoolData[],
    indexesInfo: PoolData[],
    didLoad: boolean
}


export const usePoolsInfo = (chainId: number, poolIds: string[], tokens: Token[], account?: string) : PoolData[] => {

    const poolsBalances = useTokensInfoForPools(chainId, poolIds, tokens, account)
    const poolsInfo : PoolData[] = poolsInfoFromBalances(chainId, poolsBalances)
    return poolsInfo;
}

export const useIndexesInfo = (chainId: number, indexIds: string[], tokens: Token[], account?: string) : PoolData[] => {

    const indexesBalances = useTokensInfoForIndexes(chainId, indexIds, tokens, account)
    const indexInfo : PoolData[] = poolsInfoFromBalances(chainId, indexesBalances)
    return indexInfo;
}



export const useDashboardModel = (chainId: number, tokens: Token[], depositToken: Token, account?: string) : DashboadModel => {

    // combine pools and indexes stats and return aggeragated token amount & value totals 
    const poolsBalances = useTokensInfoForPools(chainId, PoolIds(chainId), tokens, account)
    const indexesBalances = useTokensInfoForIndexes(chainId, IndexesIds(chainId), tokens, account)

    // combine pools and indexes stats and return aggeragated token amount & value totals 
    // const poolsBalances = useTokensInfoForPools(chainId, PoolIds(chainId), tokens, account)
    // const indexesBalances = useTokensInfoForIndexes(chainId, IndexesIds(chainId), tokens, account)

    // Sum up balance and value across all pools 
    // if an account is connected use his balance and value, otherwise show the totals
    let initValues = tokens.reduce( (acc, val) => {
        acc[val.symbol] = { 
            symbol: val.symbol, 
            decimals: val.decimals, 
            value: BigNumber.from(0), 
            balance: BigNumber.from(0),
            loaded: false
        }
        return acc
    }, {} as TokenBalances )

    // const allPools = [...Object.values(indexesBalances), ...Object.values(poolsBalances)]

    // If no account is provided, only return balances/values for Pools (not Indexes) 
    // because Indexes will hold their values in Pools
    const allPools = account? [...Object.values(indexesBalances), ...Object.values(poolsBalances)] :
                              [...Object.values(poolsBalances)]

    // Map of aggreagate balance and values, by token, in eveery pool
    const tokenBalances : TokenBalances = allPools.reduce( (totals, pool ) : TokenBalances => {

        Object.keys(pool).forEach( symbol => {
            const tokenInfo = pool[symbol] 
            if (tokenInfo.value) {
                totals[symbol].value = (account && tokenInfo.accountValue) ? totals[symbol].value.add(tokenInfo.accountValue) : 
                                       tokenInfo.value ? totals[symbol].value.add(tokenInfo.value) : totals[symbol].value
            }
            if (tokenInfo.balance) {
                totals[symbol].balance = (account && tokenInfo.accountBalance) ? totals[symbol].balance.add(tokenInfo.accountBalance) : 
                                         tokenInfo.balance ? totals[symbol].balance.add(tokenInfo.balance) : totals[symbol].balance
            }
            
            totals[symbol].loaded = (tokenInfo.value !== undefined && tokenInfo.balance !== undefined)
        })
        return totals

    }, initValues )

 
    const didLoad : boolean = Object.values(tokenBalances).reduce( (loaded, token ) : boolean => {
        return (loaded && token.loaded === true)
    }, true )

    // console.log("useDashboardModel = didLoad: ", didLoad, "account: ", account)

    const totalValue: BigNumber = Object.values(tokenBalances).reduce( (total, token ) : BigNumber => {
        return total.add(token.value)
    }, BigNumber.from(0))


    //// Indexes & Pools Info ////
    const poolsInfo : PoolData[] = poolsInfoFromBalances(chainId, poolsBalances)
    const indexesInfo : PoolData[] = poolsInfoFromBalances(chainId, indexesBalances)

    //// Chart1: Asset value % Chart Data  ////
    const valueByAsset : PieChartsData[] = Object.values(tokenBalances).map( (item ) => {
        return {
            name: item.symbol,
            value: Number( fromDecimals( item.value, depositToken.decimals, 2) ),
       } 
    }).filter( it => it.value > 0)

    //// Chart 2: Value by Pools/Indexes////
    const valueByPool: PieChartsData[] = valueByPoolChartData(chainId, depositToken, poolsBalances, indexesBalances, account)
                                          .sort ( (a, b) => { return b.value - a.value } )

    return  {
        portfolioInfo: { tokenBalances: tokenBalances, totalValue: totalValue },
        chartValueByAsset: { title: "Asset Allocation", data: valueByAsset, width: 300, height: 300 },
        chartValueByPool: { title: "Strategy Allocation", data: valueByPool, width: 300, height: 300 },
        poolsInfo,
        indexesInfo,
        didLoad,
    }

}




const poolsInfoFromBalances = (chainId : number, poolsBalances: TokenBalanceMapforIndexMap ) : PoolData[] => {

    return Object.keys(poolsBalances).map( (poolId : string) : PoolData => {

        const { depositToken : depositTokenSymbol, investTokens : investTokenSymbols } = PoolInfo(chainId, poolId)
        const poolTokenSymbols = [depositTokenSymbol, ...investTokenSymbols] as string[]

        // tokensBalances
        const tokenInfoArray =  Object.values(poolsBalances[poolId]) as TokenInfo[]
        const tokensArrayFiltered = tokenInfoArray.filter( it => poolTokenSymbols.includes(it.symbol) )

        const totalValue : BigNumber = tokensArrayFiltered.reduce( (acc, val)  => {
            if (val.accountValue) acc = acc.add(val.accountValue)
            return acc
        }, BigNumber.from(0))

        return  { poolId, tokenInfoArray: tokensArrayFiltered, totalValue }
    })
}



//TODO move to a file shared with IndexStatsView

const valueByPoolChartData = (
        chainId: number, 
        depositToken : Token, 
        poolsBalances : { [x: string]: any } ,
        indexesBalances : { [x: string]: any },
        account? : string
        
    ): PieChartsData[] => {
 

  
    const tokenBalancesByPool = Object.keys(poolsBalances).map ( poolId => {
        return { 
            poolId, 
            tokensBalance: poolsBalances[poolId]
        }
    })

    const tokenBalancesForIndexes = Object.keys(indexesBalances).map ( indexId => {
        return { 
            poolId: indexId, 
            tokensBalance: indexesBalances[indexId]
        }
    })
    

    // if don't have account don't return indexes because their value in already accounted in the pools
    const allPools = account ? [...tokenBalancesForIndexes, ...tokenBalancesByPool] : [...tokenBalancesByPool]

    // account for the share of each pool owned by the index
    const valueByPool = Object.values(allPools).map( (it : any) => {

        const { name } = PoolInfo(chainId, it.poolId)

        const value = it.tokensBalance ? Object.keys(it.tokensBalance).reduce( (acc : BigNumber, symbol : string) => {
            const value =  account ?  it.tokensBalance[symbol].accountValue : it.tokensBalance[symbol].value
            acc = value ? acc.add(value) : acc
            return acc
        }, BigNumber.from(0)) : BigNumber.from(0)

        return {
            name: name,
            value: Number(fromDecimals(value, depositToken.decimals, 2))
        }
    }).filter(it => it.value > 0)

    return valueByPool
}
