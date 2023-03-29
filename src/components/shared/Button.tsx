import { styled } from "@material-ui/core/styles"
import { Button as BaseButton } from "@material-ui/core";

export const Button = styled(BaseButton)(({ theme }) => (
{

    borderRadius: 20,
    border: `0px solid ${theme.palette.text.primary}`,
    
    width: 180, 
    height: 40, 
    backgroundColor: theme.palette.type === 'light' ? '#A9EE70': '#7AA279',
    textTransform: "none",
    color: theme.palette.text.primary,
    boxShadow: "0 0px 0px 0 rgba(0,0,0,0)",

    '&:hover': {
        filter: "brightness(0.8)",
        backgroundColor: theme.palette.type === 'light' ? '#A9EE70': '#A9EE70',
        boxShadow: "0 0px 0px 0 rgba(0,0,0,0)",
        border: `0px solid ${theme.palette.text.primary}`,
    },
}))


export const ButtonSecondary = styled(BaseButton)(({ theme }) => (
{
    marginLeft: 0,
    border: `1px solid ${theme.palette.text.primary}`,
    borderRadius: 20,
    width: 180, 
    height: 40, 
    backgroundColor: theme.palette.type === 'light' ? 'rgba(0,0,0,0)': 'rgba(0,0,0,0)',
    textTransform: "none",
    color: theme.palette.text.primary,

    '&:hover': {
        backgroundColor: theme.palette.type === 'light' ? 'rgba(0,0,0,0.3)': 'rgba(0,0,0,0.3)',
        boxShadow: "0 0px 0px 0 rgba(0,0,0,0)",
        border: `1px solid ${theme.palette.text.primary}`,
    },
}))
    
// {
//     margin: "auto",
//     border:   `1px solid ${theme.palette.primary.main}`,
//     borderRadius: 12,
// }));
