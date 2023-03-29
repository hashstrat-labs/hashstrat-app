
import { makeStyles, Box, Typography, Divider } from "@material-ui/core"
import { Horizontal } from "../Layout"

interface TickerInfoProps {
    symbol: string,
    value: string
}

const useStyles = makeStyles( theme => ({
    container: {
        padding: 6,
        border: "1px solid #aaa",
        margin: 0,
        alignItems: "center",
        borderRadius: 0,
        minWidth: 110,
    }
}))


export const TickerInfo = ({ symbol, value,  } : TickerInfoProps) => {
    const classes = useStyles()
    
    return (
        <div className={classes.container}>
            <Horizontal spacing="between">
                <Typography variant="body2"> {symbol} </Typography>
                <Typography variant="body2"> {value} </Typography>
            </Horizontal>
        </div>
    )
}


