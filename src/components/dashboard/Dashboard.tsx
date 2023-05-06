

import React, { useState, useContext } from "react"

import { AppContext } from "../../context/AppContext"

import { makeStyles, Tab, Box, Paper  } from "@material-ui/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"

import { Token } from "../../types/Token"

import { FundAssetsSummary } from "./FundAssetsSummary"
import { MyPortfolioSummary } from "./MyPortfolioSummary"
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

        backgroundColor: theme.palette.type === 'light' ? '#F7F7F7' : '#222',
    },

    // tabList: { 
    //     maxWidth: 1200,
    //     padding: 0,
    //     margin: "auto",
    //     backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.grey[900],
    //     borderRadius: "20px 20px 0px 0px",

    //     [theme.breakpoints.down('xs')]: {
    //         borderRadius: 0,
    //     },
    // },
    // tab: { 
    //     maxWidth: 1200,
    //     padding: 0,
    //     margin: "auto",
    //     paddingTop: 20,
    //     paddingBottom: 20,
    //     backgroundColor: theme.palette.type === 'light' ? 'white' : theme.palette.grey[900],
    //     borderRadius: "0px 0px 20px 20px",

    //     [theme.breakpoints.down('xs')]: {
    //         borderRadius: 0,
    //     },
    // }
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
            

            { (connectedChainId && (!account || wrongNetwork(connectedChainId))) &&
                <Box style={{height: 500}}>
                    <Vertical >
                        <ConnectAccountHelper connectedChainId={connectedChainId} userMessage="access your portfolio" />
                    </Vertical>
                </Box>
            }

            { !(connectedChainId && (!account || wrongNetwork(connectedChainId))) &&
                <Box  style={{ maxWidth: 1200, margin: "auto" }}>
                    <MyPortfolioSummary chainId={chainId} connectedChainId={connectedChainId} depositToken={depositToken} investTokens={investTokens} account={account} onPortfolioLoad={(handleDidLoad)} /> 
                </Box>
            }
           
        </div>
    )

}




