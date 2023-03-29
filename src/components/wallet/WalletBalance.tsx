import { useEthers, useTokenBalance } from "@usedapp/core"
import { Token } from  "../../types/Token"
import { BalanceMsg } from "./BalanceMsg"
import { fromDecimals } from "../../utils/formatter"


export interface WalletBalanceProps {
    token: Token
}

export const WalletBalance = ( { token }: WalletBalanceProps ) => {

    const { symbol, image, address } = token
    const { account } = useEthers()
    const tokenBalance = useTokenBalance(address, account)
    const formattedTokenBalance = (tokenBalance) ? fromDecimals(tokenBalance, token.decimals, 2) : ""

    return (
        <BalanceMsg label={`Your available ${name} to deposit`} tokenImgSrc={image} amount={formattedTokenBalance} />
    )
}