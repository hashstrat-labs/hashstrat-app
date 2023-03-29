


import { makeStyles, Link, Typography, Box } from  "@material-ui/core"
import { NetworkExplorerHost, PoolAddress, PoolLPTokenAddress, StrategyAddress, FeedAddress,
      HstTokenAddress, FarmAddress, DaoOperationsAddress, DivsDistributorAddress, TreasuryAddress } from "../../utils/network"
import { Horizontal } from "../Layout"

const useStyle = makeStyles( theme => ({
    root: {
        overflowX: 'auto',
        overflowY: 'hidden',
        whiteSpace: 'nowrap',
    },
    gridList: {
        transform: 'translateZ(0)',
        minWidth: 900,
        paddingBottom: 10
      }
}))


export interface ContractsProps {
    chainId: number,
    poolId?: string,
}


export const Contracts = ( { chainId, poolId } : ContractsProps ) => {

    const classes = useStyle()

    const explorerHost = NetworkExplorerHost(chainId) ?? "polygonscan.com"
    const hstAddress = HstTokenAddress(chainId)
    const farmAddress = FarmAddress(chainId)
    const daoOperationsAddress = DaoOperationsAddress(chainId)
    const divsDistributorAddress = DivsDistributorAddress(chainId)
    const treasuryAddress = TreasuryAddress(chainId)

    const poolAddress = poolId && PoolAddress(chainId, poolId)
    const lpTokenAddress = poolId && PoolLPTokenAddress(chainId, poolId)
    const isIndex = poolId && poolId.startsWith("index")
    const strategyAddress = poolId && !isIndex && StrategyAddress(chainId, poolId)
    const feedAddress = poolId && !isIndex && FeedAddress(chainId, poolId)

    

    return (
        <Box my={2} px={2}>
            
            <div className={classes.root}>
                    <div className={classes.gridList}>
                    <Horizontal>
                        <Typography variant="body2">Contracts:</Typography>
                        { poolAddress && <Link href={`https://${explorerHost}/address/${poolAddress}` } target="_blank">Pool</Link> }
                        { lpTokenAddress && <Link href={`https://${explorerHost}/address/${lpTokenAddress}` } target="_blank">LP Token</Link> }
                        { strategyAddress && <Link href={`https://${explorerHost}/address/${strategyAddress}` } target="_blank">Strategy</Link> }
                        { feedAddress && <Link href={`https://${explorerHost}/address/${feedAddress}` } target="_blank">Price feed</Link> }

                        <Link href={`https://${explorerHost}/address/${hstAddress}` } target="_blank">HST Token</Link>
                        <Link href={`https://${explorerHost}/address/${farmAddress}` } target="_blank">HST Farm</Link>
                        
                        <Link href={`https://${explorerHost}/address/${daoOperationsAddress}` } target="_blank">DAO Operations</Link>
                        <Link href={`https://${explorerHost}/address/${divsDistributorAddress}` } target="_blank">Divs Distributor</Link>
                        <Link href={`https://${explorerHost}/address/${treasuryAddress}` } target="_blank">Treasury</Link>
                    </Horizontal>
                </div>
            </div>
        </Box>




    )
}