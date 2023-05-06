import { useState } from "react";

import { makeStyles, Box, Link, Typography, FormControl, InputLabel, Select, MenuItem, Button, Popover, Paper } from "@material-ui/core"
import { Token } from "../../types/Token"
import { Link as RouterLink } from "react-router-dom"
import { Horizontal } from "../Layout"
import { Info } from "@material-ui/icons"

import poolsInfo from "../../config/pools.json"
import indexesInfo from "../../config/indexes.json"
import networksConfig from "../../config/networks.json"

import { usePoolsInfo, useIndexesInfo, PoolData } from "../dashboard/DashboadModel"

import { PoolIds } from "../../utils/pools";
import { PoolSummary } from "../shared/PoolSummary"
import { InvestTokens, PoolInfo } from "../../utils/pools"
import { IndexesIds } from "../../utils/pools";


interface PoolExplorerProps {
    chainId: number,
    account?: string,
    depositToken: Token
}


const useStyles = makeStyles( theme => ({
    container: {
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.up('xs')]: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
    },

}))


const allStrategies = (chainId: number) : string[]=> {

    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const indexes = indexesInfo[networkName as keyof typeof indexesInfo]
    const pools = poolsInfo[networkName as keyof typeof poolsInfo]
    // const enabled = [...indexes, ...pools].filter( (pool: {disabled: string}) => { return (pool.disabled === 'false')} )
    const enabled = [...indexes, ...pools]
    const filtered = enabled.map((pool: { strategy: string }) => pool.strategy)
    const deduped = Array.from(new Set(filtered))
    
    let single : Array<string> = [], multi :  Array<string> = [];
    deduped.forEach(e =>  (e.indexOf(',') > 0 ? multi : single).push(e) );

    return [ ...single.sort(), ...multi.sort()]
}


const allAssets = (chainId: number) : string[] => {

    const networkName = networksConfig[chainId.toString() as keyof typeof networksConfig]
    const indexes = indexesInfo[networkName as keyof typeof indexesInfo]
    const pools = poolsInfo[networkName as keyof typeof poolsInfo]

    // const enabled = [...indexes, ...pools].filter( (pool: {disabled: string}) => { return (pool.disabled === 'false')} )
    const enabled = [...indexes, ...pools]
 
    const filtered = enabled.map(pool => pool.investTokens.join(','))
    const deduped = Array.from(new Set(filtered))

    let single : Array<string> = [], multi :  Array<string> = [];
    deduped.forEach(e =>  (e.indexOf(',') > 0 ? multi : single).push(e) );

    return [ ...single.sort(), ...multi.sort()]
}



const isMyPool = (pool: PoolData) : boolean => {

    console.log("isMyPool", pool)

    const noValue = pool.tokenInfoArray.reduce( (acc, val) => {
        if ( val.accountValue !== undefined && !val.accountValue?.isZero() ) {
            console.log("isMyPool ", val.symbol, "=>", val.accountValue?.toString())
        }
     
        return acc && (val.accountValue === undefined || val.accountValue?.isZero())
    }, true)


    return !noValue
}


// Returns the list of PoolData for the "active" pools for the the optional 'asset' and 'strategy', ordered by TVL
const filterPools = (chainId: number, poolsInfo: PoolData[], strategy: string | undefined, asset: string | undefined, mypools: boolean) => {
    const filtered = poolsInfo.filter( pool => { 
        const info = PoolInfo(chainId, pool.poolId)
        const includeStrategy = strategy === undefined || info.strategy === strategy
        const includeAsset = asset === undefined || info.investTokens.join(',') === asset
        const includeMyPools = mypools === false || isMyPool(pool)

        // return info.disabled === 'false' && includeStrategy && includeAsset && includeMyPools
        return info.disabled === 'false' && includeStrategy && includeAsset && includeMyPools
    }).sort( (a: PoolData, b: PoolData) => {
        return b.totalValue.toNumber() - a.totalValue.toNumber()
    })

    console.log("filtered >>> ", filtered)
    
    return filtered
}



const strategyNames = {
    "rebalance_01": "Rebalancing",
    "meanrev_01": "Mean Reversion",
    "trendfollow_01": "Trend Following",
    "rebalance_01,meanrev_01,trendfollow_01": "Mean Reversion + Rebalancing + Trend Following"
}

const assetNames = {
    "WBTC": "BTC",
    "WETH": "ETH",
    "WBTC,WETH": "BTC + ETH",
}


export const PoolExplorer = ({ chainId, account, depositToken } : PoolExplorerProps) => {

    const classes = useStyles()

    const [asset, setAsset] = useState(-1)
    const [strategy, setStrategy] = useState(-1)
    //const [mypools, setMypools] = useState(false)

    const strategies = allStrategies(chainId)
    const assets = allAssets(chainId)
    
    const investTokens = InvestTokens(chainId)
    const tokens = [depositToken, ...investTokens]
    const pools = usePoolsInfo(chainId, PoolIds(chainId), tokens, account)
    const indexes = useIndexesInfo(chainId, IndexesIds(chainId), tokens, account)

    const handleStrategyChange = (event: React.ChangeEvent <{ name?: string | undefined; value: unknown; }>) => {
        setStrategy(Number(event.target.value))
    }
    
    const handleAssetChange = (event: React.ChangeEvent <{ name?: string | undefined; value: unknown; }>) => {
        setAsset(Number(event.target.value))
    }

    const strategyItems = strategies.map( (item, idx) => {
        const name = strategyNames[item as keyof typeof strategyNames] || item
        return <MenuItem key={idx} value={idx}>{name}</MenuItem>
    })


    const assetItems = assets.map( (item, idx) => {
        const name = assetNames[item as keyof typeof assetNames] || item

        return <MenuItem key={idx} value={idx}>{name}</MenuItem>
    })

    const selectedStrategy = strategy === -1 ? undefined : strategies[strategy]
    const selectedAsset = asset === -1 ? undefined : assets[asset]

    const poolsViews = filterPools(chainId, [...indexes, ...pools], selectedStrategy, selectedAsset, false).map( index => { 
        return (
            <div key={index.poolId}>
                <PoolSummary chainId={chainId} poolId={index.poolId} account={account} depositToken={depositToken} tokens={index.tokenInfoArray} />
            </div>
        )
    })


    ///// popover //// 
    const [anchorEl0, setAnchorEl0] = useState<HTMLButtonElement | null>(null);

    const handleClick0 = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl0(event.currentTarget);
    };
    
    const handleClose0 = () => {
        setAnchorEl0(null);
    };

    const open0 = Boolean(anchorEl0)
    const id0 = open0 ? 'divs-info-popover-0' : undefined
        

    return (
        <Box className={classes.container}>
            <Box mx={2} >

                <Box mb={2} >
                    <Typography variant="h3"> Pools &amp; Indexes <Button onClick={handleClick0} style={{ height: 40, width: 40 }} ><Info /></Button></Typography>  
                </Box>

                <Typography variant="body1">
                    Here are all HashStrat Pools with their associated strategies.  
                </Typography>  
                <Typography variant="body1">
                    Filter by a combination of strategies and assets to find a pool to deposit into.
                </Typography>  
                <Popover style={{maxWidth: 400}} id={id0} open={open0} anchorEl={anchorEl0} onClose={handleClose0} anchorOrigin={{vertical: 'bottom', horizontal: 'center' }} >
                    <Box style={{ width: '350px'}}>
                        <Paper variant="elevation">
                            <Typography style={{ padding: 10 }} variant="body2" > 
                                <strong>Pools </strong> hold 2 digital assets, a stable asset (USDC) and a risk asset (wrapped BTC or ETH).<br/>
                                Pools use a <Link component={RouterLink} to="/strategies" >strategy</Link> to trade between them.
                                <br/><br/>
                                <strong>Indexes </strong> are baskets of Pools and offer exposure to multiple strategies and multiple assets.
                            </Typography>
                        </Paper>
                    </Box>
                </Popover> 
                    
                <Horizontal>
                    <Box my={4}>
                        <Horizontal align="left">
                            <FormControl fullWidth={false} >
                                <InputLabel id="strategy-select-label">Strategies</InputLabel>
                                <Select style={{minWidth: 320}}
                                    labelId="strategy-select-label"
                                    id="strategy-select"
                                    value={strategy}
                                    label="Strategies"
                                    onChange={ e => handleStrategyChange(e) }
                                    placeholder="Select strategies"
                                >
                                    <MenuItem key={-1} value={-1}>All</MenuItem>
                                    {strategyItems}
                                </Select>
                            </FormControl>
                            
                            <FormControl fullWidth={false}>
                                <InputLabel id="assets-select-label">Assets</InputLabel>
                                <Select style={{minWidth: 180}}
                                    labelId="assets-select-label"
                                    id="assets-select"
                                    value={asset}
                                    label="Assets"
                                    onChange={ e => handleAssetChange(e) }
                                    placeholder="Select assets"
                                    
                                >
                                    <MenuItem key={-1} value={-1}>All</MenuItem>
                                    {assetItems}
                                </Select>
                            </FormControl>

                        </Horizontal>
                    </Box>
                </Horizontal>

            </Box>

            <Box style={{paddingTop: 30, paddingRight: 0, marginLeft: 0, marginRight: 0}}>
                { poolsViews && poolsViews.length > 0 && 
                    <Box py={0} >
                        <Horizontal align="center"> { poolsViews } </Horizontal>
                    </Box>
                }
            </Box>

        </Box>
    )
}


