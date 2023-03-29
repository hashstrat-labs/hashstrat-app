
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


export const useStrategyMovingAveragePeriod = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'movingAveragePeriod',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useStrategyMovingAverage = (chainId: number, poolId: string) : string | undefined => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'movingAverage',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}


export const useStrategyTargetPricePercUp = (chainId: number, poolId: string) : string | undefined => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'targetPricePercUp',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useStrategyTargetPricePercDown = (chainId: number, poolId: string) : string | undefined => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'targetPricePercDown',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useStrategyTokensToSwapPerc = (chainId: number, poolId: string) : string | undefined => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'tokensToSwapPerc',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}


export const useStrategyMinAllocationPerc = (chainId: number, poolId: string) => {
    const poolContract = StrategyContract(chainId, poolId)
    const { value, error } = useCall({
            contract: poolContract,
            method: 'minAllocationPerc',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}
