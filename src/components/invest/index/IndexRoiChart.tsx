import { useEffect, useState } from 'react'

import { Box, makeStyles } from "@material-ui/core"
import { Token } from "../../../types/Token"
import { usePoolSwapsInfoForIndex } from "../../../hooks/useIndex"

import { roiDataForSwaps as indexRoiDataForSwaps } from "../../../utils/calculators/roiCalculator"

import { round } from "../../../utils/formatter"
import { TimeSeriesLineChart, TimeSeriesData } from "../../shared/TimeSeriesLineChart"
import { PoolTokensSwapsInfo } from "../../../types/PoolTokensSwapsInfo"
import { InvestTokens } from "../../../utils/pools"

import { RoiInfo } from '../../../types/RoiInfo'


const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0,
    },
    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    }
}))


interface IndexRoiChartProps {
    chainId: number,
    indexId: string,
    depositToken: Token,
}


export const IndexRoiChart = ( { chainId, indexId, depositToken } : IndexRoiChartProps ) => {

    const [chartData, setChartData] = useState<TimeSeriesData[]|undefined>(undefined)

    const classes = useStyle()
    const swaps = usePoolSwapsInfoForIndex(chainId, indexId)
    const investTokens = InvestTokens(chainId)

    const label1 = `Index ROI`
    const label2 = `Buy & Hold ROI`

    useEffect(() => {
        if (swaps && swaps.length > 0 && !chartData ) {
            const roi = indexRoiDataForSwaps(swaps as PoolTokensSwapsInfo[], depositToken, investTokens)
            const data = roi.map( (data: RoiInfo) => {
                let record : any = {}
                record['time'] = data.date * 1000
                record[label1] = round(data.strategyROI)
                record[label2] = round(data.buyAndHoldROI)
                return record
            })
            setChartData(data)
        }
	}, [swaps])


    return (
        <Box className={classes.container}>

            <Box className={classes.chart} >
                {
                    chartData && 
                    <TimeSeriesLineChart title="Index ROI vs Benchmark" 
                        label1={label1} 
                        label2={label2}
                        yAxisRange={['auto', 'auto']}
                        scale="linear"
                        data={chartData}  
                    /> 
                }
  
            </Box>

        </Box>
    )

}
