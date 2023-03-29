import React, { useState, useEffect } from "react"
import { useNotifications } from "@usedapp/core"
import { BigNumber } from "ethers"

import { useTokenApprove, useTokenAllowance, useTokenBalance } from "../../hooks"
import { useDepositAndStartStake, useEndStakeAndWithdraw } from "../../hooks/useFarm"


import { Box, Grid, Button, Input, CircularProgress, Divider, Typography, Link, makeStyles } from "@material-ui/core"
import { AlertTitle } from "@material-ui/lab"
import { StyledAlert } from "../shared/StyledAlert"

import { SnackInfo } from "../SnackInfo"
import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"
import { toDecimals, fromDecimals } from "../../utils/formatter"
import { NetworkExplorerHost, NetworkExplorerName, FarmAddress } from "../../utils/network"



export interface StakeFormProps {
    formType? :  "stake" | "unstake";
    chainId: number,
    poolId: string,
    token : Token,
    balance: string,
    account: string;
    
    handleSuccess: (result: SnackInfo) => void,
    handleError: (error: SnackInfo) => void,
    allowanceUpdated: () => void;
    onClose: () => void
}


const useStyle = makeStyles( theme => ({
    title: {
        fontWeight: 700,
        fontSize: 20,
    },
    container: {
        padding: 0,
        width: '100%',
        maxWidth: 360,
    },
    section1: {
        margin: `${theme.spacing(2)}px ${theme.spacing(2)}px`
    },
    tokenImg: {
        height: "30px",
        width: "30px",
        marginRight: 20,
        marginLeft: 0,
    },
    amountWithLabel: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20, 
        marginBottom: 50,
        marginLeft: 10,
    },
    amount: {
        fontSize: 28,
        fontWeight: 200,
        textAlign: "right",
        marginRight: 20,
    },
    info:{
        margin: "auto"
    }
}))


export const StakeForm = ({ formType, chainId, poolId, token, balance, account, handleSuccess, onClose } : StakeFormProps) => {

    const { symbol } = token

    // PoolLP Token allowance 
    const allowance = useTokenAllowance(chainId, poolId, symbol, FarmAddress(chainId, poolId)) // in token decimals

    const { approveErc20, approveErc20State } = useTokenApprove(chainId, poolId, symbol, FarmAddress(chainId, poolId))

    const classes = useStyle()
    const { notifications } = useNotifications()

    // Token stats
    const tokenBalance = useTokenBalance(chainId, poolId, "pool-lp", account);


    // Form state management
    const [amount, setAmount] = useState<number | string>("")
    const [isValidAmount, setIsValidAmount] = useState<boolean>(false) 
    const [amountDecimals, setAmountDecimals] = useState<string>("")
    const [userMessage, setUserMessage] = useState<SnackInfo>()

    // formatted values
    const [formattedAllowance, setFormattedAllowance] = useState('');


    useEffect(() => {
        if (allowance) {
            setFormattedAllowance( fromDecimals(allowance, token.decimals, 4) )
        }
    }, [allowance, token.decimals])



    // Form Handlers

    const balancePressed = () => {
        updateAmount(balance)
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = event.target.value === "" ? "" : event.target.value.trim()
        updateAmount(newAmount)
    }

    // validates the stake amount and its decimal amount
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
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        console.log("approveButtonPressed - amount: ", amount, "amountDecimals", amountDecimals)
        return approveErc20(amountDecimals)
    }


    const submitForm = () => {
        setUserMessage(undefined)

        if (formType === 'stake') {
            submitDeposit()
        } else if (formType === 'unstake') {
            submitWithdrawal()
        }
    }


    const allowanceOk = formattedAllowance && isValidAmount && (parseFloat(formattedAllowance) >= Number(amount) )

    // Deposit and Stake LP Tokens
    const { deposit, depositState } = useDepositAndStartStake(chainId, poolId)
    const isDepositMining = depositState.status === "Mining"

    const submitDeposit = () => {
        const amountDecimals = toDecimals(amount.toString(), token.decimals)
        return deposit(token.address, amountDecimals)
    }

    // End Stake and Withdraw Tokens
    const { withdraw, withdrawState } = useEndStakeAndWithdraw(chainId, poolId)
    const isWithdrawMining = withdrawState.status === "Mining"
    
    const submitWithdrawal = () => {

        const currentBalance = tokenBalance ? tokenBalance.toString() : balance
        if ( isVeryCloseValues(amountDecimals ,  currentBalance) ) {
            console.log("submitWithdrawal - should withdraw all!  currentBalance => ", currentBalance)
        }
        const withdrawAmount = isVeryCloseValues( amountDecimals ,  currentBalance ) ? currentBalance : amountDecimals
        return withdraw(token.address, withdrawAmount)
    }

    const submitButtonTitle = (formType === 'stake') ? "Stake" : 
                               (formType === 'unstake') ? "Unstake" : "n/a"

    const explorerHost = NetworkExplorerHost(chainId)
    const approveLink =  (approveErc20State.status === 'Success' && approveErc20State.receipt)? `https://${explorerHost}/tx/${approveErc20State.receipt.transactionHash}` : ""
    const depositLink =  (depositState.status === 'Success' && depositState.receipt)? `https://${explorerHost}/tx/${depositState.receipt.transactionHash}` : ""
    const withdrawLink =  (withdrawState.status === 'Success' && withdrawState.receipt)? `https://${explorerHost}/tx/${withdrawState.receipt.transactionHash}` : ""

    useEffect(() => {
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Approve Token Transfer"
        ).length > 0) {
            //TODO udpate UI
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
                message: "Now you can Stake the tokens",
            })
            handleSuccess(info)
        }
        if (notifications.filter((notification) =>
                notification.type === "transactionSucceed" &&
                notification.transactionName === "Deposit and Stake Tokens"
        ).length > 0) {
            const info : SnackInfo = {
                type: "info",
                title: "Success",
                message: "Staking of LP tokens completed",
                linkUrl: depositLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 15000
            }
            setUserMessage({
                type: "info",
                title: "Staking completed",
                message: "Now you can close the window",
            })
            handleSuccess(info)
            setAmountDecimals("")
        }

        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Unstake and Withdraw Tokens"
        ).length > 0) {
            const info : SnackInfo = {
                type: "info",
                title: "Success",
                message: "Unstaking of LP tokens completed",
                linkUrl: withdrawLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 15000
            }
            setUserMessage({
                type: "info",
                title: "Unstaking completed",
                message: "Now you can close the window",
            })
            handleSuccess(info)
            setAmountDecimals("")
        }
    }, [notifications, chainId, approveLink, depositLink, withdrawLink, formattedAllowance, handleSuccess])

    
    const showApproveButton =  (isApproveMining || (!allowanceOk && !isDepositMining)) // !allowanceOk  &&  !isDepositMining
    const showDepositButton =  ( !(isApproveMining || (!allowanceOk && !isDepositMining)) && (allowanceOk || isDepositMining)) // (allowanceOk || isDepositMining) && !isApproveMining
    console.log("allowanceOk", allowanceOk, "formattedAllowance: ", formattedAllowance, "amount", amount, "isValidAmount", isValidAmount, "isApproveMining", isApproveMining, " ==> showApproveButton", showApproveButton)


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
                
                <div className={classes.section1}>
                    <h1 className={classes.title}> { formType === 'stake' ? `Stake ${symbol}` : `Unstake ${symbol}` } </h1>
                    <Typography color="textSecondary"> 
                        { formType === 'stake' ? 
                            "First approve the token transfer and then Stake the tokens" : 
                            "Unstake LP tokens to withdraw your funds in the Pool" 
                        }
                    </Typography>
                </div>
                
                <Divider />

                <Box mt={3} mb={4}>
                    <Grid container justifyContent="flex-start"> 
                        <Link href="#" color="inherit" variant="body2" onClick={() => balancePressed()} style={{textDecoration: "underline"}} >
                            Balance: {balance} 
                        </Link> 
                    </Grid>

                    <Grid container justifyContent="space-between">
                        {/* first row */}
                        <Grid item xs={9} >
                            <Input className={classes.amount} inputProps={{min: 0, style: { textAlign: 'right' }}}  
                                value={amount} placeholder="0.0" autoFocus onChange={handleInputChange} /> 
                        </Grid> 
                        <Grid item xs={3} >
                            <Box style={{paddingTop: 12, paddingLeft: 5}}>
                                <Typography color="textSecondary" variant="body1" style={{minWidth:70}}>{symbol}</Typography>
                            </Box>
                        </Grid> 
                        <Grid item xs={2} > </Grid> 
                    </Grid>

                </Box>

                { formType === 'stake' &&
                    <Box mb={2} >
                        { showApproveButton &&
                        <Button variant="contained" color="secondary" fullWidth disabled={ !isValidAmount }
                            onClick={() => approveButtonPressed()} >
                            Approve transfer
                            { isApproveMining && <Horizontal>  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                        </Button>
                        }


                        { showDepositButton && 
                        <Button variant="contained" color="primary" fullWidth  
                            onClick={() => submitForm()} >
                            { submitButtonTitle }
                            { isDepositMining && <Horizontal >  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                        </Button>
                        }

                        { userMessage && userMessage.title === 'Staking completed' &&
                            <Box mt={2} >
                                <Button variant="contained" color="secondary" fullWidth onClick={onClose} >
                                    Close
                                </Button>
                            </Box>
                        }
                    </Box>
    
                }  
                { formType === 'unstake' &&
                    <Box mb={2} >
                        <Button variant="contained" color="primary" fullWidth disabled={ !isValidAmount }
                            onClick={() => submitForm()}>
                            { submitButtonTitle }
                            { isWithdrawMining && <Horizontal>  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                        </Button>
                        { userMessage && userMessage.title === 'Unstaking completed' &&
                            <Box mt={2} >
                                <Button variant="contained" color="secondary" fullWidth onClick={onClose} >
                                    Close
                                </Button>
                            </Box>
                        }
                    </Box>
                }

            </div>
        
            {
                (approveErc20State.status === 'Mining' || depositState.status  === 'Mining' || withdrawState.status === 'Mining' ) ? 
                    <Typography color="textSecondary" variant="body2" >  Mining... </Typography> : 
                (approveErc20State.status === 'Exception' || depositState.status  === 'Exception' || withdrawState.status === 'Exception' ) ? 
                    <Typography color="error" variant="body2" >  
                        { approveErc20State.errorMessage } { depositState.errorMessage } { withdrawState.errorMessage }
                    </Typography> : ''
            }
        </Box>
    )
}


// returns true if the 2 values are closer than 0.01 % difference
const isVeryCloseValues = (value1: string, value2: string) : boolean => {
    const a = BigNumber.from(value1) 
    const b = BigNumber.from(value2)
    if (a.eq(BigNumber.from(0)) && b.eq(BigNumber.from(0))) return true

    const diff = a.gte(b) ? a.sub(b) : b.sub(a)
    const max = a.gte(b) ? a : b
    const percDiff = diff.mul(BigNumber.from(1000)).div(max)

    return percDiff.toNumber()  < 1
}