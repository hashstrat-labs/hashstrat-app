
import { makeStyles, Link, Box, Divider, Typography, Button } from "@material-ui/core"
import { utils } from "ethers"
import { useAccountLPBalanceForPool } from "../../hooks/usePoolInfo"
import { useTotalDeposited, useTotalWithdrawn  } from "../../hooks"

import { PoolInfo } from "../../utils/pools"

import { Link as RouterLink } from "react-router-dom"
import { Token } from "../../types/Token"
import { fromDecimals, round } from "../../utils/formatter"
import { BigNumber } from "ethers"
import { TokenInfo } from "../../types/TokenInfo"

import { ButtonGo } from "../shared/Button"
import { Horizontal } from "../Layout"

import usdc from "../dashboard/img/usdc.svg"
import wbtc from "../dashboard/img/btc.svg"
import weth from "../dashboard/img/eth.svg"


interface PoolSummaryProps {
    chainId: number,
    poolId: string,
    tokens: TokenInfo[],
    depositToken: Token,
    account?: string
}


const useStyles = makeStyles( theme => ({
    container: {
        backgroundColor: theme.palette.type === 'light' ? '#fff' : '#000',
        borderRadius: 8,
        padding: 20,
        width: 378,

        [theme.breakpoints.down("sm")]: {
            width: '100%',
        }
    },

  
}))



export const PoolSummary = ({ chainId, poolId, tokens, depositToken, account } : PoolSummaryProps ) => {
    
    const classes = useStyles()

    const { perc } = useAccountLPBalanceForPool(chainId, poolId, account)

    const deposits = useTotalDeposited(chainId, poolId)
    const withdrawals = useTotalWithdrawn(chainId, poolId)
    const formattedDeposits = deposits ? fromDecimals(deposits, depositToken.decimals, 2) : undefined
    const formattedWithdrawals = withdrawals ? fromDecimals(withdrawals, depositToken.decimals, 2) : undefined

    const totalValues = tokens.reduce( (acc, val) => {
        acc = {
            account: val.accountValue ? acc.account.add(BigNumber.from(val.accountValue)) : acc.account,
            pool: val.value ? acc.pool.add(BigNumber.from(val.value)) : acc.pool
        }
        return acc
    },  { account: BigNumber.from(0), pool: BigNumber.from(0)} )



    const totalAccountValueFormatted = fromDecimals(totalValues.account, depositToken.decimals, 0 )
    const totalValueFormatted = fromDecimals(totalValues.pool, depositToken.decimals, 0 )
    const accountPercFormatted = `${round( perc ? perc * 100 : 0)}`

    const { name, description, disabled } = PoolInfo(chainId, poolId)


    const tokenViews = tokens && tokens.map( token => {
        const decimals = token.symbol === 'WBTC' ? 4 : token.symbol === 'WETH' ? 3 : token.symbol === 'USDC' ? 0 : 0
        const balance = token.balance && fromDecimals(token.balance ?? BigNumber.from(0), token.decimals, decimals)
        const value = token.value && fromDecimals(token.value ?? BigNumber.from(0), depositToken.decimals, 0 )
        const imageSrc = token.symbol === 'WBTC' ? wbtc : token.symbol === 'WETH' ? weth : token.symbol === 'USDC' ? usdc : ''

        return (
            <Box>
                <Horizontal> 
                    <Box>
                        <img key={token.symbol} src={imageSrc} style={{width: 25, height: 25, marginLeft: 0, marginTop: 5}} alt="" />
                    </Box>
                    <Box>
                        <Box>
                            <Typography color="textPrimary" style={{fontSize: 20, fontWeight: 500}} >{balance ? utils.commify(balance) : ''}</Typography>  
                        </Box>
                        <Box>
                            <Typography color="textSecondary" style={{fontSize: 14, fontWeight: 600}}> {value ? '$'+utils.commify(value) : ''} </Typography>
                        </Box>
                    </Box>
                </Horizontal>
            </Box>
        )
    })

    const myShareFormatted = `$${utils.commify(totalAccountValueFormatted) } (${accountPercFormatted}%)`

    const link = poolId.startsWith("index") ? `/indexes/${poolId}` : `/pools/${poolId}`

    const totalAccountValue = fromDecimals(totalValues.account, depositToken.decimals, 2 )
    const outlineColour = poolId.startsWith("index") ? "primary" : "secondary"

    const nameShortened = name.replace(/ *\[[^)]*\] */g, "")
    const nameFormatted = nameShortened.length > 33 ? nameShortened.slice(0, 30) + "..." : nameShortened



    const roi = (totalAccountValue && formattedWithdrawals && formattedDeposits && parseFloat(formattedDeposits) > 0) ? 
                        Math.round( 10000 * (parseFloat(formattedWithdrawals) + parseFloat(totalAccountValue) - parseFloat(formattedDeposits)) / parseFloat(formattedDeposits)) / 100 : undefined
    const roiFormatted = roi && `${roi}%`

    return (
        <Box color={`${outlineColour}`} className={classes.container} >
            
            <Box>
                <Typography color="textPrimary" style={{fontSize: 20, fontWeight: 500, marginBottom: 10}} > {nameFormatted} { disabled === 'true' && <label>🚫</label>}</Typography>
                <Box style={{ height: 45 }} >
                    <Typography variant="body2" align="left"> {description} </Typography>
                </Box>
               

                <Box>

                    <Divider style={{ marginTop: 15, marginBottom: 15 }} />

                    <Horizontal align="center" valign="center" spacing="around" >
                        <Box textAlign="center">
                            <Box>
                                <Typography color="textPrimary" style={{fontSize: 24, fontWeight: 500}} >${utils.commify(totalValueFormatted)}</Typography>  
                            </Box>
                            <Box>
                                <Typography color="textSecondary" style={{fontSize: 16, fontWeight: 600}}>TVL</Typography>
                            </Box>
                        </Box>

                        <Box textAlign="center">
                            <Typography color="textPrimary" variant="h5" >{myShareFormatted}</Typography>
                            <Typography color="textSecondary" style={{fontSize: 16, fontWeight: 600}}>My Share</Typography>
                        </Box>
                    </Horizontal>
                </Box>

                <Divider style={{ marginTop: 15, marginBottom: 10 }} />

                <Typography align="center" color="textSecondary" style={{fontSize: 16, fontWeight: 600, marginBottom: 5}}>Managed Assets</Typography>
                
                <Divider style={{ marginTop: 10, marginBottom: 10 }} />

                <Horizontal spacing={ window.innerWidth > 480 ? 'around' : 'between'} align={ window.innerWidth > 480 ? 'center' : 'left'} >
                    {tokenViews}
                </Horizontal>

                <Divider style={{ marginTop: 10, marginBottom: 10 }} />

                <Box pt={2}> 
                    <Link component={RouterLink} to={link} style={{ textDecoration: 'none' }} > 
                        <ButtonGo fullWidth={true}> Go to Strategy </ButtonGo>
                    </Link>
                </Box>
            </Box>
        </Box>

    )
}
