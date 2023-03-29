import React, { useState } from "react"
import { Box, Tab, Snackbar, Link, makeStyles } from "@material-ui/core"
import { TabContext, TabList, TabPanel, AlertTitle } from "@material-ui/lab"
import { StyledAlert } from "../shared/StyledAlert"


import { Token } from  "../../types/Token"
import { DepositWithdrawView } from "./DepositWithdrawView"
import { StakingView } from "./StakingView"

import { SnackInfo } from "../SnackInfo"


interface TabPanelProps {
    chainId: number,
    poolId: string,
    account: string,
    tokens: Array<Token>
}

const useStyle = makeStyles( theme => ({
    container: {
        borderTop: `2px solid ${theme.palette.type === 'light' ? theme.palette.grey[200] : 'black'}`,
        marginTop: 20,
        padding: 0,
        borderRadius: 0
    },
    tabList: { 
        padding: 0,
        margin: "auto",
        maxWidth: 800,
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    tab: { 
          padding: 0,
          maxWidth: 800,
          margin: "auto",
          paddingTop: 20,
          backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
}))




export const WalletTabs = ( { chainId, poolId, account, tokens } : TabPanelProps ) => {

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    const [showSnack, setShowSnack] = useState(false)
    const [snackContent, setSnackContent] = useState<SnackInfo>()

    const classes = useStyle()

    const handleCloseSnack = () => {
        setShowSnack(false)
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    const handleSuccess = (info: SnackInfo) => {
        console.log("WalletTabs.handleSuccess() >>> ", info)
        setSnackContent(info)
        setShowSnack(true)
    }

    const handleError = (error: SnackInfo) => {
        console.log("WalletTabs.handleError() >>> ", error)
        setSnackContent(error)
        setShowSnack(true)
    }

    const lpToken = tokens.find(el => el.symbol === 'POOL-LP')

    return (
        
        <Box className={classes.container}>
            <Box>
                <TabContext value={selectedTokenIndex.toString()}>
                    <TabList onChange={handleChange} className={classes.tabList}>
                        <Tab label="Deposit" value="0" key={0} ></Tab>
                        <Tab label="Withdraw" value="1" key={1} ></Tab>
                        <Tab label="Stake" value="2" key={2}></Tab>
                        <Tab label="Unstake" value="3" key={3}></Tab>
                    </TabList>
                    {
                        tokens.map((token, index ) => {
                            return (
                                <TabPanel className={classes.tab} value={index.toString()} key={index}>
                                    <DepositWithdrawView 
                                        formType={ token.symbol === 'POOL-LP' ? "withdraw" :  "deposit" }
                                        chainId={chainId}
                                        poolId={poolId}
                                        token={token}
                                        handleSuccess={handleSuccess}
                                        handleError={handleError}
                                    />
                                </TabPanel>
                            )
                        })
                    }
                    <TabPanel className={classes.tab} value="2" key="2">
                        <StakingView 
                            chainId={chainId}
                            poolId={poolId}
                            formType="stake"
                            token={lpToken!}
                            handleSuccess={handleSuccess}
                            handleError={handleError}
                        />
                    </TabPanel>
                    <TabPanel className={classes.tab} value="3" key="3">
                        <StakingView 
                            chainId={chainId}
                            poolId={poolId}
                            formType="unstake"
                            token={lpToken!}
                            handleSuccess={handleSuccess}
                            handleError={handleError}
                        />
                    </TabPanel>
                </TabContext>
            </Box>


            <Snackbar
                    open={showSnack}
                    anchorOrigin={ { horizontal: 'right',  vertical: 'bottom' } }
                    autoHideDuration={snackContent?.snackDuration ?? 10000}
                    onClose={handleCloseSnack}
            >
                    <StyledAlert onClose={handleCloseSnack} severity={snackContent?.type}>
                        <AlertTitle> {snackContent?.title} </AlertTitle>
                        {snackContent?.message}
                        <br/>
                        <Link href={snackContent?.linkUrl} target="_blank"> {snackContent?.linkText} </Link>
                    </StyledAlert>
            </Snackbar>
        </Box>
    )
}

export default WalletTabs
