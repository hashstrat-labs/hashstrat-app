

import { makeStyles, Box, Typography, Divider } from "@material-ui/core"
import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { PoolInfo } from "../../utils/pools"

import { useDashboardModel } from "./DashboadModel"
import { TreeChart } from "../shared/TreeChart"
import { Horizontal } from "../Layout"

import strategiesSrc from  "./img/strategies.svg"

interface PortfolioMapProps {
    chainId: number,
    account?: string,
    depositToken: Token,
    investTokens: Array<Token>,
}


const useStyles = makeStyles( theme => ({
    container: {
        backgroundColor: theme.palette.type === 'light' ? '#fff' :'#000',
        paddingTop: 20,
        paddingBottom: 20,

        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 8,
        [theme.breakpoints.down('xs')]: {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
        },
    },

    strategyMap: {
        marginBottom: 20,

        [theme.breakpoints.down('xs')]: {
            marginLeft: 10,
            marginRight: 10,
        },
    },

}))


export const PortfolioMap = ({ chainId, depositToken, investTokens, account } : PortfolioMapProps ) => {
    
    const classes = useStyles()
    const tokens = [depositToken, ...investTokens]
    const { poolsInfo, indexesInfo, portfolioInfo, didLoad } = useDashboardModel(chainId, tokens, depositToken)


    const poolsWithFunds = [...indexesInfo, ...poolsInfo]
        .filter( pool => pool.totalValue && pool.totalValue.isZero() === false )
        .sort ( (a, b) => { return b.totalValue!.sub(a.totalValue!).toNumber() } )

   
    const portfolioMap = poolsWithFunds
        .filter( it => {
            const info = PoolInfo(chainId, it.poolId)
            return info.disabled === 'false'
        }).map ( it => {
            const info = PoolInfo(chainId, it.poolId)
        return {
            name: info.name,
            data: it.tokenInfoArray
                .filter ( t => t.value )
                .map ( t => {
                return {
                    x: t.symbol,
                    y: Number(fromDecimals( t.value! , depositToken.decimals, 2)),
                }
            })
        }
    })
    

    return (
        <Box className={classes.container}>

            <Horizontal>
                <img style={{ width: 32, height: 32 }}  src={strategiesSrc} />
                <Typography  style={{ fontSize: 20, fontWeight: 500}}> HashStrat Strategies </Typography> 
            </Horizontal> 

            <Divider style={{ marginTop: 10, marginBottom: 30 }} />


            {  didLoad && (poolsWithFunds && poolsWithFunds.length > 0) &&
                <Box className={ classes.strategyMap }>
                    <Typography> Map showing how managed assets are allocated to HashStrat strategies </Typography> 
                    <TreeChart 
                        title=""
                        height={ Math.min( Math.round(window.innerWidth/2), 420) }
                        data={portfolioMap}
                    />
                </Box>
            }
         
        </Box>
    )

}




