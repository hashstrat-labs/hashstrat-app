import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useEthers } from "@usedapp/core";
import { Typography, Box,  makeStyles } from "@material-ui/core"

import { utils } from "ethers"
import { Horizontal } from "../Layout"


interface PortfolioValueProps {
    value: number,
    roi?: number | undefined,
    gains?: number | undefined,
}

const useStyles = makeStyles( theme => ({
    container: {
        backgroundColor: theme.palette.type === 'light' ? '#fff' :'#000',
        padding: 20,
        borderRadius: 8,
        [theme.breakpoints.down('xs')]: {
            paddingLeft: 10,
            paddingRight: 10,
        },
    },
    avatar: {
         border: `1px solid ${ theme.palette.type === 'light' ? '#ccc' :'#aaa' }`,
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


export const PortfolioValue = ({ value, gains, roi }: PortfolioValueProps ) => {

    const { account } = useEthers()
    const roiRounded = roi !== undefined ? Math.round( roi * 10000 ) / 100 : 0
    const gainsRounded = gains !== undefined ? Math.round( gains * 100 ) / 100 : 0
    const classes = useStyles()

    console.log(">>> PortfolioValue value: ", value, "gains",gains, "gainsRounded:", gainsRounded, "roi:", roi, roiRounded)


    return (
        <Box textAlign="center" className={classes.container}>

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
                        { roi !== undefined && gainsRounded !== undefined &&
                            <Box className={classes.roiValue}>
                                <Typography 
                                    variant="body1" 
                                    color="textPrimary"
                                    align="left"
                                    style={{ fontSize: 24,  fontWeight: 600, color: roi >=0 ? 'green' : 'red' }}  >
                                        {roi >=0 ? '+' : ''}{ roiRounded }% (${utils.commify( gainsRounded ) }) 
                                </Typography>
                            </Box>
                        }
                    </Box>
                </Box>

            </Horizontal>


        </Box>
    )
}