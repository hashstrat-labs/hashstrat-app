


import { makeStyles, useTheme, Box, Link } from  "@material-ui/core"
import { SocialIcon } from "react-social-icons"
import { Horizontal } from "./Layout"
import arrowLeft from "./img/arrow-left.png"


const useStyle = makeStyles( theme => ({
    container: {
        maxWidth: 420,
        [theme.breakpoints.down('sm')]: {
            maxWidth: 280,
            margin: 'auto'
        },
    },

    social: {
        minWidth: 180,
        display: "grid",
        gridTemplateColumns: "1fr auto 15px",
        justifyItems: "left",
        alignItems: "center", 
        gap: 5,
        marginRight: 20,

        [theme.breakpoints.down('sm')]: {
            minWidth: 30,
            gridTemplateColumns: "1fr",
        },
    },

    name: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
    },

    icon: {
        filter: theme.palette.type === 'light' ? "brightness(1.0)" : "invert(1.0)",
        width: 15,
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
    }
}))


export const Socials = () => {
    const classes = useStyle()
    const theme = useTheme();
    const bgcolor = theme.palette.type === 'light' ? '#555' : '#ccc'

    return (
        <Box className={classes.container}>

            <Horizontal align="left" valign="center">
               
                <Box className={classes.social}>
                    <Horizontal valign="center">
                        <SocialIcon url="https://medium.com/@hashstrat" style={{width: 30, height: 30}} target="_blank"  bgColor={bgcolor} />
                        <Link target="_blank" href="https://medium.com/@hashstrat">
                            <label className={classes.name}>Medium</label>
                        </Link> 
                    </Horizontal>
                    <img src={arrowLeft} className={classes.icon} />
                </Box>
        

                <Box className={classes.social}>
                    <Horizontal valign="center">
                        <SocialIcon url="https://github.com/orgs/hashstrat-labs/repositories" style={{width: 30, height: 30}} target="_blank" bgColor={bgcolor} />
                        <Link target="_blank" href="https://github.com/orgs/hashstrat-labs/repositories">
                            <label className={classes.name}>GitHub</label>
                        </Link>
                    </Horizontal>
                    <img src={arrowLeft} className={classes.icon} />
                </Box>
            
                <Box className={classes.social}>
                    <Horizontal valign="center">
                        <SocialIcon url="https://www.linkedin.com/company/hashstrat" style={{width: 30, height: 30}} target="_blank" bgColor={bgcolor} />
                        <Link target="_blank" href="https://www.linkedin.com/company/hashstrat">
                            <label className={classes.name}>LinkedIn</label>
                        </Link> 
                    </Horizontal>
                    <img src={arrowLeft} className={classes.icon} />
                </Box>
                
                <Box className={classes.social}>
                    <Horizontal valign="center">
                        <SocialIcon url="https://t.me/hashstrat_public" style={{width: 30, height: 30}} target="_blank"  bgColor={bgcolor} />
                        <Link target="_blank" href="https://t.me/hashstrat_public">
                            <label className={classes.name}>Telegram</label>
                        </Link>
                    </Horizontal>
                    <img src={arrowLeft} className={classes.icon} />
                </Box>

            </Horizontal>
        </Box>
    )
}