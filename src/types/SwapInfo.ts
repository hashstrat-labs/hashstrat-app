export type SwapInfo = {
    timestamp: string,
    side: "BUY" | "SELL",
    feedPrice: string,
    bought: string,
    sold: string,
    depositTokenBalance: string,
    investTokenBalance: string,
    portfolioValue?: string
}

export type PoolSwapInfo = {
    poolId: string, 
    weight: number, 
    swaps: SwapInfo[]
}