import { useState } from "react"
import { useEthers, useTokenBalance } from "@usedapp/core"
import { Box, Grid, Button, Link, makeStyles } from  "@material-ui/core"
import { AlertTitle } from "@material-ui/lab"

import { useStakedTokenBalance } from "../../hooks/useFarm"

import { StyledAlert } from "../shared/StyledAlert"
import { TitleValueBox } from '../TitleValueBox'
import { DepositForm } from './DepositForm'
import { WithdrawForm } from './WithdrawForm'
import { SnackInfo } from "../SnackInfo"
import { Modal } from "../Modal"
import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { PoolInfo } from "../../utils/pools"



interface DepositWithdrawViewProps {
  formType: "deposit" | "withdraw",
  chainId: number,
  poolId: string,
  token: Token;
  handleSuccess: (result: SnackInfo) => void,
  handleError: (error: SnackInfo) => void,
}


const useStyle = makeStyles( theme => ({
  container: {
    margin: "auto",
    padding: theme.spacing(1),
    textAlign: 'center',
    maxWidth: "500px",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  balanceView: {
    marginBottom: "20px",
  }
}))



export const DepositWithdrawView = ( { formType, chainId, poolId, token, handleSuccess, handleError } : DepositWithdrawViewProps ) => {

  const classes = useStyle()
  const [showUDepositWithdrawModal, setShowUDepositWithdrawModal] = useState(false);
  const [formTypeValue, setFormTypeValue] = useState(formType);

  const { symbol, address } = token
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(address, account)
  const formattedTokenBalance = tokenBalance ? fromDecimals(tokenBalance, token.decimals, 6) : ''

  const tokenStakedBalance = useStakedTokenBalance(chainId, poolId, account)
  const formattedTokenStakedBalance = tokenStakedBalance && fromDecimals(tokenStakedBalance, token.decimals, 2)



  const showModalPressed = (buttonType: 'deposit' | 'withdraw') => {
    if (Number(formattedTokenBalance) > 0) {
        setShowUDepositWithdrawModal(true)
    }
    setFormTypeValue(buttonType)
  }

  const hideModalPreseed = () => {
    setShowUDepositWithdrawModal(false)
    setFormTypeValue('deposit')
  }

  const handleAllowanceUpdated = () => {
    console.log("handleAllowanceUpdated")
  }
  
  return (
      <Box className={classes.container}>

           {  formType === 'deposit' &&  chainId === 137  && formattedTokenBalance && formattedTokenBalance === "0" &&
              <StyledAlert severity="info" style={{textAlign: "center", marginBottom: 20}} > 
                  <AlertTitle>No {symbol} to deposit</AlertTitle>
                  You can get {token.symbol} tokens directly on Polygon using <Link href="https://quickswap.exchange/#/swap" target="_blank"> QuickSwap</Link>,
                  or transfer {token.symbol} from Ethereum to Polygon via the <Link href="https://wallet.polygon.technology/bridge" target="_blank">Polygon Bridge</Link>
              </StyledAlert>
          }

          {  formType === 'withdraw' &&  chainId === 137 && formattedTokenStakedBalance && Number(formattedTokenStakedBalance) > 0 &&
              <StyledAlert severity="info" style={{textAlign: "center", marginBottom: 20}} > 
                  <AlertTitle>You have {formattedTokenStakedBalance} staked {symbol} tokens</AlertTitle>
                  Unstake your {symbol} tokens before you can withdraw those funds.
              </StyledAlert>
          }

          {  formType === 'deposit' && PoolInfo(chainId, poolId) === 'true' &&
              <StyledAlert severity="info" style={{textAlign: "center", marginBottom: 20}} > 
                  <AlertTitle>Deposits Disabled</AlertTitle>
                  Can't deposit into a disabled { poolId.startsWith("index") ? "Index" : "Pool" }. Withdraw your funds and transfer them into the upgraded v3 { poolId.startsWith("index") ? "Index" : "Pool" }
              </StyledAlert>
          }


          <div className={classes.balanceView} onClick={(e) => showModalPressed( (formType === 'withdraw') ? "withdraw" :  "deposit" )} >
                <TitleValueBox title={`Available to ${formType}`} value={formattedTokenBalance} suffix={symbol} border={true} />
          </div>
          <Box sx={{ flexGrow: 1, pt: 2 }}>
              <Grid container>
                { formType === 'deposit' &&
                  <Grid item xs={12}>
                      <Box >
                          <Button disabled={ (PoolInfo(chainId, poolId).disabled === 'true') || Number(formattedTokenBalance) === 0 } name="deposit" variant="contained" color="primary" onClick={(e) => showModalPressed("deposit")}>
                            Deposit
                          </Button>
                      </Box>
                  </Grid>
                }
                { formType === 'withdraw' &&
                  <Grid item xs={12}>
                      <Box>
                          <Button disabled={ Number(formattedTokenBalance) === 0 } name="withdraw" variant="contained" color="primary" onClick={(e) => showModalPressed("withdraw")}>
                            Withdraw
                          </Button>
                      </Box>
                  </Grid>
                }
              </Grid>
          </Box>
          

          { showUDepositWithdrawModal && account && (
            <Modal onClose={(e) => hideModalPreseed()}>
              { formTypeValue === "deposit" && 
                <DepositForm
                  balance={formattedTokenBalance}
                  chainId={chainId}
                  poolId={poolId}
                  token={token}
                  account={account}
                  handleSuccess={handleSuccess}
                  handleError={handleError}
                  allowanceUpdated={handleAllowanceUpdated}
                  onClose={hideModalPreseed}
                /> 
              }

              { formTypeValue === "withdraw" && 
                <WithdrawForm
                  balance={formattedTokenBalance}
                  chainId={chainId}
                  poolId={poolId}
                  token={token}
                  account={account}
                  handleSuccess={handleSuccess}
                  handleError={handleError}
                  allowanceUpdated={handleAllowanceUpdated}
                  onClose={hideModalPreseed}
                /> 
              }
            </Modal>
          )}
      </Box>
    )

}