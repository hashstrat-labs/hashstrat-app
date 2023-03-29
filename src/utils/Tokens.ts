import { Token } from "../types/Token"
import { PoolInfo } from "./pools"
import { PoolLPTokenAddress, UsdcTokenAddress, DaiTokenAddress, WethTokenAddress, WbtcTokenAddress , HstTokenAddress} from "./network"

import weth from "../components/img/weth.png"
import wbtc from "../components/img/wbtc.png"
import usdc from "../components/img/usdc.png"
import dai from "../components/img/dai.png"
import poollp from "../components/img/pool_lp.png"


export const Tokens = (chainId: number, poolId: string) : Map<String, Token> => {
    const { depositToken } = PoolInfo(chainId, poolId)
    const depositTokenDecimals = depositToken.toLowerCase() === 'dai' ? 18 :
                                 depositToken.toLowerCase() === 'usdc' ? 6 : 18
   
    return {
        "dai": { address: DaiTokenAddress(chainId), symbol: "DAI", decimals: 18, image: dai},
        "usdc": { address: UsdcTokenAddress(chainId), symbol: "USDC", decimals: 6, image: usdc},
        "wbtc": { address: WbtcTokenAddress(chainId), symbol: "WBTC", decimals: 8, image: wbtc},
        "weth": { address: WethTokenAddress(chainId), symbol: "WETH", decimals: 18, image: weth },
        "pool-lp": { address: PoolLPTokenAddress(chainId, poolId), symbol: "POOL-LP", decimals: depositTokenDecimals, image: poollp },
        "hst" : HstToken(chainId)
    } as any
}


export const HstToken = (chainId: number) : Token => {
    return {
        address: HstTokenAddress(chainId), 
        symbol: "HST", 
        decimals: 18, 
        image: poollp 
    }
}
