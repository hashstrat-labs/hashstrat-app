import { Typography, makeStyles, Link, Box, useTheme, Divider } from "@material-ui/core"
import { Horizontal } from "../Layout"
import { Link as RouterLink } from "react-router-dom"

import { Socials } from "../Socials"

import logoLight from "../img/logo-light.png"
import logoDark from "../img/logo-dark.png"


const useStyle = makeStyles( theme => ({
    footer: {
        backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        textAlign: "center",
        padding: theme.spacing(0)
    }
}))




export const Footer = () =>  {
    const classes = useStyle()
	const theme = useTheme();

	const lightMode = theme.palette.type === 'light'
	const logoImg = lightMode ? logoLight : logoDark


    return (
        <footer className={classes.footer}>

            <Divider variant="fullWidth" style={{marginTop: 0, marginBottom: 20}}/>

            <Box style={{  margin: "auto", display: 'flex', alignItems:"center", 
                    flexWrap: "wrap", alignContent:"center", justifyItems: "center", justifyContent: 
                    "space-evenly", flexDirection: "row" }}>

                <Box px={4} py={3} >
                    <img src={logoImg} style={{ width: 220 }} alt="logo" />
                    <Typography variant="body2"> © 2023 HashStrat. All rights reserved </Typography>
                </Box>
                <Box py={2}>
                    <Socials />
                </Box>
            </Box>

          
            <Divider variant="fullWidth" style={{marginTop: 20, marginBottom: 20}}/>

            <Horizontal align="center"> 
                <Box>   
                    <Link component={RouterLink} to="/privacy" style={{ color: theme.palette.text.secondary, textDecoration: "underline" }}> Privacy Policy</Link>
                    &nbsp; &nbsp;
                    <Link component={RouterLink} to="/terms" style={{ color: theme.palette.text.secondary, textDecoration: "underline" }}> Terms of service </Link> 
                </Box>
            </Horizontal>

            <Divider variant="fullWidth" style={{marginTop: 20, marginBottom: 0}}/>

        </footer>
    )
}