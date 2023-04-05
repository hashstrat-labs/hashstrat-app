import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom"
import { useTokenBalance } from "@usedapp/core"

import { makeStyles, Box, Link, Typography, Button, Paper,  Stepper, StepLabel, Step, Popover    } from "@material-ui/core"
import { Info } from "@material-ui/icons"
import Carousel from 'react-material-ui-carousel'

import { SnackInfo } from "../SnackInfo"

import { Token } from "../../types/Token"
import { DepositForm } from "../wallet/DepositForm"

import { usePoolsInfo, useIndexesInfo, PoolData } from "../dashboard/DashboadModel"
import { Horizontal, Vertical } from "../Layout";
import { PoolInfo } from "../../utils/pools"
import { IndexesIds } from "../../utils/pools";
import { PoolIds } from "../../utils/pools";
import { fromDecimals } from "../../utils/formatter"

import wbtc from "../img/wbtc.png"
import weth from "../img/weth.png"

import { Launch } from "@material-ui/icons"

import { strategyItems } from "../strategies/StrategyInfo"


interface DespositWorkflowProps {
    chainId: number,
    depositToken: Token,
    investTokens: Array<Token>,
    isInitialDeposit: boolean,
    account?: string,
    onClose?: () => void,
    onSuccess?: (info: SnackInfo) => void,
    onError?: (error: SnackInfo) => void,
}


const useStyles = makeStyles( theme => ({
    container: {
      
    },

    assetsList: {
        marginTop: 50,
        maxWidth: 900,
        // margin: 'auto',
        [theme.breakpoints.down('xs')]: {
            display: "none"
        },
    },
    assetsCarousel: {
        [theme.breakpoints.up("sm")]: {
            display: "none"
        },
    },

    assetContainer: {
        margin: "auto",
        padding: theme.spacing(2),
        minWidth: 150,
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: 12,
        paddingBottom: 10,

        [theme.breakpoints.down('xs')]: {
            minWidth: 280,
            marginLeft: 30,
            marginRight: 30
        },
    },
    asset: {
        margin: "auto",
        // padding: theme.spacing(1),
        minWidth: 170,
    },

    strategy: {
        marginLeft: 70,
        marginRight: 70,
        padding: theme.spacing(2),
        minWidth: 350,
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: 12,
        paddingBottom: 10,
        [theme.breakpoints.down('xs')]: {
            minWidth: 280,
            marginLeft: 30,
            marginRight: 30
        },
    }

}))

const steps = [
    'Select your assets',
    'Select your strategy',
    'Deposit',
]

const strategyNames = {
    "rebalance_01": "Rebalancing",
    "meanrev_01": "Mean Reversion",
    "trendfollow_01": "Trend Following",
    "rebalance_01,meanrev_01,trendfollow_01": "Mean Reversion + Rebalancing + Trend Following"
}

const assetNames = {
    "WBTC": "BTC",
    "WETH": "ETH",
    "WBTC,WETH": "BTC + ETH",
}


const assetImages = ['WBTC','WETH'].map( (item, idx) => {
    const imageSrc = item === 'WBTC' ? wbtc : item === 'WETH' ? weth : ''
    return <img key={idx} src={imageSrc} style={{width: 45, height: 45}} alt={`${item}`} />
})



const isMyPool = (pool: PoolData) : boolean => {
    const noValue = pool.tokenInfoArray.reduce( (acc, val) => {
        if ( val.accountValue !== undefined && !val.accountValue?.isZero() ) {
            console.log("isMyPool ", val.symbol, "=>", val.accountValue?.toString())
        }
     
        return acc && (val.accountValue === undefined || val.accountValue?.isZero())
    }, true)
    return !noValue
}

const filterPools = (chainId: number, poolsInfo: PoolData[], poolId: string | undefined, asset: string | undefined, mypools: boolean) => {
    const filtered = poolsInfo.filter( pool => { 
        const info = PoolInfo(chainId, pool.poolId)
        //const includePool = poolId === undefined || pool.poolId === poolId
        const includeAsset = asset === undefined || info.investTokens.map( (it: string) => it.toLowerCase()).join(',') === asset.toLowerCase()
        const includeMyPools = mypools === false || isMyPool(pool)

        return info.disabled === 'false' && includeAsset && includeMyPools
    })

    return filtered
}




export const DepositWorkflow = ({ chainId, depositToken, investTokens, isInitialDeposit, account, onClose, onSuccess, onError } : DespositWorkflowProps) => {
    
    const classes = useStyles()
    const tokens = [depositToken, ...investTokens]

 
    const [selectedAsset, setSelectedAsset] = useState<string>()
    const [selectedPool, setSelectedPool] = useState<string>()
    
    const tokenBalance = useTokenBalance(depositToken.address, account)
    const formattedTokenBalance = tokenBalance ? fromDecimals(tokenBalance, depositToken.decimals, 2) : ''



    const didSelectAsset = (asset: string) => {
        console.log("didSelectAsset: ", asset)
        if (asset === selectedAsset) {
            setSelectedAsset(undefined)
        } else {
            setSelectedAsset(asset)
        }
    }

    const didSelectPool = (poolId: string) => {
        console.log("didSelectPool: ", poolId)
        if (poolId === selectedPool) {
            setSelectedPool(undefined)
        } else {
            setSelectedPool(poolId)
        }
    }
 

    const pools = usePoolsInfo(chainId, PoolIds(chainId), tokens, account)
    const indexes = useIndexesInfo(chainId, IndexesIds(chainId), tokens, account)



    //// FILTER POOL

    // const selectedStrategy = strategy == -1 ? undefined : strategies[strategy]

    const poolsForAssets = filterPools(chainId, [ ...pools, ...indexes], selectedPool, selectedAsset, false).map( pool => pool.poolId  )


    const poolsViews = poolsForAssets?.map( (poolId, idx) => {
        const { description, detail, scope  } = PoolInfo(chainId, poolId)

        const info = PoolInfo(chainId, poolId)
        const strategyName =  strategyNames[info.strategy as keyof typeof strategyNames] || info.strategy

        const strategyInfo = strategyItems.find( it => it.name === strategyName)

        return (
            <Box key={idx} className={classes.strategy}>

                <Typography align="center" variant="h6" style={{ marginTop: 0 }}>{strategyName}</Typography>
                <ul>
                    <li><Typography variant="body2" style={{ marginTop: 0 }}>{description}</Typography></li>
                    <li><Typography variant="body2" style={{ marginTop: 0 }}>{detail}</Typography></li>
                    <li><Typography variant="body2" style={{ marginTop: 0 }}>{scope}</Typography></li>
                </ul>
                

                { strategyInfo && 
                    <Horizontal align='center' valign='center'> 
                        <Box pt={2}>
                            <Link component={RouterLink}  to={`/sim?strategy=${strategyInfo.id}&from=2019-01-01`} target="_blank" style={{ paddingRight: 30 }} > Strategy Simulator <Launch style={{ height: 15, transform: "translateY(2px)" }} /> </Link>
                            <Link href={strategyInfo.link} target="_blank" > Learn More <Launch style={{ height: 15, transform: "translateY(2px)" }} />  </Link>
                        </Box>
                    </Horizontal>
                
                }
             
                <Horizontal align="center">
                    <Box mt={3} mb={1}>
                        <Button variant="outlined" color="primary" onClick={() => didSelectPool(poolId)} style={{ textTransform:'none'}} >
                            Select
                        </Button>  
                    </Box>
                </Horizontal> 
            </Box>
        )
    })

    const assetViews = [
        <Box p={1} key={0} className={classes.assetContainer} >
                <div className={classes.asset} >
                    <Vertical align="center">
                        <Box py={1}>BTC</Box>
                        {assetImages[0]}
                    </Vertical>
                </div>
                <Box mt={2} mb={1}>
                    <Horizontal align="center">
                        <Button variant="outlined" color="primary" onClick={() => didSelectAsset('wbtc')}  style={{ textTransform:'none'}} >
                            Select
                        </Button>  
                    </Horizontal> 
                </Box>
        </Box>,
        
        <Box p={1} key={1} className={classes.assetContainer}>
            <div className={classes.asset} >
                <Vertical align="center">
                    <Box py={1}>ETH</Box>
                    {assetImages[1]}
                </Vertical>
            </div>
            <Box mt={2} mb={1}>
                <Horizontal align="center">
                    <Button variant="outlined" color="primary" onClick={() => didSelectAsset('weth')}  style={{ textTransform:'none'}} >
                        Select
                    </Button>  
                </Horizontal> 
            </Box>
        </Box>,

        <Box p={1} key={2} className={classes.assetContainer}>
            <div className={classes.asset} >
                <Vertical align="center">
                    <Box py={1}>BTC + ETH </Box>
                    <Horizontal align="center">
                        {assetImages[0]}
                        {assetImages[1]}
                    </Horizontal>
                </Vertical>
            </div>
            <Box mt={2} mb={1}>
                <Horizontal align="center">
                    <Button variant="outlined" color="primary" onClick={() => didSelectAsset('wbtc,weth')} style={{ textTransform:'none'}} >
                        Select
                    </Button>  
                </Horizontal> 
            </Box>
        </Box>
    ]


    const hideModalPreseed = () => {
        reset()
    }

    const handleAllowanceUpdated = () => {}


    ////// STEPPER

    const [activeStep, setActiveStep] = useState(0)
    const [depositCompleted, setDepositCompleted] = useState<boolean>(false)

    const reset = () => {
        setDepositCompleted(false)
        setSelectedAsset(undefined)
        setSelectedPool(undefined)
    };

    useEffect(() => {
        setDepositCompleted(false)
        if (selectedPool !== undefined ) {
            setActiveStep(2)
		} else if (selectedAsset !== undefined) {
            setActiveStep(1)
        } else {
            setActiveStep(0)
        }

	}, [selectedAsset, selectedPool])

    
    const handleGoBackToStep = (step: number) => {
        if (step === 0) {
            setSelectedAsset(undefined)
            setSelectedPool(undefined)
            setDepositCompleted(false)
        }
        if (step === 1) {
            setSelectedPool(undefined)
            setDepositCompleted(false)
        }
    }

    
    /// DEPOSIT

    const handleSuccess = (info: SnackInfo) => {
        console.log("DepositWorkflow.handleSuccess() >>> ", info)
        if (info.message === "Deposit completed"){
            console.log("deposit completed!!")
            setDepositCompleted(true)
        }
        onSuccess && onSuccess(info)
    }

    const handleError = (error: SnackInfo) => {
        onError && onError(error)
    }


    const handleClose = () => {
        onClose && onClose()
    }

    const assetSelectionStep = selectedAsset ? assetNames[ selectedAsset.toUpperCase() as keyof typeof assetNames] : ''
    const strategySelectionStep = selectedPool && strategyNames[PoolInfo(chainId, selectedPool).strategy as keyof typeof strategyNames]


    ///// popover //// 
    const [anchorEl0, setAnchorEl0] = useState<HTMLButtonElement | null>(null);

    const handleClick0 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl0(event.currentTarget);
    };
    
    const handleClose0 = () => {
        setAnchorEl0(null);
    };

    const open0 = Boolean(anchorEl0)
    const id0 = open0 ? 'divs-info-popover-0' : undefined
    
        

    return (
        <Box style={{ width: '100%' }} >
      
            <Box pt={0} pb={4} >

                { !isInitialDeposit &&
                    <Box pt={3} mb={3} pl={2} pr={2} style={{ minWidth: 500}} >
                         <Typography variant="h4" align="center">
                            Deposit
                         </Typography>
                        {/* <Typography variant="body1"  style={{marginTop: 5}} align="center">
                            Select a combination of risk assets and portfolio management strategies for this deposit.
                        </Typography> */}


                        <Typography variant="body1" align="center" style={{marginTop: 5}}>
                            {
                                (selectedAsset === undefined && selectedPool === undefined) && 
                                <label>Step 1 of 3 <br/> Select the risk assets you want to hold</label>
                            }

                            {
                               (selectedAsset !== undefined && selectedPool === undefined) && 
                               <label>Step 2 of 3  <br/> Select the strategy to manage your assets</label>
                            }
                            {
                               (!depositCompleted && selectedAsset !== undefined && selectedPool !== undefined) &&
                                <label>Step 3 of 3  <br/> Deposit {depositToken.symbol} and view your portfolio</label>
                            }
                            {
                                depositCompleted && <label>Deposit completed!</label>
                            }
                            
                            {/* Select a combination of risk assets, select your portfolio management strategy, deposit {depositToken.symbol}, and HashStrat will build your portfolio. <br/> */}
                        </Typography>
                    </Box>

                }
                { isInitialDeposit &&
                    <Box mb={3} pl={1} pr={1} >

                        <Typography variant="h4" align="center">Build your Portfolio
                            <Button onClick={handleClick0} style={{ height: 40, width: 40 }} >
                                <Info  color="action"/> 
                            </Button>
                        </Typography>

                        <Popover style={{maxWidth: 500}} id={id0} open={open0} anchorEl={anchorEl0} onClose={handleClose0} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }} >
                            <Box p={3} style={{ minWidth: '320px'}}>
                               
                                    <Typography variant="body1">
                                        Your portfolio will contain a mix of stablecoin (USDC) and your selected risk assets (WBTC, WETH).
                                    </Typography>
                                    <Typography variant="body1"  style={{marginTop: 5}}>
                                    The allocation to each asset in the portfolio will be managed automatically by the strategy you select,
                                    with the goal to capture volatility and limit risk.
                                    </Typography>
                            
                            </Box>
                        </Popover> 

                    </Box>
                }

            
                <Stepper activeStep={activeStep} alternativeLabel >
                    {steps.map((label, idx) => {    
                        const stepCompleted = idx < activeStep || (idx === (steps.length -1) && depositCompleted)
                        return (
                        <Step key={label} completed={ stepCompleted }>
                        <StepLabel children={
                            <Box>
                                { (!stepCompleted ) && <Typography>{label}</Typography> }
                                { (stepCompleted && idx === steps.length -1) && 
                                    <Link >
                                        <Typography>{label}</Typography>                                
                                    </Link>
                                }
                                <Link onClick={ e => handleGoBackToStep(idx) } >
                                    <Typography variant="body2">
                                        { 
                                            idx === 0 ? assetSelectionStep : 
                                            idx === 1 ? strategySelectionStep : '' 
                                        }
                                    </Typography>
                                </Link>
                            </Box>
                        } />
                        </Step>
                    )})}
                </Stepper>

                { selectedAsset === undefined &&
                <div>
                    <div className={classes.assetsList}>
                        <Horizontal align="left">
                          {assetViews}
                        </Horizontal>
                    </div>

                    <div className={classes.assetsCarousel}>
                        <Box pt={3}  >
                            <Horizontal align="center">
                                <Carousel 
                                    fullHeightHover={false}  
                                    autoPlay={false}
                                    navButtonsAlwaysVisible={true}
                                    cycleNavigation={false}
                                    swipe={true}
                                    indicators={true}
                                >
                                    {assetViews}
                                </Carousel>
                            </Horizontal>
                        </Box>
                    </div>
                </div>
 
                }
                { poolsViews && poolsViews.length > 0 && selectedAsset !== undefined && selectedPool === undefined &&
                    <Box pt={3}  >
                        <Horizontal align="center">
                            <Carousel 
                                fullHeightHover={false}  
                                navButtonsProps={{ 
                                    style: {
                                        // backgroundColor: 'red',
                                        // borderRadius: 0
                                    }
                                }} 

                                autoPlay={false}
                                navButtonsAlwaysVisible={true}
                                cycleNavigation={false}
                                swipe={true}
                                indicators={true}
                            >
                                {poolsViews}
                            </Carousel>
                        </Horizontal>
                    </Box>
                }

                { depositCompleted && 
                    <Box mt={3}>
                        <Box mt={3}>
                            <Horizontal align="center">
                                <Button color="primary" variant="contained" onClick={handleClose}>
                                    View Portfolio
                                </Button>
                            </Horizontal>
                        </Box>
                    </Box>
                }
                
                { selectedPool !== undefined && account && !depositCompleted && 
                    <Box >

                        {/* <DepositWithdrawView 
                            formType="deposit"
                            chainId={chainId}
                            poolId={selectedPool}
                            token={depositToken}
                            handleSuccess={handleSuccess}
                            handleError={handleError}
                        /> */}

                        <Horizontal align="center">
                            <Box mt={3}> 
                                <Paper>
                                    <Box>
                                        <DepositForm
                                            balance={formattedTokenBalance}
                                            chainId={chainId}
                                            poolId={selectedPool}
                                            token={depositToken}
                                            account={account}
                                            handleSuccess={handleSuccess}
                                            handleError={handleError}
                                            allowanceUpdated={handleAllowanceUpdated}
                                            onClose={hideModalPreseed}
                                        /> 
                                    </Box>
                                </Paper>
                            </Box>
                        </Horizontal>


                    </Box>
                }
    
            </Box>

        </Box>
    )

}






