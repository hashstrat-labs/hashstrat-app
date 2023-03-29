import React, { useState, useContext } from "react"
import { Box, Tab, makeStyles } from "@material-ui/core"

import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { Token } from "../../../types/Token"
import { MyStatsView } from "./MyStatsView"
import { IndexStatsView } from "./IndexStatsView"
import { WalletTabs } from "../../wallet/WalletTabs"
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
    tabList: { 
        padding: 0,
        margin: "auto",
        maxWidth: 800,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    tab: { 
          maxWidth: 800,
          margin: "auto",
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
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

    return (
        <Box className={classes.container}>
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
    )
}

export default IndexTabs
