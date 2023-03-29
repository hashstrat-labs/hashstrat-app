import { useEffect, useState } from 'react'

import { BigNumber } from 'ethers'
import { Box, makeStyles } from "@material-ui/core"
import { Token } from "../../../types/Token"
import { useSwapInfoArray } from "../../../hooks/usePool"
import { useFeedLatestPrice, useFeedLatestTimestamp } from "../../../hooks/useFeed"
import { roiDataForSwaps } from "../../../utils/calculators/roiCalculator"
import { round } from "../../../utils/formatter"
import { TimeSeriesLineChart, TimeSeriesData } from "../../shared/TimeSeriesLineChart"
import { RoiInfo } from '../../../types/RoiInfo'
import { PoolTokensSwapsInfo } from "../../../types/PoolTokensSwapsInfo"


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


interface RoiChartProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}


export const RoiChart = ( { chainId, poolId, depositToken, investToken } : RoiChartProps ) => {

    const [chartData, setChartData] = useState<TimeSeriesData[]|undefined>(undefined)

    const classes = useStyle()

    const swaps = useSwapInfoArray(chainId, poolId)
    const price = useFeedLatestPrice(chainId, poolId)
    const latestTimestamp = useFeedLatestTimestamp(chainId, poolId)
    const priceTimestamp = latestTimestamp && BigNumber.from(latestTimestamp).toNumber()
    
    const label1 = `Strategy ROI`
    const label2 = `Buy & Hold ROI`


    useEffect(() => {
        if (swaps && price && priceTimestamp && !chartData ) {

            const poolSwapsInfo : PoolTokensSwapsInfo[] = [
                {
                    poolId: poolId,
                    weight: 1,
                    priceInfo: {
                        symbol: investToken.symbol,
                        price: BigNumber.from(price),
                        timestamp: priceTimestamp,
                    },
                    priceInfoStart: swaps.length > 0 ? {
                        symbol: investToken.symbol,
                        price: BigNumber.from(swaps[0].feedPrice),
                        timestamp: Number(swaps[0].timestamp),
                    } : undefined,
                    swaps: swaps
                }
            ]


            const roi = roiDataForSwaps(poolSwapsInfo, depositToken, [investToken])
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
                <TimeSeriesLineChart 
                    title="Strategy ROI vs Benchmark" 
                    label1={label1} 
                    label2={label2}
                    yAxisRange={['auto', 'auto']}
                    scale="linear"
                    data={chartData!}  
                /> 
            </Box>
        </Box>
    )
}
