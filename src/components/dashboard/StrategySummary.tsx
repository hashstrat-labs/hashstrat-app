
import { makeStyles, Link, Box, Typography, Divider } from "@material-ui/core"
import { BigNumber, utils } from "ethers"
import { Link as RouterLink } from "react-router-dom"

import { useGetDeposits, useGetWithdrawals } from "../../hooks/usePool"
import { PoolInfo } from "../../utils/pools"
import { fromDecimals } from "../../utils/formatter"
import { Token } from "../../types/Token"
import { ButtonGo } from "../shared/Button"

import { TokenInfo } from "../../types/TokenInfo"
import { Horizontal } from "../Layout"

import usdc from "./img/usdc.svg"
import wbtc from "./img/btc.svg"
import weth from "./img/eth.svg"



interface PoolSummaryProps {
    chainId: number,
    poolId: string,
    tokens: TokenInfo[],
    depositToken: Token,
    account: string | undefined

}




export const StrategySummary = ({ chainId, poolId, tokens, depositToken, account} : PoolSummaryProps ) => {
    
    const { name, description, investTokens, depositToken : depositTokenSymbol, disabled } = PoolInfo(chainId, poolId)
    const deposits = useGetDeposits(chainId, poolId, account)
    const withdrawals = useGetWithdrawals(chainId, poolId, account)
    
   
    const useStyles = makeStyles( theme => ({
        container: {
            backgroundColor: 
                theme.palette.type === 'light' && disabled == 'true' ? '#E7E7E7' :
                theme.palette.type === 'light' && disabled == 'false' ? '#fff' :
                '#000',
            borderRadius: 8,
            padding: 20,
            width: 378,

            [theme.breakpoints.down("xs")]: {
                width: '100%',
            }
        }
    }))


    const classes = useStyles()

    const totalValues = tokens.reduce( (acc, val) => {
        acc = {
            account: val.accountValue ? acc.account.add(BigNumber.from(val.accountValue)) : acc.account,
            pool: val.value ? acc.pool.add(BigNumber.from(val.value)) : acc.pool
        }
        return acc
    },  { account: BigNumber.from(0), pool: BigNumber.from(0)} )


    const totalAccountValue = fromDecimals(totalValues.account, depositToken.decimals, 2 )


    if (totalAccountValue === '0' && disabled === 'true') {
        return <div></div>
    }

    const assetImages = [depositTokenSymbol, ...investTokens].map( (item, idx) => {
       const imageSrc = item === 'WBTC' ? wbtc : item === 'WETH' ? weth : item === 'USDC' ? usdc : ''
       return <img key={idx} src={imageSrc} style={{width: 25, height: 25, marginLeft: 5}} alt="" />
    })

    const isIndex = poolId.startsWith("index")
    const link = isIndex ? `/indexes/${poolId}` : `/pools/${poolId}`
    const outlineColout = isIndex ? "primary" : "secondary"
 
    const formattedDeposits = deposits ? fromDecimals(deposits, depositToken.decimals, 2) : ""
    const formattedWithdrawals = withdrawals ? fromDecimals(withdrawals, depositToken.decimals, 2) : ""

    
    const roi = (totalAccountValue && formattedWithdrawals && formattedDeposits && parseFloat(formattedDeposits) > 0) ? 
                        Math.round( 10000 * (parseFloat(formattedWithdrawals) + parseFloat(totalAccountValue) - parseFloat(formattedDeposits)) / parseFloat(formattedDeposits)) / 100 : undefined
    const roiFormatted = roi && `${roi}%`


    const nameShortened = name.replace(/ *\[[^)]*\] */g, "")
    const nameFormatted = nameShortened.length > 33 ? nameShortened.slice(0, 30) + "..." : nameShortened


    return (
        <Box color={`${outlineColout}`} className={classes.container} >
            
            <Box>
               
                <Typography color="textPrimary" style={{fontSize: 20, fontWeight: 500, marginBottom: 10}} > {nameFormatted} { disabled === 'true' && <label>🚫</label>}</Typography>
                <Typography variant="body2" align="left"> {description} </Typography>

                { account && 
                    <Box>

                        <Divider style={{ marginTop: 15, marginBottom: 20 }} />

                        <Horizontal align="center" valign="center" spacing="between">
                            <Box textAlign="center">
                                <Box>
                                    <Typography color="textPrimary" style={{fontSize: 24, fontWeight: 500}} >${utils.commify(totalAccountValue)}</Typography>  
                                </Box>
                                <Box>
                                    <Typography color="textSecondary" style={{fontSize: 16, fontWeight: 600}}>My Assets</Typography>
                                </Box>
                            </Box>

                            <Box textAlign="center">
                                <Typography color="textPrimary" variant="h5" >{roiFormatted}</Typography>
                                <Typography color="textSecondary" style={{fontSize: 16, fontWeight: 600}}>ROI</Typography>
                            </Box>
                            <Box textAlign="center">
                                 <Box> {assetImages} </Box>
                            </Box>
                        </Horizontal>

                        <Divider style={{ marginTop: 20, marginBottom: 0 }} />

                    </Box>
                }

                <Box pt={2}> 
                    <Link component={RouterLink} to={link} style={{ textDecoration: 'none' }} > 
                        <ButtonGo fullWidth={true}> Go to Strategy </ButtonGo>
                    </Link>
                </Box>
            </Box>
        </Box>
    )
}



