import { Box, makeStyles, Typography } from "@material-ui/core"
import { TitleValueBox } from "../../TitleValueBox"
import { Token } from "../../../types/Token"
import { fromDecimals, round} from "../../../utils/formatter"
import { BigNumber } from 'ethers'
import { PoolInfo } from "../../../utils/pools"
import { RoiChart } from "./PoolRoiChart"


import { 
    useFeedDecimals,
    useFeedLatestPrice,
    useFeedLatestTimestamp,
} from "../../../hooks"

import { 
    useStrategyName, 
    useStrategyDescription,
    useStrategyMovingAverage,
    useStrategyMovingAveragePeriod,
    useStrategyTargetPricePercUp,
    useStrategyTargetPricePercDown,
    useStrategyTokensToSwapPerc

} from "../../../hooks/useTrendFollowStrategy"


const useStyle = makeStyles( theme => ({
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    }
}))


interface StrategyInfoViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}



export const TrendFollowtrategyInfoView = ( { chainId, poolId, depositToken, investToken } : StrategyInfoViewProps ) => {

    const name = useStrategyName(chainId, poolId)
    const { upkeep } = PoolInfo(chainId, poolId)

    const description = useStrategyDescription(chainId, poolId)
    const latestFeedPrice = useFeedLatestPrice(chainId, poolId)
    const feedDecimals = useFeedDecimals(chainId, poolId)
    const feedLatestTimestamp = useFeedLatestTimestamp(chainId, poolId)

    const movingAverage = useStrategyMovingAverage(chainId, poolId)
    const movingAveragePeriod = useStrategyMovingAveragePeriod(chainId, poolId)
    const tokensToSwapPerc = useStrategyTokensToSwapPerc(chainId, poolId)


    const formattedPriceTimestant = feedLatestTimestamp ? new Date(feedLatestTimestamp * 1000).toLocaleTimeString() : ''
    const formattedPrice = latestFeedPrice ? fromDecimals( BigNumber.from(latestFeedPrice), parseInt(feedDecimals), 2) : ''
    const feedPriceText = `${formattedPrice} ${depositToken.symbol} at ${formattedPriceTimestant}`

    // moving average
    const formattedMovingAverage = movingAverage ? fromDecimals( BigNumber.from(movingAverage), parseInt(feedDecimals), 2) : ''
    const movingAverageText = `${formattedMovingAverage} ${depositToken.symbol}`

    // strategy parameters
    // const deltaPricePerc = round((latestFeedPrice - movingAverage) / movingAverage, 4)
    const deltaPricePerc = formattedPrice && formattedMovingAverage ? round( (Number(formattedPrice) - Number(formattedMovingAverage) ) / Number(formattedMovingAverage), 4 ) : undefined
    const deltaPricePercText = deltaPricePerc ? `${round(deltaPricePerc * 100)}` : ''


    const targetPricePercUp = useStrategyTargetPricePercUp(chainId, poolId)
    const targetPricePercDown = useStrategyTargetPricePercDown(chainId, poolId)
  
    const targetPriceUp = round( parseInt(formattedMovingAverage) *  (1 +  parseInt(targetPricePercUp) / 100) )
    const targetPriceDown = round( parseInt(formattedMovingAverage) *  (1 - parseInt(targetPricePercDown) / 100) )
    
    const buyTargetText = (targetPriceDown) ? `Buy when ${investToken.symbol} ≥  ${targetPriceUp}` : ''
    const sellTargetText = (targetPriceUp) ? `Sell when ${investToken.symbol} < ${targetPriceDown} ` : ''

    const classes = useStyle()

    return (
        <Box className={classes.portfolioInfo} >
            <Box mb={2}>
                <Typography variant="h6" align="center"> {name}</Typography> 
                <Typography variant="body2" align="center"> {description}</Typography> 
            </Box>

            <RoiChart chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken}  />

            <TitleValueBox title={`${investToken.symbol} price`} value={feedPriceText} mode="small"  />
            <TitleValueBox title={`Trend (${movingAveragePeriod}D MA)`} value={movingAverageText} mode="small"  />
            <TitleValueBox title="Deviation From Trend" value={deltaPricePercText} mode="small"  suffix="%" />
            <TitleValueBox title="Buy Trigger" value={`${buyTargetText}`} mode="small"  />
            <TitleValueBox title="Sell Trigger" value={`${sellTargetText}`} mode="small" />
            <TitleValueBox title="Trade Size" value={`${tokensToSwapPerc}`} mode="small"  suffix="%" />

            <TitleValueBox title="Chainlink Automation" value="Upkeep Page" url={upkeep} mode="small" />
        </Box>
    )
}
