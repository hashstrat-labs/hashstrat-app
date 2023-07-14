import { Typography, Box, Divider, CircularProgress, makeStyles } from "@material-ui/core"
import { utils } from "ethers"
import { Horizontal, Vertical } from "../Layout"

import myAssetsSrc from  "./img/my-assets.svg"

import btc from  "./img/btc.svg"
import eth from  "./img/eth.svg"
import usdc from  "./img/usdc.svg"

import { StackedBarChart } from "../shared/StackedBarChart"

interface MyAssetsProps {
    tokens : { balance: string, decimals: number, depositTokenSymbol: string, symbol: string, value: string } []
    title? : string | undefined,
    description? : string | undefined,
    showNoFundsMesssage?: boolean
    height?: number
}

const useStyles = makeStyles( theme => ({
    container: {
        backgroundColor: theme.palette.type === 'light' ? '#fff' :'#000',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 8,
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 10,
            paddingRight: 10,
        },
    },
    amount: {
        fontSize: 32, 
        fontWeight: 400,

        [theme.breakpoints.down('sm')]: {
            fontSize: 28, 
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 26, 
        },
    },
    value: {
        fontSize: 16, 
        [theme.breakpoints.down('sm')]: {
            fontSize: 14, 
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: 12, 
        },
    }

}))

export const MyAssets = ( { tokens, title, description, showNoFundsMesssage = true, height = 75}: MyAssetsProps ) => {

    const classes = useStyles()
    const tokensSorted = tokens.sort( (a, b) => { return Number(b.value) - Number(a.value) } )
    
    const tokenView = tokensSorted.filter(t => Number(t.balance) > 0).map( (t, idx) => {
        const symbolSrc = t.symbol === 'WBTC' ? btc :  t.symbol === 'WETH' ? eth :  t.symbol === 'USDC' ? usdc : ''
        return (
            <Box key={idx}>
                <Horizontal>
                    <Box>
                        <Vertical>
                            <img style={{ width: 44, height: 44 }}  src={symbolSrc} />
                        </Vertical>
                    </Box>
                    <Box>
                        <Typography className={classes.amount} align="left" > {utils.commify(t.balance)}   </Typography>
                        <Typography className={classes.value} align="left" > {t.symbol} &nbsp; ${utils.commify(t.value)}   </Typography>
                    </Box>
                </Horizontal>
            </Box>
        )
    })

    const haveFunds = tokensSorted.filter(t => Number(t.balance) > 0).length > 0

    const chartData = tokensSorted.map( t => {  
        return {
            name: t.symbol,
            value: Number( t.value )
        }
    })

    
    return (
        <Box className={classes.container}>
            { title && 
                <Box>
                    <Horizontal>
                        <img style={{ width: 32, height: 32 }}  src={myAssetsSrc} />
                        <Typography  style={{ fontSize: 20, fontWeight: 500}}> {title} </Typography> 
                    </Horizontal> 
                    <Divider style={{ marginTop: 10, marginBottom: 30 }} />
                </Box>
            }

            { description && 
                <Box pb={2}>
                    <Typography> {description}</Typography>
                </Box>
            }
           
            
            <Horizontal spacing="between">
                {tokenView}
            </Horizontal> 

            <Box py={3}>
                { !haveFunds && showNoFundsMesssage &&
                    <Box px={2}>
                        <Typography style={{fontSize: 18}}>
                            You have no assets in your portfolio. <br/>
                            Deposit some funds to create your portfolio.
                        </Typography>
                    </Box>
                }
                { haveFunds &&
                    <StackedBarChart 
                        direction="horizontal"
                        data={chartData} 
                        height={height}
                    />
                }
            </Box>
        </Box>
    )
}