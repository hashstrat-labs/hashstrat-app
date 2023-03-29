
import { makeStyles, Link, Box, Divider, Typography, Button } from "@material-ui/core"
import { utils } from "ethers"
import { useAccountLPBalanceForPool } from "../../hooks/usePoolInfo"

import { PoolInfo } from "../../utils/pools"

import { Link as RouterLink } from "react-router-dom"
import { Token } from "../../types/Token"
import { fromDecimals, round } from "../../utils/formatter"
import { BigNumber } from "ethers"
import { TitleValueBox } from "../TitleValueBox"
import { TokenInfo } from "../../types/TokenInfo"

import usdc from "../img/usdc.png"
import wbtc from "../img/wbtc.png"
import weth from "../img/weth.png"


interface PoolSummaryProps {
    chainId: number,
    poolId: string,
    tokens: TokenInfo[],
    depositToken: Token,
    account?: string
}


const useStyles = makeStyles( theme => ({
    container: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    pool: {
        width: 320,
        color: theme.palette.text.secondary,
        textTransform: "none",
    },
    myassets: {
        width: 350,
        backgroundColor: theme.palette.background.default, 
    }
}))



export const PoolSummary = ({ chainId, poolId, tokens, depositToken, account } : PoolSummaryProps ) => {
    
    const classes = useStyles()

    const { perc } = useAccountLPBalanceForPool(chainId, poolId, account)

    const totalValues = tokens.reduce( (acc, val) => {
        acc = {
            account: val.accountValue ? acc.account.add(BigNumber.from(val.accountValue)) : acc.account,
            pool: val.value ? acc.pool.add(BigNumber.from(val.value)) : acc.pool
        }
        return acc
    },  { account: BigNumber.from(0), pool: BigNumber.from(0)} )


    const totalAccountValueFormatted = fromDecimals(totalValues.account, depositToken.decimals, 2 )
    const totalValueFormatted = fromDecimals(totalValues.pool, depositToken.decimals, 2 )
    const accountPercFormatted = `${round( perc ? perc * 100 : 0)}`

    const { name, description, investTokens, depositToken : depositTokenSymbol, disabled } = PoolInfo(chainId, poolId)


    const tokenViews = tokens && tokens.map( token => {
        const accountBalanceFormatted = token.accountBalance && fromDecimals(token.accountBalance ?? BigNumber.from(0), token.decimals, 4 )
        const accountValueFormatted = token.accountValue && fromDecimals(token.accountValue ?? BigNumber.from(0), depositToken.decimals, 2 )
        const valueFormatted = accountBalanceFormatted && accountValueFormatted ?  `${accountBalanceFormatted} ($ ${accountValueFormatted})` : '0'

        return <TitleValueBox key={token.symbol} title={token.symbol} value={valueFormatted} mode="small" />
    })

    const myShareFormatted = `$ ${utils.commify(totalAccountValueFormatted) } (${accountPercFormatted}%)`
    const link = poolId.startsWith("index") ? `/indexes/${poolId}` : `/pools/${poolId}`


    if (totalAccountValueFormatted === '0' && disabled === 'true') {
        return <div></div>
    }

    const assetImages = [...investTokens, depositTokenSymbol].map( (item, idx) => {
       const imageSrc = item === 'WBTC' ? wbtc : item === 'WETH' ? weth : item === 'USDC' ? usdc : ''
       return <img key={idx} src={imageSrc} style={{width: 25, height: 25, marginLeft: 5}} alt="" />
    })

    const outlineColout = poolId.startsWith("index") ? "primary" : "secondary"
    return (
      
            <Link component={RouterLink} to={link} style={{ textDecoration: 'none' }} > 
                <Button variant="outlined" color={`${outlineColout}`} className={classes.container} >
                    <Box className={classes.pool}>
                        <Typography variant="h6" align="center"> {name} </Typography>
                        <Typography variant="body2"> {description} </Typography>
                        <Box pt={2}>{assetImages} </Box>
                        <Divider variant="fullWidth" style={{marginTop: 20, marginBottom: 20}} />
                        <TitleValueBox title="TVL" value={`$ ${utils.commify(totalValueFormatted)}`} mode="small" />
                        { account && 
                            <>
                                <TitleValueBox title="My Share" value={myShareFormatted} mode="small" />
                                <Typography variant="body1" align="left" style={{marginTop: 20 }}> My Assets </Typography>
                                {tokenViews}
                            </>
                        }
                    </Box>
                </Button>
            </Link>
    )
}
