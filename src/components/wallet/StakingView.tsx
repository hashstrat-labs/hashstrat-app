import { useState } from "react"
import { useEthers, useTokenBalance } from "@usedapp/core"
import { useStakedTokenBalance } from "../../hooks/useFarm"

import { Box, Grid, Button, makeStyles, Typography } from  "@material-ui/core"
import { AlertTitle } from "@material-ui/lab"

import { PoolInfo } from "../../utils/pools"
import { StyledAlert } from "../shared/StyledAlert"
import { TitleValueBox } from '../TitleValueBox'
import { Modal } from "../Modal"
import { Token } from "../../types/Token"
import { fromDecimals } from "../../utils/formatter"
import { SnackInfo } from "../SnackInfo"
import { StakeForm } from "./StakeForm"


interface StakingViewProps {
  formType :  "stake" | "unstake";
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



export const StakingView = ( { chainId, poolId, token, formType, handleSuccess, handleError } : StakingViewProps ) => {

  const classes = useStyle()
  const [showStakeUnstakeModal, setShowStakeUnstakeModal] = useState(false);


  const { symbol, address } = token
  const { account } = useEthers()
  const tokenBalance = useTokenBalance(address, account)
  const formattedTokenBalance = (tokenBalance && fromDecimals(tokenBalance, token.decimals, 2)) || "0.0"

  const tokenStakedBalance = useStakedTokenBalance(chainId, poolId, account)
  const formattedTokenStakedBalance = (tokenStakedBalance && fromDecimals(tokenStakedBalance, token.decimals, 2)) || "0.0"

  const showModalPressed = () => {
    if (formType === 'stake' ? Number(formattedTokenBalance) > 0: Number(formattedTokenStakedBalance) > 0) {
      setShowStakeUnstakeModal(true)
    }
  }

  const hideModalPreseed = () => {
    setShowStakeUnstakeModal(false)
  }

  const handleAllowanceUpdated = () => {
    console.log("handleAllowanceUpdated")
  }
  

  return (
      <Box className={classes.container}>

          { formType === 'stake' && Number(formattedTokenBalance) === 0 &&
              <StyledAlert severity="info" color="info" style={{textAlign: "center", marginBottom: 20 }} > 
                  <AlertTitle>No LP tokens to stake</AlertTitle>
                  Deposit funds into any pool to get LP tokens that you can stake to earn HashStrat DAO tokens (HST).
                  HST token holders can participate in governance and collect protocol "dividends".
              </StyledAlert>
          }
          {formType === 'stake' && Number(formattedTokenBalance) > 0  &&
            <Box mb={3}>
                <Typography>
                        Stake your LP tokens to earn DAO tokens (HST). HST token holders can participate in governance and collect protocol "dividends".
                </Typography>
            </Box>
          }


          <div className={classes.balanceView} onClick={(e) => showModalPressed()} >
            <TitleValueBox title={`Available to ${formType === 'stake' ? 'Stake' : 'Unstake'}`} 
                    value={ formType === 'stake' ? formattedTokenBalance : formattedTokenStakedBalance } suffix={symbol} border={true} />
          </div>
          <Box sx={{ flexGrow: 1, pt: 2 }}>
              <Grid container>
            
                  <Grid item xs={12}>
                      <Box >
                        <Button disabled={ formType === 'stake' ? 
                                            Number(formattedTokenBalance) === 0 || (PoolInfo(chainId, poolId).disabled === 'true') : // disable stake for disabled pools
                                            Number(formattedTokenStakedBalance) === 0
                              } 
                                name={formType === 'stake' ?  "Stake" : "Unstake"} variant="contained" color="primary" onClick={(e) => showModalPressed()}>
                            { formType === 'stake' ?  "Stake" : "Unstake" }
                        </Button> 
                      </Box>
                  </Grid>
              </Grid>
          </Box>
          

          {showStakeUnstakeModal && account && (
            <Modal onClose={(e) => hideModalPreseed()}>

              <StakeForm
                formType={formType}
                balance={ formType === 'stake' ? formattedTokenBalance : formattedTokenStakedBalance }
                chainId={chainId}
                poolId={poolId}
                token={token}
                account={account}
                handleSuccess={handleSuccess}
                handleError={handleError}
                allowanceUpdated={handleAllowanceUpdated}
                onClose={hideModalPreseed}
              /> 
            </Modal>
          )}
      </Box>
    )

}