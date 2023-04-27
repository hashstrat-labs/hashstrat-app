import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useEthers } from "@usedapp/core";
import { Typography, Box,  makeStyles } from "@material-ui/core"

import { utils } from "ethers"
import { Horizontal } from "../Layout"


interface AssetValueProps {
    value: number,
}

const useStyles = makeStyles( theme => ({

    title: {
        textAlign: 'center',
        color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[900],
    },


}))


export const AssetValue = ({ value }: AssetValueProps) => {

    const { account } = useEthers()

    const classes = useStyles()

    return (
        <Box textAlign="center">

            <Typography style={{ fontSize: 40, fontWeight: 500 }}  align="center">
                ${ utils.commify( value ) }
            </Typography>

            <Typography className={classes.title }>Total Value Managed (TVL)</Typography>
        </Box>
    )
}