import { useEffect, useState } from 'react'
import { makeStyles, Box } from  "@material-ui/core"
import { TimeSeriesLineChart, TimeSeriesData } from "../shared/TimeSeriesLineChart"
import { round } from "../../utils/formatter"
import { RoiInfo } from '../../types/RoiInfo'


const useStyle = makeStyles( theme => ({
    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}))


export interface StrategyChartsProps {
    roiInfos: RoiInfo[],
    width? : number
    height? : number
}


export const ROIChart = ({ roiInfos, width, height} : StrategyChartsProps) => {

    const classes = useStyle()
    const [chartData, setChartData] = useState<TimeSeriesData[]|undefined>(undefined)


    useEffect(() => {
        if (roiInfos) {
            const data = roiInfos.map( (data: RoiInfo) => {
                let record : any = {}
                record['time'] = data.date * 1000
                record["Strategy ROI"] = round(data.strategyROI)
                record["Buy-and-hold ROI"] = round(data.buyAndHoldROI)
                return record
            })
            setChartData(data)
        }

	}, [roiInfos])


    return (
        <Box className={classes.chart} >
            <TimeSeriesLineChart 
                title="Strategy ROI vs Benchmark"  
                label1="Strategy ROI"
                label2="Buy-and-hold ROI"
                yAxisRange={['auto', 'auto']}
                data={chartData!}
                scale="linear"
                width={width}
                height={height}
            /> 
        </Box>
    )
}
