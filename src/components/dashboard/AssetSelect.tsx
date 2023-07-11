import { useState } from "react"
import { Typography, Box, Radio, Button, makeStyles } from "@material-ui/core"
import { Horizontal } from "../Layout"

import btc from  "./img/btc.svg"
import eth from  "./img/eth.svg"

const assetInfo = {
    "wbtc": {
        img: btc,
        symbol: 'BTC',
        name: 'Bitcoin'
    },
    "weth": {
        img: eth,
        symbol: 'ETH',
        name: 'Ether'
    }
  
}

interface AssetSelectProps {
    symbols: string[],
    selected: boolean,
    didSelectAsset: (assets: string) => void
}




export const AssetSelect = ({ symbols, selected, didSelectAsset }: AssetSelectProps ) => {


    const onSelect = () => {
        didSelectAsset( symbols.join(',') )
        // didSelectAsset('wbtc,weth')
    }

    const useStyles = makeStyles( theme => ({

        container: {
            backgroundColor: theme.palette.type === 'light' ? '#f5f5f5' :'#000',
            // borderRadius: 8,
            // paddingLeft: 10,
            // paddingRight: 20,
            // paddingTop: 10,
            // paddingBottom: 10,

            width: '100%',
            textTransform:'none',

            border:  selected ? `1px solid ${theme.palette.primary.main}` : '',

        }

    }))

    const classes = useStyles()

    return (
        <Button variant="outlined" color="primary" onClick={onSelect} className={classes.container}  >

            <Horizontal align='center' valign='center' spacing='between'>
                <Horizontal>
                    <Radio 
                        color="primary" 
                        // value={ selectedValue ? symbols.join(",") : '' }
                        checked={ selected }
                    />

                    <Box>
                        <Typography variant='body1' align="left" color='textPrimary' style={{fontSize: 16}}> <strong> {symbols.map( s => assetInfo[s as keyof typeof assetInfo].symbol).join(" + ")} </strong> </Typography>
                        <Typography variant='body2' align="left" color='textSecondary' style={{fontSize: 14}}> 
                            {  
                                symbols.map( (s) => assetInfo[s as keyof typeof assetInfo].name ).join(' + ')
                            }
                        </Typography>
                    </Box>
                </Horizontal>


                <Box pt={1}>
                { symbols.map( (s) => {
                    return (
                        <img key={s} src={ assetInfo[s as keyof typeof assetInfo].img } style={{paddingLeft: 10}} />
                    )
                })}
                </Box>
            </Horizontal>

        </Button>
    )
}