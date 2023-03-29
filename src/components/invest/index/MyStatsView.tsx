import { makeStyles, Box, Accordion, AccordionDetails, AccordionSummary, Typography } from  "@material-ui/core"
import { utils } from "ethers"

import { TitleValueBox } from "../../TitleValueBox"
import { Token } from  "../../../types/Token"
import { useGetDeposits, useGetWithdrawals } from "../../../hooks/useIndex"
import { useIndexModel } from "./IndexModel"

import { fromDecimals } from "../../../utils/formatter"
import { BigNumber } from "ethers"
import { InvestTokens } from "../../../utils/pools"
import { ExpandMore } from "@material-ui/icons"


const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 0,
    },
    portfolioInfo: {
        maxWidth: 640,
        margin: "auto",
        padding: theme.spacing(1)
    }
}))


interface MyStatsViewProps {
    chainId: number,
    poolId: string,
    account: string,
    depositToken: Token
}


export const MyStatsView = ( { chainId, poolId, account, depositToken } : MyStatsViewProps ) => {

    const classes = useStyle()

    const tokens =  [depositToken, ...InvestTokens(chainId)]
    const { indexInfo, portfolioInfo } = useIndexModel(chainId, poolId, tokens, depositToken, account)
    const deposits = useGetDeposits(chainId, poolId, account)
    const withdrawals = useGetWithdrawals(chainId, poolId, account)
    
    
    const formattedPortfolioValue = portfolioInfo.totalValue ? fromDecimals(portfolioInfo.totalValue, depositToken.decimals, 2) : undefined
    const formattedDeposits = deposits ? fromDecimals(deposits, depositToken.decimals, 2) : ""
    const formattedWithdrawals = withdrawals ? fromDecimals(withdrawals, depositToken.decimals, 2) : ""
    const roiFormatted = (formattedPortfolioValue && formattedWithdrawals && formattedDeposits && parseFloat(formattedDeposits) > 0) ? 
                        String(Math.round( 10000 * (parseFloat(formattedWithdrawals) + parseFloat(formattedPortfolioValue) - parseFloat(formattedDeposits)) / parseFloat(formattedDeposits)) / 100 ) : 'n/a'

    
    const assetViews = indexInfo?.tokenInfoArray?.map( token => {
        const balance = token.accountBalance ?? BigNumber.from(0)
        const value = token.accountValue ?? BigNumber.from(0)
        const decimals = token.decimals
        // fromDecimals( item.balance, item.decimals, item.symbol === 'USDC' ? 2 : 4),
        const accountBalanceFormatted = fromDecimals(balance, decimals, token.symbol === 'USDC' ? 2 : 4 ) as any
        const accountValueFormatted = fromDecimals(value, depositToken.decimals, 2 ) as any
        const valueFormatted = `${utils.commify(accountBalanceFormatted)} (${utils.commify(accountValueFormatted)} ${ depositToken.symbol }) `

        return { symbol: token.symbol, valueFormatted, balance, value }
    }).map( it => <TitleValueBox key={it.symbol} title={it.symbol} value={it.valueFormatted} /> )


    return (
        <Box className={classes.container}  >
            <Box className={classes.portfolioInfo} >

                { assetViews }

                <div style={{marginBottom: 20}} />

                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                        <Typography > Portfolio Info </Typography>
                    </AccordionSummary>
                    <AccordionDetails >
                        <Box>
                            <TitleValueBox mode="small" title="Assets Value" value={utils.commify(formattedPortfolioValue??"")} suffix={depositToken.symbol} />
                            {/* <TitleValueBox mode="small" title="My Index share" value={lpPercFormatted} suffix="%" /> */}
                            <TitleValueBox mode="small" title="Deposits" value={utils.commify(formattedDeposits)} suffix={depositToken.symbol} />
                            <TitleValueBox mode="small" title="Withdrawals" value={utils.commify(formattedWithdrawals)} suffix={depositToken.symbol} />
                            <TitleValueBox mode="small" title="ROI" value={roiFormatted??""} suffix="%" />
                        </Box>
                    </AccordionDetails>
                </Accordion>
              
            </Box>
        </Box>
    )
}

