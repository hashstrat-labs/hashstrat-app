import { SwapInfo } from "./SwapInfo"
import { BigNumber } from "ethers"

export type PoolTokensSwapsInfo = {
    poolId: string,
    weight: number,
    priceInfo: {
        symbol: string,
        price: BigNumber,
        timestamp: number,
    } | undefined,
    priceInfoStart: {
        symbol: string,
        price: BigNumber,
        timestamp: number,
    } | undefined,
    swaps: SwapInfo[]
}
