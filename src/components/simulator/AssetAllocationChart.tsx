import { useEffect, useState } from 'react'
import { makeStyles, Box } from  "@material-ui/core"
import { TimeSeriesAreaChart, TimeSeriesData } from "../shared/TimeSeriesAreaChart"
import { round } from "../../utils/formatter"
import { RoiInfo } from '../../types/RoiInfo'


const useStyle = makeStyles( theme => ({
    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}))


export interface AssetAllocationChartProps {
    roiInfos: RoiInfo[]
    asset1: string,
    asset2: string
}


export const AssetAllocationChart = ({ asset1, asset2, roiInfos } : AssetAllocationChartProps ) => {

    const classes = useStyle()
    const [chartData, setChartData] = useState<TimeSeriesData[]|undefined>(undefined)
 
    const label1 = `${asset1} %`
    const label2 = `${asset2} %`

    useEffect(() => {

        if (roiInfos) {
            const data = roiInfos.map( (data: RoiInfo) => {
                let record : any = {}
                record['time'] = data.date * 1000
                record[label1] = round(data.investTokenPerc)
                record[label2] = round(data.depositTokenPerc)
                return record
            })
            setChartData(data)
        }

	}, [roiInfos, label1, label2])


    return (
        <Box className={classes.chart} >
            <TimeSeriesAreaChart title="Asset Allocation %" 
                label1={label1} 
                label2={label2} 
                data={chartData!}  
            /> 
        </Box>
             
    )
}
