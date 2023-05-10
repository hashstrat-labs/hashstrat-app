
import { useState, useEffect } from "react"

import { makeStyles, Box, Link, Typography, Snackbar, CircularProgress, Divider } from "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"

import { BigNumber } from "ethers"

import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { StrategySummary } from "./StrategySummary"
import { Horizontal } from "../Layout"
import { PoolInfo } from "../../utils/pools"

import { useDashboardModel } from "./DashboadModel"
import { useTotalDeposited, useTotalWithdrawals } from "../../hooks/useUserInfo"
import { DepositWorkflow } from "./DepositWorkflow"

import { Modal } from "../CustomModal"
import { StyledAlert } from "../shared/StyledAlert"
import { SnackInfo } from "../SnackInfo"
import { TreeChart } from "../shared/TreeChart"
import { PortfolioValue } from './PortfolioValue'
import { MyAssets } from './MyAssets'
import { Transactions } from './Transactions'

import myStrategiesSrc from './img/strategies.svg'


interface MyPortfolioSummaryProps {
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
        marginTop:10,
    },

    strategies: {
        marginTop:20,
        padding: 10,
        paddingBottom: 0,
        borderRadius: 8,
        backgroundColor: theme.palette.type === 'light' ? '#fff' :'#000',
    },


    assetsTransactions: {
        marginTop: 30,
        // backgroundColor: 'red',

        display: "grid",
        gridTemplateColumns: "2fr  1fr",
        columnGap: 40,

        [theme.breakpoints.down('sm')]: {
            marginTop: 30,
            gridTemplateColumns: "1fr 1fr",
        },
        [theme.breakpoints.down('xs')]: {
            marginTop: 30,
            gridTemplateColumns: "1fr",
            rowGap: 30,
            columnGap: 0,
        },
    },


    strategyMap: {
        margin: 'auto',
        marginBottom: 20,
        maxWidth: 800, 

        [theme.breakpoints.down('xs')]: {
            marginLeft: 10,
            marginRight: 10,
        },
    },

    strategyPools: {
        padding: theme.spacing(0),
        [theme.breakpoints.down('xs')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    }

}))


export const MyPortfolioSummary = ({ chainId, connectedChainId, depositToken, investTokens, account, onPortfolioLoad } : MyPortfolioSummaryProps) => {
    
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

    const tokensBalanceInfo = Object.values(portfolioInfo.tokenBalances)
        .filter( item => item.value !== undefined && item.balance !== undefined )
        .map( (item ) => {
        return {
            symbol: item.symbol,
            balance: fromDecimals( item.balance ?? BigNumber.from(0), item.decimals, item.symbol === 'USDC' ? 2 : 4),
            value: fromDecimals( item.value ?? BigNumber.from(0), depositToken.decimals, 2),
            depositTokenSymbol: depositToken.symbol,
            decimals: item.decimals
       }
    })

    
    const userHasDisabledPools = [...indexesInfo, ...poolsInfo].filter( pool => pool.totalValue.isZero() === false ).reduce( (acc, val ) => {
        return acc = acc || PoolInfo(chainId, val.poolId).disabled === 'true'
    }, false)

    const poolsWithFunds = [...indexesInfo, ...poolsInfo]
        .filter( pool => pool.totalValue.isZero() === false )
        .sort ( (a, b) => { return b.totalValue.sub(a.totalValue).toNumber() } )
     
    const disabledPoolsSummaryViews = poolsWithFunds
        .filter( pool => { 
            return PoolInfo(chainId, pool.poolId).disabled === 'true'
            // const isV4 =  /v4.?$/.test(pool.poolId) 
            // return isV4 == false
        })
        .map ( pool => {
        return <StrategySummary key={pool.poolId} 
                    chainId={chainId} 
                    poolId={pool.poolId} 
                    tokens={pool.tokenInfoArray} 
                    depositToken={depositToken}
                    account={account}
                />
    })  

    const enabledPoolsSummaryViews = poolsWithFunds
        .filter( pool => { 
            return PoolInfo(chainId, pool.poolId).disabled === 'false'
        })
        .map ( pool => {
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
        if ( didLoad && portfolioInfo.totalValue?.isZero() ) {
            setShowBuildPortfolio(true)
		} 
        if ( didLoad && !portfolioInfo.totalValue?.isZero() )  {
            setShowBuildPortfolio(false)
		} 
        
        if (onPortfolioLoad) {
            onPortfolioLoad(didLoad)
        }

	}, [didLoad, portfolioInfo.totalValue ?? BigNumber.from(0), onPortfolioLoad])

    
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
            data: it.tokenInfoArray
                .filter ( t => t.accountValue !== undefined )
                .map ( t => {
                return {
                    x: t.symbol,
                    y: Number(fromDecimals( t.accountValue , depositToken.decimals, 2)),
                }
            })
        }
    })
    

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
                        <AlertTitle><strong>Strategy upgrade</strong></AlertTitle>
                        Due to an upgrde, one of your strategies has been disabled and a new version is now available.<br/>
                        <strong>Withdraw your funds now</strong> from the disabled strategies below and deposit into the new upgraded strategies.
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
                            <Box pb={2}>
                                { roiFormatted !== undefined && 
                                totalValueFormatted !== undefined && 
                                totalWithdrawnFormatted !== undefined &&
                                totalDepositedFormatted !== undefined &&
                                <PortfolioValue 
                                    roi={ Number( roiFormatted ?? 0 ) / 100 } 
                                    value={ Number( totalValueFormatted ?? 0) }
                                    gains={ Number( totalValueFormatted ?? 0) + Number( totalWithdrawnFormatted ?? 0) - Number( totalDepositedFormatted ?? 0) }
                                />
                                }
                                
                                <Box className={classes.assetsTransactions}>
                                    <MyAssets title="My Assets" tokens={ tokensBalanceInfo } />
                                    <Transactions 
                                        deposits={ totalDepositedFormatted } 
                                        withdrawals={totalWithdrawnFormatted} 
                                        symbol={depositToken.symbol}
                                        depositButtonPressed={depositButtonPressed}
                                    />
                                </Box>

                            </Box>
                        </Box>
                    }
                  
                  

                    {   !showBuildPortfolio && 
                        (
                            (enabledPoolsSummaryViews && enabledPoolsSummaryViews.length > 0) || 
                            (disabledPoolsSummaryViews && disabledPoolsSummaryViews.length > 0) 
                        )  &&
                        <Box mb={4} className={classes.strategies} >
                            <Box px={1}>
                                <Horizontal >
                                    <img style={{ width: 32, height: 32 }}  src={myStrategiesSrc} />
                                    <Typography  style={{ fontSize: 20, fontWeight: 500}} > My Strategies </Typography> 
                                </Horizontal> 

                                <Divider style= {{ marginTop: 10, marginBottom: 30 }}/>

                                <Typography variant="body1" align="left" style={{ margin:10 }}>
                                    Portfolio view showing what strategies are managing the assets in your portfolio.
                                </Typography>
                            </Box>
   
                            <Box className={ classes.strategyMap }>
                                <TreeChart 
                                    title=""
                                    height={350}
                                    data={portfolioMap}
                                />
                            </Box>
                        </Box>
                    }


                    {   !showBuildPortfolio && 
                        (
                            (enabledPoolsSummaryViews && enabledPoolsSummaryViews.length > 0) || 
                            (disabledPoolsSummaryViews && disabledPoolsSummaryViews.length > 0) 
                        )  &&                       
                        <Box pb={2}>

                            <Box className={classes.strategyPools}>
                                <Typography variant="h5" >Strategy Pools</Typography>
                            </Box>

                            { (enabledPoolsSummaryViews && enabledPoolsSummaryViews.length > 0) &&
                                <Box pt={4} >
                                    <Horizontal> 
                                    { enabledPoolsSummaryViews }
                                    </Horizontal>
                                </Box>
                            }
                            
                            { (disabledPoolsSummaryViews && disabledPoolsSummaryViews.length > 0) &&
                                <>
                                <Box py={4} >
                                    <Alert severity="warning" > 
                                        <AlertTitle><strong> Disabled Strategies 🚫</strong></AlertTitle>
                                        Withdraw your funds from the disabled strategies below, 
                                        and deposit into the new upgraded strategies.
                                    </Alert>
                                </Box>
                                <Horizontal> 
                                    { disabledPoolsSummaryViews }
                                </Horizontal>
                                </>
                            }

                        </Box>
                    }

              

                    { showDepositModal && 
                        <Modal onClose={ hideModalPreseed } variant="wide" open={true} >
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




