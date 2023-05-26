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



export const PortfolioValue = ({ value, gains, roi }: PortfolioValueProps ) => {

    const { account } = useEthers()
    const roiRounded = roi !== undefined ? Math.round( roi * 10000 ) / 100 : 0
    const gainsRounded = gains !== undefined ? Math.round( gains * 100 ) / 100 : 0


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
            fontSize: 16, 
            fontWeight: 500,
            color: theme.palette.text.secondary,
            [theme.breakpoints.down('xs')]: {
                display: 'none'
            },
        },
        amount: {
            fontSize: 40,
            fontWeight: 400,
            textAlign: "left",
            [theme.breakpoints.down('xs')]: {
                fontSize: 38, 
            },
        },


        roi: {
            fontSize: 24,  
            fontWeight: 600, 
            color: roi !== undefined ? (roi >= 0 ? 'green' : 'red') : '',
            [theme.breakpoints.down('xs')]: {
                fontSize: 18,  
            },
        },

        horizontal: {
            display: 'flex',
            flexDirection: 'row',
            [theme.breakpoints.down('xs')]: {
                flexDirection: 'column'
            },
        },

        // roi: {
        //     paddingTop: 0,
        //     paddingLeft: 50,
        //     [theme.breakpoints.down('xs')]: {
        //         paddingTop: 0,
        //         paddingLeft: 0,
        //     },
        // },

        roiBox: {
            paddingLeft: 30,
            [theme.breakpoints.down('xs')]: {
                paddingLeft: 0,
            },
        },
        roiWrapper: {
            paddingTop: 10,
            // fontSize: 24,
            [theme.breakpoints.down('xs')]: {
                paddingTop: 0,
            },
        }

    }))

    const classes = useStyles()

    return (
        <Box textAlign="center" className={classes.container}>

            <Horizontal valign="center">
                
                <Box className={classes.avatar}>
                    <Jazzicon diameter={60} seed={jsNumberForAddress( account ?? '0x0')} />
                </Box>

                <Box className={classes.horizontal}>
                    <Box>
                        <Typography className={classes.title}>Portfolio Value</Typography>
                        <Typography className={classes.amount}> ${ utils.commify( value ) } </Typography>
                    </Box>
                    
                    <Box className={classes.roiBox}>
                        <Box>
                            <Typography className={classes.title}>ROI</Typography>
                        </Box>
                        { roi !== undefined && gainsRounded !== undefined &&
                            <Box className={classes.roiWrapper}>
                                <Typography className={classes.roi}>
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