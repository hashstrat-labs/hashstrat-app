type StrategyInfo = {
    id: string,
    name: string,
    description: string,
    goal: string,
    scope: string,
    returns: string,
    timeframe: string,
    link: string
}

export const strategyItems : StrategyInfo[] = [
    {
        id: "TrendFollowing",
        name: "Trend Following",
        description: "A momentum strategy trading in the direction of the underlying trend.",
        goal: "Allows to capture value in the risk asset during uptrends, and sell into USDC during downtrends.",
        scope: "Works best when there is a defined trend in the market.",
        returns: "13.2x",
        timeframe: "From Jan 2019 to Jan 2023",
        link: "https://medium.com/@hashstrat/trend-following-strategy-7dce9756eaa"

    },
    {
        id: "MeanReversion",
        name: "Mean Reversion",
        description: "A strategy for dollar-cost averaging in and out a risk asset when its price diverges substantially from its long term trend.",
        goal: "Aims to accumulate the risk asset when its price is significantly undervalued, and progressively divest when it's significantly overvalued.",
        scope: "Works best when the market is forming a bottom or a top.",
        returns: "7.7x",
        timeframe: "From Jan 2019 to Jan 2023",
        link: "https://medium.com/@hashstrat/hashstrat-mean-reversion-strategy-b1a576b05d5f"
    },
    {
        id: "Rebalancing",
        name: "Rebalancing",
        description: "A self-balancing strategy targeting an allocation of 60% to risk asset and 40% USDC.",
        goal: "Allows to acquire more of the risk asset at lower prices and offload some risk at higher prices.",
        scope: "Works best during periods of significant market volatility, in either direction.",
        returns: "6.6x",
        timeframe: "From Jan 2019 to Jan 2023",
        link: "https://medium.com/@hashstrat/hashstrat-rebalancing-strategy-f0bb6cf3152f"

    }
]