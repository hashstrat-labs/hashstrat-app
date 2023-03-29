import { Color as Severity } from "@material-ui/lab"

export type SnackInfo = {
    type: Severity,
    title: string;
    message: string;
    linkUrl?: string
    linkText?: string
    snackDuration?: number 
}