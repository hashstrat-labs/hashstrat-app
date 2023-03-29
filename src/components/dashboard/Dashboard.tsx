

import React, { useState, useContext } from "react"

import { AppContext } from "../../context/AppContext"

import { makeStyles, Tab, Box, Paper  } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

import { Token } from "../../types/Token"

import { FundAssetsSummary } from "./FundAssetsSummary"
import { MyPortfolioAssetsSummary } from "./MyPortfolioAssetsSummary"
import { ConnectAccountHelper } from "./ConnectAccountHelper"
import { Vertical } from "../Layout"


interface DashboardProps {
    chainId: number,
    account?: string,
    depositToken: Token,
    investTokens: Array<Token>,
}


const useStyles = makeStyles( theme => ({
    container: {
        paddingTop: 2,
        marginBottom: 10,
      
    },

    tabList: { 
        maxWidth: 1200,
        padding: 0,
        margin: "auto",
        backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.grey[900],
        borderRadius: "20px 20px 0px 0px",

        [theme.breakpoints.down('xs')]: {
            borderRadius: 0,
        },
    },
    tab: { 
        maxWidth: 1200,
        padding: 0,
        margin: "auto",
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.grey[900],
        borderRadius: "0px 0px 20px 20px",

        [theme.breakpoints.down('xs')]: {
            borderRadius: 0,
        },
    }
}))



export const Dashboard = ({ chainId, depositToken, investTokens, account } : DashboardProps) => {
    
    const { connectedChainId, wrongNetwork } = useContext(AppContext);

    const selIdx =  0 //account === undefined ? 1 : 0
    const classes = useStyles()
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(selIdx)
   
    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const handleDidLoad = (didLoad: boolean ) => {
        console.log("Dashboad - portfolio did load", didLoad)
    }

    console.log("Dashboad - connectedChainId:", connectedChainId, "")

    return (
        <div className={classes.container} >
            
            <TabContext value={selectedTokenIndex.toString()}>
     
                <TabList onChange={handleChange} className={classes.tabList}>
                    <Tab label="My Portfolio" value="0" key={0} />
                    <Tab label="HashStrat" value="1" key={1}  />
                </TabList>

                <TabPanel className={classes.tab} value="0" key={0}>
                { (connectedChainId && (!account || wrongNetwork(connectedChainId))) &&
                    <Box style={{height: 500}}>
                        <Vertical >
                            <ConnectAccountHelper connectedChainId={connectedChainId} userMessage="access your portfolio" />
                        </Vertical>
                    </Box>
                }

                { !(connectedChainId && (!account || wrongNetwork(connectedChainId))) &&
                    <MyPortfolioAssetsSummary chainId={chainId} connectedChainId={connectedChainId} depositToken={depositToken} investTokens={investTokens} account={account} onPortfolioLoad={(handleDidLoad)} /> 
                }
                </TabPanel>

                <TabPanel className={classes.tab} value="1" key={1}>
                    <FundAssetsSummary chainId={chainId}  depositToken={depositToken} investTokens={investTokens} />
                </TabPanel>
            </TabContext>
           
        </div>
    )

}




