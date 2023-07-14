
import { makeStyles, Link, Box, Typography, Breadcrumbs, Divider } from "@material-ui/core"

import { PoolTabs } from "./PoolTabs"
import { Token } from "../../../types/Token"

import { PoolInfo } from "../../../utils/pools"
import { Contracts } from "../../shared/Contracts"

import { Link as RouterLink } from "react-router-dom"


interface PoolHomeProps {
    poolId: string,
    chainId: number,
    account?: string,
    tokens: Token[],
    investToken: Token,
}

const useStyles = makeStyles( theme => ({

    container: {
        maxWidth: 1200,
        margin: 'auto',
        paddingTop: theme.spacing(2),
  
        [theme.breakpoints.up('xs')]: {
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
        },
    }
}))


export const PoolHome = ({ chainId, poolId, account, tokens, investToken } : PoolHomeProps) => {
    
    const { name } = PoolInfo(chainId, poolId)
    const classes = useStyles()

    return (
        <Box className={classes.container}>
            <Box px={2}>
                <Breadcrumbs aria-label="breadcrumb" >
                    <Link component={RouterLink} to="/"> Home </Link>
                    <Link component={RouterLink} to="/invest"> Invest </Link>
                    <Typography>{name}</Typography>
                </Breadcrumbs>
            </Box>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}}/>

            <PoolTabs chainId={chainId!} poolId={poolId} account={account} tokens={tokens} investToken={investToken} />
            <Contracts chainId={chainId} poolId={poolId} />
        </Box>
    )
}




