
import React, { useState } from "react";
import { makeStyles, Dialog, Box, Typography, Grid, Divider } from "@material-ui/core"

import { Close as CloseIcon } from "@material-ui/icons"

// import IconButton from "@mui/material/IconButton";
import { styled } from "@material-ui/core/styles"
import useMediaQuery from '@material-ui/core/useMediaQuery';



interface CustomModalProps {
    variant?: "normal" | "wide"
    open: boolean;
    onClose: () => void;
    children: React.ReactNode

}


export const Modal: React.FC<CustomModalProps> = ({ open, onClose, children, variant = "normal" }) => {
    const fullScreen = useMediaQuery("(max-width:600px)");

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullScreen={fullScreen} 
            maxWidth={ variant === "normal" ? "xs" : variant === "wide" ? "md" : "sm" } 
            fullWidth
        >
            <Box
                sx={{
                    position: "relative",
                    paddingLeft: "0px",
                    paddingRight: "0px",
                }}
            >

                <Grid container justify="flex-end">
                        <Box p={2}
                            color="inherit"
                            onClick={onClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </Box>
                </Grid>

                <Divider />

                {children}

            </Box>
        </Dialog>
    );
};

