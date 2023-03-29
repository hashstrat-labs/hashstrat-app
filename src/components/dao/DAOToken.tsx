import { useState, useEffect } from "react"
import { utils } from "ethers"
import { useNotifications } from "@usedapp/core";

import { Box, Accordion, AccordionDetails, AccordionSummary, makeStyles, 
        Typography, Button, CircularProgress, Card, CardContent, CardActions
     } from "@material-ui/core"
import { AlertTitle } from "@material-ui/lab"
import { ExpandMore } from "@material-ui/icons"

import { useMaxSupply, useTotalSupply } from "../../hooks/useHST"
import { useTokenBalance  } from "../../hooks/useErc20Tokens"
import { useStakedLP, useClaimableRewards, useClaimReward  } from "../../hooks/useFarm"

import { fromDecimals } from "../../utils/formatter"
import { TitleValueBox } from "../TitleValueBox"

import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"

import { SnackInfo } from "../SnackInfo"
import { NetworkExplorerHost } from "../../utils/network"
import { StyledAlert } from "../shared/StyledAlert"

import { HstToken } from "../../utils/Tokens"



interface DAOTokenProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    tokenInfo: {
        // maxWidth: 600,
        margin: "auto"
    },
    container: {
        // textAlign: "center",
        padding: theme.spacing(2),
        minHeight: 300
    },
    info:{
        margin: "auto",
        marginBottom: 30,
    },
    claimAction: {
        display: "flex",
        justifyContent: "space-around",
        paddingBottom: 20
    },
    accordion: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
    }
}))


export const DAOToken = ({ chainId, account, depositToken } : DAOTokenProps ) => {

    const classes = useStyles()
    const hstBalance = useTokenBalance(chainId, "", "HST", account)

    const hstMaxSupply  = useMaxSupply(chainId)
    const hstTotalSupply  = useTotalSupply(chainId)

    const tokenStakedBalance = useStakedLP(chainId, account)
    const claimableRewards = useClaimableRewards(chainId, account)

    const [userMessage, setUserMessage] = useState<SnackInfo>()
    const { notifications } = useNotifications()

    // Claim HST tokens
    const { claimReward, claimRewardState } = useClaimReward(chainId)
    const isDepositMining = claimRewardState.status === "Mining"

    const handleClaimButtonPressed = () => {
        console.log("DaoHome - handleClaimButtonPressed ")
        setUserMessage(undefined)

        return claimReward()
    }

    const hstToken = HstToken(chainId)

    const handleAddTokenButtonPressed = () => {

            window.ethereum && window.ethereum.request({
                 method: 'wallet_watchAsset', 
                 params: {
                    type: 'ERC20',
                    options: {
                      address: hstToken.address,
                      symbol: hstToken.symbol,
                      decimals: hstToken.decimals,
                      image: 'https://hashstrat.com/logo.svg'
                    }
                  }
            })
            .then(() => console.log('Success, Token added!'))
            .catch((error: Error) => console.log(`Error: ${error.message}`))

    }

    
    const explorerHost = NetworkExplorerHost(chainId)
    const claimedLink =  (claimRewardState.status === 'Success' && 
                claimRewardState.receipt && 
                claimRewardState.receipt.transactionHash 
                ) ? `https://${explorerHost}/tx/${claimRewardState.receipt.transactionHash}` : ""

    useEffect(() => {
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Claim Rewards"
        ).length > 0) {
            setUserMessage({
                type: "info",
                title: "HST tokens claimed",
                message: "Thanks for participating in the HashStrat DAO",
            })
        }
    }, [notifications, chainId, claimedLink])

  
    const formattedTokenStakedBalance = tokenStakedBalance? fromDecimals(tokenStakedBalance, depositToken.decimals, 2) : ""
    const formattedClaimableRewards = claimableRewards? fromDecimals(claimableRewards, 18, 2) : ""
    const formattedHstBalance = hstBalance? fromDecimals(hstBalance, 18, 2) : ""
    const formattedHstMaxSupply = hstMaxSupply? fromDecimals(hstMaxSupply, 18, 2) : ""
    const formattedHstTotalSupply = hstTotalSupply? fromDecimals(hstTotalSupply, 18, 2) : ""

    const circulatingPerc = (formattedHstTotalSupply && formattedHstMaxSupply ) ? 
             `${ Math.round(10000 * Number(formattedHstTotalSupply) /  Number(formattedHstMaxSupply)) / 100 }% ` : 'n/a'


    return (

        <Box className={classes.container}>

            { userMessage &&
                <div className={classes.info}>
                    <StyledAlert severity={userMessage?.type}>
                        <AlertTitle> {userMessage?.title} </AlertTitle>
                        {userMessage?.message}
                    </StyledAlert>
                </div>
            }

            <Box className={classes.tokenInfo}>
                <Accordion >

                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" className={classes.accordion} >

                        <Typography > 
                            The DAO Token (HST) is used to participate in the DAO governance and revenue sharing.  <br/>
                            You can earn it by depositing into any HashStrat pool and staking your LP tokens. 
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails style={{paddingLeft: 0, margin: 0}}>
                        <ul>
                            <li style={{marginBottom: 10}}>
                               <Typography variant="body2" > HST is a ERC20 token with a fixed supply of 1 million and no premine.</Typography>
                            </li>
                            <li style={{marginBottom: 10}}>
                            <Typography variant="body2"  >HST has a fair distribution and can only be acquired by using of the HashStrat protocol.</Typography>
                            </li>
                            <li style={{marginBottom: 10}}>
                            <Typography variant="body2"  >Users who deposit funds in any Pools &amp; Indexes, can stake their LP tokens and farm HST.</Typography>
                            </li>
                            <li style={{marginBottom: 10}}>
                            <Typography variant="body2"  > HST gets distributed with a fixed schedule over a 10 years period.</Typography>
                            </li>
                            <li style={{marginBottom: 10}}>
                                <Typography variant="body2" >The rate of distributon of HST tokens decreases exponentially, halving every year, to incentivise early adopters and supporters of the protocol.</Typography>
                            </li>
                        </ul>
                    </AccordionDetails>
                </Accordion>
            </Box>

            <Box p={4}>

                <Horizontal align="center" > 

                    <Box mb={3} style={{minWidth: 320 }} >
                        <Card>
                            <CardContent>
                                <Typography variant="h5" style={{ marginBottom: 10 }} >HST Token</Typography>
                                <TitleValueBox title="Max Supply" value={ utils.commify( formattedHstMaxSupply )} />
                                <TitleValueBox title="Circulating Supply" value={ utils.commify(formattedHstTotalSupply) }  />
                                <TitleValueBox title="Circulating %" value={`${circulatingPerc}`} suffix="" />
                            </CardContent>
                            <CardActions   >
                                <Button variant="contained" color="secondary" fullWidth onClick={handleAddTokenButtonPressed} style={{ margin: 20, height: 40 }} > 
                                    Add HST to MetaMask
                                </Button>
                            </CardActions>
                        </Card>
                    </Box>

                    <Box  style={{minWidth: 320 }} >
                        
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h5" style={{ marginBottom: 10 }}>Your HST Token Farm</Typography>
                                <TitleValueBox title="LP tokens farming" value={ utils.commify(formattedTokenStakedBalance) } />
                                <TitleValueBox title="HST collected" value={ utils.commify(formattedHstBalance) } />
                                <TitleValueBox title="HST available to collect" value={ utils.commify(formattedClaimableRewards) }  />
                            </CardContent>
                            <CardActions   >
                                <Button variant="contained" color="primary" fullWidth onClick={handleClaimButtonPressed} style={{ margin: 20, height: 40 }} > 
                                    Collect HST Tokens
                                    { isDepositMining && <Horizontal >  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                                </Button>
                            </CardActions>
                        </Card>
  
                    </Box>
                </Horizontal>




            </Box>

        </Box>
    )
}


