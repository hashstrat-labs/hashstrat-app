import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom"
import { useTokenBalance } from "@usedapp/core"

import { makeStyles, Box, Link, Typography, Button, Paper,  Stepper, StepLabel, Step, Popover, RadioGroup, Divider } from "@material-ui/core"
import { Info, Launch } from "@material-ui/icons"
import Carousel from 'react-material-ui-carousel'

import { SnackInfo } from "../SnackInfo"

import { Token } from "../../types/Token"
import { DepositForm } from "../wallet/DepositForm"

import { usePoolsInfo, useIndexesInfo, PoolData } from "../dashboard/DashboadModel"
import { Horizontal } from "../Layout";
import { PoolInfo } from "../../utils/pools"
import { IndexesIds } from "../../utils/pools";
import { PoolIds } from "../../utils/pools";
import { fromDecimals } from "../../utils/formatter"

import { strategyItems } from "../strategies/StrategyInfo"
import { AssetSelect } from "./AssetSelect"

import wbtc from "../img/wbtc.png"
import weth from "../img/weth.png"

import dca from "../img/dca.png"
import rebalancing from "../img/rebalancing.png"
import trend from "../img/trend.png"
import allStrategies from "../img/all-strategies.png"


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
        width: '100%',
        minHeight: 500,
    },

    depositHeader: {
        paddingLeft: 30,
        paddingRight: 30,

        [theme.breakpoints.down("sm")]: {
            paddingLeft: 20,
            paddingRight: 20,
        },
    },

    depositWrapper: {
        // backgroundColor: 'red',
        display: 'grid', 
        paddingLeft: 0,
        paddingRight: 0,
        gridTemplateColumns: '320px auto',
        minHeight: 500,

        [theme.breakpoints.down('xs')]: {
            gridTemplateColumns: '1fr',
        },
    },

    stepperWrapper: {
        paddingTop: 30,
        backgroundColor: theme.palette.type === 'light' ? '#F5F5F5' :'#000',
        maxWidth: 320,

        [theme.breakpoints.down("xs")]: {
            maxWidth: '100%'
        },

    },

    stepperVertical: {
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'transparent',

        [theme.breakpoints.down("xs")]: {
            display: 'none',
            // maxWidth: "100%",
            // paddingLeft: 0,
            // paddingRight: 0,
        },
    },

    stepperHorizontal: {
        paddingLeft: 0,
        paddingRight: 0,
        backgroundColor: 'transparent',

        [theme.breakpoints.up("sm")]: {
            display: 'none',
        },
    },

    assetsSelectionWrapper: {
        marginLeft: 60, 
        marginRight: 40,
        [theme.breakpoints.down("sm")]: {
            marginLeft: 20, 
            marginRight: 0,
        },
    },

    assetsSelectionHeader: {
        marginTop: 40, 
        [theme.breakpoints.down("sm")]: {
            display: 'none',
        },
    },

    strategySelectionWrapper: {
        marginLeft: 60, 
        marginRight: 40,
        [theme.breakpoints.down("sm")]: {
            marginLeft: 20, 
            marginRight: 0,
        },
    },

    strategyCard: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
        paddingBottom: 20,

        borderRadius: 22,
        border: `1px solid ${ theme.palette.type === 'light' ? '#ddd' :'#333' }`,

        [theme.breakpoints.down("sm")]: {
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            borderRadius: 0,
            border: '',
        },
    },

    assetContainer: {
        margin: "auto",
        padding: theme.spacing(2),
        minWidth: 150,
        backgroundColor: theme.palette.type === 'light' ? '#fff' :'#000',
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: 8,
        paddingBottom: 10,

        [theme.breakpoints.down('xs')]: {
            borderRadius: 0,
            minWidth: 280,
        },
    },

    asset: {
        margin: "auto",
        minWidth: 150,
        [theme.breakpoints.down('sm')]: {
            minWidth: 130,
        },
    },

    strategy: {
        margin: 'auto',
        marginLeft: 60,
        marginRight: 60,
        // backgroundColor: theme.palette.type === 'light' ? 'red' :'#000',
        // border: `1px solid ${theme.palette.secondary.main}`,
        paddingTop: 20,
        borderRadius: 8,
        paddingBottom: 10,

        [theme.breakpoints.down('xs')]: {
            borderRadius: 0,
            marginLeft: 0,
            marginRight: 0
        },
    },

    strategyDetail: {
        // display: 'grid', 
        paddingLeft: 10,
        paddingRight: 10,
        // gridTemplateColumns: '100px auto',
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 5,
            paddingRight: 5,
            // gridTemplateColumns: '1fr',
        },
    }, 

    strategyImage: {
        width: 100, 
        height: 100, 
        [theme.breakpoints.down('xs')]: {
            margin: "auto",
        },
    },

    strategyInfo: {
        marginTop: 0,
        paddingTop: 0, 
        marginLeft: 0, 
        paddingLeft: 60,
        paddingRight: 20,
        [theme.breakpoints.down('xs')]: {
            marginTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
        },
    },

    depositFormWrapper: {
        maxWidth: 400,
        margin: 'auto',
        [theme.breakpoints.down('sm')]: {
            maxWidth: '100%'
        },
    },

    navigationWrapper: {
        marginLeft: 60,
        marginRight: 60,
        marginBottom: 20,

        [theme.breakpoints.down('sm')]: {
            marginLeft: 20,
            marginRight: 20,
        },
    }



}))

const steps = [
    'Choose your Assets',
    'Select your strategy',
    'Enter your Amount',
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

const strategyImages = {
    "rebalance_01": rebalancing,
    "meanrev_01": dca,
    "trendfollow_01": trend,
    "rebalance_01,meanrev_01,trendfollow_01": allStrategies
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


// Returns the list of PoolData for the "active" pools that support the optional 'asset'
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


type DepositWorkflowStep = 'select-assets' | 'select-strategy' | 'deposit'


export const DepositWorkflow = ({ chainId, depositToken, investTokens, isInitialDeposit, account, onClose, onSuccess, onError } : DespositWorkflowProps) => {
    
    const classes = useStyles()
    const tokens = [depositToken, ...investTokens]

    const [step, setStep] = useState<DepositWorkflowStep>('select-assets')

    const [selectedAsset, setSelectedAsset] = useState<string>()
    const [selectedPool, setSelectedPool] = useState<string>()
    const [selectedPoolIdx, setSelectedPoolIdx] = useState<number | undefined>(undefined)

    const tokenBalance = useTokenBalance(depositToken.address, account)
    const formattedTokenBalance = tokenBalance ? fromDecimals(tokenBalance, depositToken.decimals, depositToken.decimals) : ''



    const didSelectAsset = (asset: string) => {
        console.log(">>> DepositWorkflow - didSelectAsset: ", asset)
        if (asset === selectedAsset) {
            setSelectedAsset(undefined)
        } else {
            setSelectedAsset(asset)
        }
    }

    const didSelectStrategy = (poolId: string, idx: number) => {
        console.log("didSelectStrategy: ", poolId)
        if (poolId === selectedPool) {
            setSelectedPool(undefined)
            setSelectedPoolIdx(undefined)
        } else {
            setSelectedPool(poolId)
            setSelectedPoolIdx(idx)
        }
    }

    const continueButtonPressed = () => {
        if (selectedAsset !== undefined && step === 'select-assets') {
            setStep('select-strategy')
            setActiveStep(1)
        }

        if (selectedAsset !== undefined && selectedPool !== undefined && step === 'select-strategy') {
            setStep('deposit')
            setActiveStep(2)
        }

        if (step === 'deposit') {
///// TODO
            hideModalPreseed()
        }


    }

    const backButtonPressed = () => {
        if (step === 'select-strategy') {
            setStep('select-assets')
            setActiveStep(0)
            setSelectedPool(undefined)
            setSelectedPoolIdx(undefined)
        }
        if (step === 'deposit') {
            setStep('select-strategy')
            setActiveStep(1)
        }
    }
    
 

    const pools = usePoolsInfo(chainId, PoolIds(chainId), tokens, account)
    const indexes = useIndexesInfo(chainId, IndexesIds(chainId), tokens, account)



    //// FILTER POOL

    // const selectedStrategy = strategy == -1 ? undefined : strategies[strategy]

    const poolsForAssets = filterPools(chainId, [ ...pools, ...indexes], selectedPool, selectedAsset, false).map( pool => pool.poolId  )
    // console.log(">>>  selectedPool:", selectedPool)

    const poolsViews = poolsForAssets?.map( (poolId, idx) => {

        const { description, detail, scope  } = PoolInfo(chainId, poolId)
        const info = PoolInfo(chainId, poolId)
        const strategyName =  strategyNames[info.strategy as keyof typeof strategyNames] || info.strategy
        const strategyImg =  strategyImages[info.strategy as keyof typeof strategyImages] || ''
        const strategyInfo = strategyItems.find( it => it.name === strategyName)

        return (
            <Box key={idx} className={classes.strategy}>

                <Horizontal spacing="between" valign="center">
                    <Typography variant="h5" style={{ marginTop: 0, marginBottom: 20, marginLeft: 20 }}>{strategyName}</Typography>
                    {/* <Box mr={3}>
                        <img src={strategyImg} className={classes.strategyImage}  style={{width: 80, height: 60}} />
                    </Box> */}
                </Horizontal>

                <Box>
                    <ul>
                        <li><Typography variant="body2" style={{ marginTop: 0 }}>{description}</Typography></li>
                        <li><Typography variant="body2" style={{ marginTop: 0 }}>{detail}</Typography></li>
                        <li><Typography variant="body2" style={{ marginTop: 0 }}>{scope}</Typography></li>
                    </ul>
                </Box>


                { strategyInfo && 
                    <Horizontal align='center' valign='center'> 
                        <Box pt={2}>
                            <Link component={RouterLink} to={`/sim?strategy=${strategyInfo.id}&from=2019-01-01`} target="_blank" style={{ paddingRight: 30 }} > Strategy Simulator <Launch style={{ height: 15, transform: "translateY(2px)" }} /> </Link>
                            <Link href={strategyInfo.link} target="_blank" > Learn More <Launch style={{ height: 15, transform: "translateY(2px)" }} />  </Link>
                        </Box>
                    </Horizontal>
                
                }
          
                <Box mt={3} mb={1} mx={5}>
                    <Button fullWidth variant="contained" color="primary"
                        onClick={() => didSelectStrategy(poolId, idx)} style={{ textTransform:'none'}} 
                        disabled={selectedPoolIdx === idx}
                    >
                        Select Strategy
                    </Button>  
                </Box>
       
            </Box>
        )
    })

    const assetViews = [

        <Box mt={2} mr={3} key={0} >
            <AssetSelect symbols={['wbtc']} selected={selectedAsset === 'wbtc'} didSelectAsset={didSelectAsset} />
        </Box>,
        
        <Box mt={2} mr={3} key={1} >
            <AssetSelect symbols={['weth']} selected={selectedAsset === 'weth'} didSelectAsset={didSelectAsset} />
        </Box>,

        <Box mt={2} mr={3} key={2} >
            <AssetSelect symbols={['wbtc', 'weth']} selected={selectedAsset === 'wbtc,weth'} didSelectAsset={didSelectAsset} />
        </Box>,
    ]

    const hideModalPreseed = () => {

        console.log("DepositWorkflow.hideModalPreseed ")
        setDepositCompleted(false)
        setSelectedAsset(undefined)
        setSelectedPool(undefined)

        onClose && onClose()
    }

    const handleAllowanceUpdated = () => {}


    ////// STEPPER

    const [activeStep, setActiveStep] = useState(0)
    const [depositCompleted, setDepositCompleted] = useState<boolean>(false)


    // useEffect(() => {
        // setDepositCompleted(false)
        // setActiveStep(0)

        // if (selectedPool !== undefined ) {
        //     setActiveStep(2)
		// } else if (selectedAsset !== undefined) {
        //     setActiveStep(1)
        // } else {
        //     setActiveStep(0)
        // }

	// }, [selectedAsset, selectedPool])

    
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
            console.log("deposit completed")
            setDepositCompleted(true)

            // // close deposit workflow 
            // onClose && onClose();
        }
        onSuccess && onSuccess(info)
    }

    const handleError = (error: SnackInfo) => {
        onError && onError(error)
    }


    const assetSelectionStep = selectedAsset ? assetNames[ selectedAsset.toUpperCase() as keyof typeof assetNames] : ''
    const strategySelectionStep = selectedPool && strategyNames[PoolInfo(chainId, selectedPool).strategy as keyof typeof strategyNames]


    ///// popover //// 
    const [anchorEl0, setAnchorEl0] = useState<HTMLButtonElement | null>(null);

    const handleClick0 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl0(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl0(null);
    };

    const open0 = Boolean(anchorEl0)
    const id0 = open0 ? 'divs-info-popover-0' : undefined
    
        

    return (
        <Box className={classes.container} >
      
            { isInitialDeposit &&
                <Box mb={3} pl={1} pr={1} >

                    <Typography variant="h4" align="center">Build your Portfolio
                        <Button onClick={handleClick0} style={{ height: 40, width: 40 }} >
                            <Info color="action"/> 
                        </Button>
                    </Typography>

                    <Popover style={{maxWidth: 500}} id={id0} open={open0} anchorEl={anchorEl0} onClose={handleClose} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }} >
                        <Box p={3} style={{ minWidth: '320px'}}>
                        
                            <Typography variant="body1">
                                Your portfolio will include a mix of stablecoin (USDC) and your selected risk assets (WBTC, WETH).
                            </Typography>
                            <Typography variant="body1"  style={{marginTop: 5}}>
                                The allocation to each asset will be managed automatically by the strategy you select,
                                with the goal to generate returns and limit risk.
                            </Typography>
                    
                        </Box>
                    </Popover> 

                </Box>
            }

            <Box className={classes.depositWrapper}>

                <Box className={classes.stepperWrapper}>

                    <Box className={classes.depositHeader}>
                        <Typography variant="h6">Deposit</Typography>
                        
                        <Typography style={{marginTop: 20}} variant="body2" color="textSecondary">
                            Allocate funds to your favourite assets and strategies. 
                        </Typography>
                    </Box>

                    <Stepper activeStep={activeStep} orientation="vertical" className={classes.stepperVertical}>
                        {steps.map((label, idx) => {    
                            const stepCompleted = idx < activeStep || (idx === (steps.length -1) && depositCompleted)
                            return (
                            <Step key={label} completed={ stepCompleted }>
                                <StepLabel children={
                                    <Box>
                                        <Box>
                                            <Typography variant="body2" color="textSecondary">Step {idx+1}</Typography>
                                            <Typography variant="body1">{label}</Typography>
                                        </Box>
                                        <Link style={{ textDecoration: 'none' }} >
                                            <Typography variant="body2">
                                                { 
                                                    idx === 0 ? assetSelectionStep : 
                                                    idx === 1 ? strategySelectionStep : 
                                                    idx === 2 && stepCompleted ? label : '' 
                                                }
                                            </Typography>
                                        </Link>
                                    </Box>
                                } 
                                />
                            </Step>
                        )})}
                    </Stepper>

                    <Stepper alternativeLabel activeStep={activeStep} orientation="horizontal" className={classes.stepperHorizontal}>
                        {steps.map((label, idx) => {    
                            const stepCompleted = idx < activeStep || (idx === (steps.length -1) && depositCompleted)
                            return (
                            <Step key={label} completed={ stepCompleted }>
                                <StepLabel children={
                                    <Box>
                                        <Box>
                                            <Typography variant="body2">{label}</Typography>
                                        </Box>
                                        <Link style={{ textDecoration: 'none' }} >
                                            <Typography variant="body2">
                                                { 
                                                    idx === 0 ? assetSelectionStep : 
                                                    idx === 1 ? strategySelectionStep : '' 
                                                }
                                            </Typography>
                                        </Link>
                                    </Box>
                                } 
                                />
                            </Step>
                        )})}
                    </Stepper>


                </Box>


                <Box>
                    { step === 'select-assets' &&
                        <Box className={classes.assetsSelectionWrapper}>
                            <Box className={classes.assetsSelectionHeader}>
                                <Typography variant="h6"> Choose your Assets </Typography>
                                <Typography variant="body2" color="textSecondary" style={{marginTop: 10}}> Select the risk assets you want to hold </Typography>
                            </Box>

                            <Box mt={3}>
                                <RadioGroup name="select-assets-buttons-group">
                                    {assetViews}
                                </RadioGroup>
                            </Box>
                        </Box>
                    }


                    { step === 'select-strategy' &&
                     //poolsViews && poolsViews.length > 0 && selectedAsset !== undefined && selectedPool === undefined &&
                        <>
                            <Box className={classes.strategySelectionWrapper}>
                                <Box className={classes.assetsSelectionHeader}>
                                    <Typography variant="h6"> Select your Strategy </Typography>
                                    <Typography variant="body2" color="textSecondary" style={{marginTop: 10}}> Choose the strategy that will be managing your assets. </Typography>
                                </Box>
                            </Box>
                            <Box className={classes.strategyCard}>
                                <Carousel 
                                    index={selectedPoolIdx}
                                    animation="slide"
                                    fullHeightHover={true}  
                                    navButtonsProps={{ 
                                        style: {
                                            backgroundColor: "rgba(63, 143, 227, 0.9)",
                                        }
                                    }} 

                                    autoPlay={false}
                                    navButtonsAlwaysVisible={true}
                                    cycleNavigation={true}
                                    swipe={true}
                                    indicators={true}
                                >
                                    {poolsViews} 
                                </Carousel>
                            </Box>
                        </>
                    }

                    { step === 'deposit' && selectedPool && account &&
                    // selectedPool !== undefined && account && //!depositCompleted && 
                           
                        <Box className={classes.depositFormWrapper}> 
                            <DepositForm
                                isFromDashboard={true}
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
                    }

                    <Divider variant="fullWidth" style={{marginTop: 40, marginBottom: 20}} />

                    <Box className={classes.navigationWrapper}>
                        <Horizontal spacing="between">
                            <Button variant="outlined" 
                                onClick={backButtonPressed} 
                                disabled={step === 'select-assets'}
                            > Go back </Button>
                    
                        
                            <Button variant="contained" color="primary"
                                onClick={continueButtonPressed} 
                                disabled={
                                    (step === 'select-assets' && selectedAsset === undefined) || 
                                    (step === 'select-strategy' && selectedPool === undefined)
                                }
                            > { step === 'deposit' ? 'Close' : 'Continue'} </Button>
                        
                        </Horizontal>
                    </Box>


                </Box>

             
            </Box>
     
        </Box>
    )

}






