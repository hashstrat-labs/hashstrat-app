import { useEffect, useState } from 'react'
import moment from 'moment'
import { makeStyles, Box, Paper, TextField, Typography, MenuItem } from  "@material-ui/core"

import { SimulatorInastance, StrategyName } from "../../services/simulator/SimulatorService"
import { DepositToken, InvestTokens } from "../../utils/pools"
import { roiDataForSwaps  } from "../../utils/calculators/roiCalculator"
import { RoiInfo } from '../../types/RoiInfo'
import { PoolTokensSwapsInfo } from "../../types/PoolTokensSwapsInfo"
import { Horizontal } from '../Layout'
import { InfoCard } from './InfoCard'
import { StraetegyTrades } from "./StraetegyTrades"
import { ROIChart } from "./ROIChart"
import { AssetAllocationChart } from "./AssetAllocationChart"
import { DrawdownChart } from './DrawdownChart'

import { useSearchParams } from "react-router-dom"
import { PriceChart } from './PriceChart'

import { MeanReversionSummary  } from "../strategies/MeanReversion"
import { TrendFollowingSummary  } from "../strategies/TrendFollowing"
import { RebalancingSummary  } from "../strategies/Rebalancing"

import { AssetsChart } from './AssetsChart'

const useStyle = makeStyles( theme => ({
 
    container: {
        marginTop: 2,
        paddingLeft: 20,
        paddingRight: 20,
        maxWidth: 1200,
        margin: "auto",
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 0,
            paddingRight: 0,
		},
    },

    header: {
        display: "flex",
        // justifyContent: "left",
        alignItems: "top",
        flexDirection: "row",
        flexFlow: "row wrap",
        gap: theme.spacing(3),
    },

    form: {
        // width: "100%",
    },

    metrics: {
        // maxHeight: 250,
        marginBottom: 20,
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
    },

    banner: {
        marginTop: 10,
        width: 600,
        margin: 'auto',
    },

    formField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: 20,
        width: 200,
        [theme.breakpoints.down('xs')]: {
            marginBottom: 20,
            width: 140,
		},
    },

    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },

    trades: {
        minWidth: 900,
        [theme.breakpoints.down('xs')]: {
            minWidth: '100%'
		},
    }

}))


export interface SimHomeProps {
    chainId: number,
}


export const SimHome = ({ chainId } : SimHomeProps) => {

    const classes = useStyle()

    const params = {
        fromDate: "sim.fromDate",
        toDate: "sim.toDate",
        asset: "sim.asset",
        strategy: "sim.strategy",
        investment: "sim.investment",
    }

    const [searchParams] = useSearchParams();


    // Ger params from URL, otherwise from Local storage, othewrwise some defaults
    const fromParam = searchParams.get("from") &&  moment(searchParams.get("from"), 'YYYY-MM-DD').isValid() ?
            moment(searchParams.get("from")).toDate().toISOString() :
            localStorage.getItem(params.fromDate) ?? '2019-01-07T00:00:00'
           

    const toParam = searchParams.get("to") &&  moment(searchParams.get("to"), 'YYYY-MM-DD').isValid() ?
            moment(searchParams.get("to")).toDate().toISOString() :
            localStorage.getItem(params.toDate) ?? new Date().toISOString()
           
    const assetParam : 'BTC' | 'ETH' = ['BTC', 'ETH'].includes( searchParams.get("symbol") ?? '') ?
             (searchParams.get("symbol") === 'BTC' ? 'BTC' : 'ETH') :
             localStorage.getItem(params.asset) === 'BTC' ? 'BTC' : 'ETH' 
           
    const strategyParam = ['MeanReversion', 'Rebalancing', 'TrendFollowing'].includes(searchParams.get("strategy") ?? '') ?
            searchParams.get("strategy") ?? StrategyName[StrategyName.TrendFollowing] :
            localStorage.getItem(params.strategy) ?? StrategyName[StrategyName.TrendFollowing]       


    const investmentParam = searchParams.get("investment") && Number(searchParams.get("investment")) > 0 ?
                            searchParams.get("investment") ?? '1000' :
                            localStorage.getItem(params.investment) ?? '1000'    


    const [fromDate, setFromDate] = useState<Date>(new Date(fromParam)) // 2018-12-15 //'2018-01-01T00:00:00'
    const [toDate, setToDate] = useState<Date>(new Date(toParam))       // new Date())
    const [asset, setAsset] = useState<'BTC' | 'ETH'>(assetParam)
    const [strategy, setStrategy] = useState<string>(strategyParam)
    const [investment, setInvestment] = useState<number>(Number(investmentParam))

    // ROI items
    const [roiInfos, setRoiInfos] = useState<RoiInfo[]|undefined>(undefined)

    const depositToken = DepositToken(chainId)!
    const investTokens = InvestTokens(chainId)

    const investToken = asset === 'BTC' ?  investTokens.find( it => it.symbol === 'WBTC')! :
                        investTokens.find( it => it.symbol === 'WETH')!

    // Run simulator
    const swapsInfos = depositToken && investToken && SimulatorInastance(asset,
         StrategyName[strategy as keyof typeof StrategyName], 
         investment, depositToken, [investToken]
    ).getSwapsInfo(fromDate, toDate)

    const swaps = swapsInfos?.map( (it : PoolTokensSwapsInfo) => it.swaps ).flat()


    const prices = depositToken && investToken &&  SimulatorInastance(
            asset, 
            StrategyName[strategy as keyof typeof StrategyName], 
            investment, 
            depositToken, 
            [investToken]
        ).getPrices(fromDate, toDate)


    useEffect(() => {
        if (swapsInfos && depositToken && investToken && validate(investment, fromDate, toDate) ) {

            const roiInfos = roiDataForSwaps(swapsInfos, depositToken, [investToken], investment)
            setRoiInfos(roiInfos)
        }

	}, [fromDate, toDate, asset, strategy, investment])


    const validate = (amount: number, from: Date, to: Date) => {
        const validAmount = amount > 0
        const validDates = from.getTime() > new Date('2011-01-01T00:00:00').getTime() && from.getTime() < (to.getTime() + 86400 * 1000)

        return validAmount && validDates
    }


    const lastRoi = roiInfos && roiInfos.length > 0 ? roiInfos[roiInfos.length-1] : undefined


    return (
        <Paper className={classes.container}>

                <Box py={4}>
                    <Typography variant='h3' align="center">Strategy Simulator</Typography>
                </Box>


                <Box px={2} >
                    <Box className={classes.header}>
                
                    { strategy === 'MeanReversion' && 
                        <Box style={{ width: 400 }} >
                            <MeanReversionSummary />
                            {/* <MeanReversionDetails /> */}
                        </Box>
                    }

                    { strategy === 'Rebalancing' && 
                        <Box style={{ width: 400 }} >
                            <RebalancingSummary />
                            {/* <RebalancingDetails /> */}
                        </Box>
                    }

                    { strategy === 'TrendFollowing' && 
                        <Box style={{ width: 400 }} >
                            <TrendFollowingSummary />
                            {/* <TrendFollowingDetails /> */}
                        </Box>
                    }

                        <form  noValidate className={classes.form}>

                            <TextField 
                                className={classes.formField}
                                id="strategy-select"
                                value={strategy}
                                label="Strategy"
                                onChange={ (e) => { 
                                    setStrategy( e.target.value as string) 
                                    localStorage.setItem(params.strategy, e.target.value as string)
                                }}
                                select
                            >
                                <MenuItem key={0} value={ StrategyName[StrategyName.Rebalancing]}>Rebalancing</MenuItem>
                                <MenuItem key={1} value={ StrategyName[StrategyName.MeanReversion]}>Mean Reversion</MenuItem>
                                <MenuItem key={2} value={ StrategyName[StrategyName.Momentum]}>Momentum</MenuItem>
                                <MenuItem key={3} value={ StrategyName[StrategyName.TrendFollowing]}>Trend Following</MenuItem>
                            </TextField>


                            <TextField 
                                className={classes.formField}
                                id="asset-select"
                                value={asset}
                                label="Assets Traded"
                                onChange={ (e) => { 
                                    setAsset(e.target.value as 'BTC' | 'ETH') 
                                    localStorage.setItem(params.asset, e.target.value as 'BTC' | 'ETH')
                                }}
                                select
                            >
                                <MenuItem key={0} value={'BTC'}>BTC, USDC</MenuItem>
                                <MenuItem key={1} value={'ETH'}>ETH, USDC</MenuItem>
                            </TextField>

                            <TextField
                                id="investment"
                                label="Initial Investment"
                                type="number"
                                defaultValue={investment}
                                className={classes.formField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{min: 0, style: { textAlign: 'right' }}} 
                                placeholder='USDC'
                                onChange={(e) => {
                                    setInvestment(Number(e.target.value))
                                    localStorage.setItem(params.investment, e.target.value)
                                }}
                            />

                            <br/>
                        
                            <TextField
                                id="dateFrom"
                                label="From"
                                type="date"
                                defaultValue={ moment(fromDate.getTime()).format('yyyy-MM-DD') }
                                className={classes.formField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => { 
                                    if (e.target.value.length > 0) {
                                        const date = Date.parse(e.target.value) > new Date().getTime() ? new Date() : new Date(Date.parse(e.target.value))
                                        setFromDate(date)
                                        localStorage.setItem(params.fromDate, date.toISOString())
                                    }
                
                                }}
                            />

                            <TextField
                                id="dateTo"
                                label="To"
                                type="date"
                                defaultValue={ moment(toDate.getTime()).format('yyyy-MM-DD') }
                                className={classes.formField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => {
                                    console.log("e.target.value", e.target.value)
                                    if (e.target.value.length > 0) {
                                        const date = Date.parse(e.target.value) > new Date().getTime() ? new Date() : new Date(Date.parse(e.target.value))
                                        setToDate(date)
                                        localStorage.setItem(params.toDate, date.toISOString())
                                    }
                                }}
                            />


                        </form>

                    </Box>

                </Box>

                <Box mt={4}>
                    <Box px={1}>
                        <Typography variant='h4'>Performance </Typography>
                    </Box>
                    <Box py={0} className={classes.metrics}>

                        <div className={classes.banner}>
                            <Horizontal valign="center" align="center">
                                <InfoCard 
                                    type="amount"
                                    title="Portfolio Value" value={Math.round(lastRoi?.strategyValue ?? 0)} 
                                    detailTitle="Buy-and-hold" detailValue={Math.round(lastRoi?.buyAndHoldValue ?? 0)} 
                                /> 
                                <InfoCard 
                                    type="percentage"
                                    title="Strategy ROI" value={Math.round(lastRoi?.strategyROI ?? 0)} 
                                    detailTitle="Buy-and-hold" detailValue={Math.round(lastRoi?.buyAndHoldROI ?? 0)} 
                                /> 
                                <InfoCard 
                                    type="percentage"
                                    title="Max Drawdown" value={Math.round(lastRoi?.maxStrategyDrawdownPerc ?? 0)} 
                                    detailTitle="Buy-and-hold" detailValue={Math.round(lastRoi?.maxBuyAndHoldDrawdownPerc ?? 0)} 
                                /> 
                            </Horizontal>
                        </div>
                    </Box>
                </Box>

                { prices && swapsInfos && swapsInfos?.length > 0 &&
                  <Box>
                    <Box px={1}>
                        <Typography variant='h4'>Price Chart</Typography>
                        <Typography variant='body1'>Price chart with trade annotations</Typography>
                    </Box>
                    <PriceChart 
                        symbol={investToken.symbol.substring(1)} 
                        prices={prices} 
                        swaps={swapsInfos}
                    />
                  </Box>
                }

                { roiInfos &&
                    <Box>
                        <Box px={1}>
                            <Typography variant='h4'>Strategy ROI</Typography>
                            <Typography variant='body1'>The returns of the investment determined by the value of the assets held</Typography>
                        </Box>
                        <ROIChart roiInfos={roiInfos} /> 
                    </Box>
                }
                { roiInfos &&
                    <Box>
                        <Box px={1}>
                            <Typography variant='h4'>Strategy Drawdowns</Typography>
                            <Typography variant='body1'>The decline in value of the assets from the past peak</Typography>
                        </Box>
                        <DrawdownChart roiInfos={roiInfos} /> 
                    </Box>
                }
                { roiInfos &&
                    <Box>
                        <Box px={1}>
                            <Typography variant='h4'>Assets</Typography>
                            <Typography variant='body1'>The amount of assets held at any point in time</Typography>
                        </Box>
                        <AssetsChart roiInfos={roiInfos} 
                            asset1={investToken.symbol} 
                            asset2={depositToken.symbol}
                        /> 
                    </Box>
                }
                { roiInfos &&
                    <Box>
                        <Box px={1}>
                            <Typography variant='h4'>Asset Value (%)</Typography>
                            <Typography variant='body1'>The value in USD of the assets held as a percentage of the overall portfolio</Typography>
                        </Box>
                        <AssetAllocationChart roiInfos={roiInfos} 
                            asset1={investToken.symbol} 
                            asset2={depositToken.symbol}
                        />
                    </Box>
                }

                <Box>
                    <Box px={1}>
                        <Typography variant='h4'>Trades</Typography>
                        <Typography variant='body1'>The trades performed by the strategy </Typography>
                    </Box>
                    <Horizontal align='center'>
                        <Box className={classes.trades}>
                            <StraetegyTrades swaps={swaps} depositToken={depositToken} investToken={investToken} />
                        </Box>
                    </Horizontal>
                </Box>


            </Paper>
    )
}
