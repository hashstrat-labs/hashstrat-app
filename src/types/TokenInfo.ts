import { BigNumber } from "ethers"

export type TokenInfo = {
    value: BigNumber | undefined,
    balance: BigNumber | undefined,
    accountValue: BigNumber | undefined,
    accountBalance: BigNumber | undefined
    
    decimals: number,
    symbol: string,
}