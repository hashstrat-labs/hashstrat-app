
import { useCall } from "@usedapp/core"
import { TreasuryContract } from "../utils/network"

export const useGetBalance = (chainId: number) => {

    const { value, error } = useCall({
        contract: TreasuryContract(chainId),
        method: 'getBalance',
        args:  [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0]
}


export const useGetPayments = (chainId: number) => {

    const { value, error } = useCall({
        contract: TreasuryContract(chainId),
        method: 'getPayments',
        args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0]
}

