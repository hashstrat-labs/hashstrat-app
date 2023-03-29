
import { constants } from "ethers"

import { useContractFunction, useCall } from "@usedapp/core"
import { DivsDistributorContract } from "../utils/network"



export const useGetDistributionIntervals = (chainId: number) => {

    const contract = DivsDistributorContract(chainId)
    const { value } = useCall({
        contract: contract,
        method: 'getDistributionIntervals',
        args: [],
    }) ?? {}

    return value?.[0]
}


export const useGetDistributiontIntervalsCount = (chainId: number) => {

    const contract = DivsDistributorContract(chainId)
    const { value } = useCall({
        contract: contract,
        method: 'getDistributiontIntervalsCount',
        args: [],
    }) ?? {}
    
    return value?.[0]
}


export const useClaimableDivs = (chainId: number, account?: string) => {

    const contract = DivsDistributorContract(chainId)
    const { value } = useCall({
        contract: contract,
        method: 'claimableDivs',
        args: account? [account] : [constants.AddressZero]

    }) ?? {}
    
    return value?.[0]
}


export const useClaimedDivs = (chainId: number, distributionId: number, account?: string) => {

    const contract = DivsDistributorContract(chainId)
    const { value } = useCall({
        contract: contract,
        method: 'claimedDivs',
        args: distributionId && account ? [distributionId, account] : [0, constants.AddressZero]

    }) ?? {}
    
    return value?.[0]
}

//// User Actions

export const useClaimDivs = (chainId: number) => {
    const contract = DivsDistributorContract(chainId)

    const { send: claimDivsSend, state: claimDivsState } = useContractFunction(contract, "claimDivs", { 
        transactionName: "Claim Dividends"
    })

    const claimDivs = () => {
        return claimDivsSend()
    }

    return { claimDivs, claimDivsState }
}


