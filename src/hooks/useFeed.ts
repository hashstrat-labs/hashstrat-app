
import { useCall, useCalls } from "@usedapp/core"
import { FeedContract, FeedContractForAddress, FeedAddressForToken } from "../utils/network"


export const useFeedLatestPrice = (chainId: number, poolId: string) : string | undefined => {
    const contract = FeedContract(chainId, poolId)
    const { value, error } = useCall({
            contract: contract,
            method: 'latestAnswer',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString()
}

export const useFeedDecimals = (chainId: number, poolId: string) => {
    const contract = FeedContract(chainId, poolId)
    const { value, error } = useCall({
            contract: contract,
            method: 'decimals',
            args: [],
    }) ?? {}

    if (!value) {
        console.warn("useFeedDecimals - feed decimals is: ", value, " feed contract: ", contract.address)
    }

    error && console.error("error in custom hook: ", error)
    return value?.[0].toString() ?? 8
}

export const useFeedLatestTimestamp = (chainId: number, poolId: string) : number | undefined => {
    const contract = FeedContract(chainId, poolId)
    const { value, error } = useCall({
            contract: contract,
            method: 'latestTimestamp',
            args: [],
    }) ?? {}

    error && console.error("error in custom hook: ", error)
    return value && Number(value[0].toString())
}


export const useLastPriceForTokens = (chainId: number, tokens: string[]) => {

    const feedAddresses = tokens.map( symbol => FeedAddressForToken(chainId, symbol) )

    // Price feed calls
    const priceCalls = tokens.map( (req, idx) => ({
        contract: FeedContractForAddress(feedAddresses[idx]),
        method: 'latestAnswer',
        args: [],
    })) ?? []

    const timestampCalls = tokens.map( (req, idx) => ({
        contract: FeedContractForAddress(feedAddresses[idx]),
        method: 'latestTimestamp',
        args: [],
    })) ?? []
  
    const priceResults = useCalls(priceCalls) ?? []
    const timestampResults = useCalls(timestampCalls) ?? []

    return tokens.map( (symbol, idx) => {
        const price = priceResults.at(idx)?.value
        const timestamp = timestampResults.at(idx)?.value
        const formattedTimestamp = timestamp && timestamp[0] ? Number(timestamp[0].toString()) : 0
        return {
            symbol: symbol,
            price: price && price[0] as string,
            timestamp: formattedTimestamp, 
        }
    })

}