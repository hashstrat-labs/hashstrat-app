import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useEthers } from "@usedapp/core";
import { Typography, Box,  makeStyles } from "@material-ui/core"

import { utils } from "ethers"
import { Horizontal } from "../Layout"
import logo from './img/hs.svg'

interface AssetValueProps {
    value: number,
}

const useStyles = makeStyles( theme => ({

    container: {
        backgroundColor: theme.palette.type === 'light' ? '#fff' :'#000',
        paddingTop: 20,
        paddingBottom: 20,

        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 8,
        [theme.breakpoints.down('xs')]: {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 10,
            paddingRight: 10,
        },
    },
    avatar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        width: 96,
        height: 96,
        // border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: 8,
        backgroundColor: '#E1E1E1',

        [theme.breakpoints.down('xs')]: {
            width: 86,
            height: 86,
        },
    }
}))


export const AssetValue = ({ value }: AssetValueProps) => {

    const { account } = useEthers()
    const classes = useStyles()

    return (
        <Box className={classes.container}>

            <Horizontal align='left' valign='center'>
                <Box className={classes.avatar}>
                    <img src={logo} />
                </Box>
                <Box pl={1}>
                    <Typography color="textSecondary">Total Value Managed</Typography>
                    <Typography style={{ fontSize: 40, fontWeight: 500 }}>
                        ${ utils.commify( value ) }
                    </Typography>
                </Box>
            </Horizontal>
            
        </Box>
    )
}