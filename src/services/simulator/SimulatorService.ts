
import { Feed, BTCFeed, ETHFeed } from "../pricefeed/PricefeedService"
import { PoolTokensSwapsInfo } from "../../types/PoolTokensSwapsInfo"
import { Token } from "../../types/Token"

import { Strategy, StrategyPrices } from "./strategies/Strategy"
import { Rebalancing } from "./strategies/Rebalancing"
import { MeanReversion } from "./strategies/MeanReversion"
import { TrendFollowing } from "./strategies/TrendFollowing"
import { Momentum } from "./strategies/Momentum"

export enum StrategyName  {
    Rebalancing, MeanReversion, Momentum, TrendFollowing
}


/**
 * A simulator for HashStrat Strategies. 
 * Uses a datafeed for the risk assets to produce a list of trades and strategy performance.
 * returns PoolTokensSwapsInfo, a data strcutre compatible with 
 * 
 */
class Simulator {

    feed: Feed
    amount: number
    depositToken : Token
    investtTokens : [Token]

    //TODO add support for an Index over multiple stategies
    strategy: Strategy | undefined

    constructor(feed: Feed, strategyName: StrategyName, amount: number, depositToken : Token, investTokens : [Token]) {

        this.feed = feed
        this.amount = amount
        this.depositToken = depositToken
        this.investtTokens = investTokens
        this.strategy = ( strategyName === StrategyName.Rebalancing ) ? new Rebalancing(feed, depositToken, investTokens[0]) :
                        ( strategyName === StrategyName.MeanReversion ) ? new MeanReversion(feed, depositToken, investTokens[0]) : 
                        ( strategyName === StrategyName.Momentum ) ? new Momentum(feed, depositToken, investTokens[0]) : 
                        ( strategyName === StrategyName.TrendFollowing ) ? new TrendFollowing(feed, depositToken, investTokens[0]) : undefined
                }

    getSwapsInfo (from: Date, to: Date = new Date()) : PoolTokensSwapsInfo[] | undefined {
        const trades = this.strategy?.simulate(from, to, this.amount)
        return  trades ? [trades] : undefined
    }

    getPrices (from: Date, to: Date = new Date()) : StrategyPrices[] | undefined {
        return this.strategy?.getPrices(from, to)
    }

}


export const SimulatorInastance = (symbol: 'BTC' | 'ETH', strategy: StrategyName, amount: number, depositToken : Token, investTokens : [Token] ) => {
    const feed = symbol === 'BTC' ? BTCFeed : ETHFeed

    return new Simulator(feed, strategy, amount, depositToken, investTokens)
}
