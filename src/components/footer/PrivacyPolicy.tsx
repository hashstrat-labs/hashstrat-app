


import { makeStyles, Box, Typography, Link } from "@material-ui/core"
import { Link as RouterLink } from "react-router-dom"


const useStyle = makeStyles(theme => ({
    privacy: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        margin: "auto",
        maxWidth: 900,
    },

}))


export const PrivacyPolicy = () => {
    const classes = useStyle()

    return (
        <Box className={classes.privacy}>

            <Typography variant="h3" align="center"> Privacy Policy</Typography>
            <br />

            <Typography variant="body2"> This document was last updated on March 14, 2023. </Typography>


            <br />
            <Typography variant="body1">
                This Privacy Policy governs the manner in which HashStrat Labs (collectively, “Company”, HashStrat, “our”, “us”, or “we”) collects, uses,
                maintains and discloses information collected from users (each, a "User") of the Site. <br />

                This Policy also applies to any of our other websites that post this Policy. <br />
                By using the Site, you agree that you have read, understood, and accept all of the terms and conditions of this Privacy Policy, and you hereby consent that we will collect, use, and share your information in the following ways.
            </Typography>
            <br />
            <Typography variant="body1">
                Any capitalized terms not defined herein shall have the meaning set forth in our <Link target="blank" component={RouterLink} to='/terms'>Terms of Service</Link>, (“Terms of Service”).
            </Typography>

            <br /><br />
            <Typography variant="h6">  Collection of Your Personal Information</Typography>


            <Typography variant="body1">
                In order to better provide you with products and services offered on our Site, we may collect personally identifiable information (“Personal Information”), such as your:
            </Typography>

            <ul>
                <li>Pologon Address (Public Key or ENS domain)</li>
                <li>Identity information such as your IP address</li>
            </ul>

            <Typography variant="body1">
                We may collect Personal Information from Users in a variety of ways, including, but not limited to, when Users visit our Site and connect a Wallet or sign up for an Account, fill out a form, or otherwise directly correspond with us in connection with other activities, services, features or resources we make available on our Site. 
                <br />
                Users may be asked for, as appropriate, email address or other Personal Information to access some features on the Site. Users may, however, visit our Site anonymously. 
                <br />
                We will collect Personal Information from Users only if they voluntarily submit such information to us. 
                <br />
                Users can always refuse to supply Personal Information, except that it may prevent them from engaging in certain Site related activities.
            </Typography>


            <br /><br />
            <Typography variant="h6"> Non-Personal Identification Information </Typography>

            <Typography variant="body1">
                We may automatically collect and record non-personal identification information about Users whenever they interact with our Site on our server logs.<br />
                Non-personal identification information may include your Polygon address (without other Personal Information),
                the browser name, the type of computer and technical information about Users means of connection to our Site, such as the operating system and
                the Internet service providers utilized and other similar information.<br />
                We may also collect non-personal identification information about you from other sources, including from our use of cookies (as described below) and from publicly available data on a blockchain network,
                such as information collected from using blockchain explorers or third party service.<br />
                We may add this to information we get from you on this Site.
            </Typography>


            <br /><br />
            <Typography variant="h6">Information Collected from Other Sources and Do Not Track Policy</Typography>

            <Typography variant="body1">
            We also receive information from other sources and combine that with information we collect rough our Site.
            For instance, we may collect additional information like demographic and statistical information from third parties and sources other than the Site for which you have approved our access, such as other web3 service providers platforms or APIs.
            In addition, you may also provide us information by accessing third-party services in connection with your use of the Site, including social media IDs and related social media information.
            In any event, if we collect information from other sources, we will always endeavor to provide you with clear notice of such data collection.
            However, any third-party services may collect information as determined by their own privacy policies, and you should be careful to review their policies prior to using such services.
            <br /><br />
            Through cookies we place on your browser or device, we may also collect information about your online activity after you leave our Site.
            Just like any other usage information we collect, this information allows us to improve the Site and customize your online experience, and otherwise as described in this Privacy Policy.
            <br /><br />

            Your browser may offer you a “Do Not Track” option, which allows you to signal to operators of websites and web applications and services (including behavioral advertising services) that you do not wish such operators to track certain of your online activities over time and across different websites. When you turn on the Do Not Track function in your browser, we stop collecting the information from your browser that allows us to tailor advertisements and other content specifically to you that is based on your visits to our advertising partners’ websites. Specifically, we stop collecting information from the unique browser cookie that links your browser to visits to third party sites. Do Not Track signals are set on a browser-by-browser basis, so you must set them on every browser you use if you do not wish to be tracked. Remember that this is just our Do Not Track policy, and we can’t and don’t make any promises about how third parties react when you set this signal on your browser.
            </Typography>

            <br /><br />
            <Typography variant="h6">Web browser cookies</Typography>

            <Typography variant="body1">
            We may use both session cookies (which expire once you close your web browser) and persistent cookies (which stay on your computer or mobile device until you delete them) to help you personalize your online experience.
            A cookie is a text file that is placed on your hard disk by a web page server.
            Cookies cannot be used to run programs or deliver viruses to your computer.
            Cookies are uniquely assigned to you, and can only be read by a web server in the domain that issued the cookie to you.
            <br /><br />
            We use two broad categories of cookies:
            (1) first party cookies, served directly by us to your computer or mobile device, which are used only by us to recognize your computer or mobile device when it revisits our Site; and
            (2) third party cookies, which are served by service providers on our Site, and can be used by such service providers to recognize your computer or mobile device when it visits other websites.

            <br /><br />
            One of the primary purposes of cookies is to provide a convenience feature to save you time.
            The purpose of a cookie is to tell the Web server that you have returned to a specific page.
            This simplifies the process of recording your personal information, such as mailing addresses, shipping addresses, and so on.
            When you return to the Site, the information you previously provided can be retrieved, so you can easily use the features that you customized.

            <br /><br />
            Our Site uses the following types of cookies for the purposes set out below:
            </Typography>

            <ul>
                <li>
                    <Typography variant="body1"><strong>Essential Cookies</strong></Typography>
                    These cookies are essential to provide you with services available through our Site and to enable you to use some of its features. Without these cookies, the services that you have asked for may not be able to be provided or fully functional, and we only use these cookies to provide you with those services.
                </li>

                <li>
                    <Typography variant="body1"><strong>Functionality Cookies</strong></Typography>
                    These cookies allow our Site to remember choices you make when you use our Site, such as remembering your language preferences, remembering your login details and remembering the changes you make other parts of our Site which you can customize. The purpose of these cookies is to provide you with a more personal experience and to avoid you having to re-enter your preferences every time you visit our Site
                </li>

                <li>
                    <Typography variant="body1"><strong>Analytics and Performance Cookies</strong></Typography>
                    These cookies are used to collect information about traffic to our Site and how users use our Site. The information gathered does not identify any individual visitor. We use this information to help operate our Site more efficiently and to monitor the level of activity on our Site.
                </li>

            </ul>

            <br />
            <Typography variant="body1">
            We use Google Analytics for this purpose.
            Google Analytics uses its own cookies. It is only used to improve how our Site works.
            You can find out more information about Google Analytics cookies <Link target="_blank" href="https://support.google.com/analytics/answer/11397207?hl=en" >here</Link>.

            You can find out more about how Google protects your data <Link target="_blank" href="https://marketingplatform.google.com/about" >here</Link>.

            <br /><br />
            You can prevent the use of Google Analytics relating to your use of our Site by downloading and installing the browser plugin available
            via this <Link target="_blank" href="https://tools.google.com/dlpage/gaoptout?hl=en-US" >link</Link>.

            <br /><br />

            You have the ability to accept or decline cookies.
            You can disable these pursuant to your web browser’s instructions (usually located within the “settings,” “help” “tools” or “edit” facility).
            Most Web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer.
            If you choose to decline cookies, you may not be able to fully experience the interactive features of the Site’s services or websites you visit.
            </Typography>

            <br /><br />
            <Typography variant="h6">Use of Information</Typography>

            <Typography variant="body1">
            Below is a description of all of the ways we intend to use your information:
            </Typography>
            <ul>
                <li>We use your Personal Information to operate, maintain, and improve the Site, products, and our services.</li>
                <li>We use your Personal Information to respond to and provide and improve customer service.</li>
                <li>We use your Personal Information to send information including confirmations, technical notices, updates, security alerts, and support and administrative messages.</li>
                <li>With your consent, we use your Personal Information to communicate about promotions, upcoming events, and other news, including news about products and services offered by us and our selected partners.</li>
                <li>We use your Personal Information to conduct security investigations and risk assessments.</li>
                <li>We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.</li>
                <li>We may use feedback you provide to improve our products and services.</li>
                <li>We use your Personal Information as described in the “Sharing of Your Personal Information” section below.</li>
                <li>Sharing of Your Personal Information</li>
            </ul>
            <br />

            <Typography variant="h6">Sharing of Your Personal Information</Typography>
            
            <Typography variant="body1">
            We may share Personal Information as follows:
            </Typography>
            <ul>
                <li>We may share Personal Information with your express consent.</li>
                <li>We may share Personal Information when we do a business deal, or negotiate a business deal, involving the sale or transfer of all or a part of our business or assets. These deals can include any merger, financing, acquisition, or bankruptcy transaction or proceeding.</li>
                <li>We may share personal information for legal, protection, compliance and safety purposes.</li>
                <ul>
                    <li>We may share information to comply with applicable laws.</li>
                    <li>We may share information to respond to law enforcement, officials, regulatory agencies and other lawful requests, subpoenas and legal processes.</li>
                    <li>We may share information to protect the rights and property of HashStrat, our agents, customers, and others. This includes enforcing our agreements, policies, and Terms of Service.</li>
                    <li>We may share information in an emergency. This includes protecting the safety of our employees and agents, our customers, or any person.</li>
                </ul>
                <li>We may share your information with certain service providers to help provide our Site.</li>
                <li>We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.</li>
                <li>We may share your information with other businesses or third parties to help us operate our business and the Site, or to administer activities on your behalf, provided that you have given us your permission. For instance, this may include sharing information with other web3 service providers that you have accessed or interacted with using our Site.</li>
            </ul>

            <Typography variant="body1">
            We do not sell, trade, or rent Users Personal Information to others.
            </Typography>

            <br /><br />
            <Typography variant="h6">Information Choices and Changes</Typography>

            <Typography variant="body1">
            For purposes of the rights described below, if you are a resident of the European Economic Area, United Kingdom or Switzerland,
            “Personal Information” shall have the same meaning as “Personal Data” is defined under the General Data Protection Regulation (“GDPR”),
            and “processing” shall have the same meaning as defined in the GDPR. For purposes of the GDPR,
            HashStrat will be the controller of your Personal Information processed in connection with the Site.
            </Typography>

            <br />

            <Typography variant="body1">
            You may send requests about Personal Information to our Contact Information below regarding the following:
            </Typography>

            <ul>
                <li>
                    <strong>Opt-out</strong><br />
                    You may contact us anytime to opt-out of: (i) direct marketing communications; and (ii) any new processing of your Personal Information that we may carry out beyond the original purpose. Please note that your use of some of the Site may be ineffective upon opt-out. Our marketing emails also tell you how to “opt-out.” If you opt out, we may still send you non-marketing emails on an as-needed basis.
                </li>
                <li>
                    <strong>Access</strong><br />
                    You may access the information we hold about you at any time by contacting us directly.
                </li>
                <li>
                    <strong>Amend</strong><br />
                    You can also contact us to update or correct any inaccuracies in your Personal Information.
                </li>
                <li>
                    <strong>Move</strong><br />
                    Your Personal Information is portable – i.e. you have the flexibility to move your data to other service providers as you wish.
                </li>
                <li>
                    <strong>Erase and forget</strong><br />
                    In certain situations, for example when the information we hold about you is no longer relevant or is incorrect, you can request that we erase your data.
                </li>
                <li>
                    <strong>Restriction of processing</strong><br />
                    You can ask us to restrict further processing of your Personal Information.
                </li>
                <li>
                    <strong>Withdrawal of Consent</strong><br />
                    If we are processing your Personal Information based on your consent (as indicated at the time of the collection of such Personal Information), you have the right to withdraw your consent at any time. Please note, however, that if you exercise this right, you may have to then provide express consent on a case-by-case basis for the use or disclosure of certain of your Personal Information, if such use or disclosure is necessary to enable you to utilize some or all of our Site.
                </li>
            </ul>

            <Typography variant="body1">
            If you wish to exercise any of these rights, please contact us using the details in the Contact Information section below. In your request, please make clear:
            (i) what Personal Information is concerned; and
            (ii) which of the above rights you would like to enforce.
            For your protection, we may only implement requests with respect to the Personal Information associated with the particular email address that you use to send us your request, and we may need to verify your identity before implementing your request.
            We will try to comply with your request as soon as reasonably practicable and in any event, within one month of your request.
            <br />
            If you are in the European Economic Area, United Kingdom and/or Switzerland at the time of data collection, you have the right to lodge a complaint to a Data Protection Authority about our collection and use of your data.
            For more information, please contact your local data protection authority or agency.
            </Typography>

            <br /><br />

            <Typography variant="h6">Tracking User Behavior</Typography>
            <Typography variant="body1">
            We may keep track of the websites and pages our users visit on the Site in order to determine what services are the most popular.
            </Typography>
            <br /><br />

            <Typography variant="h6">Security of your Personal Information</Typography>
            <Typography variant="body1">
            When Personal Information is transmitted to other websites, it is protected through the use of encryption, such as the Secure Sockets Layer (SSL) protocol. We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your Personal Information, username, password, transaction information and data stored on our Site.
            <br /><br />
            We strive to take appropriate security measures to protect against unauthorized access to or alteration of your Personal Information. Unfortunately, no data transmission over the Internet or any wireless network can be guaranteed to be 100% secure. As a result, while we strive to protect your Personal Information, you acknowledge that: (a) there are security and privacy limitations inherent to the Internet which are beyond our control; and (b) security, integrity, and privacy of any and all information and data exchanged between you and us through this Site cannot be guaranteed.
            </Typography>

            <br /><br />
            <Typography variant="h6">Retention</Typography>
            <Typography variant="body1">
            We will only retain your Personal Information for as long as is reasonably required for you to use the Site (and in the event you create an Account, until you delete such Account) unless a longer retention period is required or permitted by law (for example for regulatory purposes).
            </Typography>
            <br /><br />

            <Typography variant="h6">Minors</Typography>
            <Typography variant="body1">
            We do not knowingly collect personally identifiable information from minors. If you are under the age of eighteen, you must ask your parent or guardian for permission to use this website. If you believe that a child under the age of 13 has provided information to us, please notify us at carlo@hashstrat.com. If we inadvertently collect information of children under 13, we will delete that information immediately upon notice. We are not liable for any damages that may result from the user’s misrepresentation of age.
            </Typography>
            <br /><br />

            <Typography variant="h6">External Data Storage Sites</Typography>
            <Typography variant="body1">
            Your information, including Personal Information that we collect from you, may be transferred to, stored at and processed by us and our affiliates and other third parties outside the country in which you reside, including, but not limited to the United States, where data protection and privacy regulations may not offer the same level of protection as in other parts of the world. By using our Site, you consent and agree to this transfer, storing or processing. We will take all steps reasonably necessary to ensure that your information is treated securely and in accordance with this Policy. One such step we may take to ensure the security of your Personal Information in the event that a transfer may not be subject to the same protection in the EEA, United Kingdom or Switzerland is to enter into specific contract clauses approved by the European Commission which ensure your Personal Information is given the same protection it has in Europe.
            </Typography>
            <br /><br />

            <Typography variant="h6">Update</Typography>
            <Typography variant="body1">
            HashStrat has the discretion to update this privacy policy at any time. When we do, we will post a notification on the main page of our Site. We encourage Users to frequently check this page for any changes to stay informed about how we are helping to protect the Personal Information we collect. You acknowledge and agree that it is your responsibility to review this privacy policy periodically and become aware of modifications.
            </Typography>
            <br /><br />

            <Typography variant="h6">Your acceptance of these terms</Typography>
            <Typography variant="body1">
            By using this Site, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed your acceptance of those changes.
            </Typography>
            <br /><br />

            <Typography variant="h6">Contacting us</Typography>

            <Typography variant="body1">
            If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at: carlo@hashstrat.com.
            <br />
            For purposes of the GDPR, we have named the below listed individual as our Data Protection Officer:
            <br />
            Name: Carlo Pascoli <br />
            Email address for contact: carlo@hashstrat.com<br />
            </Typography>



        </Box>
    )
}