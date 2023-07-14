import React, { useState, useContext } from "react"
import { Box, Tab, makeStyles, Typography } from "@material-ui/core"
import { TabContext, TabList, TabPanel, Alert, AlertTitle } from "@material-ui/lab"
import { Token } from "../../../types/Token"
import { MyStatsView } from "./MyStatsView"
import { WalletTabs } from "../../wallet/WalletTabs"
import { IndexStatsView } from "./IndexStatsView"

import { PoolInfo } from "../../../utils/pools"
import { ConnectAccountHelper } from "../../dashboard/ConnectAccountHelper"
import { Vertical } from "../../Layout"

import { AppContext } from "../../../context/AppContext"


interface IndexTabsProps {
    poolId: string,
    chainId: number,
    account?: string,
    tokens: Array<Token>,
    investTokens: Array<Token>,
}

const useStyle = makeStyles( theme => ({
    container: {
        marginTop: 22,
        paddingBottom: 0,
    },
    panelContainer: {
        marginTop: 22,
        marginBottom: 22,
        backgroundColor: theme.palette.type === 'light' ? 'white' :'#000',
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



export const IndexTabs = ( { chainId, poolId, account, tokens } : IndexTabsProps ) => {

    const { connectedChainId, wrongNetwork } = useContext(AppContext);

    const depositToken = tokens[0]

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)
    const classes = useStyle()

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const { name, description, detail, scope, disabled } = PoolInfo(chainId, poolId)

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
                <Typography variant="body2" style={{ paddingTop: 10 }}>{description} {scope}</Typography>
            </Box>

            <Box className={classes.panelContainer}> 
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} className={classes.tabList}>
                        {<Tab label="My Assets" value="0" key={0} /> }
                        <Tab label="Index" value="1" key={1}  />
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
                        <IndexStatsView chainId={chainId} poolId={poolId} depositToken={depositToken} account={account} />
                    </TabPanel>
                    
                </TabContext>
            </Box>
        </Box>
    )
}

export default IndexTabs
