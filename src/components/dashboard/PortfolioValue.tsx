import { Typography, Box } from "@material-ui/core"
import { utils } from "ethers"


interface PortfolioValueProps {
    value: number,
    roi: number,
}


export const PortfolioValue = ({ value, roi }: PortfolioValueProps ) => {

    const roiFormatted = Math.round( roi * 10000 ) / 100
    const valueBefore = Math.round(  value / (1 + roi) )
    const growth = Math.round(value - valueBefore)

    return (
        <Box textAlign="center">
            <Typography variant="body1" style={{ fontSize: '180%', fontWeight: 600 }} >
                $ { utils.commify( value ) }
            </Typography>

            <Typography variant="body1" color="textPrimary" style={{ fontSize: '120%',  fontWeight: 600, color: roi >=0 ? 'green' : 'red' }}  >
                {roi >=0 ? '+' : ''}{ roiFormatted }% (${utils.commify( growth ) }) 
            </Typography>
        </Box>
    )
}