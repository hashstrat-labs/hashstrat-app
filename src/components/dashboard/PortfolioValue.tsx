import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useEthers } from "@usedapp/core";
import { Typography, Box,  makeStyles } from "@material-ui/core"

import { utils } from "ethers"
import { Horizontal } from "../Layout"


interface PortfolioValueProps {
    value: number,
    roi?: number | undefined,
}

const useStyles = makeStyles( theme => ({

    avatar: {

         border: `1px solid ${theme.palette.text.secondary}`,
         borderRadius: 6,
         marginRight: 20,
         paddingTop: 20,
         width: 100,
         height: 100, 

         [theme.breakpoints.down('xs')]: {
            paddingTop: 10,
            width: 80,
            height: 80, 
        },
    },

    title: {
        textAlign: 'left',
        color: theme.palette.type === 'light' ? theme.palette.grey[900] : theme.palette.grey[900],
        [theme.breakpoints.down('xs')]: {
            display: 'none'
        },
    },

    values: {
        display: 'flex',
        flexDirection: 'row',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column'
        },
    },

    roi: {
        paddingTop: 0,
        paddingLeft: 50,
        [theme.breakpoints.down('xs')]: {
            paddingTop: 0,
            paddingLeft: 0,
        },
    },
    roiValue: {
        paddingTop: 10,
        fontSize: 24,
        [theme.breakpoints.down('xs')]: {
            paddingTop: 0,
        },
    }

}))


export const PortfolioValue = ({ value, roi }: PortfolioValueProps ) => {

    const { account } = useEthers()

    const roiFormatted = roi && Math.round( roi * 10000 ) / 100
    const valueBefore = roi && Math.round(  value / (1 + roi) )
    const growth = valueBefore && Math.round(value - valueBefore)

    const classes = useStyles()

    return (
        <Box textAlign="center">
            <Horizontal valign="center">
                <Box className={classes.avatar}>
                    <Jazzicon diameter={60} seed={jsNumberForAddress( account ?? '0x0')} />
                </Box>

                <Box className={classes.values}>

                    <Box >
                        <Box>
                            <Typography className={classes.title}>Portfolio Value</Typography>
                        </Box>
                        <Typography style={{ fontSize: 40, fontWeight: 500 }}  align="left">
                            ${ utils.commify( value ) }
                        </Typography>
                    </Box>
                    
                    <Box className={classes.roi}>
                        <Box>
                            <Typography className={classes.title}>ROI</Typography>
                        </Box>
                        { roi && growth &&
                            <Box className={classes.roiValue}>
                                <Typography 
                                    variant="body1" 
                                    color="textPrimary"
                                    align="left"
                                    style={{ fontSize: 24,  fontWeight: 600, color: roi >=0 ? 'green' : 'red' }}  >
                                        {roi >=0 ? '+' : ''}{ roiFormatted }% (${utils.commify( growth ) }) 
                                </Typography>
                            </Box>
                        }
                    </Box>
                </Box>

            </Horizontal>


        </Box>
    )
}