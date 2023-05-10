import { useState } from "react";

import { DAppProvider, Goerli, Polygon } from '@usedapp/core';

import { Container } from '@material-ui/core'
import { Main } from './components/Main'
import { getDefaultProvider } from 'ethers'
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline';


const App = () => {

	const [lightTheme, toggleTheme] = useState(
		localStorage.getItem("theme") !== "dark"
	);


	const useDappConfig = {
		defaultNetwork: Polygon.chainId,
		// networks: [Goerli, Polygon],
		readOnlyChainId: Polygon.chainId,
		readOnlyUrls: {
			[Goerli.chainId]: getDefaultProvider('goerli'),
			[Polygon.chainId]: getDefaultProvider('matic'),
		},
		notifications: {
			checkInterval: 100,
			expirationPeriod: 1000,
		},
		// refresh: "everyBlock",
	};
	  

	const appTheme = createTheme({
		palette: {
			type: lightTheme ? "light" : "dark",
			primary: {
				main: lightTheme ? '#0091EA' : '#adebeb', //33cca6
			},
			secondary: {
				main: lightTheme ? '#355E7D' :  '#33cca6', //adebeb
			},

			info: {
				light: lightTheme ? '#4b5f6' : '#222222',
				main: lightTheme ? '#2196f3' : '#2196f3',
				dark: lightTheme ? '#1976d2' : '#1976d2',
			 },
			 background: {
				paper: lightTheme ?  '#fff' : '#424242',
				default: lightTheme ? '#909090' : '#303030',
			 },
			 action: { 
				active: lightTheme ?  '#1c7ec5' : '#E4821B',
			 }
		},	

	});

	appTheme.typography.body1 = {
		fontFamily: "Manrope",
		// fontSize: '1.0rem',
	};

	appTheme.typography.body2 = {
		fontFamily: "Manrope",
		// fontSize: '0.8rem',
	};

	appTheme.typography.h1 = {
		fontFamily: "Manrope",
	};
	
	appTheme.typography.h2 = {
		fontFamily: "Manrope",
	};

	appTheme.typography.h3 = {
		fontFamily: "Manrope",
		fontSize: '2.2rem',
		fontWeight: 600,
        [appTheme.breakpoints.down('sm')]: {
			fontSize: '1.8rem',
        },
	};

	appTheme.typography.h4 = {
		fontFamily: "Manrope",
		fontSize: '1.9rem',
		fontWeight: 600,
        [appTheme.breakpoints.down('sm')]: {
			fontSize: '1.6rem',
        },
	};

	appTheme.typography.h5 = {
		fontFamily: "Manrope",
		fontSize: '1.6em',
		fontWeight: 600,
        [appTheme.breakpoints.down('sm')]: {
			fontSize: '1.4rem',
        },
	};

	appTheme.typography.h6 = {
		fontFamily: "Manrope",
		fontSize: '1.4em',
		fontWeight: 600,
        [appTheme.breakpoints.down('sm')]: {
			fontSize: '1.2rem',
        },
	};

	console.log("theme: ", appTheme)

	return (
		<ThemeProvider theme={{ ...appTheme }}>
			<DAppProvider config={useDappConfig}>
				<CssBaseline />
				<Container maxWidth={false} disableGutters>
					<Main lightTheme={lightTheme} toggleTheme={toggleTheme} />
				</Container>
			</DAppProvider>
		</ThemeProvider>
	)
}

export default App;
