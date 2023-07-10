

import {  Box, Typography, Link } from  "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

import { Horizontal } from "../Layout";
import { Launch } from "@material-ui/icons"


export const MeanReversionSummary = () => {
    return (
        <div>
            <Typography variant="h5">
                <strong> Mean Reversion</strong>
            </Typography>

            <Typography style={{marginTop: 10}}>
                A strategy for dollar-cost averaging in and out a risk asset when its price diverges substantially from its long term trend.
            </Typography>

            <div style={{marginTop: 10}}>
                <Link href="https://medium.com/@hashstrat/hashstrat-mean-reversion-strategy-b1a576b05d5f" target="_blank" > Learn More <Launch style={{ height: 15, transform: "translateY(2px)" }} />  </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link href="https://github.com/hashstrat-labs/hashstrat-pool/blob/master/contracts/strategies/MeanReversionV1.sol"> GitHub <Launch style={{ height: 15, transform: "translateY(2px)" }} /> </Link>
            </div>

        </div>
    )
}

export const MeanReversionDetails = () => {


    return (
        <Box px={2}>
            <div>
                <strong>Gaol</strong> <br/>
                Accumulate the risk asset when its price is significantly below its long term trend and divest when it's significantly above.
            </div>
            <br />
            <div>     
                <strong>Rule</strong> <br/>
                Given a Pool holding BTC (or ETH) and USDC, <br />
                when the BTC price is 33% below its 350D moving average then accumulate BTC periodically buying with 5% of all USDC in the Pool, <br />
                when the BTC price is 66% above its 350D moving average then divest BTC by periodically selling 5% of all BTC in the Pool. <br />
                Also ensure the pool holds at least 20% of its value in both BTC and USDC
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
                    <Link component={RouterLink} to="/pools/pool03v4a">BTC-USDC</Link>
                    <Link component={RouterLink} to="/pools/pool04v4a">ETH-USDC</Link>
                </Horizontal>
            </div>
        </Box>
    )
}