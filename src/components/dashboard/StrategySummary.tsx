
import { makeStyles, Link, Box, Typography } from "@material-ui/core"
import { BigNumber, utils } from "ethers"
import { Link as RouterLink } from "react-router-dom"

import { useGetDeposits, useGetWithdrawals } from "../../hooks/usePool"
import { PoolInfo } from "../../utils/pools"
import { fromDecimals } from "../../utils/formatter"
import { Token } from "../../types/Token"

import { TitleValueBox } from "../TitleValueBox"
import { TokenInfo } from "../../types/TokenInfo"
import { Horizontal } from "../Layout"

import usdc from "../img/usdc.png"
import wbtc from "../img/wbtc.png"
import weth from "../img/weth.png"



interface PoolSummaryProps {
    chainId: number,
    poolId: string,
    tokens: TokenInfo[],
    depositToken: Token,
    account: string | undefined
}


const useStyles = makeStyles( theme => ({
    container: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: 12,
        padding: 20,
        // marginLeft: 10,
        // marginRight: 10
    },
    pool: {
        width: 360,
        color: theme.palette.text.secondary,
        textTransform: "none",
        [theme.breakpoints.down("sm")]: {
            width: 320,
        },
    }
}))



export const StrategySummary = ({ chainId, poolId, tokens, depositToken, account } : PoolSummaryProps ) => {
    
    const classes = useStyles()

    const deposits = useGetDeposits(chainId, poolId, account)
    const withdrawals = useGetWithdrawals(chainId, poolId, account)
    
    
    const totalValues = tokens.reduce( (acc, val) => {
        acc = {
            account: val.accountValue ? acc.account.add(BigNumber.from(val.accountValue)) : acc.account,
            pool: val.value ? acc.pool.add(BigNumber.from(val.value)) : acc.pool
        }
        return acc
    },  { account: BigNumber.from(0), pool: BigNumber.from(0)} )


    const totalAccountValue = fromDecimals(totalValues.account, depositToken.decimals, 2 )

    const { name, description, investTokens, depositToken : depositTokenSymbol, disabled } = PoolInfo(chainId, poolId)



    if (totalAccountValue === '0' && disabled === 'true') {
        return <div></div>
    }


    const tokenViews = tokens && tokens.map( token => {
        const accountBalanceFormatted = token.accountBalance && fromDecimals(token.accountBalance ?? BigNumber.from(0), token.decimals, 4 )
        const accountValueFormatted = token.accountValue && fromDecimals(token.accountValue ?? BigNumber.from(0), depositToken.decimals, 2 )
        const valueFormatted = accountBalanceFormatted && accountValueFormatted ?  `${accountBalanceFormatted} ($ ${accountValueFormatted})` : '0'

        return <TitleValueBox key={token.symbol} title={token.symbol} value={valueFormatted} mode="small" />
    })

    const assetImages = [...investTokens, depositTokenSymbol].map( (item, idx) => {
       const imageSrc = item === 'WBTC' ? wbtc : item === 'WETH' ? weth : item === 'USDC' ? usdc : ''
       return <img key={idx} src={imageSrc} style={{width: 25, height: 25, marginLeft: 5}} alt="" />
    })

    const isIndex = poolId.startsWith("index")
    const link = isIndex ? `/indexes/${poolId}` : `/pools/${poolId}`
    const outlineColout = isIndex ? "primary" : "secondary"
 
    const formattedDeposits = deposits ? fromDecimals(deposits, depositToken.decimals, 2) : ""
    const formattedWithdrawals = withdrawals ? fromDecimals(withdrawals, depositToken.decimals, 2) : ""

    
    const roiFormatted = (totalAccountValue && formattedWithdrawals && formattedDeposits && parseFloat(formattedDeposits) > 0) ? 
                        String(Math.round( 10000 * (parseFloat(formattedWithdrawals) + parseFloat(totalAccountValue) - parseFloat(formattedDeposits)) / parseFloat(formattedDeposits)) / 100 ) : 'n/a'


    const nameShortened = name.replace(/ *\[[^)]*\] */g, "")
    const nameFormatted = nameShortened.length > 18 ? nameShortened.slice(0, 16) + "..." : nameShortened


    return (
        <Box  color={`${outlineColout}`} className={classes.container} >
            <Box className={classes.pool}>

                <Horizontal spacing="between" >
                    <Typography variant="h5"> {nameFormatted} </Typography>
                    <Box> {assetImages} </Box>
                </Horizontal>

                
                <Typography variant="body2" align="left"> {description} </Typography>


                { account && 
                    <Box pt={3}>
                        <TitleValueBox title="Asset Value" value={`$${utils.commify(totalAccountValue)}`} mode="bold" />
                        <TitleValueBox title="ROI" value={roiFormatted} mode="bold" suffix="%" />
                    </Box>
                }

                <Box pt={2}> 
                    <Horizontal align="center" >
                        <Link component={RouterLink} to={link} style={{ textDecoration: 'none' }} > 
                                Go to {isIndex ? 'Index' : 'Pool'} &gt;&gt;
                        </Link>
                    </Horizontal>
                </Box>
            </Box>
        </Box>
    )
}



