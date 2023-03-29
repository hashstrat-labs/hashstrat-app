
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom"

import { makeStyles, Link, Typography, Breadcrumbs, Box , Button, Divider} from "@material-ui/core"
import { Launch } from "@material-ui/icons"

import { useUsersForPools, useUsersForIndexes } from '../../hooks/usePoolInfo'
import { InvestTokens, DepositToken } from "../../utils/pools"
import { shortenAccount } from "../../utils/formatter"
import { IndexesIds, PoolIds } from "../../utils/pools"
import { MyPortfolioAssetsSummary } from "../dashboard/MyPortfolioAssetsSummary"
import { Horizontal } from "../Layout";



interface UsersHomeProps {
    chainId: number,
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    }
}))


export const UsersHome = ({ chainId } : UsersHomeProps) => {

    const [account, setAccount] = useState<string | undefined>()
    
    const loadData = (account: string) => {
        setAccount(account)
    }

    const classes = useStyles()
    const usersPools = useUsersForPools(chainId, PoolIds(chainId))
    const usersIndexes = useUsersForIndexes(chainId, IndexesIds(chainId))
    
    const users = new Set<string>()
    usersPools.forEach(users.add, users)
    usersIndexes.forEach(users.add, users)

    const accounts = Array.from(users.values()).map( (account : string) => {
        return (
            <Box ml={3} key={account}>
                <Horizontal valign="center">
                    <Button onClick={ () => loadData(account) } > {shortenAccount(account)} </Button> 
                    <Link key={account} href={`https://polygonscan.com/address/${account}`} target="_blank"> <Launch/> </Link>
                </Horizontal>
            </Box>
        )
    })


    const depositToken = DepositToken(chainId) 
    const investTokens = InvestTokens(chainId)

    return (
        <div className={classes.container}>
            
            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/"> Home </Link>
                <Typography>Accounts</Typography>
            </Breadcrumbs>

            <Box>
                <Horizontal>
                { accounts }
                </Horizontal>
            </Box>

            <Divider style={{marginTop:30, marginBottom: 30}}/>

            <Typography align="center" variant="h5"> {account} </Typography>

            <Divider style={{marginTop:30, marginBottom: 30}}/>

            { account && 
                <MyPortfolioAssetsSummary chainId={chainId} connectedChainId={undefined} depositToken={depositToken!} investTokens={investTokens} account={account} />
            }
        </div>
    )
}


