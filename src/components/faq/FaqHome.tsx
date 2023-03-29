import { makeStyles,  Link, Box, Typography, Breadcrumbs, Divider } from  "@material-ui/core"
import { Alert, AlertTitle } from "@material-ui/lab"
import { Link as RouterLink } from "react-router-dom"

import { FaqContent } from "./FaqContent"


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
    }
}))

export const FaqHome = () => {

    const classes = useStyles()
    
    return (
        <div className={classes.container}>

            <Breadcrumbs aria-label="breadcrumb">
                <Link component={RouterLink} to="/"> Home </Link>
                <Typography>FAQ</Typography>
            </Breadcrumbs>

            <Divider variant="middle" style={{marginTop: 20, marginBottom: 0}}/>

            <Box my={2}>
                <Alert severity="warning">
                    <AlertTitle> Scary Disclaimer </AlertTitle>
                    Hashtrat is an experimental platform under active development.<br/>
                    Be careful or you could loose your funds!
                </Alert>
            </Box>
            
            <FaqContent />

        </div>
    )
}