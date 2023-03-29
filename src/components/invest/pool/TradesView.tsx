import { Box, makeStyles } from "@material-ui/core"
import { Token } from "../../../types/Token"
import { fromDecimals, round } from "../../../utils/formatter"
import { DataGrid, GridColDef } from "@material-ui/data-grid"
import { useSwapInfoArray } from "../../../hooks"


const useStyle = makeStyles( theme => ({
    container: {
        margin: 0,
        padding: 10,
        maxWidth: 800
    },
    chart: {
        maxWidth: 700,
        margin: "auto"
    }
}))


interface PoolStatsViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
    investToken: Token
}


export const TradesView = ( { chainId, poolId, depositToken, investToken } : PoolStatsViewProps ) => {

    const classes = useStyle()

    // arraay of trades made in chronological order
    const swaps = useSwapInfoArray(chainId, poolId)


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
            // valueFormatter: (params) => {
            //     return params.value;
            // },
        },
        {
            field: 'stableAssetTradedAmount',
            headerName: `${depositToken.symbol} Traded`,
            description: 'The amount of the stable asset sold or bought',
            type: 'string',
            sortable: false,
            width: 150,
            // valueFormatter: (params) => {
            //     return params.value;
            // },
          },
          {
            field: 'feedPrice',
            headerName: 'Price',
            type: 'number',
            width: 120,
            sortable: false,
        },
    ];

    // Trades table rows
    const rows = swaps?.slice().reverse()?.map( (data: any, index: number) => {

        const date = new Date(data.timestamp * 1000)
        const feedPrice = parseFloat(fromDecimals(data.feedPrice, 8, 2))

        const tradeSideFactor = data.side === 'BUY' ? 1.0 : -1.0
        const amount1 = data.side === 'BUY' ? data.bought : data.sold
        const amount2 = data.side === 'BUY' ? data.sold : data.bought
        const riskAssetAmountTraded = parseFloat(fromDecimals(amount1, investToken.decimals, 6))
        const stableAssetAmountTraded =  parseFloat(fromDecimals(amount2, depositToken.decimals, 2))

        // perc risk asset traded
        const riskAssetBalance = parseFloat(fromDecimals(data.investTokenBalance, investToken.decimals, 6))
        const riskAssetTradedPerc = round(100 * riskAssetAmountTraded  / ( riskAssetBalance + (data.side === 'BUY' ? 0 : riskAssetAmountTraded) ))

        // perc stable asset traded
        const stableAssetBalance = parseFloat(fromDecimals(data.depositTokenBalance, depositToken.decimals, 2))
        const stableAssetTradedPerc = round(100 * stableAssetAmountTraded / (stableAssetBalance + (data.side === 'BUY' ? stableAssetAmountTraded : 0) ))

        return {
            id: index,
            date: date,
            side: data.side,
            feedPrice: feedPrice,
            riskAssetTradedAmount: `${tradeSideFactor * riskAssetAmountTraded} (${riskAssetTradedPerc}%)`,
            stableAssetTradedAmount: `${-tradeSideFactor * stableAssetAmountTraded} (${stableAssetTradedPerc}%)`,
        }
    })
  
  

    return (
        <Box className={classes.container}>
            { rows && 
                <Box> 
                    <div style={{ height: rows.length * 56 + 110, width: '100%', marginTop: 20 }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                    />
                    </div>
                </Box> 
            }
        </Box>
    )
}
