import { utils } from "ethers"
import { Box, Typography, makeStyles } from "@material-ui/core"
import { BigNumber } from "ethers"
import { usePoolModel } from "./PoolModel"
import { TitleValueBox } from "../../TitleValueBox"
import { Token } from "../../../types/Token"
import { fromDecimals, round } from "../../../utils/formatter"
import { useSwapInfoArray } from "../../../hooks"
import { TimeSeriesAreaChart } from "../../shared/TimeSeriesAreaChart"
import { PoolInfo } from "../../../utils/pools"
import { VPieChart } from "../../shared/VPieChart"

import { Horizontal } from "../../Layout"

import { useTotalDeposited, useTotalWithdrawn, useFeedLatestPrice, useFeedLatestTimestamp  } from "../../../hooks"



const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        // padding: 0,
        paddingBottom: theme.spacing(2),
    },
    poolInfo: {
        paddingTop: 20,
        minWidth: 340,
        margin: "auto",
        marginTop: 0,
        padding: theme.spacing(1)
    },
    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    }
}))


interface PoolStatsViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}



export const PoolStatsView = ( { chainId, poolId, depositToken, investToken } : PoolStatsViewProps ) => {

    const classes = useStyle()

    const { name, description } = PoolInfo(chainId, poolId)
    const tokens =  [depositToken, investToken]
    const { poolInfo, portfolioInfo, chartData : assetAllocationChartData } = usePoolModel(chainId, poolId, tokens, depositToken)

    const totalDeposited = useTotalDeposited(chainId, poolId)
    const totalWithdrawn = useTotalWithdrawn(chainId, poolId)
    const price = useFeedLatestPrice(chainId, poolId)
    const latestTimestamp = useFeedLatestTimestamp(chainId, poolId)

    const formattedPortfolioValue = portfolioInfo.totalValue ? fromDecimals(portfolioInfo.totalValue, depositToken.decimals, 2) : ""
    const formattedDeposited = (totalDeposited) ? fromDecimals(totalDeposited, depositToken.decimals, 2) : ""
    const formatteWithdrawn = (totalWithdrawn) ? fromDecimals(totalWithdrawn, depositToken.decimals, 2) : ""

    const swaps = useSwapInfoArray(chainId, poolId)
    const label1 = `${depositToken.symbol} Value %`
    const label2 = `${investToken.symbol} Value %`
  

    const assetViews = poolInfo.tokenInfoArray.map( token => {
        const balance = token.balance ?? BigNumber.from(0)
        const value = token.value ?? BigNumber.from(0)
        const decimals = token.decimals //    tokens.find( t => t.symbol === symbol)?.decimals ?? 2
        const accountBalanceFormatted = fromDecimals(balance, decimals, 4 ) as any
        const accountValueFormatted = fromDecimals(value, depositToken.decimals, 2 ) as any
        const valueFormatted = `${accountBalanceFormatted} (${accountValueFormatted} ${ depositToken.symbol }) `

        return { symbol: token.symbol, valueFormatted, balance, value }
    }).map( it => <TitleValueBox key={it.symbol} title={it.symbol} value={it.valueFormatted} /> )


    /// move contruction of 'assetValuePercChartData' to until function
    const swapsData = swaps?.map( (data: any) => {
        const price = parseFloat(fromDecimals(data.feedPrice, 8, 2))
        const asset1 = parseFloat(fromDecimals(data.depositTokenBalance, depositToken.decimals, 2))
        const asset2 = parseFloat(fromDecimals(data.investTokenBalance, investToken.decimals, 6))

        let record : any = {}
        record['time'] = data.timestamp * 1000
        record[label1] = round( 100 * asset1 / (asset1 + asset2 * price ))          // stable asset % 
        record[label2] = round( 100 * asset2 * price / (asset1 + asset2 * price ))  // risk asset % 
        return record
    })

    //TODO use balance of assets in the pool rather than values from the last trade
    const priceTimestamp = latestTimestamp && BigNumber.from(latestTimestamp).toNumber()
    const priceFormatted = price ? parseFloat(fromDecimals(BigNumber.from(price), 8, 2)) : 0


    const asset1 = swaps && swaps.length > 0 ? parseFloat(fromDecimals( BigNumber.from(swaps[swaps.length-1].depositTokenBalance), depositToken.decimals, 2)) : undefined
    const asset2 = swaps && swaps.length > 0 ? parseFloat(fromDecimals( BigNumber.from(swaps[swaps.length-1].investTokenBalance), investToken.decimals, 6)) : undefined

    let last : any = {}
    if (asset1 !== undefined && asset2 !== undefined && price !== undefined && priceTimestamp !== undefined) {
        last['time'] = priceTimestamp * 1000
        last[label1] = round( 100 * asset1 / (asset1 + asset2 * priceFormatted ))
        last[label2] = round( 100 * asset2 * priceFormatted / (asset1 + asset2 * priceFormatted ))
    }

    const assetValuePercChartData = swapsData && last ? [...swapsData, last] : []


    return (
        <Box className={classes.container}>
            <Box mb={2}>
                <Typography variant="h6" align="center"> {name}</Typography> 
                <Typography variant="body2" align="center"> {description}</Typography> 
            </Box>

            <Box mb={4}>
                <Typography variant="h4" align="center"> ${utils.commify(formattedPortfolioValue)} </Typography>
                <Typography variant="body2" align="center"> Value of all assets in the Pool</Typography>
            </Box>

            <Horizontal align="center" valign="top" >
                <VPieChart { ...assetAllocationChartData } /> 
                <Box className={classes.poolInfo} >
                    <Typography variant="h6" align="center">Pool Info</Typography>

                    { assetViews }
                    <TitleValueBox title="Total Deposited" value={formattedDeposited} suffix={depositToken.symbol} />
                    <TitleValueBox title="Total Withdrawn" value={formatteWithdrawn} suffix={depositToken.symbol}/>
                </Box>
            </Horizontal>
           

            <Typography align="center" variant="h6" style={{marginTop: 20}}>
                Assets Value Percentages
            </Typography>

            <TimeSeriesAreaChart title="Asset Value %" 
                label1={label1} 
                label2={label2} 
                data={assetValuePercChartData}  
            /> 
        </Box>
    )
}
