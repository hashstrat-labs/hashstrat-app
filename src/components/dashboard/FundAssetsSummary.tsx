

import { makeStyles, Box, Typography } from "@material-ui/core"
import { utils } from "ethers"
import { useEthers } from "@usedapp/core";


import { Token } from "../../types/Token"
import { Horizontal } from "../Layout"
import { TitleValueBox } from "../TitleValueBox"
import { VPieChart } from "../shared/VPieChart"
import { useDashboardModel } from "./DashboadModel"
import { PoolInfo } from "../../utils/pools"

import { fromDecimals } from "../../utils/formatter"
import { PoolExplorer } from "../invest/PoolExprorer"

import { TreeChart } from "../shared/TreeChart"
import { PortfolioValue } from './PortfolioValue'


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
    const { poolsInfo, indexesInfo, portfolioInfo, chartValueByAsset, chartValueByPool } = useDashboardModel(chainId, tokens, depositToken)

    const poolsWithFunds = [...indexesInfo, ...poolsInfo].filter( pool => pool.totalValue.isZero() === false ).sort ( (a, b) => { return b.totalValue.sub(a.totalValue).toNumber() } )

    const tokenBalancesoFormatted = Object.values(portfolioInfo.tokenBalances).map( (item ) => {
        return {
            symbol: item.symbol,
            balance: fromDecimals( item.balance, item.decimals, 4),
            value: fromDecimals( item.value, depositToken.decimals, 2),
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
    
    console.log(">>> poolsWithFunds: ", poolsWithFunds, ">>>", portfolioMap)


    const totalValueFormatted = portfolioInfo.totalValue && fromDecimals( portfolioInfo.totalValue, depositToken.decimals, 2)
    
    return (
        <div className={classes.container}>
         

        {/* AAAAAA */}
            <Box className={classes.portfolioSummary} > 

                <Typography variant="h5" align="center" >Assets under Management</Typography>

                <Box pt={5}>
                    <PortfolioValue value={ Number( totalValueFormatted ?? 0) } />
                </Box>
                <Typography variant="body1" align="center" style={{marginTop: 0, marginBottom: 50}}>
                    TVL across all Pools &amp; Indexes
                </Typography>

                { totalValueFormatted  && Number(totalValueFormatted) > 0 &&

                    <Horizontal align="center" >

                        <Box >
                            <VPieChart { ...chartValueByAsset } /> 
                                {/* <VPieChart  { ...chartValueByPool } /> */}
                        </Box>

                        <Box className={classes.portfolioInfo} >
                            {
                                tokenBalancesoFormatted && tokenBalancesoFormatted.map( (token : any)=> {
                                    const valueFormatted = `${utils.commify( token.balance )} ($ ${ utils.commify( token.value )})`
                                    return  <TitleValueBox key={token.symbol} title={token.symbol} value={valueFormatted}  mode="small" />
                                })
                            }
                        </Box>

                    </Horizontal>

                }

            </Box>


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




