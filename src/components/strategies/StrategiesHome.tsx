


import { useState } from 'react'

import { makeStyles, Box, Typography, Link, Accordion, AccordionDetails, AccordionSummary, Breadcrumbs, Divider } from  "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import { Link as RouterLink } from "react-router-dom"
import { useSearchParams } from "react-router-dom"

import { StrategyPlayground } from "./StrategyPlayground"
import { RebalancingSummary, RebalancingDetails } from "./Rebalancing"
import { TrendFollowingSummary, TrendFollowingDetails } from "./TrendFollowing"
import { MeanReversionSummary, MeanReversionDetails } from "./MeanReversion"


const useStyle = makeStyles( theme => ({

    container: {
        maxWidth: 1200,
        margin: 'auto',
        paddingTop: theme.spacing(2),
        
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 0,
            marginRight: 0,
        },
    },

    accordionDetails: {
        padding: 0,
        margin: 0,
        [theme.breakpoints.down('xs')]: {
            margin: 0,
            padding: 0,
        },
    },
    
    playground: {
      
        padding: 20,
        margin: 0,
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 0,
            paddingRight: 0,
        },
    },

}))


const simulatrParams = {
    fromDate: "sim.fromDate",
    toDate: "sim.toDate",
    asset: "sim.asset",
    strategy: "sim.strategy",
    investment: "sim.investment",
}


export const StrategiesHome = () => {
    const classes = useStyle()

    const [searchParams] = useSearchParams();

    const strategyParam = ['MeanReversion', 'Rebalancing', 'TrendFollowing'].includes(searchParams.get("s") ?? '') ?
                searchParams.get("s") : ''    

     const [strategy, setStrategy] = useState<string | null>(strategyParam)

    return (
        <Box className={classes.container} >

            <Box px={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/"> Home </Link>
                    <Typography>Strategies</Typography>
                </Breadcrumbs>
            </Box>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}}/>

            <Box mx={2} mt={2}>
                <Typography variant="h3"> Strategies </Typography>  
            </Box>

            <Box my={3} px={2}>
                <Typography>Strategies are set of rules, encoded into smart contracts, that can trade the assets held into HashStrat pools.</Typography>
                <Typography>Pools are smart contracts holding a risk asset (WBTC or WETH) and a stable asset (USDC) and are configured with a strategy to trade between them.</Typography>
            </Box>

            <Box>

                <Accordion defaultExpanded={ strategy === '' || strategy === 'Rebalancing'  }>
                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                        <RebalancingSummary />
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails} >
                        <div>
                            <RebalancingDetails />
 
                            <Box className={classes.playground} >
                                <StrategyPlayground 
                                    strategy='Rebalancing'
                                    symbol="ETH"
                                    from="2019-01-01"
                                    to="2023-01-16"
                                    chartHeight={340}
                                    chainId={137} //FIXME
                                /> 
                            </Box>
                        </div>    
                    </AccordionDetails>
                </Accordion>
 
                <Accordion defaultExpanded={ strategy === 'MeanReversion' }>
                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                       <MeanReversionSummary />

                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails} >
                        <div>
                            <MeanReversionDetails />

                            <Box className={classes.playground} >
                                <StrategyPlayground 
                                    strategy='MeanReversion'
                                    symbol="ETH"
                                    from="2019-01-01"
                                    to="2023-01-16"
                                    chartHeight={340}
                                    chainId={137} //FIXME
                                /> 
                            </Box>
                        </div>
                    </AccordionDetails>
                </Accordion>
                
                <Accordion defaultExpanded={ strategy === 'TrendFollowing' }>
                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                        <TrendFollowingSummary />
                    </AccordionSummary>
                    <AccordionDetails className={classes.accordionDetails} >
                        <div>
                            <TrendFollowingDetails />

                            <Box className={classes.playground} >
                                <StrategyPlayground 
                                    strategy='TrendFollowing'
                                    symbol="ETH"
                                    from="2019-01-01"
                                    to="2023-01-16"
                                    chartHeight={340}
                                    chainId={137} //FIXME
                                /> 
                            </Box>
                        </div>
                    </AccordionDetails>
                </Accordion>

            </Box>
        </Box>
    )
}