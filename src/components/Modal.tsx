import { makeStyles } from "@material-ui/core"


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
    
    formModal: {
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

}))
 

interface ModalProps {
    onClose: React.MouseEventHandler<HTMLDivElement>;
    children: React.ReactNode
}

export const Modal = ({ onClose, children } : ModalProps) => {
    const classes = useStyles()
    
    return (
        <div>
            <div className={classes.overlay} onClick={onClose} />
            
            <div className={classes.formModal}>
                {children}
            </div>
        </div>
    )
}

