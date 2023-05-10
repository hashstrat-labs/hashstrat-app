

import { makeStyles, Box, Typography, CircularProgress } from "@material-ui/core"
import { useEthers } from "@usedapp/core";
import { BigNumber } from "ethers"

import { Token } from "../../types/Token"

import { useDashboardModel } from "./DashboadModel"
import { PoolInfo } from "../../utils/pools"

import { fromDecimals } from "../../utils/formatter"
import { PoolExplorer } from "../invest/PoolExprorer"

import { TreeChart } from "../shared/TreeChart"
import { MyAssets } from "./MyAssets"
import { AssetValue } from './AssetValue'
import { Horizontal } from "../Layout";

interface FundAssetsSummaryProps {
    chainId: number,
    depositToken: Token,
    investTokens: Array<Token>,
}


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    },
    portfolioSummary: {
        maxWidth: 700,
        margin: "auto",
        marginBottom: 70,
    },
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    portfolioCharts: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(2),
        // border: "1px solid black"
    },

    strategyMap: {
        margin: 'auto',
        marginBottom: 20,
        // maxWidth: 600, 

        [theme.breakpoints.down('xs')]: {
            // width: '100%', 
            marginLeft: 10,
            marginRight: 10,
        },
    }
}))


export const FundAssetsSummary = ({ chainId, depositToken, investTokens } : FundAssetsSummaryProps) => {
    
    const classes = useStyles()
    const tokens = [depositToken, ...investTokens]
	const { account } = useEthers()

    // const { poolsInfo, indexesInfo, portfolioInfo, chartValueByAsset, chartValueByPool, didLoad } = useDashboardModel(chainId, tokens, depositToken, account)
    const { didLoad, poolsInfo, indexesInfo, portfolioInfo, chartValueByAsset, chartValueByPool } = useDashboardModel(chainId, tokens, depositToken)

    const poolsWithFunds = [...indexesInfo, ...poolsInfo].filter( pool => pool.totalValue.isZero() === false ).sort ( (a, b) => { return b.totalValue.sub(a.totalValue).toNumber() } )


    console.log(">>> AAAA didLoad", didLoad)


    const tokensBalanceInfo = Object.values(portfolioInfo.tokenBalances)
        .filter( item => item.value !== undefined && item.balance !== undefined )
        .map( item => {
        return {
            symbol: item.symbol,
            balance: fromDecimals( item.balance ?? BigNumber.from(0), item.decimals, item.symbol === 'USDC' ? 2 : 4),
            value: fromDecimals( item.value ?? BigNumber.from(0), depositToken.decimals, 2),
            depositTokenSymbol: depositToken.symbol,
            decimals: item.decimals
       }
    })

 
    const portfolioMap = poolsWithFunds.map ( it => {
        const info = PoolInfo(chainId, it.poolId)
        return {
            name: info.name,
            data: it.tokenInfoArray.map ( t => {
                return {
                    x: t.symbol,
                    y: Number(fromDecimals( t.value, depositToken.decimals, 2)),
                }
            })
        }
    })
    
    const totalValueFormatted = portfolioInfo.totalValue && fromDecimals( portfolioInfo.totalValue, depositToken.decimals, 2)

    return (
        <div className={classes.container}>
         
            { !didLoad && 
                <div style={{height: 300, paddingTop: 140}} >
                    <Horizontal align="center" > <CircularProgress color="secondary" /> </Horizontal>  
                </div>
            }

            { didLoad && 
                <Box className={classes.portfolioSummary} > 
                    <Box pb={5} >
                        <AssetValue value={ Number( totalValueFormatted ?? 0) } />
                    </Box>

                    <MyAssets title="Managed Assets" tokens={ tokensBalanceInfo } />
                </Box>
            }

            { poolsWithFunds && poolsWithFunds.length > 0 &&
                <Box>
                    <Typography variant="h4" align="center" >HashStrat Strategies</Typography>

                    <Typography variant="body2" align="center" style={{ marginTop: 10, marginBottom: 10 }}>
                        Asset allocation by management strategy
                    </Typography>
                    <Box className={ classes.strategyMap }>
                        <TreeChart 
                            title=""
                            height={350}
                            data={portfolioMap}
                        />
                    </Box>
                </Box>
            }

            <PoolExplorer chainId={chainId} account={account} depositToken={depositToken} />
{/* 
            <Box my={4} >
                <Typography variant="h4" align="center" >Asset Allocation</Typography>
                <Typography variant="body1" align="center" style={{marginTop: 20, marginBottom: 20}}>
                    Asset allocation in the different Pools &amp; Indexes
                </Typography>
                <Horizontal align="center" > 
                    { poolsSummaryViews }
                </Horizontal>
            </Box> */}

        </div>
    )

}




