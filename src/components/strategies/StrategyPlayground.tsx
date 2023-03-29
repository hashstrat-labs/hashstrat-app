import { useEffect, useState } from 'react'
import moment from 'moment'
import { makeStyles, Box, Paper, Tab, Typography } from  "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

import { SimulatorInastance, StrategyName } from "../../services/simulator/SimulatorService"
import { DepositToken, InvestTokens } from "../../utils/pools"
import { roiDataForSwaps  } from "../../utils/calculators/roiCalculator"
import { RoiInfo } from '../../types/RoiInfo'
import { Horizontal } from '../Layout'
import { InfoCard } from '../simulator/InfoCard'
import { ROIChart } from "../simulator/ROIChart"
import { DrawdownChart } from '../simulator/DrawdownChart'


const useStyle = makeStyles( theme => ({
 
    container: {
        marginTop: 2,
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%',
        margin: "auto",
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 0,
            paddingRight: 0,
		},
    },

    tabs: {
        margin: 0,
        padding: 0,
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 0,
            marginRight: 0,
		},
    },

    infoTab: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        flexFlow: "row wrap",
        alignItems: "center",
        gap: theme.spacing(4),
        [theme.breakpoints.down('xs')]: {
            width: "100%",
            gap: theme.spacing(0),
            marginTop: 20,
            marginLeft: 0,
            marginRight: 0,
		},
    },

    dateField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
        [theme.breakpoints.down('xs')]: {
            width: 115,
		},
    },
    formField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 120,
        [theme.breakpoints.down('xs')]: {
            width: 90,
		},
    },
    infoCard: {
        paddingTop: 40,
        marginRight: 30,
        [theme.breakpoints.down('xs')]: {
            paddingTop: 0,
            marginRight: 0,
		},
    },
    chart: {
        minWidth: 600,
        [theme.breakpoints.down('xs')]: {
            minWidth: "100%",
		},
    },

}))


export interface StrategyPlaygroundProps {
    chainId: number,
    strategy: string,
    from: string,
    to: string,
    symbol: 'BTC' | 'ETH' ,
    chartHeight: number,
    // chartWidth: number,
    deposit?: number,
}


export const StrategyPlayground = ({ chainId, strategy, from, to, symbol, chartHeight = 240, deposit } : StrategyPlaygroundProps) => {

    const classes = useStyle()

    const fromParam =  moment(from, 'YYYY-MM-DD').isValid() ?
            moment(from).toDate().toISOString() :
            '2019-01-07T00:00:00'

    const toParam =  moment(to, 'YYYY-MM-DD').isValid() ?
            moment(to).toDate().toISOString() :
            new Date().toISOString()
           
    const [fromDate, setFromDate] = useState<Date>(new Date(fromParam)) 
    const [toDate, setToDate] = useState<Date>(new Date(toParam))     
    const [asset, setAsset] = useState<'BTC' | 'ETH'>(symbol)
    const [investment, setInvestment] = useState<number>( deposit ?? 100 )

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


    useEffect(() => {
        if (swapsInfos && depositToken && investToken && validate(investment, fromDate, toDate) ) {
            const roiInfos = roiDataForSwaps(swapsInfos, depositToken, [investToken], investment)
            setRoiInfos(roiInfos)
        }

	}, [fromDate, toDate, asset, strategy, investment])


    const validate = (amount: number, from: Date, to: Date) => {
        const validAmount = amount > 0
        const validDates = from.getTime() > new Date('2009-01-01T00:00:00').getTime() &&
            from.getTime() < (to.getTime() + 86400 * 1000)

        return validAmount && validDates
    }


    const lastRoi = roiInfos && roiInfos.length > 0 ? roiInfos[roiInfos.length-1] : undefined

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    return (
        <Box>
            <Box py={1}>
             <Typography  variant='h6'>Strategy performance </Typography>
            </Box>

            <Paper variant='outlined'>
                <Box className={classes.container} >
                    <TabContext value={selectedTokenIndex.toString()}>
                        <TabList onChange={handleChange} >
                            <Tab label="ROI" value="0" key={0} />
                            <Tab label="Drawdowns" value="1" key={1}  />
                        </TabList>

                        <TabPanel value="0" key={0} className={classes.tabs} >
                            <Box py={0} >
                                { roiInfos &&
                                    <Box className={classes.infoTab}>
                                        <Horizontal align="center" valign='top'>
                                            <Box className={classes.infoCard}>
                                                <InfoCard 
                                                    type="percentage"
                                                    title="Strategy ROI" value={ Math.round(lastRoi?.strategyROI ?? 0) } 
                                                    detailTitle="Buy-and-hold" detailValue={ Math.round(lastRoi?.buyAndHoldROI ?? 0) } 
                                                /> 
                                            </Box>

                                            <Box className={classes.chart} >
                                                <ROIChart roiInfos={roiInfos} height={chartHeight} /> 
                                            </Box>
                                        </Horizontal>
                                    </Box>
                                }

                            </Box>
                        </TabPanel>

                        <TabPanel value="1" key={1} className={classes.tabs} >
                            <Box py={0} >
                                { roiInfos &&
                                    <Box className={classes.infoTab}>
                                        <Horizontal align="center" valign='top'>
                                            <Box className={classes.infoCard}>
                                                <InfoCard 
                                                    type="percentage"
                                                    title="Max Drawdown" value={ Math.round(lastRoi?.maxStrategyDrawdownPerc ?? 0) } 
                                                    detailTitle="Buy-and-hold" detailValue={ Math.round(lastRoi?.maxBuyAndHoldDrawdownPerc ?? 0) } 
                                                /> 
                                            </Box>
                                            <Box className={classes.chart}>
                                                <DrawdownChart roiInfos={roiInfos} height={chartHeight} /> 
                                            </Box>
                                        </Horizontal>
                                    </Box>
                                }
                            </Box>
                        </TabPanel>

                    </TabContext>
                    
                    <Box pb={1}>
                        <Typography  variant='body2'><i>* Simulated performance from {from} to {to}</i></Typography>
                    </Box>
                
                    {/*
                    <Box pb={3}>
                        
                        <Horizontal align='center'>
                            <Box>
                            { deposit &&
                                <TextField
                                    id="investment"
                                    label="Investment"
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
                                    }}
                                />
                            }

                            <TextField
                                className={classes.formField}
                                    value={asset}
                                    onChange={ (e) => { 
                                        setAsset(e.target.value as 'BTC' | 'ETH') 
                                    }}
                                    select // tell TextField to render select
                                    label="Assets"
                            >
                                <MenuItem key={0} value={'BTC'}>BTC</MenuItem>
                                <MenuItem key={1} value={'ETH'}>ETH</MenuItem>
                            </TextField>


                            <TextField
                                id="dateFrom"
                                label="From"
                                type="date"
                                defaultValue={ moment(fromDate.getTime()).format('yyyy-MM-DD') }
                                className={classes.dateField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => { 
                                    console.log("e.target.value", e.target.value)
                                    if (e.target.value.length > 0) {
                                        const date = Date.parse(e.target.value) > new Date().getTime() ? new Date() : new Date(Date.parse(e.target.value))
                                        setFromDate(date)
                                    }
                
                                }}
                            />

                            <TextField
                                id="dateTo"
                                label="To"
                                type="date"
                                defaultValue={ moment(toDate.getTime()).format('yyyy-MM-DD') }
                                className={classes.dateField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => {
                                    console.log("e.target.value", e.target.value)
                                    if (e.target.value.length > 0) {
                                        const date = Date.parse(e.target.value) > new Date().getTime() ? new Date() : new Date(Date.parse(e.target.value))
                                        setToDate(date)
                                    }
                                }}
                            />

                            </Box>
                        </Horizontal>
                    </Box>
                    */}


                </Box>
            </Paper>

        </Box>
    )
}
