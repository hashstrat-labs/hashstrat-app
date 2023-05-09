import { makeStyles, Dialog } from "@material-ui/core"



interface ModalProps {
    variant?: "normal" | "wide"
    onClose: React.MouseEventHandler<HTMLDivElement>;
    children: React.ReactNode
}

export const Modal = ({ onClose, children, variant = "normal" } : ModalProps) => {


    const useStyles = makeStyles( theme => ({

        overlay: {
            backgroundColor: "rgba(65,65,85,0.58)",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 110
        },
        
        modal: {
            position: "fixed",
            left: "50%",
            top: "10%",
            transform: "translateX(-50%)",
            minWidth: "340px",
            backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
            boxShadow: "0 1px 27px 0 rgba(0,0,0,0.19)",
            borderRadius: "10px",
            padding: "0px",
            zIndex: 120,
            color: theme.palette.text.primary,
        },

        modalWide: {
            position: "fixed",
            top: "10%",
            left: "10%",
            width: "80%",
            minWidth: "340px",

            backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
            boxShadow: "0 1px 27px 0 rgba(0,0,0,0.19)",
            borderRadius: 10,
            padding: 0,
            zIndex: 120,
            color: theme.palette.text.primary,

            [theme.breakpoints.down('lg')]: {
                left: "10%",
                width: "80%",
            },

            [theme.breakpoints.down('sm')]: {
                left: "5%",
                width: "90%",
            },

            [theme.breakpoints.down('xs')]: {
                left: 0,
                width: "100%",
            },
        },
    }))
 
    const classes =  useStyles()
    
    return (
        <div>
            <div className={classes.overlay} onClick={onClose} />
            <div className={ variant === 'wide' ? classes.modalWide : classes.modal }>
                {children}
            </div>
        </div>
    )
}

