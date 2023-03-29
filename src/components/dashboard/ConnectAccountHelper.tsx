import { useEffect, useState } from "react";

import { useEthers, Polygon } from "@usedapp/core";

import { makeStyles, useTheme, Box, Typography, Divider, Link, Checkbox, Button } from "@material-ui/core"
import { AlertTitle } from "@material-ui/lab"

import { StyledAlert } from "../shared/StyledAlert"
import { Link as RouterLink } from "react-router-dom"


const useStyles = makeStyles( theme => ({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center", 
        margin: 'auto', 
        marginBottom: 40,
        height: "100%",
    }
}))



interface ConnectAccountHelperProps {
    connectedChainId: number | undefined
    userMessage: string | undefined
}


export const ConnectAccountHelper = ( { connectedChainId, userMessage } : ConnectAccountHelperProps ) => {

    const classes = useStyles()
    const theme = useTheme();
	
    const { switchNetwork, activateBrowserWallet, chainId, account } = useEthers()
    const [ showError, setShowError]= useState(false)
    const [ termsAccepted, setTermsAccepted ] = useState(false)
    const [ connectPressed, setConnectPressed ] = useState(false)

    const isPolygon = connectedChainId === Polygon.chainId
    const isConnected = account !== undefined && chainId !== undefined
    const purposeMessage = userMessage ?? "interact with HashStrat"

    useEffect(() => {
        let timer = setTimeout( () => setShowError(true), 500 )
        return () => {
            clearTimeout(timer)
        }
    }, [])


    useEffect(() => {
        console.log("ConnectAccountHelper - useEffect - connectedChainId : ", connectedChainId, "chainId", chainId, "account", account)
    }, [chainId, account])


    const termsAcceptanceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAccepted( event.target.checked )
    }

    const connectButtonPressed = () => {
        setConnectPressed(true)
       if (termsAccepted) { 
        activateBrowserWallet()
       }
    }

    return (
        <Box>
            <Box mx={1} >
                { showError && <Box className={classes.container}>
                    <StyledAlert severity={ isPolygon ? "info" : "warning"} >

                        <Box>
                            <AlertTitle>
                                {!isPolygon &&  <Box>Wrong Network</Box> }
                                { isPolygon && account === undefined &&  <Typography> <strong>No Account connected</strong></Typography> }
                            </AlertTitle>

                            { isPolygon &&  <Typography> Connect an account to the <strong>Polygon</strong> network to {purposeMessage}.</Typography> }
                            { !isPolygon && <Typography> Connect to the <strong>Polygon</strong> network to {purposeMessage}.</Typography> }

                            <div style={{ marginTop: 30, marginBottom: 0 }} >
                                { !isPolygon && 
                                    <Button color="primary" variant="contained" fullWidth onClick={() => switchNetwork(Polygon.chainId)} disabled={connectedChainId === Polygon.chainId}>
                                        Switch Network
                                    </Button>
                                }
                                { isPolygon && !isConnected &&
                                    <Button color="primary" variant="contained" onClick={ connectButtonPressed } fullWidth >Connect</Button>
                                }
                                
                                <Box mt={2} >
                                    { connectPressed && !termsAccepted && 
                                    <Typography variant="body1" color="error"> Please accept the terms of service to connect </Typography> }
                                </Box>

                            </div>
                        </Box>

                        <Divider variant="fullWidth" style={{marginTop: 20, marginBottom: 20}} />

                        
                            <Box textAlign="left">
                                <strong>
                                    This is beta software.
                                    HashStrat smart contracts have not been audited.<br/> 
                                    Use at your own risk. 
                                </strong>
                            </Box>
                       
                        <br/>
                        <Checkbox  style={{ paddingLeft: 0 }}
                            size="medium" 
                            checked={ termsAccepted }
                            onChange={ termsAcceptanceChange }
                        />By connecting to HashStrat, I accept the <Link 
                                target="_blank" 
                                component={RouterLink} 
                                to="/terms" 
                                style={{ color: theme.palette.text.primary, textDecoration: "underline" }}
                            >terms of service</Link> and <Link 
                                target="_blank" 
                                component={RouterLink} to="/privacy" 
                                style={{ color: theme.palette.text.primary, textDecoration: "underline" }}
                            >privacy policy</Link>
                            

                    </StyledAlert>
                </Box>
                }
            </Box> 

        </Box>
    )
}


