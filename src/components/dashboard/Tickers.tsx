
import { Box, makeStyles } from "@material-ui/core"
import { utils } from "ethers"
import { InvestTokens } from "../../utils/pools"
import { useStakedLP, useUnstakedLP  } from "../../hooks/useFarm"
import { useTokenBalance } from "../../hooks"
import { fromDecimals } from "../../utils/formatter"
import { Horizontal } from "../Layout"
import { Token } from "../../types/Token"
import { TickerInfo } from "./TickerInfo"


interface DaoHomeProps {
    chainId: number,
    account?: string,
    depositToken: Token
}

const useStyles = makeStyles( theme => ({
    root: {
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
    },
    gridList: {
        width: 560,
        transform: 'translateZ(0)',
        margin: 'auto'
      }
}))


export const Tickers = ({ chainId, account, depositToken } : DaoHomeProps ) => {

    const classes = useStyles()
    const investTokens = InvestTokens(chainId)

    // token balances
    const hstBalance = useTokenBalance(chainId, "", "HST", account)
    const depositTokenBalance = useTokenBalance(chainId, "", depositToken.symbol, account)
    const investTokenBalance0 = useTokenBalance(chainId, "", investTokens[0].symbol, account)
    const investTokenBalance1 = useTokenBalance(chainId, "", investTokens[1].symbol, account)

    const unstakedLPBalance = useUnstakedLP(chainId, account)
    const stakedLPBalance = useStakedLP(chainId, account)

    const formattedHstBalance = hstBalance? fromDecimals(hstBalance, 18, 2) : ""
    const formattedDpositTokenBalance = depositTokenBalance? fromDecimals(depositTokenBalance, depositToken.decimals, 2) : ""

    const formattedUnstakedLPBalance = unstakedLPBalance? fromDecimals(unstakedLPBalance, depositToken.decimals, 2) : ""
    const formattedStakedLPBalance = stakedLPBalance? fromDecimals(stakedLPBalance, depositToken.decimals, 2) : ""

    return (
    
        <Box mt={2} mb={1}  px={1}>
            <div className={classes.root}>
                    <div className={classes.gridList}>
                        <Horizontal valign="center" align="center">
                            <TickerInfo symbol={depositToken.symbol} value={ utils.commify(formattedDpositTokenBalance) } />
                            <TickerInfo symbol="HST" value={ utils.commify(formattedHstBalance) } />
                            <TickerInfo symbol="LP" value={ utils.commify(formattedUnstakedLPBalance) } />
                            <TickerInfo symbol="Staked LP" value={ utils.commify(formattedStakedLPBalance) } />
                        </Horizontal>
                   </div>
            </div>
        </Box>
    )
}


