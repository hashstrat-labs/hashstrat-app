import React, { useState, useEffect } from "react"
import { useNotifications } from "@usedapp/core"

import { Box, Grid, Button, Input, CircularProgress, Typography, Link, makeStyles } from "@material-ui/core"
import { useTokenApprove, useTokenAllowance } from "../../hooks/useErc20Tokens"
import { useDeposit } from "../../hooks/usePool"

import { Token } from "../../types/Token"
import { toDecimals, fromDecimals } from "../../utils/formatter"
import { NetworkExplorerHost, NetworkExplorerName, PoolAddress} from "../../utils/network"
import { SnackInfo } from "../SnackInfo"
import { Horizontal } from "../Layout"
import { AlertTitle } from "@material-ui/lab"
import { StyledAlert } from "../shared/StyledAlert"


export interface DepositFormProps {
    isFirstDeposit: boolean
    chainId: number,
    poolId: string,
    token : Token;
    balance: string;
    account: string;

    handleSuccess: (result: SnackInfo) => void,
    handleError: (error: SnackInfo) => void,
    allowanceUpdated: () => void;
    onClose: () => void
}


const useStyle = makeStyles( theme => ({
    container: {
        maxWidth: 540,
    },
    title: {
        fontWeight: 700,
        fontSize: 20,
    },

    amount: {
        fontSize: 28,
        fontWeight: 200,
        textAlign: "right",
        marginRight: 0,
    },
    info:{
        margin: "auto"
    }
}))





export const DepositForm = ({ chainId, poolId, token, balance, handleSuccess, handleError, onClose, isFirstDeposit} : DepositFormProps ) => {

    const classes = useStyle()
    const { symbol } = token

    // Token stats 
    const allowance = useTokenAllowance(chainId, poolId, symbol, PoolAddress(chainId, poolId)) // in token decimals

    // form state management
    const [amount, setAmount] = useState<number | string>("")
    const [isValidAmount, setIsValidAmount] = useState<boolean>(false) 
    const [amountDecimals, setAmountDecimals] = useState<string>("")
    const [userMessage, setUserMessage] = useState<SnackInfo>()

    
    const { approveErc20, approveErc20State } = useTokenApprove(chainId, poolId, symbol, PoolAddress(chainId, poolId))
    const { notifications, removeNotification } = useNotifications()

    // formatted values
    const formattedAllowance = allowance && fromDecimals(allowance, token.decimals, 4)


    useEffect(() => {
        console.log(">>> Deposit form opened. userMessage:", userMessage)
        return () => {
            setUserMessage(undefined)
            notifications.forEach( e => {
                removeNotification( { notificationId: e.id, chainId } )
            })
            console.log(">>> Deposit form closed. notifications:", notifications)
        }

	}, [])


    // Form Handlers
    const handleClose = () => {
        console.log("DepositForm.handleClose")
        setUserMessage(undefined)
        onClose()
    }

    const balancePressed = () => {
        updateAmount(balance)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : event.target.value.trim()
        updateAmount(newAmount)
    }

    // validates the deposit amount and its decimal amount
    const updateAmount = (newAmount: string) => {
        setAmount(newAmount)
        const amounDec = Number(newAmount)
        const validAmount = newAmount !== '' && !isNaN(amounDec) 

        const amountDecimals = toDecimals( validAmount ? amounDec.toString() : "0", token.decimals)
        setAmountDecimals(amountDecimals)
        setIsValidAmount(validAmount)
    }



    // Approve Tokens
    const isApproveMining = approveErc20State.status === "Mining"
    const approveButtonPressed = () => {
        console.log("approveButtonPressed - amount: ", amount, "amountDecimals", amountDecimals)
        return approveErc20(amountDecimals)
    }


    const submitForm = () => {
        setUserMessage(undefined)
        if (isValidAmount) {
            submitDeposit()
        } else {
            console.log("invalid amount:", amount, amountDecimals)
        }
    }


  
    const allowanceOk = formattedAllowance !== undefined && 
                        amount !== undefined && amount !== '' && 
                        (parseFloat(formattedAllowance) >= Number(amount) )


    // Deposit Tokens
    const { deposit, depositState } = useDeposit(chainId, poolId)
    const isDepositMining = depositState.status === "Mining"

    const submitDeposit = () => {
        console.log("submitDeposit - amount: ", amount, "amountDecimals", amountDecimals)
        return deposit(amountDecimals)
    }


    

    const submitButtonTitle = "Deposit"

    const explorerHost = NetworkExplorerHost(chainId)
    const approveLink =  (approveErc20State.status === 'Success' && approveErc20State.receipt)? `https://${explorerHost}/tx/${approveErc20State.receipt.transactionHash}` : ""
    const depositLink =  (depositState.status === 'Success' && depositState.receipt)? `https://${explorerHost}/tx/${depositState.receipt.transactionHash}` : ""

    useEffect(() => {
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve Token Transfer"
        ).length > 0) {
            //TODO update UI
            console.log("Token transfer approved. New allowance: ", formattedAllowance)

            const info : SnackInfo = {
                type: "info",
                title: "Success",
                message: "Token transfer approved",
                linkUrl: approveLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 15000
            }
            setUserMessage({
                type: "info",
                title: "Token transfer approved",
                message: "Now you can deposit the tokens",
            })
            handleSuccess(info)
        }
        // deposit success
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Deposit Tokens"
        ).length > 0) {

            console.log("Deposit notifications:", notifications)

            const info : SnackInfo = {
                type: "info",
                title: "Success",
                message: "Deposit completed",
                linkUrl: depositLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 15000
            }
            setUserMessage({
                type: "info",
                title: "Deposit completed",
                message: isFirstDeposit ? "Now you can view your portfolio" : "Now you can close the window",
            })
            handleSuccess(info)
            setAmountDecimals("")
            setAmount('')
        }

    }, [notifications, chainId, approveLink, depositLink, formattedAllowance])


    const appprovedTransfer = allowanceOk || (userMessage && userMessage.title === 'Token transfer approved')
    const showCloseButton = Number(balance) == 0 || (userMessage && userMessage.title === 'Deposit completed') ? true : false

    const showDepositButton = !showCloseButton && (amount == '' ||  appprovedTransfer || isDepositMining) // (allowanceOk || isDepositMining) && !isApproveMining
    const showApproveButton = !showCloseButton && !showDepositButton &&  (isApproveMining || (!appprovedTransfer && !isDepositMining)) // !allowanceOk  &&  !isDepositMining

    // console.log(">>> balance: ", showCloseButton, ",  amount:", amount, "appprovedTransfer", appprovedTransfer, "allowanceOk", allowanceOk, "isApproveMining", isApproveMining, " ==> showApproveButton", showApproveButton,  "showCloseButton", showCloseButton)

    return (
        <Box p={3}>
            
            <div className={classes.container}>

                { userMessage &&
                    <div className={classes.info}>
                        <StyledAlert severity={userMessage?.type}>
                            <AlertTitle> {userMessage?.title} </AlertTitle>
                            {userMessage?.message}
                        </StyledAlert>
                    </div>
                }
                
                { Number(balance) > 0  &&
                    <Box pb={1} >
                        <h1 className={classes.title}> Deposit {symbol} </h1>
                        <ol>
                            <li>
                                <Typography color="textSecondary"> Approve token transfer {( showCloseButton || (showDepositButton && appprovedTransfer) ) && <span>✅</span> } </Typography> 
                            </li>
                            <li>
                                <Typography color="textSecondary">  Deposit { showCloseButton && <span>✅</span> }</Typography>
                            </li>
                        </ol>   
                    </Box>
                }
       

                { Number(balance) === 0  &&
                    <div >
                        <StyledAlert severity="warning">
                            <AlertTitle> You have no USDC to deposit </AlertTitle>
                            You can get {token.symbol} tokens directly on Polygon using <Link href="https://quickswap.exchange/#/swap" target="_blank"> QuickSwap</Link>,
                            or transfer {token.symbol} from Ethereum to Polygon via the <Link href="https://wallet.polygon.technology/bridge" target="_blank">Polygon Bridge</Link>
                        </StyledAlert>
                    </div>
                }
                
                { Number(balance) >= 0 &&
                    <Box>

                        <Box mt={3} mb={2}>

                            <Grid container justifyContent="flex-start"> 
                                <Link href="#" color="inherit" variant="body2" onClick={() => balancePressed()} style={{textDecoration: "underline", paddingBottom: 20}} >
                                    Balance: {balance} 
                                </Link>
                            </Grid>

                            <Grid container >

                                {/* first row */}
                                <Grid item xs={8} >
                                    <Horizontal valign="center">
                                        <Input className={classes.amount} inputProps={{min: 0, style: { textAlign: 'right' }}}  
                                            value={amount} placeholder="0.0" autoFocus onChange={handleInputChange} />
                                    </Horizontal>
                                </Grid> 
                                <Grid item xs={4} >
                                    <Box pt={2} pl={2}>
                                        <Typography color="textSecondary" variant="body1">{symbol}</Typography>
                                    </Box>
                                </Grid> 

                            </Grid>
                
                        </Box>
                    </Box>
                }

                { Number(balance) > 0 &&
                    <Box mb={2} pt={3} >
                        { showApproveButton &&
                            <Button  style={{ minWidth: 150 }} variant="contained" color="secondary" fullWidth
                                onClick={() => approveButtonPressed()} >
                                Approve Transfer
                                { isApproveMining && <Horizontal>  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                            </Button>
                        }

                        { showDepositButton && (!userMessage || userMessage.title !== 'Deposit completed') &&
                            <Button  style={{ minWidth: 150 }} variant="contained" color="primary" fullWidth 
                                onClick={() => submitForm()} >
                                { submitButtonTitle }
                                { isDepositMining && <Horizontal >  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                            </Button>
                        }

                        { showCloseButton &&
                            <Button  style={{ minWidth: 150 }} variant="contained" color="primary" fullWidth onClick={handleClose} >
                                    { isFirstDeposit ? "View portfolio" : "Close" }
                            </Button>
                        }
                    </Box>
                }  
            
            </div>
        
            { (approveErc20State.status === 'Mining' || depositState.status  === 'Mining') ? 
                    <Typography color="textSecondary" variant="body2" align="center">  Mining... </Typography> : 
                (approveErc20State.status === 'Exception' || depositState.status  === 'Exception' ) ? 
                    <Typography color="error" variant="body2" >  
                        { approveErc20State.errorMessage } { depositState.errorMessage } 
                    </Typography> : ''
            }

        </Box>
    )
}


