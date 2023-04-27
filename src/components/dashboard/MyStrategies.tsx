import { Typography, Box, Divider, makeStyles } from "@material-ui/core"
import { utils } from "ethers"
import { Horizontal, Vertical } from "../Layout"

import myAssetsSrc from  "./img/my-assets.svg"
// import btc from  "./img/btc.svg"
// import eth from  "./img/eth.svg"
// import usdc from  "./img/usdc.svg"
import btc from  "./img/btc.png"
import eth from  "./img/eth.png"
import usdc from  "./img/usdc.png"

import { StackedBarChart } from "../shared/StackedBarChart"

interface MyAssetsProps {
    tokens: { balance: string, decimals: number, depositTokenSymbol: string, symbol: string, value: string } []
}

const useStyles = makeStyles( theme => ({
    amount: {
        fontSize: 32, 
        fontWeight: 400,

        [theme.breakpoints.down('xs')]: {
            fontSize: 28, 
        },
    },
    value: {
        fontSize: 16, 
        [theme.breakpoints.down('xs')]: {
            fontSize: 14, 
        },
    }

}))

export const MyAssets = ( { tokens }: MyAssetsProps ) => {

        const classes = useStyles()
        const tokensSorted = tokens.sort( (a, b) => { return Number(b.value) - Number(a.value) } )
        const tokenView = tokensSorted.map( t => {

        const symbolSrc = t.symbol === 'WBTC' ? btc :  t.symbol === 'WETH' ? eth :  t.symbol === 'USDC' ? usdc : ''

        return (
            <Box>
                <Horizontal>
                    <Box>
                        <Vertical>
                             <img style={{ width: 44, height: 44 }}  src={symbolSrc} />
                        </Vertical>
                    </Box>
                    <Box>
                         <Typography className={classes.amount}  align="left" >  {utils.commify(t.balance)}   </Typography>
                         <Typography className={classes.value}   align="left" > {t.symbol} &nbsp; ${utils.commify(t.value)}   </Typography>
                    </Box>
                </Horizontal>
            </Box>
        )
    })

    const chartData = tokensSorted.map( t => {  
        return {
            name: t.symbol,
            value: Number( t.value )
        }
    })

      
    return (
        <Box>
            <Horizontal >
                <img style={{ width: 32, height: 32 }}  src={myAssetsSrc} />
                <Typography  style={{ fontSize: 20, fontWeight: 500}} > My Assets </Typography> 
            </Horizontal> 

            <Divider style={{ marginTop: 10, marginBottom: 30 }} />

            <Horizontal spacing="between" >
                {tokenView}
            </Horizontal> 

            <Box py={3}>
                <StackedBarChart 
                    direction="horizontal"
                    data={chartData} 
                    height={75}
                />
            </Box>
        </Box>
    )
}