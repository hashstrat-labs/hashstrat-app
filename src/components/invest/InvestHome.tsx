import { makeStyles, Link, Typography, Breadcrumbs, Divider, Box } from "@material-ui/core"
import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"
import { PoolExplorer } from "./PoolExprorer"

import { useDashboardModel } from "../dashboard/DashboadModel"

import { AssetValue } from '../dashboard/AssetValue'
import { MyAssets } from "../dashboard/MyAssets"

import { fromDecimals } from "../../utils/formatter"

interface InvestHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token,
    investTokens: Array<Token>,
}

const useStyles = makeStyles( theme => ({
    container: {
        maxWidth: 1200,
        margin: 'auto',
        
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('xs')]: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
    },

    portfolioSummary: {
        maxWidth: 700,
        margin: "auto",
        marginBottom: 70,
    },

    explorer: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(4),

        [theme.breakpoints.down('xs')]: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
    }
}))


export const InvestHome = ({ chainId, account, depositToken, investTokens }: InvestHomeProps) => {

    const classes = useStyles()

    const tokens = [depositToken, ...investTokens]
    const { portfolioInfo  } = useDashboardModel(chainId, tokens, depositToken)

    const totalValueFormatted = portfolioInfo.totalValue && fromDecimals( portfolioInfo.totalValue, depositToken.decimals, 2)

    const tokensBalanceInfo = Object.values(portfolioInfo.tokenBalances).map( (item ) => {
        return {
            symbol: item.symbol,
            balance: fromDecimals( item.balance, item.decimals, item.symbol === 'USDC' ? 2 : 4),
            value: fromDecimals( item.value, depositToken.decimals, 2),
            depositTokenSymbol: depositToken.symbol,
            decimals: item.decimals
       }
    })


    return (
        <div className={classes.container}>

            <Box px={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/"> Home </Link>
                    <Typography>Invest</Typography>
                </Breadcrumbs>
            </Box>

            <Box className={classes.portfolioSummary} > 
                <Box pb={5} >
                    <AssetValue value={ Number( totalValueFormatted ?? 0) } />
                </Box>

                <MyAssets title="Managed Assets" tokens={ tokensBalanceInfo } />
            </Box>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}} />
            <Box className={classes.explorer}>
                <PoolExplorer chainId={chainId} account={account} depositToken={depositToken} />
            </Box>

        </div>
    )
}


