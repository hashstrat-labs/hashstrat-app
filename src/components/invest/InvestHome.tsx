import { makeStyles, Link, Typography, Breadcrumbs, Divider, Box, CircularProgress } from "@material-ui/core"
import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"
import { PoolExplorer } from "./PoolExprorer"

import { useDashboardModel } from "../dashboard/DashboadModel"

import { AssetValue } from '../dashboard/AssetValue'
import { MyAssets } from "../dashboard/MyAssets"

import { fromDecimals } from "../../utils/formatter"
import { BigNumber } from "ethers"
import { Horizontal } from "../Layout"

import { PortfolioMap } from "../dashboard/PortfolioMap"



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
        
        [theme.breakpoints.down('xs')]: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
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
    const { didLoad, portfolioInfo  } = useDashboardModel(chainId, tokens, depositToken)
    const totalValueFormatted = portfolioInfo.totalValue && fromDecimals( portfolioInfo.totalValue, depositToken.decimals, 2)

    const tokensBalanceInfo = Object.values(portfolioInfo.tokenBalances)
        .filter( item => item.value !== undefined && item.balance !== undefined)
        .map( (item ) => {
        return {
            symbol: item.symbol,
            balance: fromDecimals( item.balance ?? BigNumber.from(0), item.decimals, item.symbol === 'USDC' ? 2 : 4),
            value: fromDecimals( item.value ?? BigNumber.from(0), depositToken.decimals, 2),
            depositTokenSymbol: depositToken.symbol,
            decimals: item.decimals
       }
    })

    return (
        <Box className={classes.container}>

            <Box px={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/"> Home </Link>
                    <Typography>Invest</Typography>
                </Breadcrumbs>
            </Box>

            <Divider variant="middle" style={{  marginTop: 20,  marginBottom: 20 }}/>
            
            { !didLoad && 
                <div style={{height: 300, paddingTop: 140}} >
                    <Horizontal align="center" > <CircularProgress color="secondary" /> </Horizontal>  
                </div>
            }

            { didLoad &&
                <>
                
                    <Box mt={4} /> 
                    <AssetValue value={ Number( totalValueFormatted ?? 0) } />
                    
                    <Box mt={4} />
                    
                    <MyAssets 
                        title="Managed Assets" 
                        description="Total assets managed by the protocol (AuM)" 
                        tokens={ tokensBalanceInfo } 
                        height={60}
                    />

                    <Box mt={4} />
                    <Box style={{ maxWidth: 1200, margin: "auto" }}>
                        <PortfolioMap
                            chainId={chainId} 
                            depositToken={depositToken} 
                            investTokens={investTokens} 
                        /> 
                    </Box>

             
                    <Box className={classes.explorer}>
                        <PoolExplorer chainId={chainId} account={account} depositToken={depositToken} />
                    </Box>
                </>

            }

        </Box>
    )
}


