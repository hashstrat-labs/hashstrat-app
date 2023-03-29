import { useEffect, useState } from 'react'
import { makeStyles, Box } from  "@material-ui/core"
import { TimeSeriesDualLineChart, TimeSeriesData } from "../shared/TimeSeriesDuealLineChart"
import { round } from "../../utils/formatter"
import { RoiInfo } from '../../types/RoiInfo'


const useStyle = makeStyles( theme => ({
    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}))


export interface AssetsChartProps {
    roiInfos: RoiInfo[],
    asset1: string,
    asset2: string,
    width? : number
    height? : number
}


export const AssetsChart = ({ roiInfos, width, height, asset1, asset2} : AssetsChartProps) => {

    const classes = useStyle()
    const [chartData, setChartData] = useState<TimeSeriesData[]|undefined>(undefined)


    useEffect(() => {
        if (roiInfos) {
            const data = roiInfos.map( (data: RoiInfo) => {
                let record : any = {}
                record['time'] = data.date * 1000
                record[asset1] = round(data.investTokenAmount, 6)
                record[asset2] = round(data.depositTokenAmount)
                return record
            })
            setChartData(data)
        }

	}, [roiInfos])


    return (
        <Box className={classes.chart} >
            <TimeSeriesDualLineChart 
                title={`${asset1} & ${asset2} `}
                label1={asset1}
                label2={asset2}
                yAxisRange={['auto', 'auto']}
                data={chartData!}
                scale="linear"
                width={width}
                height={height}
            /> 
        </Box>
    )
}
