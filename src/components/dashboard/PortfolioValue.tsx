import { Typography, Box } from "@material-ui/core"
import { utils } from "ethers"


interface PortfolioValueProps {
    value: number,
    roi?: number | undefined,
}


export const PortfolioValue = ({ value, roi }: PortfolioValueProps ) => {

    const roiFormatted = roi && Math.round( roi * 10000 ) / 100
    const valueBefore = roi && Math.round(  value / (1 + roi) )
    const growth = valueBefore && Math.round(value - valueBefore)

    return (
        <Box textAlign="center">
            <Typography variant="body1" style={{ fontSize: '220%', fontWeight: 600 }} >
                $ { utils.commify( value ) }
            </Typography>
            { roi && growth &&
                <Typography variant="body1" color="textPrimary" style={{ fontSize: '120%',  fontWeight: 600, color: roi >=0 ? 'green' : 'red' }}  >
                    {roi >=0 ? '+' : ''}{ roiFormatted }% (${utils.commify( growth ) }) 
                </Typography>
            }
        </Box>
    )
}