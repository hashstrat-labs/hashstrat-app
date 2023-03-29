
import { useCall } from "@usedapp/core"
import { StrategyContract } from "../utils/network"


export const useStrategyName = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'name',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useStrategyDescription = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'description',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useStrategyDepositTokenAddress = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'depositToken',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useStrategyInvestTokenAddress = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'investToken',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useStrategyFeedAddress = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'feed',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}


export const useStrategyRebalancingThreshold = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'rebalancingThreshold',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useStrategyTargetInvestPerc = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'targetInvestPerc',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}
