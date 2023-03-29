export type RoiInfo = {
    date: number;
    strategyROI: number;
    buyAndHoldROI: number;
    strategyValue: number;
    buyAndHoldValue: number;
    strategyDrawdownPerc: number;
    buyAndHoldDrawdownPerc: number;
    maxStrategyDrawdownPerc: number;
    maxBuyAndHoldDrawdownPerc: number;
    depositTokenAmount: number,
    investTokenAmount: number,
    investTokenPerc: number,
    depositTokenPerc: number,
}

type PoolId = {
    poolId: string;
}

export type RoiInfoForPool =  RoiInfo & PoolId;



