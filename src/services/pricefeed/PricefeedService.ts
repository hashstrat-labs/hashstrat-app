import btc_dayly  from "./feeds/BTC_daily.json"
import eth_dayly  from "./feeds/ETH_daily.json"

import btc_weekly  from "./feeds/BTC_weekly.json"
import eth_weekly  from "./feeds/ETH_weekly.json"


export type PriceData = {
    date: Date,
    price: number
}

type FeedPeriod = "daily" | "weekly"

// https://eodhistoricaldata.com/api/eod/BTC-USD.CC?api_token=demo&order=a&fmt=json&period=d&from=2023-01-14
const BASE_URL = "https://eodhistoricaldata.com/api/eod"



export class Feed {

    prices: PriceData[];


    constructor( symbol: 'BTC' | 'ETH', period : FeedPeriod = "daily" ) {


        switch(symbol) {
            case "BTC": 
                this.prices = period === "daily" ? btc_dayly.map( it => this.priceMap(it) ) : btc_weekly.map( it => this.priceMap(it) ) 
                break;
            case "ETH":
                this.prices = period === "daily" ? eth_dayly.map( it => this.priceMap(it) ) : eth_weekly.map( it => this.priceMap(it) ) 
                break;
            default:
                this.prices = []
        }

        // fetch latest data prices
        const url = this.priceFeedUrl(BASE_URL, symbol, period, this.prices.at(-1)?.date! )

        console.log("PricefeedService >>> loading:",  symbol)

        fetch(url)
            .then((response) => response.json())
            .then((data : {date: string, open: number}[]) => { 

                //console.log("PricefeedService >>> loading data:", BASE_URL,  data)

                data.forEach( (it, idx) => {
                    if (idx > 0) {
                        this.prices.push({
                            date: new Date(it.date),
                            price: it.open
                        }) 
                    }
                })
        });

    }


    getPrice (date: Date) : number | undefined  {
        const priceData = this.prices.find( (it, idx) => {
            return  it.date.getTime() <= date.getTime() && 
                    (idx === (this.prices.length-1) || this.prices[idx+1].date.getTime() > date.getTime())
        })

        return priceData?.price
    }


    getPrices(from: Date, to: Date) : PriceData[] {
        //const days = Math.floor( (to.getTime() - from.getTime()) / 86400 / 1000)
        // console.log(">>> days: ", days)
        // const prices = ( days < 365 * 2) ?
        //     [...this.prices] :
        //     [...this.prices.filter( (it, idx) => idx % 10 === 0 || idx === this.prices.length-1 )]
        // console.log(">>> days: ", days, "skipped: ", prices.length)

        return this.prices.filter( it => it.date.getTime() >= from.getTime() && it.date.getTime() <= to.getTime() )
    }


    private priceMap = ( it : {date: string, open: number} ) => {
        return {
            date: new Date( Date.parse(it.date) ),
            price: it.open
        }
    }

    private priceFeedUrl = (base: string, symbol: 'BTC' | 'ETH', period : FeedPeriod = "daily", from: Date) : string =>  {

        const pairParam = symbol === 'BTC' ? 'BTC-USD.CC' : symbol === 'ETH' ? 'ETH-USD.CC': ''
        const peiodParam = period === 'daily' ? 'd' : period === 'weekly' ? 'w' : ''
        const fromParam = from.toISOString().split('T')[0]

        return `${base}/${pairParam}?api_token=demo&order=a&fmt=json&period=${peiodParam}&from=${fromParam}`
    }

}


const FeedInastance = (symbol: 'BTC' | 'ETH', period : FeedPeriod = "daily") : Feed => {
    console.log("FeedInastance >>> ", symbol)
    return new Feed(symbol, period)
}


export const BTCFeed = FeedInastance('BTC', 'daily')
export const ETHFeed = FeedInastance('ETH', 'daily')
