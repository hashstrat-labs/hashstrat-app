import { constants, BigNumber } from "ethers"

import {  useCalls } from "@usedapp/core"
import { PoolContract } from "../utils/network"
import { PoolIds, IndexesIds} from "../utils/pools"


export const useTotalDeposited = (chainId: number, account: string | undefined) => {

    const allIds = [...IndexesIds(chainId), ...PoolIds(chainId)]

    const totalDepositedCalls = allIds.map( poolId => {
        return {
            contract: PoolContract(chainId, poolId),
            method: 'deposits',
            args: account? [account] : [constants.AddressZero]
        }
    })

    const totalDepositedResults = useCalls(totalDepositedCalls) ?? []
    totalDepositedResults.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'deposits' on ${totalDepositedCalls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    const total = totalDepositedResults.reduce( (acc : BigNumber, val : any) => {
        acc = ( val && val?.value ) ? acc.add( val.value[0] ) : acc
        return acc
    }, BigNumber.from(0))

    return total
}





export const useTotalWithdrawals = (chainId: number, account: string | undefined) => {

    const allIds = [...IndexesIds(chainId), ...PoolIds(chainId)]

    const totalDepositedCalls = allIds.map( poolId => {
        return {
            contract: PoolContract(chainId, poolId),
            method: 'withdrawals',
            args: account? [account] : [constants.AddressZero]
        }
    })

    const totalDepositedResults = useCalls(totalDepositedCalls) ?? []
    totalDepositedResults.forEach((result, idx) => {
        if(result && result.error) {
            console.error(`Error encountered calling 'withdrawals' on ${totalDepositedCalls[idx]?.contract.address}: ${result.error.message}`)
        }
    })

    const total = totalDepositedResults.reduce( (acc : BigNumber, val : any) => {
        acc = ( val && val?.value ) ? acc.add( val.value[0] ) : acc
        return acc

    }, BigNumber.from(0))

    return total
}
