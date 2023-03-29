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


export interface DrawdownChartProps {
    roiInfos: RoiInfo[]
    width? : number
    height? : number
}


export const DrawdownChart = ({ roiInfos, width, height } : DrawdownChartProps) => {
    
    const classes = useStyle()
    const [chartData, setChartData] = useState<TimeSeriesData[]|undefined>(undefined)

    useEffect(() => {
        if (roiInfos) {
            const data = roiInfos.map( (data: RoiInfo) => {
                let record : any = {}
                record['time'] = data.date * 1000
                record["Strategy Drawdowns"] = round(data.strategyDrawdownPerc)
                record["Buy-and-hold Drawdowns"] = round(data.buyAndHoldDrawdownPerc)
                return record
            })
            setChartData(data)
        }

	}, [roiInfos])


    return (
        <Box className={classes.chart} >
            <TimeSeriesLineChart 
                title="Strategy Drawdowns vs Benchmark"  
                label1="Strategy Drawdowns"
                label2="Buy-and-hold Drawdowns"
                data={chartData!}  
                yAxisRange={[-100, 0]}
                scale="linear"
                width={width}
                height={height}
            /> 
        </Box>
    )
}
