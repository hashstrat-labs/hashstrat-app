import { styled } from "@material-ui/core/styles"
import { Alert } from "@material-ui/lab";


export const StyledAlert = styled(Alert)(({ theme }) => ({
    margin: "auto",
    border:   `1px solid ${theme.palette.primary.main}`,
    borderRadius: 12,
}));
