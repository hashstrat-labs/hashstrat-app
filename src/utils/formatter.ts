


import { BigNumber, ethers } from 'ethers'

export const fromDecimals = (amount: BigNumber, decimals: Number, precision: Number) => {

    const decimalsFactor =  BigNumber.from('10').pow( BigNumber.from(decimals) ); 
    const precisionFactor =  BigNumber.from('10').pow(BigNumber.from(precision)); 
    const number = BigNumber.from(amount).mul(precisionFactor).div(decimalsFactor)
    const decimal =  number.toNumber() / precisionFactor.toNumber()
    return decimal.toString()
}

export const toDecimals = (amount: string | number, decimals: number = 18) => {
    const formatted = ethers.utils.parseUnits(amount.toString(), decimals)
    return formatted.toString()
}


export const shortenAccount = (account?: string) => {
    if (!account) return "n/a"
    return account.substring(0, 6) + "..." + account.substring(38)
}

export const round = (n : number, d=2) => {
    return Math.round(n * (10**d)) / (10**d)
}


export const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
    list.reduce((previous, currentItem) => {
        const group = getKey(currentItem);
        if (!previous[group]) previous[group] = [];
        previous[group].push(currentItem);
        
        return previous;
    }, {} as Record<K, T[]>);


