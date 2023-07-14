import React, { useState, useContext } from "react"
import { Box, Tab, makeStyles, Typography } from "@material-ui/core"
import { TabContext, TabList, TabPanel, Alert, AlertTitle } from "@material-ui/lab"
import { Token } from "../../../types/Token"
import { MyStatsView } from "./MyStatsView"
import { PoolStatsView } from "./PoolStatsView"
import { TradesView } from "./TradesView"
import { WalletTabs } from "../../wallet/WalletTabs"
import { RebalanceStrategyInfoView } from "./RebalanceStrategyInfoView"
import { MeanRevStrategyInfoView } from "./MeanRevStrategyInfoView"
import { TrendFollowtrategyInfoView } from "./TrendFollowtrategyInfoView"

import { PoolInfo } from "../../../utils/pools"
import { ConnectAccountHelper } from "../../dashboard/ConnectAccountHelper"
import { Vertical } from "../../Layout"

import { AppContext } from "../../../context/AppContext"
import { MyAssets } from "../../dashboard/MyAssets"


interface PoolTabsProps {
    poolId: string,
    chainId: number,
    account?: string,
    tokens: Array<Token>,
    investToken: Token,
}

const useStyle = makeStyles( theme => ({
    container: {
        marginTop: 22,
        paddingBottom: 0,
    },
    panelContainer: {
        marginTop: 22,
        marginBottom: 22,
        backgroundColor: theme.palette.type === 'light' ? 'white' :'#424242',
        maxWidth: 1200,
        margin: "auto",
        borderRadius: 8,
    },
    title: {
        paddingLeft: 20,
        paddingRight: 20,
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 10,
            paddingRight: 10,
        },
    },
    tabList: { 
        padding: 0,
    },
    tab: { 
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 20,
        paddingBottom: 20,
    },
}))



export const PoolTabs = ( { chainId, poolId, account, tokens, investToken } : PoolTabsProps ) => {

    const { connectedChainId, wrongNetwork } = useContext(AppContext);

    const depositToken = tokens[0]

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const classes = useStyle()

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const { name, description, scope, detail, strategy, disabled } = PoolInfo(chainId, poolId)

    const isRebalanceStrategy = strategy === "rebalance_01" 
    const isMeanRevStrategy = strategy === "meanrev_01"
    const isTrendFollowStrategy = strategy === "trendfollow_01"


    return (
        <Box className={classes.container}>

            { disabled === 'true' && 
                <Box pb={2} >
                    <Alert severity="warning" > 
                        <AlertTitle><strong>Strategy upgrade</strong></AlertTitle>
                        Due to an upgrde, this strategy has been disabled and a new version is now available.<br/>
                        <strong>Withdraw your funds now</strong> from this strategy and deposit into the new upgraded strategy.
                    </Alert>
                </Box>
            }

            <Box className={classes.title}>
                <Typography variant="h5">{name}</Typography>
                <Typography variant="body2" style={{ paddingTop: 10 }} >{description} {scope}</Typography>
            </Box>


            <Box className={classes.panelContainer}> 

                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} className={classes.tabList}>
                        {<Tab label="My Assets" value="0" key={0} /> }
                        <Tab label="Pool" value="1" key={1}  />
                        <Tab label="Strategy" value="2" key={2}  />
                        <Tab label="Trades" value="3" key={3} />

                    </TabList>
                    <TabPanel className={classes.tab} value="0" key={0}>
                        { (connectedChainId && (!account || wrongNetwork(connectedChainId))) &&
                            <Box style={{height: 400}} px={2}>
                                <Vertical >
                                    <ConnectAccountHelper connectedChainId={connectedChainId} userMessage="view your assets" />
                                </Vertical>
                            </Box>
                        }
                        { connectedChainId && account && !wrongNetwork(connectedChainId) &&
                            <Box>
                                <MyStatsView chainId={chainId} poolId={poolId} account={account} depositToken={depositToken} />
                                <WalletTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens!} />
                            </Box>
                        }
                    </TabPanel>
                    <TabPanel className={classes.tab} value="1" key={1}>
                        <PoolStatsView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                    </TabPanel>
                    <TabPanel className={classes.tab} value="2" key={2}>
                        <Box pb={4}>
                        {
                        isRebalanceStrategy && <RebalanceStrategyInfoView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                        }
                        {
                        isMeanRevStrategy && <MeanRevStrategyInfoView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                        }
                        {
                            isTrendFollowStrategy && <TrendFollowtrategyInfoView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                        }
                        </Box>
                    </TabPanel>
                    <TabPanel className={classes.tab} value="3" key={3}>
                        <TradesView chainId={chainId} poolId={poolId} depositToken={depositToken} investToken={investToken} />
                    </TabPanel>
                </TabContext>
            </Box>
        </Box>
    )
}

export default PoolTabs
