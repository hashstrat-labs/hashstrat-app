import { Typography, Box, Divider, Button, makeStyles } from "@material-ui/core"
import { utils } from "ethers"
import { Horizontal, Vertical } from "../Layout"

import transactionsSrc from  "./img/transactions.svg"

interface TransactionsProps {

    deposits: string, 
    withdrawals: string, 
    symbol: string,
    depositButtonPressed: () => void
}

const useStyles = makeStyles( theme => ({
    wrapper: {
        display: "flex",
        // justifyContent: "space-around",
        flexDirection: "row",
        flexFlow: "row nowrap",
        gap: theme.spacing(2),
    },
    title: {
        fontSize: 16,
        fontWeight: 600,
        color: theme.palette.text.secondary

    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        gap: 5
    }

}))

export const Transactions = ( { deposits, withdrawals, symbol, depositButtonPressed }: TransactionsProps ) => {

    const classes = useStyles()
      
    return (
        <Box>

            <Box className={classes.header}>
                <img style={{ width: 32, height: 32 }}  src={transactionsSrc} />
                <Typography  style={{ fontSize: 20, fontWeight: 500}} > Transactions </Typography> 
            </Box> 

            <Divider style={{ marginTop: 10, marginBottom: 30 }} />


            <Box className={classes.wrapper} >
                <Box mr={1}>
                    <Vertical>
                        <Box className={classes.header}> 
                            <Box style = {{ borderRadius: 2, backgroundColor: '#34C759', width: 13, height: 13}}></Box>
                            <Typography align="left" className={ classes.title }> Deposits</Typography>
                        </Box>

                        <span> 
                            <span style = {{ fontSize: 36, fontWeight: 500 }}> {utils.commify( Math.round(Number( deposits )) )} </span>
                            <span style = {{ fontSize: 17, fontWeight: 600,  verticalAlign: 'middle' }} > {symbol} </span> 
                        </span>

                    </Vertical>
                </Box>

                <Box  ml={1}>
                    <Vertical>
                        <Box className={classes.header}> 
                            <Box style = {{ borderRadius: 2, backgroundColor: '#FB1313', width: 13, height: 13}}></Box>
                            <Typography align="left" className={ classes.title }> Withdrawals</Typography>
                        </Box>

                        <span> 
                            <span style = {{ fontSize: 36, fontWeight: 500 }}> {utils.commify(  Math.round(Number( withdrawals )) )} </span>
                            <span style = {{ fontSize: 17, fontWeight: 600,  verticalAlign: 'middle' }} > {symbol} </span> 
                        </span>

                    </Vertical>
                </Box>

            </Box> 

            <Divider style={{ marginTop: 10, marginBottom: 20 }} />
   
            <Box mb={2} >
                <Horizontal align="center"> 
                    <Button variant="contained" onClick={depositButtonPressed} color="primary" size="large" fullWidth > Deposit </Button>
                </Horizontal>
            </Box>
        </Box>
    )
}