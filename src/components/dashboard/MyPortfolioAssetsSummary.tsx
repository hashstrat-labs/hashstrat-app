
import { useState, useEffect } from "react"

import { makeStyles, Box, Link, Typography, Button, Snackbar, CircularProgress, Divider } from "@material-ui/core"

import { utils } from "ethers"
import { Alert, AlertTitle } from "@material-ui/lab"

import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { StrategySummary } from "./StrategySummary"
import { Horizontal } from "../Layout"

import { TitleValueBox } from "../TitleValueBox"
import { VPieChart } from "../shared/VPieChart"
import { PoolInfo } from "../../utils/pools"

import { useDashboardModel } from "./DashboadModel"
import { useTotalDeposited, useTotalWithdrawals } from "../../hooks/useUserInfo"
import { DepositWorkflow } from "./DepositWorkflow"

import { Modal } from "../Modal"
import { StyledAlert } from "../shared/StyledAlert"
import { SnackInfo } from "../SnackInfo"
import { TreeChart } from "../shared/TreeChart"
import { PortfolioValue } from './PortfolioValue'



interface MyPortfolioAssetsSummaryProps {
    chainId: number,
    connectedChainId: number | undefined,
    account?: string,
    depositToken: Token,
    investTokens: Array<Token>,

    onPortfolioLoad? : (didLoad: boolean) => void
}


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        [theme.breakpoints.down('xs')]: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
    },
    portfolioSummary: {
        maxWidth: 900,
        margin: "auto"
    },
    portfolioInfo: {
        // maxWidth: 640,
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
        maxWidth: 800, 

        [theme.breakpoints.down('xs')]: {
            // width: '100%', 
            marginLeft: 10,
            marginRight: 10,
        },
    }
}))


export const MyPortfolioAssetsSummary = ({ chainId, connectedChainId, depositToken, investTokens, account, onPortfolioLoad } : MyPortfolioAssetsSummaryProps) => {
    
    const classes = useStyles()
    const tokens = [depositToken, ...investTokens]
    const { poolsInfo, indexesInfo, portfolioInfo, chartValueByAsset, chartValueByPool, didLoad } = useDashboardModel(chainId, tokens, depositToken, account)

    const totalDeposited = useTotalDeposited(chainId, account)
    const totalWithdrawn = useTotalWithdrawals(chainId, account)
    
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showBuildPortfolio, setShowBuildPortfolio]  = useState(false);

    const depositButtonPressed = () => {
        setShowDepositModal(true)
    }

    const hideModalPreseed = () => {
        setShowDepositModal(false)
    }

    const tokensBalanceInfo = Object.values(portfolioInfo.tokenBalances).map( (item ) => {
        return {
            symbol: item.symbol,
            balance: fromDecimals( item.balance, item.decimals, item.symbol === 'USDC' ? 2 : 4),
            value: fromDecimals( item.value, depositToken.decimals, 2),
            depositTokenSymbol: depositToken.symbol,
            decimals: item.decimals
       }
    })
    
    const userHasDisabledPools = [...indexesInfo, ...poolsInfo].filter( pool => pool.totalValue.isZero() === false ).reduce( (acc, val ) => {
        return acc = acc || PoolInfo(chainId, val.poolId).disabled === 'true'
    }, false)

    const poolsWithFunds = [...indexesInfo, ...poolsInfo].filter( pool => pool.totalValue.isZero() === false ).sort ( (a, b) => { return b.totalValue.sub(a.totalValue).toNumber() } )
    const poolsSummaryViews = poolsWithFunds.map ( pool => {
        return <StrategySummary key={pool.poolId} 
                    chainId={chainId} 
                    poolId={pool.poolId} 
                    tokens={pool.tokenInfoArray} 
                    depositToken={depositToken}
                    account={account}
                 />
    })

    const totalValueFormatted = portfolioInfo.totalValue && fromDecimals( portfolioInfo.totalValue, depositToken.decimals, 2)
    const totalDepositedFormatted = totalDeposited && fromDecimals( totalDeposited, depositToken.decimals, 2)
    const totalWithdrawnFormatted = totalWithdrawn && fromDecimals( totalWithdrawn, depositToken.decimals, 2)

    const roiFormatted = (totalValueFormatted && totalWithdrawnFormatted && totalDepositedFormatted && parseFloat(totalDepositedFormatted) > 0) ? 
                            String(Math.round( 10000 * (parseFloat(totalWithdrawnFormatted) + parseFloat(totalValueFormatted) - parseFloat(totalDepositedFormatted)) / parseFloat(totalDepositedFormatted)) / 100 ) : 'n/a'


    // show build portfolio workfow if have no assets
    useEffect(() => {
        if ( didLoad && totalValueFormatted === "0") {
            setShowBuildPortfolio(true)
		} 
        if (onPortfolioLoad) {
            onPortfolioLoad(didLoad)
        }

	}, [didLoad, totalValueFormatted, onPortfolioLoad])

    
    /// DepositWorkflow Callbacks
    const hidePortfolioWorkflow = () => {
        setShowDepositModal(false)
        setShowBuildPortfolio(false)
    }

    const handleSuccess = (info: SnackInfo) => {
        setSnackContent(info)
        setShowSnack(true)
    }

    const handleError = (error: SnackInfo) => {
        setSnackContent(error)
        setShowSnack(true)
    }




    // SNACK
    const [showSnack, setShowSnack] = useState(false)
    const [snackContent, setSnackContent] = useState<SnackInfo>()

    const handleCloseSnack = () => {
        setShowSnack(false)
    }


  
    const portfolioMap = poolsWithFunds.map ( it => {
        const info = PoolInfo(chainId, it.poolId)
        return {
            name: info.name,
            data: it.tokenInfoArray.map ( t => {
                return {
                    x: t.symbol,
                    y: Number(fromDecimals( t.accountValue, depositToken.decimals, 2)),
                }
            })
        }
    })
    
    // console.log(">>> poolsWithFunds: ", poolsWithFunds, ">>>", portfolioMap)


    return (
        <div className={classes.container}>

            { !didLoad && 
                <div style={{height: 300, paddingTop: 140}} >
                    <Horizontal align="center" > <CircularProgress color="secondary" /> </Horizontal>  
                </div>
            }
         

            { userHasDisabledPools && 
                <Box pb={2} >
                    <Alert severity="warning" > 
                        <AlertTitle>Upgraded Pools &amp; Indexes</AlertTitle>
                        New versions of all Pools &amp; Indexes have been deployed and the old versions are now disabled.<br/>
                        Withdraw your funds from disabled Pools &amp; Indexes and deposit into active ones. <br/>
                        If you had "staked" your LP tokens remember to "unstake" them before you can withdraw.
                    </Alert>
                </Box>
            }

            {  didLoad && account &&
                <div>
                    { didLoad && showBuildPortfolio && 
                        <Box mb={4}>
                            <Horizontal align="center"> 
                                <DepositWorkflow  
                                    chainId={chainId} 
                                    depositToken={depositToken} 
                                    investTokens={investTokens}
                                    isInitialDeposit={true}
                                    account={account} 
                                    onClose={hidePortfolioWorkflow}
                                    onSuccess={handleSuccess}
                                    onError={handleError}
                                />                     
                            </Horizontal>
                        </Box>
                    }

                    { !showBuildPortfolio  && 

                        <Box className={classes.portfolioSummary} > 

                            <Typography variant="h4" align="center" style={{ marginTop: 0, marginBottom: 30 }} > Portfolio Summary </Typography>

                            <Box pb={5} >
                                <PortfolioValue roi={ Number( roiFormatted ?? 0 ) / 100 }  value={ Number( totalValueFormatted ?? 0) } />
                            </Box>

                            { totalValueFormatted  && Number(totalValueFormatted) > 0 &&

                                <Horizontal align="center" >

                                    <Box >
                                        <VPieChart { ...chartValueByAsset } /> 
                                            {/* <VPieChart  { ...chartValueByPool } /> */}
                                    </Box>

                                    <Box>
                                        {
                                            tokensBalanceInfo && tokensBalanceInfo.map( asset => {
                                                const valueFormatted = `${ utils.commify(asset.balance) } ($ ${  utils.commify(asset.value) })`
                                                return  <TitleValueBox key={asset.symbol} title={asset.symbol} value={ valueFormatted }  mode="small" />
                                            })
                                        }

                                        <Box mt={5}>
                                            <TitleValueBox mode="small" title="My Deposits" value={ utils.commify(totalDepositedFormatted) } suffix={depositToken.symbol} />
                                            <TitleValueBox mode="small" title="My Withdrawals" value={ utils.commify(totalWithdrawnFormatted) } suffix={depositToken.symbol} />
                                       
                                            { !showBuildPortfolio &&
                                                <Box mt={4} mb={2} >
                                                    <Horizontal align="center"> 
                                                        <Button variant="contained" onClick={depositButtonPressed} color="primary" size="large" > Deposit </Button>
                                                    </Horizontal>
                                                </Box>
                                            }
                                        </Box>

                                    </Box>

                                </Horizontal>
    
                            }
                            
                        </Box>
                        
                    }

                  

                    { !showBuildPortfolio && poolsSummaryViews && poolsSummaryViews.length > 0 &&
                        <Box my={4} >

                            <Divider style= {{ marginBottom: 40 }}/>

                            <Typography variant="h4" align="center" >My Strategies</Typography>

                            <Typography variant="body2" align="center" style={{ margin:10 }}>
                                Portfolio view showing what strategies are managing the assets in your portfolio.
                            </Typography>
                            <Box className={ classes.strategyMap }>
                                <TreeChart 
                                    title=""
                                    height={350}
                                    data={portfolioMap}
                                />
                            </Box>

                            <Horizontal align="center" > 
                                { poolsSummaryViews }
                            </Horizontal>
                        </Box>
                    }


                    { showDepositModal && 
                        <Modal onClose={(e) => hideModalPreseed()} variant="wide" >
                            <DepositWorkflow  
                                chainId={chainId} 
                                depositToken={depositToken} 
                                investTokens={investTokens} 
                                isInitialDeposit={false}
                                account={account} 
                                onClose={hidePortfolioWorkflow}
                                onSuccess={handleSuccess}
                                onError={handleError}
                            />

                        </Modal>
                    }
                </div>
            }


            <Snackbar
                open={showSnack}
                anchorOrigin={ { horizontal: 'right',  vertical: 'bottom' } }
                autoHideDuration={snackContent?.snackDuration ?? 15000}
                onClose={handleCloseSnack}
            >
                <StyledAlert onClose={handleCloseSnack} severity={snackContent?.type}>
                    <AlertTitle> {snackContent?.title} </AlertTitle>
                    {snackContent?.message}
                    <br/>
                    <Link href={snackContent?.linkUrl} target="_blank"> {snackContent?.linkText} </Link>
                </StyledAlert>
            </Snackbar>

        </div>
    )

}




