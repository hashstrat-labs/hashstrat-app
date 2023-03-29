

import {  Box, Typography, Link } from  "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

import { Horizontal } from "../Layout";
import { Launch } from "@material-ui/icons"


export const TrendFollowingSummary = () => {
    return (
        <div>
            <Typography variant="h5">
                <strong> Trend Following </strong>
            </Typography>
            <Typography>
                A momentum strategy trading in the direction of the underlying trend.
            </Typography>
            
            <div style={{marginTop: 10}}>
                <Link href="https://medium.com/@hashstrat/trend-following-strategy-7dce9756eaa" target="_blank" > Learn More <Launch style={{ height: 15, transform: "translateY(2px)" }} />  </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link href="https://github.com/hashstrat-labs/hashstrat-pool/blob/master/contracts/strategies/TrendFollowV1.sol">GitHub <Launch style={{ height: 15, transform: "translateY(2px)" }} /> </Link>
            </div>
        </div>
    )
}

export const TrendFollowingDetails = () => {


    return (
        <Box px={2}>
            <div>
                <strong>Goal</strong> <br/>
                Capture volatility in the risk asset when its price is moving in a sustained direction. 
            </div>
            <br />
            <div>     
                <strong>Rule</strong> <br/>
                Given a Pool containing BTC (or ETH) and USDC, <br />
                When BTC (ETH) price is above its 40D moving average, then buy BTC (ETH) with all USDC in the Pool <br />
                When BTC (ETH) price is below its 40D moving average, then sell all BTC (ETH) into USDC. 
            </div>
            <br />
            <div>     
                <strong>Execution Frequency</strong> <br/>
                Once every 5 days
            </div>
            <br />
            <div>     
                <strong>Pools</strong> <br/>
                <Horizontal>
                    <Link component={RouterLink} to="/pools/pool05v3a">BTC-USDC TRDFLW01</Link>
                    <Link component={RouterLink} to="/pools/pool06v3a">ETH-USDC TRDFLW01</Link>
                </Horizontal>
            </div>
        </Box>
    )
}