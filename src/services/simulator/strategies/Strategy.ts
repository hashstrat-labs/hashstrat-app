
import { PoolTokensSwapsInfo } from "../../../types/PoolTokensSwapsInfo"


export interface StrategyPrices { 
    date: Date
    price: number
    ma?: number
    upper?: number
    lower?: number
    RSI?: number
}



export interface Strategy {

    simulate(from: Date, to: Date, amount: number) : PoolTokensSwapsInfo | undefined 

    getPrices(from: Date, to: Date) : StrategyPrices[] | undefined 

}