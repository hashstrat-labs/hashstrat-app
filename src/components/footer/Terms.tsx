


import { makeStyles, Box, Typography, Link } from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"

const useStyle = makeStyles(theme => ({
    terms: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        margin: "auto",
        maxWidth: 900,
    }
}))


export const Terms = () => {
    const classes = useStyle()

    return (
        <Box className={classes.terms}>

            <Typography variant="h3" align="center"> Terms of Service  </Typography>
            <br />
            <Typography variant="body2"> This document was last updated on March 14, 2023. </Typography>

            <br />
            <Typography variant="body1">
                Please read these Terms of Service (this “Agreement”) carefully. Your use or access of the Site (as defined below) constitutes your consent to this Agreement
           
            </Typography>

            <br /><br />
            <Typography variant="h5"> Scope of Use </Typography>
            <Typography variant="body1">
                This Agreement is between you and HashStrat Labs (“Company”, “HashStrat”, “we”, “our” or “us”) concerning your use of (including any access to) Company’s websites, including but not limited to hashstrat.com
                and each of their subdomains, and our web applications (collectively with any other materials and services available therein, and successor site(s) or application(s) thereto, the “Site”)
                and, together with tools to access the Polygon-based protocol for decentralized on-chain asset management known as the “HashStrat" online protocol/app/platform, and related services (collectively, the “Services”) 


                This Agreement hereby incorporates by this reference any additional terms and conditions with respect to the Site posted by Company to the Site, or otherwise made available to you by Company,
                including without limitation, during the creation, acquisition, transfer, or modification of certain digital assets, our online and/or mobile services, and software provided on or in connection with those services.
            </Typography>






            <br />
            <Typography variant="h5">Acceptance </Typography>
            <Typography variant="body1">
                By clicking or tapping any button or box marked “accept,” “agree” or “OK” (or a similar term) in connection with this Agreement, or by accessing or using the Site, you agree to be bound by this Agreement
                and affirm that you are of legal age to enter into this Agreement where you live and have the legal capacity to enter into this Agreement.
                <br />
                If you are an individual accessing or using the Site on behalf of, or for the benefit of, any corporation, partnership or other entity with which you are associated (an “Organization”),
                then you are agreeing to this Agreement on behalf of yourself and such Organization, and you represent and warrant that you have the legal authority to bind such Organization to this Agreement.
                References to “you” and “your” in this Agreement will refer to both the individual using the Site and to any such Organization.
            </Typography>

            <br />
            <Typography variant="h5">Eligibility </Typography>
            <Typography variant="body1">
                This site is offered and available to users who are 18 years of age or older, or, if the registered user is an Organization, you have the right, power and authority to enter into this agreement on behalf of the registered user and bind the registered user to its terms.
                If the registered user does not agree to the terms of this agreement, we will not provide our services and you must not use the Site or any of our services.
                Without limiting the foregoing, by using our Site, you acknowledge and understand that laws regarding financial instruments, which sometimes include Crypto Assets (as defined below), may vary from jurisdiction to jurisdiction, and it is your obligation alone to ensure that you fully comply with any law, regulation or directive, relevant to your jurisdiction with regard to the use of our Site.
                For the avoidance of doubt, the ability to access our Site does not necessarily mean that our Site, or your activities through it, are legal under the laws, regulations or directives relevant to your jurisdiction.
                All of our Site or the services made available through our Site may not be available to all users, and we reserve the right to assess or reassess at any time your eligibility to use all or part of our Site.
                Our Site does not constitute, and may not be used for the purposes of, an offer or solicitation to anyone in any jurisdiction in which such offer or solicitation is not authorized, or to any person to whom it is unlawful to make such an offer or solicitation.

            </Typography>

            <br />
            <Typography variant="h5">Services </Typography>
            <br />
            <Typography variant="h6"> <u> HashStrat protocol </u>  </Typography>


            <Typography variant="body1">
                Through use of the Site, individuals can interact with the Polygon blockchain to access and deposit funds into baskets of Crypto Assets ("Pools", "Indexes") that programmatically manage the allocation of such assets within the Pools/Indexes without intermediaries while remaining in control of their Crypto Assets.
            </Typography>
            <br />
            <Typography variant="body1">
                The allocations of the assets within these Pools/Indexes are managed by signals ("Strategies") that are generated through predefined, algorithmic logic encoded into smart contracts.
                Certain signals have been encoded and made available by default by the Company.
            </Typography>

            <br />
            <Typography variant="body1">
                “Crypto Assets” as used in this Agreement, refers to ERC20 tokens, implemented on the Polygon blockchain using smart contracts, and include tokens HashStrat created that are part of the HashStrat Protocol.
                HashStrat does not endorse any particular Pool/Index/Strategy or otherwise officially advise you with respect to a particular Pool/Index/Strategy, and any predefined Pool/Index/Strategy made available on the Site are not intended to be personalized financial advice to you.
            </Typography>
            <br />
            <Typography variant="body1">
                To access the services on the Site, including to interact with any Pool/Index/Strategy, you must have access to a compatible virtual currency wallet (a “Wallet”) that supports ERC20 tokens.
                Any Crypto Assets you acquire through the Site will be held and administered solely by you through your Wallet, and we shall have no access to or responsibility in regard to your Wallet or any Crypto Asset held in your Wallet.
                It is solely your responsibility to determine what Wallet software to use in connection with the Site, and your use of such Wallets are subject to any governing terms of use or privacy policy of such Wallet.
                While the Company has added support for certain Wallets and Crypto Assets on the site, you acknowledge and agree that we are under no obligation to add additional support for other Wallets or other Crypto Assets, 
                and that the inclusion of any particular Wallet or Crypto Asset is not an endorsement by us.
            </Typography>

            <br />

            <Typography variant="body1">
                <strong>
                    HashStrat will not create a hosted Wallet for you or otherwise custody Crypto Assets on your behalf, and it is your sole responsibility to maintain the security of your Wallet.
                    In the event that you lose access to your Wallet, a private key, password, or other method of securing your Wallet, any funds may be irretrievable, and HashStrat will be unable to assist you in any way.
                    You hereby irrevocably waive, release and discharge all claims, whether known or unknown to you, against HashStrat, its affiliates and their respective
                    shareholders, members, directors, officers, employees, agents and representatives related to your use of any Wallet software, associated loss of funds, transaction failures,
                    or any other defects that arise in the course of your use of your Wallet, including any losses that may obtain as a result of any failure in smart contracts made available on the Site.
                </strong>
            </Typography>


            <br />
            <Typography variant="body1">
                <strong>
                    We reserve the right to modify, suspend or discontinue, temporarily or permanently, all or any part of our Site with or without notice. You agree that we will not be liable to you or to any third party for any modification, suspension or discontinuance of all or any part of our Site.
                </strong>
            </Typography>
            <br />


            <Typography variant="body1">
                THE SITE IS AN ADMINISTRATIVE PLATFORM ONLY. WE ARE NOT A BROKER, DEALER, FINANCIAL INSTITUTION, EXCHANGE, CUSTODIAN, ROBO-ADVISOR, INTERMEDIARY, OR CREDITOR. THE SITE DOES NOT FACILITATE TRANSACTIONS BETWEEN BUYERS AND SELLERS,
                INCLUDING WITH RESPECT TO ANY TRANSACTIONS THAT OCCUR DURING A REBALANCE, WHICH TRANSACTIONS OCCUR ON THIRD-PARTY, UNAFFILIATED PLATFORMS.
                THE COMPANY IS NOT A COUNTERPARTY TO ANY TRANSACTION ON THE SITE OR FOR ANY USER OF THE SITE. 
                NEITHER THE SITE NOR THE COMPANY PROVIDES FINANCIAL ADVISORY, LEGAL, REGULATORY, OR TAX SERVICES DIRECLTY, INDIRECTLY, IPLICITLY, OR IN ANY OTHER MANNER, AND YOU SHOULD NOT CONSIDER ANY CONTENT CONTAINED IN THIS AGREEMENT OR OTHERWISE POSTED ON THE SITE TO BE A SUBSTITUTE FOR PROFESSIONAL FINANCIAL, LEGAL, REGULATORY, TAX OR OTHER ADVICE. 
                THE COMPANY DOES NOT SUPPORT OR ENDORSE ANY STRATEGY.
            </Typography>

            <br />

            <Typography variant="body1">
                The Company is not providing any digital asset and portfolio management services in connection with the Site.
                You should carefully review all claims and representations before making a transaction decision.
                If you choose to engage in transactions based on Information or other content on the website or applications,
                then such decisions and transactions and any consequences flowing therefrom are your sole responsibility.
            </Typography>

            <br />

            <Typography variant="body1">
                You should use any content or Information gathered from the Site only as a starting point for your own independent research and transactional decision making,
                and you must rely on your own judgment in entering into or refraining from using the Site or conducting (or not conducting) any transaction.
                In no event shall the Company be responsible or liable to you or anyone else, directly or indirectly, for any damage or loss arising from or relating to any use, c
                ontinued use or reliance on any Information or tools, including, without limitation, directly or indirectly resulting from errors in, omissions of or alterations to any such Information.
            </Typography>

            <br />

            <Typography variant="body1">
                <strong>
                    By using the Site, you agree to be fully, independently and personally liable for each transaction made on the Site by you, including, without limitation,
                    any transaction performed automatically by HashStrat strategies as a result of using our Site.
                    As such, you must make sure that you are the only person with access to your Wallet and/or Account at all times.
                    You must make sure that no minors have access to your Wallet.
                </strong>
            </Typography>

            <br /><br />
            <Typography variant="h5">Charges and Fees</Typography> <br/>

            <Typography variant="body1">
                The Service may be available to you with or without charge. 
                Some services on the site involve the use of the Polygon blockchain network, which may require that you pay a fee, commonly known as "Polygon Gas Charges,” for the computational resources required to perform a transaction.
                You acknowledge and agree that the Company has no control over: (a) any Polygon blockchain transactions; (b) the method of payment of any Polygon Gas Charges; or (c) any actual payments of Polygon Gas Charges.
                Accordingly, you must ensure that you have a sufficient balance of MATIC stored at your Wallet to complete any transaction on the Polygon blockchain network before initiating such transactions.
                Refer to your digital wallet or Polygon block explorer to get an estimate of any Polygon Gas Charges before initiating any services that require the use of the Polygon blockchain network.
            </Typography>
            <br />

            <Typography variant="body1">
                You may be subject to certain additional fees and commissions at the time of withdrawing funds from any HashStrat Pool and Index, including fees defined by the HashStrat protocol.
                While we do not currently charge for the use of any of our services or access to the Site, we reserve the right to levy additional fees in the future, including fees for access to Information or service fees to support the operation of the Site.
                In the event that we add fees to the Site or any of our services, we will alert you in writing prior to any such fees going into effect.
            </Typography>

            <br />

            <Typography variant="body1">
                Notwithstanding anything in this Agreement to the contrary, it is your sole responsibility to determine whether, and to what extent, any taxes apply to any transactions you conduct through the Site,
                and to withhold, collect, report and remit the correct amount of taxes to the appropriate tax authorities.
            </Typography>

            <br/><br/>

            <Typography variant="h5">Content </Typography><br/>

            <Typography variant="body1">
                The Site may contain links and references to non-Site websites and resources (“Linked Websites”) and are provided for convenience only.
                If you decide to leave the Site and access Linked Websites, you do so at your own risk, and Site will have no liability arising out of or related to such Linked Websites and/or their content or any damages or loss caused or alleged to be caused by or in connection of any purchase or use of any such content, goods or services available on or through any such Linked Website.
                Your use of any Linked Websites shall be subject to such Linked Websites terms of use and privacy policy.
                Site has not reviewed the Linked Websites and we are not responsible for the content, accuracy or opinions expressed on these websites.
                Inclusion of these links on our Websites does not apply approval or endorsement by Site of the Linked Websites, their entities or products and services.
                Please understand that the Linked Websites, even if they contain the Company’s logo, are independent websites, and the Company does not control the content on that Linked Website.
                Additionally, the Company is not a party to or responsible for any transaction you may enter into with any such third party, even if you learn of such third party from the Company, by way of reference or link provided on the Company’s Websites.

            </Typography>

            <br />

            <Typography variant="body1">
                You acknowledge that you are responsible for any Content that you submit or transmit through any of our websites, applications or any posts, blogs and any other communications and content options available to us, including your responsibility as to the legality, reliability, appropriateness, originality and copyright of any such information or material. Additionally, you represent and warrant that: (i) you own all right title and interest in any Content provided by you, (ii) such Content does not violate any applicable laws, and (iii) the posting of your Content by us (in any manner or media whatsoever, on an unrestricted basis) does not (and will not) violate the privacy rights, publicity rights, copyright, contract rights or any other rights of any individual or make derogatory remarks regarding, defame or otherwise criticize any person or entity. You shall be solely liable for any damage resulting from any infringement or other violation of the copyright, trademarks or other proprietary rights of any individual or entity, and for any other harm or losses resulting from any Content.
            </Typography>


            <br /><br/>

            <Typography variant="h5">Rules of Conduct </Typography><br/>

            <Typography variant="body1">In connection with the use of the Site, you must not:</Typography>

            <ol>
                <li>
                    Post, transmit or otherwise make available through or in connection with the Site any materials that are or may be: (a) threatening, harassing, degrading, hateful or intimidating, or otherwise fail to respect the rights and dignity of others; (b) defamatory, libelous, fraudulent or otherwise tortious; (c) obscene, indecent, pornographic or otherwise objectionable; or (d) protected by copyright, trademark, trade secret, right of publicity or privacy or any other proprietary right, without the express prior written consent of the applicable owner.
                </li>
                <li>
                    Post, transmit or otherwise make available through or in connection with the Site any virus, worm, Trojan horse, Easter egg, time bomb, spyware, scareware, malware or other computer code, file or program that is or is potentially harmful or invasive or intended to damage or hijack the operation of, or to monitor the use of, any hardware, software or equipment (each, a “Virus”).
                </li>
                <li>
                    Use the Site for any commercial purpose except as explicitly provided by this Agreement or any other terms agreed to in writing by us, or for any purpose that is fraudulent or otherwise tortious or unlawful
                </li>

                <li>
                    Harvest or collect information about users of the Site except as explicitly provided by this Agreement and our Privacy Policy.
                </li>
                <li>
                    Use the Site to transmit through or in connection with the Site, any spam, chain letters or other unsolicited communications.
                </li>

                <li>
                    Interfere with or disrupt the operation of the Site or the servers or networks used to make the Site available, including by hacking or defacing any portion of the Site (including any content available thereby); or violate any requirement, procedure or policy of such servers or networks.
                </li>
                <li>
                    Restrict or inhibit any other person from legal use of the Site.
                </li>
                <li>
                    Reproduce, modify, adapt, translate, create derivative works of, sell, rent, lease, loan, timeshare, distribute or otherwise exploit any portion of (or any use of) the Site except as expressly authorized herein, without Company’s express prior written consent.
                </li>
                <li>
                    Reverse engineer, decompile or disassemble any portion of the Site, except to the extent such restriction is expressly prohibited by applicable law.
                </li>
                <li>
                    Remove any copyright, trademark or other proprietary rights notice from the Site.

                </li>
                <li>
                    Frame or mirror any portion of the Site, or otherwise incorporate any portion of the Site into any product or service, without Company’s express prior written consent.

                </li>
                <li>
                    Systematically download and store Site content.
                </li>
                <li>
                    Use any robot, spider, site search/retrieval application or other manual or automatic device to retrieve, index, “scrape,” “data mine” or otherwise gather Site content or reproduce or circumvent the navigational structure or presentation of the Site, without Company’s express prior written consent.
                    Notwithstanding the foregoing, and subject to compliance with applicable law and any instructions posted in the robots.txt file located in the Site’s root directory,
                    Company grants to the operators of public search engines permission to use spiders to copy materials from the Site for the sole purpose of (and solely to the extent necessary for) creating publicly available, searchable indices of such materials, but not caches or archives of such materials.
                    Company reserves the right to revoke such permission either generally or in specific cases, at any time and without notice.

                </li>
                <li>
                    Activity which would violate, or assist in violation of, any law, statute, ordinance, or regulation, sanctions programs administered in any jurisdiction the Site operates, including but not limited to the U.S. Department of Treasury's Office of Foreign Assets Control ("OFAC"),
                    or which would involve proceeds of any unlawful activity; publish, distribute or disseminate any unlawful material or information.

                </li>
                <li>
                    Use the Site for any purpose that could be construed as gambling or facilitating such, including but not limited to lotteries, sports forecasting or odds making,
                    fantasy sports leagues with cash prizes, internet gaming, contests, sweepstakes or games of chance.

                </li>

                <li>
                    Using trading strategies aimed at exploiting errors in prices, conducting transactions at off-market prices, or taking advantage of Internet issues, blockchain network failures, connectivity delays, market events, price feed errors, or other clear defects where prices displayed on the Site do not actually reflect the market rates,
                    or entering into transactions or combinations of transactions which, taken together or separately, are for the purpose of manipulating the Site.
                </li>

            </ol>


            <br />

            <Typography variant="h5"> Access to the Site and the Services </Typography>
            <br />

            <ol>
                <li>
                    <strong>License</strong><br />
                    Subject to this Agreement, HashStrat grants you a non-transferable, non-exclusive, revocable, limited license to use and access the Site and related content, materials, information (collectively, the "Site Content") solely for your personal use.
                    Any other use of the Site or Site Content is expressly prohibited and all other right, title, and interest in the Site or Site Content is exclusively the property of HashStrat and its licensors.
                </li>
                <li>
                    <strong>Certain Restrictions</strong><br />
                    The rights granted to you in this Agreement are subject to the following restrictions:
                    (a) you shall not license, sell, rent, lease, transfer, assign, distribute, host, or otherwise commercially exploit the Site, whether in whole or in part, or any content displayed on the Site;
                    (b) you shall not modify, make derivative works of, disassemble, reverse compile or reverse engineer any part of the Site; (c) you shall not access the Site in order to build a similar or competitive website, product, or service; and (d) except as expressly stated herein, no part of the Site may be copied, reproduced, distributed, republished, downloaded, displayed, posted or transmitted in any form or by any means. Unless otherwise indicated, any future release, update, or other addition to functionality of the Site shall be subject to this Agreement.
                    All copyright and other proprietary notices on the Site (or on any Site Content) must be retained on all copies thereof.
                </li>

                <li>
                    <strong>Site and Service Availability</strong> <br />
                    HashStrat shall use commercially reasonable efforts to attempt to provide the Site on a twenty-four (24) hours a day, seven (7) days a week basis.
                    You acknowledge and agree that from time to time this site may be inaccessible or inoperable for any reason including, but not limited to, equipment malfunctions; periodic maintenance, 
                    repairs or replacements that HashStrat undertakes from time to time; or causes beyond our reasonable control or that are not reasonably foreseeable including, but not limited to,
                    interruption or failure of telecommunication or digital transmission links, failure on or congestion of the Polygon blockchain network, hostile network attacks, network congestion or other failures.
                    You acknowledge and agree that HashStrat has no control over the availability of this Site on a continuous or uninterrupted basis,
                    and that HashStrat assumes no liability to You or any other party with regard to such, including but not limited to loss of revenue.
                </li>

                <li>
                    <strong>Customer Support</strong> <br />
                    The Site and any related services are provided “as-is” and HashStrat does not commit to providing any Customer Support in connection with the Site and is under no obligation to do so.
                    However, we are happy to discuss any challenges or questions you may have about the Site and may offer assistance on a case-by-case basis.
                    If you have questions about any aspect of the Site, you can send an email to carlo@hashstrat.com.
                </li>

                <li>
                    <strong>Ownership</strong> <br />
                    You acknowledge that all the intellectual property rights, including copyrights, patents, trademarks, and trade secrets, in the Site and Site Content are owned by HashStrat or HashStrat suppliers.
                    Neither this Agreement nor your access to the Site transfers to you or any third party any rights, title or interest in or to such intellectual property rights, except for the limited access rights expressly set forth in this Agreement.
                    HashStrat and its suppliers reserve all rights not granted in this Agreement. There are no implied licenses granted under this Agreement.
                </li>
            </ol>

            <br /><br/>

            <Typography variant="h5"> Risks and Disclaimers </Typography><br/>


            <Typography variant="body1">
                Use of the Site and participation in Transactions may carry financial risk.
                “Transactions” as used in this Agreement are defined as direct interactions with HashStrat protocol smart contracts on the Polygon blockchain.
                You acknowledge and agree that you are aware of such risks, including the following:
            </Typography>

            <ul>
                <li>
                    Transactions in Crypto Assets can be very risky. Crypto Assets are, by their nature, highly experimental, risky, volatile and Transactions are generally irreversible.
                    You should not make any transactional decision without first conducting your own research.
                    You are solely and exclusively responsible for determining whether any transaction, or strategy, or any other product or service is appropriate or suitable for you based on your own objectives and personal and financial situation.
                    You acknowledge and agree that you will access and use the Site and participate in Transactions at your own risk.
                </li>

                <li>
                    Understanding Crypto Assets and Transactions may require advanced technical knowledge.
                    Crypto Assets are often described in exceedingly technical language that requires a comprehensive understanding of applied cryptography and computer science in order to appreciate the inherent risks of transacting Crypto Assets.
                    Any reference to a type of Token on the Site does not indicate our approval or disapproval of the underlying technology regarding such type of Token, and should not be used as a substitute for your own understanding of the risks specific to each type of Token.
                    We make no warranty as to the suitability of the Crypto Assets referenced on the Site and assume no fiduciary duty in our relations with you.
                </li>

                <li>
                    In entering into any Transaction, you represent that you have been, are and will be solely responsible for making your own independent appraisal and investigations into the risks of the Transaction and the underlying Crypto Assets.
                    You represent that you have sufficient knowledge, market sophistication, professional advice and experience to make your own evaluation of the merits and risks of any Transaction or any underlying Token.
                    You accept all consequences of participating in Transactions, including the risk that you may lose access to your Crypto Assets indefinitely.
                    All Transaction decisions are made solely by you. Notwithstanding anything in this Agreement, we accept no responsibility whatsoever for and will in no circumstances be liable to you in connection with Transactions.
                    Under no circumstances will the operation of all or any portion of the Site be deemed to create a relationship that includes the provision or tendering of investment advice.
                </li>

                <li>
                    The prices of Crypto Assets are extremely volatile. Fluctuations in the price of other digital assets could materially and adversely affect the Crypto Assets, which may also be subject to significant price volatility.
                </li>

                <li>
                    Our Service does not store, send, or receive Crypto Assets. Any transfer of Crypto Assets occurs within the supporting blockchain and not on this Service, as such transfers are generally not reversible or cancelable.
                </li>

                <li>
                    The Company does not guarantee the future performance of your Crypto Asset, any specific level of performance, the success of any transaction strategy or the success of your overall management of your portfolio.
                    When reviewing the financial performance information, you should not assume that such information is accurate and complete.
                    Past performance are not indicative of future results.
                    No representation or guarantee is being made that any strategy will or is likely to achieve gains or losses similar to the past performance shown.
                    The actual percentage gains or losses experienced by investors will vary depending on many factors.
                </li>

                <li>
                    <strong>
                        To the maximum extent permissible under applicable law, neither we nor any of our affiliates will be liable for
                        (a) any loss arising from following your written or oral instructions,
                        (b) any loss that you may suffer by reason of any decision or trade made by a HashStrat strategy you employed;
                        Notwithstanding the foregoing, nothing in these Terms will waive or limit any rights that you may have under any applicable laws which may not be waived or limited.
                    </strong>
                </li>

                <li>
                    You are responsible for complying with applicable law.
                    You agree that we are not responsible for determining whether or which laws may apply to your Transactions, including tax laws.
                    You are advised to consult an attorney regarding of the legality of any activities on the Site.
                    You are solely responsible for reporting and paying any taxes arising from your use of the Site and participation in any Transaction.
                </li>

                <li>
                    You are aware of and accept the risk of operational challenges.
                    The Site may experience sophisticated cyber-attacks, unexpected surges in activity or other operational or technical difficulties that may cause interruptions to or delays on the Site.
                    You agree to accept the risk of a Transaction failure resulting from unanticipated or heightened technical difficulties, including those resulting from sophisticated attacks, and you agree not to hold us accountable for any related losses.
                    We will not bear any liability, whatsoever, for any damage or interruptions caused by any Viruses that may affect your computer or other equipment, or any phishing, spoofing or any other type of similar activity.
                </li>


                <li>
                    There are risks associated with using an Internet based currency, including but not limited to, the risk of hardware, software and Internet connections, the risk of malicious software introduction, and the risk that third parties may obtain unauthorized access to information stored within your wallet.
                    You accept and acknowledge that the Company will not be responsible for any communication failures, disruptions, errors, distortions or delays you may experience when using the Site, however caused.
                </li>

                <li>
                    The regulatory regime governing blockchain technologies, cryptocurrencies, and Crypto Assets is uncertain.
                    New regulations or policies may materially adversely affect the development of the Auction and/or Service and the utility of Crypto Assets.
                    You are advised to consult with legal counsel regarding the Site’s contents in your jurisdiction.
                </li>

            </ul>


            <Typography variant="body1">
                The Service will rely on third-party platforms such as Amazon AWS.<br/>
                If we are unable to maintain a good relationship with such platform providers; if the terms and conditions or pricing of such platform providers change; if we violate or cannot comply with the terms and conditions of such platforms;
                or if any of such platforms loses market share or falls out of favor or is unavailable for a prolonged period of time, access to and use of the Site will suffer.
                The HashStrat protocol integrates with third-party party blockchain services on the Polygon network including Chainlink, QuickSwap and Uniswap.
                These services are required to run the strategies and perform swap of Crypto Assets.
                Should these services misfunction, that could impact the performance and correct behaviour of the HashStrat protocol.
            </Typography>
            <br/>

            <Typography variant="body1">
                The Company does not own or control the underlying software protocols which govern the operation of Crypto Assets available through the Site.
                In general, the underlying protocols are open source and anyone can use, copy, modify, and distribute them.
                The Company is not responsible for operation of the underlying protocols, and the Company makes no guarantee of their functionality, security, or availability.
                The underlying protocols are subject to sudden changes in operating rules (“Forks”), and such Forks may materially affect the value, function, or even the name of a Crypto Asset available on the Site.
                In the event of a Fork, we may temporarily suspend the Site’s operations (with or without advance notice to you) and we may (a) configure or reconfigure its systems or (b) decide not to support (or cease supporting) the Forked protocol entirely.
            </Typography>
            <br/><br/>

            <Typography variant="h5"> Privacy </Typography>
            <br />
            <Typography variant="body1">
                Our privacy policy is a part of this Agreement.
                Please review our <Link target="blank" component={RouterLink} to='/privacy'>Privacy Policy</Link>, which also governs the Site and informs users of our data collection practices.
            </Typography>
            <br/><br/>

            <Typography variant="h5"> Warranties and Disclaimers </Typography>
            <br />
            <Typography variant="body1">
                <strong>
                    We have put in a great deal of effort to deliver you the Site and we hope you find it valuable, but there are certain things we can’t promise about them.
                    YOU EXPRESSLY ACKNOWLEDGE AND AGREE THAT YOUR ACCESS TO AND USE OF THE SITE AND ANY SITE CONTENT IS AT YOUR SOLE RISK. OTHER THAN AS EXPRESSLY SET OUT IN THESE TERMS,
                    NEITHER THE COMPANY NOR ITS AFFILIATES, SUPPLIERS OR DISTRIBUTORS (HASHSTRAT LABS) MAKE ANY WARRANTY, EITHER EXPRESS OR IMPLIED, ABOUT THE SITE OR SITE CONTENT.
                    THE SITE AND SITE CONTENT ARE PROVIDED “AS IS.” THE COMPANY DOES NOT WARRANT THAT:
                    (1) THE OPERATION OF THE SITE OR SITE CONTENT WILL BE UNINTERRUPTED, ERROR-FREE, OR VIRUS-FREE;
                    (2) THE FUNCTIONS CONTAINED IN THE SITE OR SITE CONTENT WILL BE ACCURATE OR MEET YOUR REQUIREMENTS; OR
                    (3) ANY DEFECTS IN THE SITE OR SITE CONTENT WILL BE CORRECTED.
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ALSO DISCLAIM ANY WARRANTIES OF MERCHANTABILITY,
                    FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. SOME STATES OR JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OF IMPLIED WARRANTIES,
                    SO SOME DISCLAIMERS IN THIS SECTION MAY NOT APPLY TO YOU.
                </strong>
            </Typography>
            <br/><br/>

            <Typography variant="h5"> Limitation of Liability </Typography>
            <br />
            <Typography variant="body1">
                <strong>
                    TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL THE COMPANY BE RESPONSIBLE TO YOU FOR ANY:
                    (1) LOSS OF USE, DATA, BUSINESS OR PROFITS; (2) FINANCIAL LOSSES; OR (3) INDIRECT, SPECIAL CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES.
                    THIS WILL BE WHETHER OR NOT THE COMPANY PARTIES HAVE BEEN WARNED OF THE POSSIBILITY OF SUCH DAMAGES.
                    NOTWITHSTANDING ANYTHING TO THE CONTRARY IN THESE TERMS, NOTHING IN THESE TERMS EXCLUDES OR LIMITS LIABILITY FOR FRAUD, FRAUDULENT MISREPRESENTATION, OR FOR DEATH OR PERSONAL INJURY CAUSED BY GROSS NEGLIGENCE.
                </strong>
            </Typography>
            <br/><br/>

            <Typography variant="h5"> Indemnification </Typography>
            <br />
            <Typography variant="body1">
                You agree to defend, indemnify and hold harmless the Company, its affiliates, licensors and service providers,
                and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors and assigns from and against
                any claims, liabilities, damages, judgments, awards, losses, costs, expenses or fees (including reasonable attorneys' fees) arising out of or relating to your violation of this Agreement
                or your use of the Site, including, but not limited to any use of the Site's content, services and products other than as expressly authorized in this Agreement or your use of any information obtained from the Site.
            </Typography>
            <br /> <br />

            <Typography variant="h5"> Designated Countries Privacy Rights </Typography>
            <br />

            <Typography variant="body1">
                This Section only applies to users and customers of the Site that are located in the European Economic Area, United Kingdom and/or Switzerland (collectively, the “Designated Countries”) at the time of data collection.
                We may ask you to identify which country you are located in when you use some of the Site, or we may rely on your IP address to identify which country you are located in.
                Where we rely only on your IP address, we cannot apply the terms of this Section to any User or Customer that masks or otherwise obfuscates their location information so as not to appear located in the Designated Countries.
                If any terms in this Section conflict with other terms contained in this Agreement, the terms in this section shall apply to Users and Customers in the Designated Countries.

                <br /><br />
                We are a data controller with regard to any personal information collected from Customers or Users of its Site. A “data controller” is an entity that determines the purposes for which and the manner in which any personal information is processed.
                Any third parties that act as our service providers are “data processors” that handle your personal information in accordance with our instructions.
                <br /><br />
                You may object to our processing at any time and as permitted by applicable law if we process your personal information on the legal basis of consent, contract or legitimate interests.
                We can continue to process your personal information if it is necessary for the defense of legal claims, or for any other exceptions permitted by applicable law.
                <br /><br />
                If we process your personal information based on a contract with you or based on your consent, or the processing is carried out by automated means, you may request to receive your personal information in a structured,
                commonly used and machine-readable format, and to have us transfer your personal information directly to another “controller”, where technically feasible, unless exercise of this right adversely affects the rights and freedoms of others.
                <br /><br />
                If you believe we have infringed or violated your privacy rights, please contact us at carlo@hashstrat.com so that we can work to resolve your concerns.
                You also have a right to lodge a complaint with a competent supervisory authority situated in a Member State of your habitual residence, place of work, or place of alleged infringement.
            </Typography>
             <br /> <br />

            <Typography variant="h5"> Changes to this Agreement </Typography><br />

            <Typography variant="body1">
                We reserve the right to change this Agreement at any time upon notice.
                We may give notice by posting the updated Agreement on the Site or by any other reasonable means.
                You can review the most current version of this Agreement at any time.
                This Agreement in effect at the time of your use of the Site apply.
                Updated versions of the Agreement are binding on you with respect to your use of the Site on or after the date indicated in the updated Agreement.
                If you do not agree to the updated Agreement, you must stop using the Site.
                Your continued use of the Site after the date of the updated Agreement will constitute your acceptance of the updated Agreement.
            </Typography>
            <br /> <br />

            <Typography variant="h5"> Entire Agreement </Typography><br />

            <Typography variant="body1">
                This Agreement and Privacy Policy constitute the sole and entire agreement between you and the Company with respect to the Site and
                supersede all prior and contemporaneous understandings, agreements, representations and warranties, both written and oral, with respect to the Site.
            </Typography>
            <br />
            <Typography variant="body1">
                This Agreement does not, and will not be construed to, create any partnership, joint venture, employer-employee, agency or franchisor-franchisee relationship between you and the Company.
            </Typography>

        </Box>
    )
}