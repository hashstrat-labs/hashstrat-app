import { BigNumber } from "ethers"

export type TokenInfo = {
    value: BigNumber,
    balance: BigNumber,
    accountValue: BigNumber,
    accountBalance: BigNumber
    decimals: number,
    symbol: string,
}