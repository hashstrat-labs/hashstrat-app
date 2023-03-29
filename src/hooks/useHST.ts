
import { useCall } from "@usedapp/core"
import { constants } from "ethers"

import { HstContract } from "../utils/network"


export const useTotalSupply = (chainId: number)  => {
    const tokenContract = HstContract(chainId) 
    const { value } = useCall({
            contract: tokenContract,
            method: 'totalSupply',
            args: [],
    }) ?? {}

    return value?.[0].toString()
}

export const useMaxSupply = (chainId: number) => {
    const tokenContract = HstContract(chainId) 

    const { value } = useCall({
            contract: tokenContract,
            method: 'maxSupply',
            args: [],
    }) ?? {}

    return value?.[0].toString()
}


export const useGetPastVotes = (chainId: number, block: number, account?: string) => {
    const tokenContract = HstContract(chainId) 

    const { value } = useCall({
            contract: tokenContract,
            method: 'getPastVotes',
            args: account && block ? [account, block] : [constants.AddressZero, 0],
        }) ?? {}

    return value?.[0].toString()
}

export const useGetPastTotalSupply = (chainId: number, block?: number) => {
    const tokenContract = HstContract(chainId) 

    const { value } = useCall({
            contract: tokenContract,
            method: 'getPastTotalSupply',
            args: block ? [ block ] : [0],
        }) ?? {}

    return value?.[0].toString()
}
