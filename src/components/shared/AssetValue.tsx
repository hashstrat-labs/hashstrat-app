import { Typography, Box,  makeStyles } from "@material-ui/core"

import { utils } from "ethers"
import { Vertical } from "../Layout"


interface AssetValueProps {
    value: number,
    roi?: number | undefined,
    gains?: number | undefined,
}


export const AssetValue = ({ value, gains, roi }: AssetValueProps ) => {

    const roiRounded = roi !== undefined ? Math.round( roi * 10000 ) / 100 : 0
    const gainsRounded = gains !== undefined ? Math.round( gains * 100 ) / 100 : 0


    const useStyles = makeStyles( theme => ({
        container: {
            backgroundColor: theme.palette.type === 'light' ? '#fff' :'#000',
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 8,
            [theme.breakpoints.down('xs')]: {
                paddingLeft: 10,
                paddingRight: 10,
            },
        },

        title: {
            textAlign: 'left',
            fontSize: 16, 
            fontWeight: 500,
            color: theme.palette.text.secondary,
        },
        amount: {
            fontSize: 34,
            fontWeight: 400,
            textAlign: "left",
            [theme.breakpoints.down('xs')]: {
                fontSize: 38, 
            },
        },


        layout: {
            display: 'flex',
            flexDirection: 'column',
            [theme.breakpoints.down('xs')]: {
                flexDirection: 'row'
            },
        },

        roiBox: {
            paddingTop: 10,
            paddingLeft: 0,
            [theme.breakpoints.down('xs')]: {
                paddingTop: 0,
                paddingLeft: 30,
            },
        },

        roi: {
            fontSize: 24, 
            fontWeight: 500, 
            color: roi !== undefined ? (roi >= 0 ? 'green' : 'red') : '',
            [theme.breakpoints.down('xs')]: {
                paddingTop: 10,
                fontSize: 22,  
            },
        },



    }))

    const classes = useStyles()

    return (
        <Box className={classes.container}>

            <Box className={classes.layout}>
                <Box>
                    <Typography className={classes.title}>Asset Value</Typography>
                    <Typography className={classes.amount}> ${ utils.commify( value ) } </Typography>
                </Box>
                
                <Box className={classes.roiBox}>
                    <Box>
                        <Typography className={classes.title}>ROI</Typography>
                    </Box>
                    { roi !== undefined && gainsRounded !== undefined &&
                        <Typography className={classes.roi}>
                            {roi >=0 ? '+' : ''}{ roiRounded }% (${utils.commify( gainsRounded ) }) 
                        </Typography>
                    }
                </Box>
    
            </Box>

        </Box>
    )
}