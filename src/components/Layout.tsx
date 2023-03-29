
import { makeStyles, Box } from "@material-ui/core"

interface ChildrenProps {
    children: React.ReactNode,
    align?: "center" | "left"
    valign?: "center" | "top"
    spacing? : "between"
}

const useStyles = makeStyles( theme => ({
    container: {
        body: theme.spacing(1),
    },
    horizontalCenter: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        flexFlow: "row wrap",
        gap: theme.spacing(2),
    },
    horizontalLeft: {
        display: "flex",
        justifyContent: "left",
        alignItems: "top",
        flexDirection: "row",
        flexFlow: "row wrap",
        gap: theme.spacing(2),
    },
    horizontalVerticallyCentered: {
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "row",
        flexFlow: "row wrap",
        alignItems: "center",
        gap: theme.spacing(2)
    },
    horizontalVerticallyCenteredLeftAligned: {
        display: "flex",
        flexDirection: "row",
        flexFlow: "row wrap",
        alignItems: "center",
        gap: theme.spacing(2),
    },
    horizontalVerticallyCenteredSpaceBetween: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        flexFlow: "row wrap",
        alignItems: "center",
        gap: theme.spacing(2),
        width: "100%"
    },
    verticalCenter: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        alignItems: "center",
    },

    verticalLeft: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-around",
        flexFlow: "row wrap",
        gap: theme.spacing(0),
    },

}))

export const Page = ({ children } : ChildrenProps) => {
    const classes = useStyles()
    return (
        <main className={classes.container}>
            <Box m={4} pt={3}>
                {children}
            </Box>
        </main>
    )
}


export const Horizontal = ({ children, align = "left" , valign, spacing } : ChildrenProps) => {
    const classes = useStyles()
    return (
        <div className={    spacing === 'between' ? classes.horizontalVerticallyCenteredSpaceBetween : 
                            (valign === 'center' && align === "center") ? classes.horizontalVerticallyCentered :
                            (valign === 'center' && align === "left") ? classes.horizontalVerticallyCenteredLeftAligned :
                            align === "center" ? classes.horizontalCenter : classes.horizontalLeft 
                        } >
            {children}
        </div>
    )
}

export const Vertical = ({children, align = "left"  } : ChildrenProps ) => {
    const classes = useStyles()
    return (
        <div className={ align === 'center' ? classes.verticalCenter : classes.verticalLeft } >
            {children}
        </div>
    )
}
