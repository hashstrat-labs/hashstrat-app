



import { makeStyles,  Link, Box, Accordion, AccordionDetails, AccordionSummary, Typography } from  "@material-ui/core"
import { ExpandMore } from "@material-ui/icons"
import { Link as RouterLink } from "react-router-dom"


const useStyles = makeStyles( theme => ({
    container: {
        padding: theme.spacing(2),
        fontSize: 18,
    },
    title: {
        fontSize: 24, 
        fontWeight: 400,

        [theme.breakpoints.down('sm')]: {
            fontSize: 18,
            fontWeight: 500,
        },
    }
}))


export const FaqContent = () => {

    const classes = useStyles()
    
    return (
        <Box className={classes.container}>

            <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography className={classes.title} > What is HashStrat?  </Typography>
                </AccordionSummary>
                <AccordionDetails >
                        <ul>
                            <li>
                                HashStrat is a new DeFi protocol to help you invest in digital assets with a long-term outlook.
                            </li>
                            <li>
                                You select which assets you want to hold (e.g. BTC &amp; ETH), pick your favourite portfolio management strategy (e.g. Trend Following, Rebalancing, Mean Reversion, etc. ) and the protocol takes care of the rest. 
                            </li>
                            <li>
                                Your portfolio management strategy determines your initial portfolio allocation and automates risk management.
                            </li>

                            <li>
                                Your strategies decide when to buy more of your favourite assets and when to sell into USDC to offload some risk.
                            </li>
                            <li>
                                HashStrat is a trustless, self-custodial protocol, which means you stay in control of your assets at all times.
                            </li>
                        </ul>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography className={classes.title} > Why use HashStrat?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Box>
                        HashStrat can help you to be a more successful, long-term investor:
                        <ul>
                            <li>Automated portfolio management prevents FOMO-buying and panic-selling your investments at the wrong time. </li>
                            <li>HashStrat strategies, with their built-in risk management, help to lock-in gains when price &amp; sentiment is high and scaling in your investments when price &amp; sentiment is low.</li>
                            <li>Our strategies can dramatically reduce volatility &amp; drawdowns of your portfolio and aim for returns competitive with a simple holding strategy.</li>
                            <li>HashStrat will make it easier for you to stay invested for longer and reap greater rewards over the long term.</li>
                        </ul>

                        Being an honest DeFi protocol, HashStrat offers the benefits of real DeFi:
                        <ul>
                            <li>You stay in control of your funds at all times. </li>
                            <li>No minimum investment requirements and other arbitrary constraints, no barriers to entry or to exit.</li>
                            <li>Behaviour of trading strategies is deterministic and transparent.</li>
                            <li>Asset allocation and individual trades are auditable by anybody on the blockchain.</li>
                            <li>Correctness of execution is guaranteed by the blockchain.</li>
                            <li>All code is open source and smart contracts are verified on-chain.</li>
                            <li>No need to share any personal information. </li>
                            <li>Seamless access to on-chain liquidity.</li>
                        </ul>
                    </Box>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography className={classes.title} > What are HashStrat Strategies exactly? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                        <ul>
                            <li> Strategies are set of rules, encoded into smart contracts, designed to manage the assets held in your digital asset portfolio.</li>
                            <li> Strategies decide when to allocate capital to risk assets (e.g. BTC, ETH) and when to trade back into a stable asset (USDC).</li>
                            <li> Their goal is to grow the value of your digital asset portfolio over time, while managing risk. </li>
                            <li> HashStrat strategies are desigend to work best over the long term, capturing the appreciation of pristine crypto assets like BTC and ETH over the crypto market cycles. </li>
                        </ul>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography className={classes.title} > Who is it for? </Typography>
                </AccordionSummary>
                <AccordionDetails >
                        <ul>
                            <li> <strong>Individual investors</strong> who want to automate the management of their crypto-portfolios, improve returns and reduce volatility, whilst retaining control over their digital assets.</li>
                            <li> <strong>DAO treasury managers</strong> who want to protect the value of their stablecoin holdings from FIAT currency debasement by getting some exposure to pristine crypto assets in a 100% trustless and verifiable way.</li>
                            <li> <strong>DeFi protocols</strong> who want to safely invest some of their liquidity for the long term.</li>
                        </ul>
                </AccordionDetails>
            </Accordion>


            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography className={classes.title} > How do you use HashStrat? </Typography>
                </AccordionSummary>
               
                <AccordionDetails >
                    <Box>
                        Using HashStat is as simple as:
                        <ol>
                            <li>
                                Select the assets you want to hold.
                            </li>
                            <li>
                                Select the automated strategies that will manage your assets.
                            </li>
                            <li>
                                Deposit USDC into the protocol smart contracts.
                            </li>
                            <li>
                                Sit back while HashStrat manages your digital asset portfolio for you.
                            </li>
                        </ol>

                        HashStrat is a web3 application running over the Polygon Network. To intereact with the HashStrat smart contracts you need:
                        <ol>
                            <li>A web3 enabled browser. Good options are <Link href="https://metamask.io" target="_blank">MetaMask</Link>  or  <Link href="https://www.coinbase.com/wallet" target="_blank">Coinbase wallet</Link>  
                            </li>
                            <li>A little amount of <Link href="https://coinmarketcap.com/currencies/polygon/" target="_blank">MATIC (Polygon)</Link> tokens to pay for transaction fees on the Polygon Network.</li>
                        </ol>
                    </Box>      
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography className={classes.title} > What is the HashStrat DAO?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                        <ul>
                            <li>The HashStrat protocol is governed by a Decentralized Autonomous Organization, the HashStrat DAO.</li>
                            <li>Users of the protocol can earn the DAO token <Link component={RouterLink} to="/dao">HST</Link> and become members of the DAO.</li>
                            <li> HST holders are able to participate in the protocol governance and revenue sharing programs.</li>
                        </ul>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography className={classes.title} > What's the DAO business model?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                        <ul>
                            <li> The protocol generates its revenues by taxing profits withdrawn from Pools &amp; Indexes. </li>
                            <li> The withdrawal fee is currently set to 1% of profits. </li>
                            <li> These fees are periodically collected into the DAO Treasury and re-distributed to DAO token holders as "dividends" </li>
                        </ul>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1bh-content" >
                    <Typography className={classes.title} > This is cool but what are the risks?</Typography>
                </AccordionSummary>
                <AccordionDetails >
                    <Box>
                        Decentralized Finance is a nascent industry and it's important to be aware of its risks.<br/>
                        These are the main risks that is worth considering when using a DeFi protocol like HashStrat: 
                        <ul>
                            <li>
                                Protocol risks: <br/>
                                Although great care is put into following programing best practices, 
                                HashStrat smart contracts could contain bugs and be subject to exploits. 
                                Be aware that in several situations DeFi protocols have been exploited and users lost access to their funds.
                            </li>
                            <li>
                                Digital Asset risks: <br/>
                                HashStat strategies trade a small number of top digital assets on the Polygon Network: USDC, WETH, WBTC.
                                In case of catastrophic events on the Polygon Network and Polygon Bridge, these assets could, in theory, loose value against 
                                their pegged tokens (BTC on the Bitcoin network, ETH and USDC on the Ethereum network).
                            </li>
                            <li>
                                Smart contract integration risks: <br/>
                                In order to enable strategy trading, HashStat integrates a limited number of high-profile thirt-party protocols: <Link href="https://chain.link/" target="_blank"> Chainlink </Link> data-feeds, <Link href="https://quickswap.exchange/" target="_blank">QuickSwap DEX</Link>. 
                                <br/>
                                Issues with these protocols could impact HashStat strategies, halting their functions or altering their behaviour.
                                
                            </li>
                            <li>
                                Network risks: <br/>
                                The HashStrat protocol runs on a blockchain, 
                                the <Link href="https://polygon.technology/" target="_blank">Polygon Network</Link>, that could suffer from malfunctions and exploits. <br/>
                                Issues at the base layer of a blockchian are very rare but can't be totally discounted. 
                            </li>
                            <li>
                                Regulatory risks: <br/>
                                Owning crypto assets and using DeFi is perfectly legal in <Link href="https://www.euronews.com/next/2022/04/27/bitcoin-ban-these-are-the-countries-where-crypto-is-restricted-or-illegal2" target="_blank"> almost </Link> every
                                jurisdiction, but it's worth keeping  an eye on how regualtions evolve and make sure you are following laws applicable in your jurisdiction.
                            </li>
                        </ul>   
                    </Box>
                </AccordionDetails>
            </Accordion>

        </Box>
    )
}