import { Container, makeStyles } from  "@material-ui/core"

export interface BalanceMsgProps {
    label : string, 
    tokenImgSrc: string, 
    amount: string
}


const useStyle = makeStyles( theme => ({
    container: {
        display: "inline-grid",
        gridTemplateColumns: "auto auto auto",
        gap: theme.spacing(1) 
    },
    tokenImg: {
        width: "20px"
    },
    amount: {
        fontWeight: 700
    }
}))

export const BalanceMsg = ({ label, tokenImgSrc, amount } : BalanceMsgProps) => {

    const classes = useStyle()

    return (
        <div className={classes.container}>
            <div>{label}</div>
            <div className={classes.amount}>{amount}</div>
            <img className={classes.tokenImg} src={tokenImgSrc} alt="token image" />
        </div>
    )
}