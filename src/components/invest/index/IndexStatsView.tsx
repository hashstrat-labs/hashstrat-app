import { utils } from "ethers"
import { makeStyles, Box, Typography } from  "@material-ui/core"
import { TitleValueBox } from "../../TitleValueBox"
import { Token } from  "../../../types/Token"
import { useIndexModel, PoolSummary } from "./IndexModel"
import { fromDecimals } from "../../../utils/formatter"
import { BigNumber } from "ethers"
import { PoolInfo, InvestTokens } from "../../../utils/pools"
import { VPieChart } from "../../shared/VPieChart"
import { Horizontal } from "../../Layout"
import { IndexInfoView } from "./IndexInfoView"


const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0,
        paddingBottom: 30
    },
    portfolioInfo: {
        // maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    },
    chart: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(4)
    }
}))


interface IndexStatsViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    account?: string
}




export const IndexStatsView = ( { chainId, poolId, depositToken, account } : IndexStatsViewProps ) => {

    const classes = useStyle()

    const { name, description } = PoolInfo(chainId, poolId)
 
    const tokens = [depositToken, ...InvestTokens(chainId)]
    const { indexInfo, poolsInfo, portfolioInfo, chartValueByAsset, chartValueByPool } = useIndexModel(chainId, poolId, tokens, depositToken)
  
    const formattedPortfolioValue = portfolioInfo.totalValue ? fromDecimals(portfolioInfo.totalValue, depositToken.decimals, 2) : ""

    const assetViews = indexInfo.tokenInfoArray.map( token => {
        const balance = token.balance ?? BigNumber.from(0)
        const value = token.value ?? BigNumber.from(0)
        const decimals = token.decimals //    tokens.find( t => t.symbol === symbol)?.decimals ?? 2
        const accountBalanceFormatted = fromDecimals(balance, decimals, 4 ) as any
        const accountValueFormatted = fromDecimals(value, depositToken.decimals, 2 ) as any
        const valueFormatted = `${ utils.commify(accountBalanceFormatted)} ($ ${utils.commify(accountValueFormatted)}) `

        return { symbol: token.symbol, valueFormatted, balance, value }
    }).map( it => <TitleValueBox mode="small" key={it.symbol} title={it.symbol} value={it.valueFormatted} /> )


    const totalWeights = poolsInfo?.reduce( (acc, val ) => {
        return acc + val.weight
    }, 0)
    const poolsInIndex = poolsInfo?.map( ( pool : PoolSummary) => {
        const valueFormatted = pool.value ? fromDecimals(pool.value, depositToken.decimals, 2) : ''
        return <TitleValueBox mode="small" key={pool.poolId} 
                    title={`${pool.weight}/${totalWeights } ${pool.name}`}
                    value={`$ ${ utils.commify(valueFormatted) }`}  
                    url={`/pools/${pool.poolId}`}
                    linkMode="title"
                />
    })

    

    return (
        <Box className={classes.container}>

            <Box mb={2}>
                <Typography variant="h6" align="center"> {name} </Typography> 
                <Typography variant="body2" align="center"> {description} </Typography> 
            </Box>

            <Box mb={4}>
                <Typography variant="h4" align="center"> ${utils.commify(formattedPortfolioValue)} </Typography>
                <Typography variant="body2" align="center"> Value of all assets in the Index</Typography>
            </Box>

            <Horizontal align="center">
                { chartValueByAsset.data.length > 0 &&  <VPieChart { ...chartValueByAsset } />  }
                { chartValueByPool.data.length > 0 &&  <VPieChart { ...chartValueByPool } />  }

                <Box className={classes.portfolioInfo} >
                    <Typography>Index composition by Asset</Typography>
                    { assetViews }
                </Box>

                <Box className={classes.portfolioInfo} >
                    <Typography>Index composition by Pool</Typography>
                    { poolsInIndex }
                </Box>

            </Horizontal>

            <Box p={0}>
                <IndexInfoView chainId={chainId} poolId={poolId} depositToken={depositToken} />
            </Box>

        </Box>
       
    )
}
