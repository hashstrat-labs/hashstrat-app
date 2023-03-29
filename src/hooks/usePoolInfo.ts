
import { useCalls } from "@usedapp/core"


import { IndexesInfo, PoolInfo, PoolsInfo, IndexesIds } from "../utils/pools"
import { Token } from "../types/Token"
import { groupBy } from "../utils/formatter"

import { BigNumber, constants } from "ethers"
import { FarmContract, DisabledFarmContract  } from "../utils/network"

import { FeedContractsForTokens, ERC20Contract, PoolLPContract, PoolContract } from "../utils/network"



export type TokenBalanceInfoForIndexMap = { [ x : string ] : TokeBalanceInfoForIndex }
export type TokenBalanceInfoMap = { [ symbol : string ] : TokenBalanceInfo }
export type PoolValueInfoMap = { [ symbol : string ] : PoolValueInfo }
export type TokenBalanceMapforIndexMap = { [ indexid : string ] : TokenBalanceInfoMap }
export type PoolValueMapForIndexMap = { [ indexid : string ] : PoolValueInfoMap }

export type PoolValueInfo = {
    indexId: string,
    poolId: string,
    value: BigNumber,
    accountValue: BigNumber | undefined
}

export type TokenBalanceInfo = {
    indexId: string,
    symbol: string,
    balance: BigNumber,
    value: BigNumber,
    decimals: number,
    accountBalance: BigNumber | undefined,
    accountValue: BigNumber | undefined,
}

type TokeBalanceInfoForIndex = {
    indexId: string;
    tokensBalances : TokenBalanceInfoMap;
    poolBalances :PoolValueInfoMap;
}


// price feed 8 digit precision  
const feedPrecision = BigNumber.from("100000000")



export const usePoolsInfoForIndexes = (chainId: number, indexIds: string[], tokens: Token[], account?: string) : PoolValueMapForIndexMap => {

   const tokenBalanceInfoForIndexMap = useTokensInfoAndPoolsInfoForIndexes(chainId, indexIds, tokens, account)

   const response = Object.keys(tokenBalanceInfoForIndexMap).map( indexId => {
        const tokenBalanceIno = tokenBalanceInfoForIndexMap[indexId]
        return {
            indexId,
            poolBalances : tokenBalanceIno.poolBalances
        }
   }).reduce( (acc, val) => {
        acc[val.indexId] = val.poolBalances
        return acc
   },  {} as { [x : string] : PoolValueInfoMap } )

   return response
}



export const useTokensInfoForIndexes = (chainId: number,  indexIds: string[], tokens: Token[], account?: string) : TokenBalanceMapforIndexMap => {

   const tokenBalanceInfoForIndexMap = useTokensInfoAndPoolsInfoForIndexes(chainId, indexIds, tokens, account)

   const response = Object.keys(tokenBalanceInfoForIndexMap).map( indexId => {
        const tokenBalanceIno = tokenBalanceInfoForIndexMap[indexId]
        return {
            indexId,
            tokensBalances : tokenBalanceIno.tokensBalances
        }
   }).reduce( (acc, val) => {
        acc[val.indexId] = val.tokensBalances
        return acc
   },  {} as { [x : string] : TokenBalanceInfoMap } )


   return response
}


export const useTokensInfoAndPoolsInfoForIndexes = (chainId: number,  indexIds: string[], tokens: Token[], account?: string) : TokenBalanceInfoForIndexMap => {

    // array of indexes with their associated pools info array [indexId, pools[{name, poolAddress, lpTokenAddress, weight}]]
    const indexPools = useIndexPools(chainId, indexIds) 

    // array of poolIds for all indexes in indexPools array
    const poolIds = indexPools.flatMap( index => {
        return index.pools && index.pools.map( (pool : any) => {
            return pool.name.toLowerCase()
        })
    }).filter((item, pos, self) => {  // remove dups
        return self.indexOf(item) === pos;
    }).filter( item => {
        return item !== undefined
    }).sort()
        

    // get assets for all pools in these Indexes
    const poolsBalances = useTokensInfoForPools(chainId, poolIds, tokens)

    // get all LP token balances of all pools in the indexes -> PoolLPs.balanceOf(index_address)
    const lpbalancesByIndexMap = usePoolsLPBalancesForIndexes(chainId, indexIds, poolIds)

    // process all poolsBalances determining the allocation of the index in those pool
    // allBalances is a map, for evey index, of the token values/amount aggregated across all pools in the index
    //  allBalances :=  { indexId: { symbol: { amount, value, decimals } } }

    const allBalancesByToken = indexPools.map( item  => {

        const indexId = item.indexId as string
        const poolids = item.pools && item.pools.map( (i: { name: string }) => i.name.toLowerCase() )
        const lpinfo = lpbalancesByIndexMap[indexId]

        // aggretation the index value by token
        let indexBalancesByToken = tokens.reduce( (map, token ) => {
            map[ token.symbol ] = { 
                amount: BigNumber.from(0),
                value: BigNumber.from(0),
                decimals: token.decimals,
            }
            return map;
        }, {} as {[x: string]: { decimals: number, amount: BigNumber, value: BigNumber } } );


        // for each pool in the index and for each token apply the Index LP %  to the token amount/values
        // and populate ndexBalancesByToken
        poolids && poolids.forEach( (poolId : string) => {

            const poolTokens = poolsBalances[poolId]
            const poolLPInfo = lpinfo.find( el => el.poolId.toLowerCase() === poolId.toLowerCase())
            const lpBalance = poolLPInfo && poolLPInfo.lpBalance 
            const lpTotalSupply = poolLPInfo && poolLPInfo.lpTotalSupply 

            Object.keys(poolTokens).forEach( symbol => {
                
                const tokenInfo = poolTokens[symbol]

                const haveBalance = tokenInfo.balance && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
                const balance = haveBalance && tokenInfo.balance.mul(lpBalance).div(lpTotalSupply)
                if (balance) {
                    indexBalancesByToken[symbol].amount = indexBalancesByToken[symbol].amount.add(balance)
                }

                const haveValue = tokenInfo.value && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
                const value = haveValue && tokenInfo.value.mul(lpBalance).div(lpTotalSupply)
                if (value) {
                    indexBalancesByToken[symbol].value = indexBalancesByToken[symbol].value.add(value)
                }
            })
        })
        
        return {
            indexId: indexId,
            indexBalancesByToken   // { symbol => { value, balance, } } of the quota of tokens owner by the Index across its Pools
        }

    }).reduce( (acc, val) => {
        acc[val.indexId] = val.indexBalancesByToken
        return acc
    }, {} as { [x: string]: any } )


    // for each pool in the index and for each token apply the Index LP %  to the token amount/values
    // and populate indexBalancesByPool
    const indexBalancesByPool = indexPools.map( item  => {

        const indexId = item.indexId as string
        const poolids = item.pools && item.pools.map( (i: { name: string }) => i.name.toLowerCase() )
        const lpinfo = lpbalancesByIndexMap[indexId]

        // aggregate the index value by pool
        let indexBalancesByPool = poolids?.reduce( (map : { [x: string]:  { value: BigNumber } }, poolId : string) => {
            map[ poolId ] = { value: BigNumber.from(0) }
            return map 
        }, {} as { [x: string]: { value:  BigNumber } } );


        // for each pool in the index and for each token apply the Index LP %  to the token amount/values
        // and populate the 2 aggregates: indexBalancesByToken, indexBalancesByPool

        poolids && poolids.forEach( (poolId : string) => {

            const poolTokens = poolsBalances[poolId]
            const poolLPInfo = lpinfo.find( el => el.poolId.toLowerCase() === poolId.toLowerCase())
            const lpBalance = poolLPInfo && poolLPInfo.lpBalance 
            const lpTotalSupply = poolLPInfo && poolLPInfo.lpTotalSupply 

            Object.keys(poolTokens).forEach( symbol => {
                
                const tokenInfo = poolTokens[symbol]
                const haveValue = tokenInfo.value && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
                const value = haveValue && tokenInfo.value.mul(lpBalance).div(lpTotalSupply)
                if (value) {
                    indexBalancesByPool[poolId].value = indexBalancesByPool[poolId].value.add(value)
                }
            })
        })
        
        return {
            indexId: indexId,
            indexBalancesByPool   // { symbol => { value, balance, } } of the quota of tokens owner by the Index across its Pools
        }

    }).reduce( (acc, val) => {
        acc[val.indexId] = val.indexBalancesByPool
        return acc
    }, {} as { [x: string]: any } )


    // // get the user LP tokens included those staked
    const lpBalancesByIndex = useAccountLPBalancesForIndexes(chainId, indexIds, account)

    // [x: string]: { indexId : string, tokensBalances : any, poolBalances : any }
    const balances = Object.keys(allBalancesByToken)?.map( indexId => {

        const lpBalance = lpBalancesByIndex[indexId].lpBalance
        const lpTotalSupply = lpBalancesByIndex[indexId].lpTotalSupply 

        // populate { symbol: balanceInfo } map
        const tokensBalances = {} as {[ x : string] : TokenBalanceInfo }
        
        Object.keys(allBalancesByToken[indexId]).forEach( symbol => {

            const balance : BigNumber = allBalancesByToken[indexId][symbol].amount
            const value = allBalancesByToken[indexId][symbol]?.value  as BigNumber
            const decimals = allBalancesByToken[indexId][symbol]?.decimals as number

            const haveBalance =  balance && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
            const accountBalance = haveBalance ? balance.mul(lpBalance).div(lpTotalSupply) : undefined
        
            const haveValue = value && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
            const accountValue = haveValue ? value.mul(lpBalance).div(lpTotalSupply) : undefined

            tokensBalances[symbol] = {
                indexId: indexId,
                symbol: symbol,
                decimals: decimals,
                balance: balance,
                value: value,
                accountBalance: accountBalance,
                accountValue: accountValue
            }
        })

        // populate { poolId: balanceInfo } map
        const poolBalances = {} as {[ x : string ] : PoolValueInfo }

        indexBalancesByPool[indexId] && Object.keys(indexBalancesByPool[indexId])?.forEach( poolId => {
            const value : BigNumber = indexBalancesByPool[indexId][poolId]?.value
            const haveValue = value && lpBalance && lpTotalSupply && !lpTotalSupply.isZero()
            const accountValue : BigNumber | undefined = haveValue ? value.mul(lpBalance).div(lpTotalSupply) : undefined

            poolBalances[poolId] = {
                indexId: indexId,
                poolId: poolId,
                value,
                accountValue
            }
        })

        return {
            indexId: indexId,
            tokensBalances: tokensBalances,
            poolBalances: poolBalances
        }

    }).reduce( (acc, val) => {
        acc[val.indexId] = val
        return acc
    }, {} as { [x: string]: TokeBalanceInfoForIndex } )


    return balances
}


export type LPBalanceInfo = {
    poolId: string,
    lpBalance: BigNumber | undefined,
    lpTotalSupply: BigNumber | undefined,
    perc: number | undefined
}



export const useAccountLPBalanceForPool = (chainId: number, poolId: string, account?: string) : LPBalanceInfo => {
    const poolsInfo = PoolsInfo(chainId, [poolId]) 
    const baances = useAccountLPBalancesForPools(chainId, account, poolsInfo)
    return baances[0]
}



export const useAccountLPBalanceForIndex = (chainId: number, indexId: string, account?: string) : LPBalanceInfo => {
    const baances = useAccountLPBalancesForIndexes(chainId, [indexId], account)
    return baances[indexId]
}


export const useAccountLPBalancesForIndexes = (chainId: number, indexIds: string[], account?: string) : { [ indexId: string] : LPBalanceInfo } => {

        // get the balance of all Indexes of the LP tokens of all Pools
        const indexesInfo = IndexesInfo(chainId,  indexIds)

        // Indexes addresses
        const lpTokens1Requests = indexesInfo.filter(req => PoolInfo(chainId, req.poolId).disabled === 'false').map( index =>  {
            return {
                indexId: index.poolId,
                indexAddress: index.pool,
                lptokenAddress: index.lptoken
            }
        })

        const lpTokens2Requests = indexesInfo.filter(req => PoolInfo(chainId, req.poolId).disabled === 'true').map( index =>  {
            return {
                indexId: index.poolId,
                indexAddress: index.pool,
                lptokenAddress: index.lptoken
            }
        })


        
        // get the IndexLP non staked balances
        const unstakedLpBalanc1Calls = lpTokens1Requests.map(req => ({
            contract: PoolLPContract(chainId, req.indexId),
            method: 'balanceOf',
            args: account? [account] : [constants.AddressZero]
        })) ?? []

        const unstakedLpBalanc2Calls = lpTokens2Requests.map(req => ({
            contract: PoolLPContract(chainId, req.indexId),
            method: 'balanceOf',
            args: account? [account] : [constants.AddressZero]
        })) ?? []
      
    
        const unstakedLpBalance1Results = useCalls(unstakedLpBalanc1Calls) ?? []
        const unstakedLpBalance2Results = useCalls(unstakedLpBalanc2Calls) ?? []


        // get the IndexLP staked balances
        const stakedLpBalance1Calls = lpTokens1Requests.map(req => ({
            contract: FarmContract(chainId),
            method: 'getStakedBalance',
            args: account? [account, req.lptokenAddress] : [constants.AddressZero, req.lptokenAddress]
        })) ?? []

        const stakedLpBalance2Calls = lpTokens2Requests.map(req => ({
            contract: DisabledFarmContract(chainId),
            method: 'getStakedBalance',
            args: account? [account, req.lptokenAddress] : [constants.AddressZero, req.lptokenAddress]
        })) ?? []

        const stakedLpBalance1Results = useCalls(stakedLpBalance1Calls) ?? []
        const stakedLpBalance2Results = useCalls(stakedLpBalance2Calls) ?? []

    
        // LP tokens supply
        const totalSupply1Calls = lpTokens1Requests.map(req => ({
            contract: PoolLPContract(chainId, req.indexId),
            method: 'totalSupply',
            args: []
        })) ?? []

        const totalSupply2Calls = lpTokens2Requests.map(req => ({
            contract: PoolLPContract(chainId, req.indexId),
            method: 'totalSupply',
            args: []
        })) ?? []
      

        const totalSupply1Results = useCalls(totalSupply1Calls) ?? []
        const totalSupply2Results = useCalls(totalSupply2Calls) ?? []
 

        const lpBalances1 = lpTokens1Requests.map( (req, idx) => {

            const unstakedBalance = unstakedLpBalance1Results[idx]?.value && unstakedLpBalance1Results[idx]?.value[0]
            const stakedBalance = stakedLpBalance1Results[idx]?.value && stakedLpBalance1Results[idx]?.value[0]

            const balance = (unstakedBalance &&  stakedBalance) ? unstakedBalance.add(stakedBalance) : undefined
            const supply = totalSupply1Results[idx]?.value && totalSupply1Results[idx]?.value[0]
            const precision = BigNumber.from(10000)

            const perc = (balance && supply && !supply.isZero()) ? precision.mul(balance).div(supply).toNumber() / 10000 : undefined
            
            return {
                poolId: req.indexId,
                lpBalance: balance,
                lpTotalSupply: supply,
                perc: perc,
            }
        })
        
        const lpBalances2 = lpTokens2Requests.map( (req, idx) => {

            const unstakedBalance = unstakedLpBalance2Results[idx]?.value && unstakedLpBalance2Results[idx]?.value[0]
            const stakedBalance = stakedLpBalance2Results[idx]?.value && stakedLpBalance2Results[idx]?.value[0]

            const balance = (unstakedBalance &&  stakedBalance) ? unstakedBalance.add(stakedBalance) : undefined
            const supply = totalSupply2Results[idx]?.value && totalSupply2Results[idx]?.value[0]
            const precision = BigNumber.from(10000)

            const perc = (balance && supply && !supply.isZero()) ? precision.mul(balance).div(supply).toNumber() / 10000 : undefined
            
            return {
                poolId: req.indexId,
                lpBalance: balance,
                lpTotalSupply: supply,
                perc: perc,
            }
        })
    
        
        const lpBalancesByIndex = [...lpBalances1, ...lpBalances2].reduce( (acc, item) => {
            acc[item.poolId] = item
            return acc
        }, {  }  as  { [ x : string] : LPBalanceInfo } )

        return lpBalancesByIndex
}



type IndexLPInfo = {
    lpBalance: BigNumber | undefined;
    lpTotalSupply: BigNumber | undefined;
    indexId: string;
    poolId: string;
    indexPerc: BigNumber | undefined;
}

// Returns the Pool LP balances that each Index has for their Pools, grouped by indexid
const usePoolsLPBalancesForIndexes = (chainId: number, indexIds: string[], poolIds: string[]) : { [x: string ] : IndexLPInfo[] } =>  {


    // poolsInfo for all pools in indexIds indexes
    const poolsInfo = PoolsInfo(chainId, poolIds) 

    // get the balance of all Indexes of the LP tokens of all Pools
    const indexesInfo = IndexesInfo(chainId,  indexIds)

    // [ Index x Pool ] addresses
    const lpTokensRequests = indexesInfo.flatMap( index =>  {
        return poolsInfo.map( pool => { 
            return {
                indexId: index.poolId,
                indexAddress: index.pool,
                poolId: pool.poolId,
                poolAddress: pool.pool
            }
        })
    })


    const calls1 = lpTokensRequests.map(req => ({
        contract: PoolLPContract(chainId, req.poolId),
        method: 'balanceOf',
        args: req.indexAddress? [req.indexAddress] : [constants.AddressZero]
    })) ?? []
  

    const results1 = useCalls(calls1) ?? []
    results1.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'balanceOf' on ${calls1[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    // LP tokens supply
    const calls2 = lpTokensRequests.map(req => ({
        contract: PoolLPContract(chainId, req.poolId),
        method: 'totalSupply',
        args: []
    })) ?? []
  

    const results2 = useCalls(calls2) ?? []
    results2.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'totalSupply' on ${calls2[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    const lpBalanceResponse = lpTokensRequests.map( (req, idx) => {
        const balance = results1[idx]?.value ? results1[idx]?.value[0] : undefined
        const supply = results2[idx]?.value ? results2[idx]?.value[0] : undefined
        const precision = BigNumber.from(10000)

        const perc = (balance && supply && !supply.isZero()) ? precision.mul(balance).div(supply).toNumber() / 10000 : undefined

        return {
            lpBalance: balance,
            lpTotalSupply: supply,
            indexId: req.indexId,
            poolId: req.poolId,
            indexPerc: perc,
        } as IndexLPInfo
    })

    const lpBalanceResponseByIndex = groupBy(lpBalanceResponse, b => b.indexId)
    // const lpBalancees = Object.values(lpBalanceResponseByIndex)
 
    return lpBalanceResponseByIndex
}


const useIndexPools = (chainId: number, poodIds: string[]) => {

    const calls = poodIds.map(poodId => ({
        contract: PoolContract(chainId, poodId),
        method: 'getPoolsInfo',
        args: [] 
    })) ?? []

    const results = useCalls(calls) ?? []

    results.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'getPoolsInfo' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

   
    // array of Indexes with array of associated pools
    
    const poolsForIndexes =  poodIds.map( (poolId, idx) => {
        const poolInfo = results.at(idx)?.value
        return {
            indexId: poolId,
            pools: poolInfo && poolInfo[0].map( (info : any) => {
                    return {
                        name: info.name,
                        poolAddress: info.poolAddress,
                        lpTokenAddress: info.lpTokenAddress,
                        weight: info.weight
                    }
            }),
        }
    })

    return poolsForIndexes
}


// Returns the token balance for the account at every pool
// poolIds params is an array of pool_ids 
// if the account is provided, the token balance info returned will account for staked LP tokens as well
// if the account is not provided ...

export const useTokensInfoForPools = (chainId: number, poolIds: string[], tokens: Token[], account?: string) : TokenBalanceMapforIndexMap => {
 
    // get the pool addresses for all indexes or all regular pools in the chain
    const poolsInfo = PoolsInfo(chainId, poolIds) 

    // get the prices for each token
    let tokenPriceMap = useTokenPrices(chainId, tokens)  // map of [ symbol => price ]

    // get LP tokens balances and totalSupplies of the account for every pool in poolsInfo
    const lpBalanceResponses = useAccountLPBalancesForPools(chainId, account, poolsInfo)

    const lpBalances = lpBalanceResponses.reduce( (map, balance ) => {
        map[ balance.poolId ] = balance
        return map;
    }, {} as { [x: string]: LPBalanceInfo } );


    // the the balance of all tokens in all pools
    const poolsBalancesResponse = useTokensPoolsBalances(chainId, tokens, poolsInfo)

    const poolsBalanceWithTokenValues = poolsBalancesResponse.map ( pool => {
       
        const lpBalance = lpBalances[pool.poolId].lpBalance 
        const lpSupply = lpBalances[pool.poolId].lpTotalSupply

        const isDepositToken = (pool.tokenSymbol === pool.depositToken?.symbol)
        const feedPrice = isDepositToken ? 1 : tokenPriceMap[pool.tokenSymbol]

        const canHaveTokenValue = pool.balance && feedPrice
        const value = canHaveTokenValue && isDepositToken ? pool.balance.mul(BigNumber.from(feedPrice)) :
                                    (canHaveTokenValue) ? adjustAmountDecimals( pool.tokenDecimals, pool.depositToken!.decimals, pool.balance.mul(BigNumber.from(feedPrice)).div(feedPrecision)  ) : undefined

        const canHaveAccountBalance = pool.balance && lpBalance && lpSupply && !lpSupply.isZero()
        const accountBalance = canHaveAccountBalance && pool.balance.mul(lpBalance).div(lpSupply)

        const canHaveAccountValue = value && lpBalance && lpSupply && !lpSupply.isZero()
        const accountValue = canHaveAccountValue && value.mul(lpBalance).div(lpSupply)

        return {
            poolId: pool.poolId,
            symbol: pool.tokenSymbol,
            decimals: pool.tokenDecimals,
            balance: pool.balance,
            value: value,
            accountBalance: accountBalance,
            accountValue: accountValue,
        }
    })

    const balancesByPoolId = groupBy(poolsBalanceWithTokenValues, b => b.poolId)

    let poolBalances = {} as TokenBalanceMapforIndexMap

    Object.keys(balancesByPoolId).forEach( poolId => {
        const tokenMap = balancesByPoolId[poolId].reduce ( (acc, val) => {
            acc[val.symbol] = val
            return acc
        }, {} as {[ x: string] : any} )
        
        poolBalances[poolId] = tokenMap
    })

    return poolBalances
}



export const useUsersForPools = (chainId: number, poolIds: string[], account?: string) => {
    const poolsInfo = PoolsInfo(chainId, poolIds) 

    // Get the  LP balances of the account for every Index
    const usersRequest = poolsInfo.map( pool => {
        return { 
            poolId: pool.poolId, 
            poolAddress: pool.pool,
        }
    })

    const usersReqCalls = usersRequest.map(req => ({
        contract: PoolContract(chainId, req.poolId),
        method: 'getUsers',
        args: []
    })) ?? []

 
    const usersResults = useCalls(usersReqCalls) ?? []
    usersResults.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'usersArray' on ${usersReqCalls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    const indexeAddresses = IndexesInfo(chainId, IndexesIds(chainId)).map ( el => el.pool )
    let addresses = new Set<string>()

    usersRequest.map( (req, idx)  => {
        const res = usersResults.at(idx)?.value
        return { req, res } 
    }).forEach( el => {
        if (el.res && el.res[0]) {
            el.res[0].filter( (el : any) => !indexeAddresses.includes(el) ).forEach(addresses.add, addresses)
        }
    })


    return addresses
}



export const useUsersForIndexes = (chainId: number, indexIds: string[], account?: string) => {
    const indexesInfo = IndexesInfo(chainId, indexIds) 

    // Get the  LP balances of the account for every Index
    const usersRequest = indexesInfo.map( index => {
        return { 
            poolId: index.poolId, 
            poolAddress: index.pool,
        }
    })

    const usersReqCalls = usersRequest.map(req => ({
        contract: PoolContract(chainId, req.poolId),
        method: 'getUsers',
        args: []
    })) ?? []

    const usersResults = useCalls(usersReqCalls) ?? []
    usersResults.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'getUsers' on ${usersReqCalls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    let addresses = new Set<string>()

    usersRequest.map( (req, idx)  => {
        const res = usersResults.at(idx)?.value
        return { req, res } 
    }).forEach( el => {
        if (el.res && el.res[0]) {
            el.res[0].forEach(addresses.add, addresses)
        }
    })

    return addresses
}


// Returns an array containing balance infos for all Tokens[] in every Pool 
//     the array returned contains [ Token x Pool ] entries
//     each entry contains { poolId, tokenSymbol, balance, tokenDecimals, depositToken }
const useTokensPoolsBalances = (chainId : number, tokens: Token[],  poolsInfo: any[]) =>  {

    // requests are [ Token x Pool ] combos
    const tokenPoolsRequestsParams = tokens.flatMap( token => {
        return poolsInfo.map( info => {
           return { 
                poolId: info.poolId, 
                poolAddress: info.pool,
                depositToken: info.depositToken,
                
                tokenSymbol: token.symbol,
                tokenAddress: token.address,
                tokenDecimals: token.decimals,
            }
        })
    })

    // ERC20 calls
    const calls = tokenPoolsRequestsParams.map(req => ({
        contract: ERC20Contract(chainId, req.tokenSymbol, req.poolId),
        method: 'balanceOf',
        args: req.poolAddress? [req.poolAddress] : [constants.AddressZero]
    })) ?? []
  
    const results = useCalls(calls) ?? []
    results.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'balanceOf' on ${calls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    // process the token balances results
    return tokenPoolsRequestsParams.map( (req, idx) => {
        const balance = results.at(idx)?.value
        return {
            poolId: req.poolId,
            tokenSymbol: req.tokenSymbol,
            balance: balance ? balance[0] : undefined, // BigNumber
            tokenDecimals: req.tokenDecimals,
            // price: poolPriceMap[req.poolId], //results4.at(idx)?.value.toString(),
            depositToken: req.depositToken,
        }
    })
}



// Retunrs the LP balance and total supply for the LP tokens of every pool and index in the poolsInfo array
// Returned LP balances include staked and non staked balances 
// If an account is not provided return only the LP total supply
// It should return both PoolLP and IndexLP balance info for the account provided 
const useAccountLPBalancesForPools = (chainId : number, account: string | undefined, poolsInfo: any[] ) : LPBalanceInfo[] => {

    // Get the  LP balances of the account for every Pool
    const lptokens1Requests = poolsInfo.filter(req => PoolInfo(chainId, req.poolId).disabled === 'false').map( pool => {
        return { 
            poolId: pool.poolId, 
            lptokenAddress: pool.lptoken, 
            account: account,
            depositToken: pool.depositToken,
        }
    })

    const lptokens2Requests = poolsInfo.filter(req => PoolInfo(chainId, req.poolId).disabled === 'true').map( pool => {
        return { 
            poolId: pool.poolId, 
            lptokenAddress: pool.lptoken, 
            account: account,
            depositToken: pool.depositToken,
        }
    })

    // get the LP non staked balances
    const lpBalance1Calls = lptokens1Requests.map(req => ({
        contract: PoolLPContract(chainId, req.poolId),
        method: 'balanceOf',
        args:  req.account? [req.account] : [constants.AddressZero]
    })) ?? []

    const lpBalance2Calls = lptokens2Requests.map(req => ({
        contract: PoolLPContract(chainId, req.poolId),
        method: 'balanceOf',
        args:  req.account? [req.account] : [constants.AddressZero]
    })) ?? []

    const lpBalance1Results = useCalls(lpBalance1Calls) ?? []
    const lpBalance2Results = useCalls(lpBalance2Calls) ?? []


    // get the LP staked balances for the "enabled" pools
    const stakedLpBalance1Calls = lptokens1Requests.map(req => ({
        contract: FarmContract(chainId),
        method: 'getStakedBalance',
        args: req.account? [req.account, req.lptokenAddress] : [constants.AddressZero, req.lptokenAddress]
    })) ?? []

    // get the LP staked balances for the "disabled" pools
    const stakedLpBalance2Calls = lptokens2Requests.map(req => ({
        contract: DisabledFarmContract(chainId),
        method: 'getStakedBalance',
        args: req.account? [req.account, req.lptokenAddress] : [constants.AddressZero, req.lptokenAddress]
    })) ?? []


    const stakedLpBalance1Results = useCalls(stakedLpBalance1Calls) ?? []
    const stakedLpBalance2Results = useCalls(stakedLpBalance2Calls) ?? []


    // get the LP total supplies
    const lpTotalSupply1Calls = lptokens1Requests.map(req => ({
        contract: PoolLPContract(chainId, req.poolId),
        method: 'totalSupply',
        args: []
    })) ?? []

    const lpTotalSupply2Calls = lptokens2Requests.map(req => ({
        contract: PoolLPContract(chainId, req.poolId),
        method: 'totalSupply',
        args: []
    })) ?? []


    const lpTotalSupply1Results = useCalls(lpTotalSupply1Calls) ?? []
    const lpTotalSupply2Results = useCalls(lpTotalSupply2Calls) ?? []
    
    const lpBalance1Responses = lptokens1Requests.map( (req, idx) => {
        const balanceNotStaked = lpBalance1Results.at(idx)?.value
        const balanceStaked = stakedLpBalance1Results.at(idx)?.value
        const supply = ( lpTotalSupply1Results.at(idx)?.value && lpTotalSupply1Results.at(idx)?.value[0] ) as BigNumber | undefined
        const totalBalance = ( balanceNotStaked && balanceStaked && balanceNotStaked[0].add(balanceStaked[0]) )  as BigNumber | undefined

        const precision = BigNumber.from(10000)
        const perc = (totalBalance && supply && !supply.isZero()) ? precision.mul(totalBalance).div(supply).toNumber() / 10000 : undefined

        return {
            poolId: req.poolId,
            lpBalance: totalBalance,
            lpTotalSupply: supply,
            perc: perc,
        }
    })

    const lpBalance2Responses = lptokens2Requests.map( (req, idx) => {
        const balanceNotStaked = lpBalance2Results.at(idx)?.value
        const balanceStaked = stakedLpBalance2Results.at(idx)?.value
        const supply = ( lpTotalSupply2Results.at(idx)?.value && lpTotalSupply2Results.at(idx)?.value[0] ) as BigNumber | undefined
        const totalBalance = ( balanceNotStaked && balanceStaked && balanceNotStaked[0].add(balanceStaked[0]) )  as BigNumber | undefined

        const precision = BigNumber.from(10000)
        const perc = (totalBalance && supply && !supply.isZero()) ? precision.mul(totalBalance).div(supply).toNumber() / 10000 : undefined

        return {
            poolId: req.poolId,
            lpBalance: totalBalance,
            lpTotalSupply: supply,
            perc: perc,
        }
    })


    return [...lpBalance1Responses, ...lpBalance2Responses]
}


// Returns a map of  { token_symbol => price }
const useTokenPrices = (chainId : number, tokens: Token[] )  => {

    const feedContracts = FeedContractsForTokens(chainId)
    const tokenSymbols = Object.keys(feedContracts)

    const pricefeedCalls = tokenSymbols.map( symbol => {
        const contract = feedContracts[symbol]

        return {
            contract:  contract,  // FeedContract(chainId, info.poolId),
            method: 'latestAnswer',
            args: []
        }
    })

    const pricefeedResults = useCalls(pricefeedCalls) ?? []
    pricefeedResults.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'latestAnswer' on ${pricefeedCalls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    let tokenPriceMap = {} as { [x: string]: string }
    tokenSymbols.forEach((symbol, idx) => {
        tokenPriceMap[symbol.toUpperCase()] = pricefeedResults.at(idx)?.value?.toString()
    })

    return tokenPriceMap
}

const adjustAmountDecimals = (tokenInDecimals: number, tokenOutDecimals: number, amountIn : BigNumber) : BigNumber => {

    const amountInAdjusted : BigNumber = (tokenOutDecimals >= tokenInDecimals) ?
            amountIn.mul( BigNumber.from(10 ** (tokenOutDecimals - tokenInDecimals))) :
            amountIn.div( BigNumber.from(10 ** (tokenInDecimals - tokenOutDecimals)))

    return amountInAdjusted;
}