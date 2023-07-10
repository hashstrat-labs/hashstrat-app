

import {  Box, Typography, Link } from  "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

import { Horizontal } from "../Layout";
import { Launch } from "@material-ui/icons"


export const RebalancingSummary = () => {
    return (
        <div>
            <Typography variant="h5">
                <strong> Rebalancing </strong>
            </Typography>

            <Typography style={{marginTop: 10}}>
                A strategy to automatically rebalance a 2 asset portfolio using a 60/40% rebalancing target and a 10% rebalancing band.
            </Typography>
            
            <div style={{marginTop: 10}}>
                <Link href="https://medium.com/@hashstrat/hashstrat-rebalancing-strategy-f0bb6cf3152f" target="_blank" > Learn More <Launch style={{ height: 15, transform: "translateY(2px)" }} />  </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link href="https://github.com/hashstrat-labs/hashstrat-pool/blob/master/contracts/strategies/RebalancingStrategyV1.sol">GitHub <Launch style={{ height: 15, transform: "translateY(2px)" }} /> </Link>
            </div>

        </div>
    )
}

export const RebalancingDetails = () => {


    return (
        <Box px={2}>
        <div>
            <strong>Goal</strong> <br/>
            Capture volatility in the risk asset by rebalancing the Pool whenever the value of either assets
            deviates significantly from the Pool's target allocation.
        </div>
        <br />
        <div>     
            <strong>Rule</strong> <br/>
            Given a Pool holding BTC (or ETH) and USDC with 60%/40% target allocation and ±10% rebalancing trigger, <br />
            when the value of all BTC in the pool rises above 70% (drops below 50%) of the overall value in the pool,<br />
            then the pool is rebalanced by selling (or buying) BTC to restore the target 60%/40% allocation.
        </div>
        <br />
        <div>     
            <strong>Execution Frequency</strong> <br/>
            Once every 7 days
        </div>
        <br />
        <div>     
            <strong>Pools</strong> <br/>
            <Horizontal>
                <Link component={RouterLink} to="/pools/pool01v4a">BTC-USDC</Link>
                <Link component={RouterLink} to="/pools/pool02v4a">ETH-USDC</Link>
            </Horizontal>
        </div>
    </Box>
    )
}