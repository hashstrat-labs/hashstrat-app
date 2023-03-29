import React, { useState, useEffect } from "react"
import { useNotifications } from "@usedapp/core"
import { BigNumber } from "ethers"

import { Box, Grid, Button, Input, CircularProgress, Typography, Link, makeStyles } from "@material-ui/core"
import { useTokenBalance } from "../../hooks/useErc20Tokens"
import { useLpTokensValue, useWithdraw, useFeesForWithdraw } from "../../hooks/usePool"
import { Token } from "../../types/Token"
import { toDecimals, fromDecimals } from "../../utils/formatter"
import { NetworkExplorerHost, NetworkExplorerName } from "../../utils/network"
import { SnackInfo } from "../SnackInfo"
import { Horizontal } from "../Layout"
import { DepositToken } from "../../utils/pools"


export interface WithdrawFormProps {
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
    section1: {
        margin: `${theme.spacing(2)}px ${theme.spacing(2)}px`
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





export const WithdrawForm = ({ chainId, poolId, token, balance, handleSuccess, handleError, onClose, account} : WithdrawFormProps) => {

    const classes = useStyle()
    const { symbol } = token

    // Token stats 
    // const allowance = useTokenAllowance(chainId, poolId, symbol, PoolAddress(chainId, poolId)) // in token decimals
    const tokenBalance = useTokenBalance(chainId, poolId, "pool-lp", account);

    // form state management
    const [amount, setAmount] = useState<number | string>("")
    const [isValidAmount, setIsValidAmount] = useState<boolean>(false) 
    const [amountDecimals, setAmountDecimals] = useState<string>("")
    const [userMessage, setUserMessage] = useState<SnackInfo>()

    // withdraw only data (fees are only available for pools)
    const lpTokensValue =  useLpTokensValue(chainId, poolId, amountDecimals)
    const feesForWithdraw = useFeesForWithdraw(chainId, poolId, amountDecimals, account)
    const { notifications } = useNotifications()

    // formatted values
    const depositToken = DepositToken(chainId)
    const formattedLTokensValue = lpTokensValue ? fromDecimals( BigNumber.from(lpTokensValue), depositToken!.decimals, 2) : ""
    const formattedFeesToWithdraw = feesForWithdraw ? fromDecimals( BigNumber.from(feesForWithdraw), depositToken!.decimals, 2) : ""


    // Form Handlers

    const handleClose = () => {
        console.log("handleClose")
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

    // validates the deposit/withdrawal amount and its decimal amount
    const updateAmount = (newAmount: string) => {
        setAmount(newAmount)
        const amounDec = Number(newAmount)
        const validAmount = newAmount !== '' && !isNaN(amounDec) 

        const amountDecimals = toDecimals( validAmount ? amounDec.toString() : "0", token.decimals)
        setAmountDecimals(amountDecimals)
        setIsValidAmount(validAmount)
    }


    const submitForm = () => {
        setUserMessage(undefined)
        submitWithdrawal()
    }


    // Withdraw Tokens
    const { withdraw, withdrawState } = useWithdraw(chainId, poolId)
    const isWithdrawMining = withdrawState.status === "Mining"
    
    const submitWithdrawal = () => {
        const currentBalance = tokenBalance ? tokenBalance.toString() : balance
        if ( isVeryCloseValues(amountDecimals ,  currentBalance) ) {
            console.log("submitWithdrawal - should withdraw all => ", currentBalance)
        }
        
        const withdrawAmount = isVeryCloseValues( amountDecimals ,  currentBalance ) ? currentBalance : amountDecimals
        return withdraw(withdrawAmount)
    }


    const submitButtonTitle = "Withdraw"
    const explorerHost = NetworkExplorerHost(chainId)
    const withdrawLink =  (withdrawState.status === 'Success' && withdrawState.receipt)? `https://${explorerHost}/tx/${withdrawState.receipt.transactionHash}` : ""

    useEffect(() => {
        if (notifications.filter((notification) =>
            notification.type === "transactionSucceed" &&
            notification.transactionName === "Withdraw Tokens"
        ).length > 0) {
            const info : SnackInfo = {
                type: "info",
                title: "Success",
                message: "Withdrawal completed",
                linkUrl: withdrawLink,
                linkText: `View on ${NetworkExplorerName(chainId)}`,
                snackDuration: 15000
            }
            setUserMessage({
                type: "info",
                title: "Withdrawals completed",
                message: "Now you can close the window",
            })
            handleSuccess(info)
            setAmountDecimals("")
        }
    }, [notifications, chainId, withdrawLink, handleSuccess])

    

    return (
        <Box p={3}>
            
            <div className={classes.container}>

                { Number(balance) >= 0  &&
                    <Box pb={0} >
                        <h1 className={classes.title}> Withdraw </h1>
                        <Typography color="textSecondary"> Redeem your {token.symbol} tokens for {depositToken?.symbol} </Typography>
                    </Box>
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

      
                                {/* second row */}
                                <Grid item xs={8} >
                                    <Box py={2}>
                                        <Horizontal spacing="between">
                                            <Typography variant="body2">{`${isValidAmount && formattedFeesToWithdraw ? 'fees: ≈ $'+formattedFeesToWithdraw : ' ' }` } </Typography>
                                            <Typography variant="body2">{`${isValidAmount && formattedLTokensValue ? '≈ $'+formattedLTokensValue : ' ' }` } </Typography>
                                        </Horizontal>
                                    </Box>
                                </Grid> 
                                <Grid item xs={4} >&nbsp;</Grid> 
                            </Grid>
                
                        </Box>
                    </Box>
                }

                <Box mb={2} >
                    <Button variant="contained" color="primary" fullWidth disabled={ !isValidAmount }
                        onClick={() => submitForm()}>
                        { submitButtonTitle }
                        { isWithdrawMining && <Horizontal>  &nbsp; <CircularProgress size={22} color="inherit" />  </Horizontal>  }  
                    </Button>
                    { userMessage && userMessage.title === 'Withdrawals completed' &&
                        <Box mt={2} >
                            <Button variant="contained" color="secondary" fullWidth onClick={handleClose} >
                                Close
                            </Button>
                        </Box>
                    }
                </Box>
            
            </div>
        
            { (withdrawState.status === 'Mining' ) ? 
                    <Typography color="textSecondary" variant="body2" align="center">  Mining... </Typography> : 
               withdrawState.status === 'Exception' ? 
                    <Typography color="error" variant="body2" > { withdrawState.errorMessage } </Typography> : ''
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
