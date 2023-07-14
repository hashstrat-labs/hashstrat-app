import { makeStyles, Box, Typography, CircularProgress } from  "@material-ui/core"

import { usePoolModel } from "./PoolModel"
import { Token } from  "../../../types/Token"
import { useGetDeposits, useGetWithdrawals } from "../../../hooks/usePool"
import { fromDecimals } from "../../../utils/formatter"
import { InvestTokens } from "../../../utils/pools"

import { MyAssets } from "../../dashboard/MyAssets"
import { AssetValue } from "../../shared/AssetValue"
import { Horizontal } from "src/components/Layout"

const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0,
    },
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    },
    layout: {
        maxWidth: 900,
        margin: "auto",

        display: 'grid',
        paddingLeft: 0,
        paddingRight: 0,
        gridTemplateColumns: '250px auto',
        [theme.breakpoints.down('xs')]: {
            gridTemplateColumns: '1fr',
        },
    }
}))


interface MyStatsViewProps {
    chainId: number,
    poolId: string,
    account: string,
    depositToken: Token
}


export const MyStatsView = ( { chainId, poolId, account, depositToken } : MyStatsViewProps ) => {


    const classes = useStyle()

    const tokens =  [depositToken, ...InvestTokens(chainId)]
    const { poolInfo, portfolioInfo } = usePoolModel(chainId, poolId, tokens, depositToken, account)
    const deposits = useGetDeposits(chainId, poolId, account)
    const withdrawals = useGetWithdrawals(chainId, poolId, account)
    
    
    const totalValueFormatted = portfolioInfo.totalValue ? fromDecimals(portfolioInfo.totalValue, depositToken.decimals, 2) : undefined
    const totalDepositedFormatted = deposits ? fromDecimals(deposits, depositToken.decimals, 2) : ""
    const totalWithdrawnFormatted = withdrawals ? fromDecimals(withdrawals, depositToken.decimals, 2) : ""
    const roiFormatted = (totalValueFormatted && totalWithdrawnFormatted && totalDepositedFormatted && parseFloat(totalDepositedFormatted) > 0) ? 
                        String(Math.round( 10000 * 
                            (parseFloat(totalWithdrawnFormatted) + parseFloat(totalValueFormatted) - parseFloat(totalDepositedFormatted)) / parseFloat(totalDepositedFormatted)) 
                            / 100 
                        ) : undefined

    
    const tokensBalanceInfo = poolInfo.tokenInfoArray.map( token => {
        const balance = token.accountBalance
        const value = token.accountValue
        const decimals = token.decimals

        const accountBalanceFormatted = balance ? fromDecimals(balance, decimals, token.symbol === 'USDC' ? 2 : 4 ) : ''
        const accountValueFormatted = value ? fromDecimals(value, depositToken.decimals, 2 ) : ''

        return {
            symbol: token.symbol,
            balance: accountBalanceFormatted,
            value: accountValueFormatted,
            depositTokenSymbol: depositToken.symbol,
            decimals: decimals
        }
    }).filter( item => item.balance !== '')

    const loading = tokensBalanceInfo.length === 0
    const haveAssets = Number(totalValueFormatted) > 0

    return (
        <Box className={classes.container}>

            <Box textAlign="center">
                { loading && <CircularProgress color="secondary" /> }
            </Box>

            { !loading && !haveAssets && 
                <Typography align="center">You have no assets in this Pool. </Typography>
            }

            { !loading && haveAssets &&
                <Box className={classes.layout}>
                    <AssetValue 
                        roi={ Number(roiFormatted ?? 0) / 100 } 
                        value={ Number( totalValueFormatted ?? 0) }
                        gains={ Number( totalValueFormatted ?? 0) + Number( totalWithdrawnFormatted ?? 0) - Number( totalDepositedFormatted ?? 0) }
                    />
                    <MyAssets 
                        tokens={ tokensBalanceInfo } 
                        showNoFundsMesssage={false}
                        height={30}
                    />
                </Box>
            }

        </Box>
    )
}

