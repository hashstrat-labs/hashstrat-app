import { Box } from "@material-ui/core"
import { DataGrid, GridColDef } from "@material-ui/data-grid"
import { BigNumber, utils } from 'ethers'
import { round } from "../../utils/formatter"
import { fromDecimals } from "../../utils/formatter"

import { SwapInfo } from "../../types/SwapInfo"
import { Token } from "../../types/Token"

interface StraetegyTradesProps {
    swaps?: SwapInfo[],
    depositToken: Token,
    investToken: Token,
}


export const StraetegyTrades = ({ swaps, depositToken, investToken }: StraetegyTradesProps ) => {

    // Trades table headers
    const columns: GridColDef[] = [
        { field: 'date', headerName: 'Date', type: 'date', width: 130, sortable: true },
        { field: 'side', headerName: 'Side', width: 90, sortable: false },
        {
            field: 'riskAssetTradedAmount',
            headerName: `${investToken.symbol} Traded`,
            description: 'The amount of the risk asset bought or sold',
            type: 'string',
            sortable: false,
            width: 150,
        },
        {
            field: 'stableAssetTradedAmount',
            headerName: `${depositToken.symbol} Traded`,
            description: 'The amount of the stable asset sold or bought',
            type: 'string',
            sortable: false,
            width: 150,
        },
        {
            field: 'feedPrice',
            headerName: 'Price',
            type: 'number',
            width: 120,
            sortable: false,
        },
        {
            field: 'portfolioValue',
            headerName: 'Portfolio Value',
            type: 'number',
            width: 150,
            sortable: false,
        },
    ]


    // Trades table rows
    const rows = swaps?.slice().sort( (a, b) => Number(b.timestamp) - Number(a.timestamp)  )?.map( (data : SwapInfo, index: number) => {

        const date = new Date( Number(data.timestamp) * 1000)
        const feedPrice = parseFloat(fromDecimals(BigNumber.from(data.feedPrice), 8, 2))

        const tradeSideFactor = data.side === 'BUY' ? 1.0 : -1.0
        const amount1 = data.side === 'BUY' ? BigNumber.from(data.bought) : BigNumber.from(data.sold)
        const amount2 = data.side === 'BUY' ? BigNumber.from(data.sold) : BigNumber.from(data.bought)
        const riskAssetAmountTraded = parseFloat(fromDecimals(amount1, investToken.decimals, 6))
        const stableAssetAmountTraded = parseFloat(fromDecimals(amount2, depositToken.decimals, 2))

        // perc risk asset traded
        const riskAssetBalance = parseFloat(fromDecimals(BigNumber.from(data.investTokenBalance), investToken.decimals, 6))
        const riskAssetTradedPerc = round(100 * riskAssetAmountTraded  / ( riskAssetBalance + (data.side === 'BUY' ? 0 : riskAssetAmountTraded) ))

        // perc stable asset traded
        const stableAssetBalance = parseFloat(fromDecimals(BigNumber.from(data.depositTokenBalance), depositToken.decimals, 2))
        const stableAssetTradedPerc = round(100 * stableAssetAmountTraded / (stableAssetBalance + (data.side === 'BUY' ? stableAssetAmountTraded : 0) ))

        const portfolioValueFormatted = data.portfolioValue && fromDecimals(BigNumber.from(data.portfolioValue), depositToken.decimals, 2)

        return {
            id: index,
            date: date,
            side: data.side,
            feedPrice: feedPrice,
            riskAssetTradedAmount: `${tradeSideFactor * riskAssetAmountTraded} (${riskAssetTradedPerc}%)`,
            stableAssetTradedAmount: `${-tradeSideFactor * stableAssetAmountTraded} (${stableAssetTradedPerc}%)`,
            portfolioValue: portfolioValueFormatted && utils.commify( portfolioValueFormatted )
        }
    })


    return (
        <> 
            { rows && 
                <Box style={{ width: '100%', marginTop: 20 }}>
                    <DataGrid 
                        rows={rows} 
                        columns={columns} 
                        autoPageSize={true} 
                        // disableColumnMenu={true}
                        rowsPerPageOptions={[100, 200]}
                        autoHeight
                    />
                </Box>
            }
        </> 
    )
}