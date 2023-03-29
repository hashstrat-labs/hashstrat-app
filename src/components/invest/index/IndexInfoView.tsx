import { Box, Typography } from "@material-ui/core"
import { Token } from "../../../types/Token"
import { IndexRoiChart } from "./IndexRoiChart"


interface IndexInfoViewProps {
    chainId: number,
    poolId: string,
    depositToken: Token,
}


export const IndexInfoView = ( { chainId, poolId, depositToken } : IndexInfoViewProps ) => {
  
    return (
        <Box pt={2} pl={2} >
            <Typography align="center"> Index Performance </Typography> 
            <IndexRoiChart chainId={chainId} indexId={poolId} depositToken={depositToken}  />
        </Box>
    )
}
