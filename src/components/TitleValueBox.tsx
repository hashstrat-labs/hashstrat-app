
import { Box, Divider, Link, makeStyles } from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

interface TitleValueBoxProps {
    title: string,
    value: string,
    suffix?: string,
    border?: boolean,
    mode?: "small" | "regular" | "bold",
    url?: string,
    linkMode?:  "title" | "value",
}


export const TitleValueBox = ({ title, value, suffix="", border=false, mode="regular", linkMode="value", url } : TitleValueBoxProps ) => {

    const useStyles = makeStyles( theme => ({
        container: {
            padding: theme.spacing(2),
            display: "flex",
            justifyContent: "space-between",
            gap: theme.spacing(1),
            border: `1px solid ${theme.palette.secondary.main}`,
            borderRadius: 12,
            minWidth: 300,
            color: theme.palette.text.primary
        },
        containerNoBorder: {
            padding: theme.spacing(1),
            display: "flex",
            justifyContent: "space-between",
            gap: theme.spacing(0),
            minWidth: 300,
        },
        label: {
            fontWeight: mode === "bold" ? 600 : 100,
            fontSize: mode === "regular" || "bold" ? "1.1rem" : "0.9rem",
            marginRight: 10,
        },
        value: {
            marginLeft: 10,
            fontWeight:  mode === "bold" ? 600 : 200,
            fontSize: mode === "regular" || "bold" ? "1.2rem" : "0.9rem"
        }
    }))

    const classes = useStyles()


    return (
        <>
            <Box className={border? classes.container : classes.containerNoBorder}>
                {
                    linkMode === 'title' && url?.startsWith("https://") ? 
                        <Link href={url} target="_blank"> {title} </Link> :     
                    linkMode === 'title' && url?.startsWith("/") ?
                        <Link component={RouterLink} to={url}> {title} </Link>  :   
                    <div className={classes.label}> {title} </div>
                }
                {
                    linkMode === 'value' && url?.startsWith("https://") ? 
                        <Link href={url} target="_blank"> {value} </Link> :     
                    linkMode === 'value' && url?.startsWith("/") ?
                        <Link component={RouterLink} to={url}> {value} </Link>   :              
                    <div className={classes.value}> {value} {suffix} </div>
                }
               
            </Box>
            {(!border) && <Divider variant="fullWidth"  /> }
        </>
  )}


