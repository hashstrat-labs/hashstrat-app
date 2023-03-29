
import { makeStyles, Link, Box, Divider, Typography, Breadcrumbs } from "@material-ui/core"

import { PoolInfo } from "../../../utils/pools"

import { IndexTabs } from "./IndexTabs"
import { Token } from "../../../types/Token"
import { Contracts } from "../../shared/Contracts"
import { Link as RouterLink } from "react-router-dom"


interface IndexHomeProps {
    poolId: string,
    chainId: number,
    account?: string,
    tokens: Token[],
    investTokens: Token[],
}


const useStyles = makeStyles( theme => ({

    container: {
        maxWidth: 1200,
        margin: 'auto',

        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),

        [theme.breakpoints.down('xs')]: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
    }
}))


export const IndexHome = ({ chainId, poolId, account, tokens, investTokens } : IndexHomeProps) => {
    
    const { name } = PoolInfo(chainId, poolId)
    const classes = useStyles()

    return (
        <Box className={classes.container}>
            <Box px={2}>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link component={RouterLink} to="/"> Home </Link>
                    <Link component={RouterLink} to="/invest"> Invest </Link>
                    <Typography>{name}</Typography>
                </Breadcrumbs>
            </Box>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}}/>

            <IndexTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens} investTokens={investTokens} />
            <Contracts chainId={chainId} poolId={poolId} />
        </Box>
    )
}




