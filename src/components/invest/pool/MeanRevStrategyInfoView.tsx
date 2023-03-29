import { utils } from "ethers"
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
    useStrategyTokensToSwapPerc,
    useStrategyMinAllocationPerc

} from "../../../hooks/useMeanRevStrategy"


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



export const MeanRevStrategyInfoView = ( { chainId, poolId, depositToken, investToken } : StrategyInfoViewProps ) => {

    const name = useStrategyName(chainId, poolId)
    const { upkeep } = PoolInfo(chainId, poolId)

    const description = useStrategyDescription(chainId, poolId)
    const latestFeedPrice = useFeedLatestPrice(chainId, poolId)
    const feedDecimals = useFeedDecimals(chainId, poolId)
    const feedLatestTimestamp = useFeedLatestTimestamp(chainId, poolId)

    const movingAverage = useStrategyMovingAverage(chainId, poolId)
    const movingAveragePeriod = useStrategyMovingAveragePeriod(chainId, poolId)
    const tokensToSwapPerc = useStrategyTokensToSwapPerc(chainId, poolId)

    const formattedPriceTimestant = feedLatestTimestamp !== undefined && new Date(feedLatestTimestamp * 1000).toLocaleTimeString()
    const formattedPrice = latestFeedPrice ? fromDecimals(BigNumber.from(latestFeedPrice), parseInt(feedDecimals), 2) : undefined
    
    const feedPriceText = formattedPrice ? `${formattedPrice} ${depositToken.symbol} at ${formattedPriceTimestant}` : ''

    // moving average
    const formattedMovingAverage = movingAverage ? fromDecimals( BigNumber.from(movingAverage), parseInt(feedDecimals), 2) : undefined
    const movingAverageText = formattedMovingAverage ? `$${ utils.commify( formattedMovingAverage )}` : ''

    // strategy parameters
    const deltaPricePerc = formattedPrice && formattedMovingAverage ? round( (Number(formattedPrice) - Number(formattedMovingAverage) ) / Number(formattedMovingAverage), 4 ) : undefined
    const targetPricePercUp = useStrategyTargetPricePercUp(chainId, poolId)
    const targetPricePercDown = useStrategyTargetPricePercDown(chainId, poolId)
    const minAllocationPerc = useStrategyMinAllocationPerc(chainId, poolId)

    const deltaPricePercText = deltaPricePerc ? `${round(deltaPricePerc * 100)}` : ''

    const targetPriceUp = formattedMovingAverage && targetPricePercUp ? round( parseInt(formattedMovingAverage) *  (1 +  parseInt(targetPricePercUp) / 100) ) : ''
    const targetPriceDown = formattedMovingAverage && targetPricePercDown ? round( parseInt(formattedMovingAverage) *  (1 - parseInt(targetPricePercDown) / 100) ) : ''
    const buyTargetText = (targetPriceDown) ? `Buy when ${investToken.symbol} ≤ ${targetPriceDown}` : ''
    const sellTargetText = (targetPriceUp) ? `Sell when ${investToken.symbol} ≥ ${targetPriceUp} ` : ''

    const targetPricePercUpText = targetPricePercUp ? targetPricePercUp : ''
    const targetPricePercDownText = targetPricePercDown ? `-${targetPricePercDown}` : ''

    const classes = useStyle()

    return (
        <Box className={classes.portfolioInfo} >

            <Box mb={2}>
                <Typography variant="h6" align="center"> {name}</Typography> 
                <Typography variant="body2" align="center"> {description}</Typography> 
            </Box>

            <RoiChart chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken}  />

            <TitleValueBox title={`Trend (${movingAveragePeriod}D MA)`} value={movingAverageText} mode="small"  />
            <TitleValueBox title="Deviation From Trend" value={deltaPricePercText} mode="small"  suffix="%" />
            <TitleValueBox title="Upper Target Price %" value={targetPricePercUpText} mode="small"  suffix="%" />
            <TitleValueBox title="Lower Target Price %" value={targetPricePercDownText} mode="small"  suffix="%" />
            <TitleValueBox title="Trade Size" value={`${tokensToSwapPerc}`} mode="small"  suffix="%" />
            <TitleValueBox title="Min allocation" value={`${minAllocationPerc}`} mode="small"  suffix="%" />
            
            <TitleValueBox title="Accumulation Target" value={`${buyTargetText}`} mode="small"  />
            <TitleValueBox title="De-risk Target" value={`${sellTargetText}`} mode="small"  />
            <TitleValueBox title={`${investToken.symbol} price`} value={feedPriceText} mode="small"  />

            <TitleValueBox title="Chainlink Automation" value="Upkeep Page" url={upkeep} mode="small" />
        </Box>
    )
}
