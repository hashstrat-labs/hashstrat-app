import { useState, useEffect } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

import { useEthers, shortenAddress } from "@usedapp/core";
import { styled } from "@material-ui/core/styles"

import { useTheme, Button, Link, Menu, MenuProps, MenuItem, Divider, Typography, makeStyles, Box, Switch } from "@material-ui/core"
import { Menu as MenuIcon, KeyboardArrowDown, KeyboardArrowUp, WbSunny, Brightness3 } from "@material-ui/icons"
import { useLocation, Link as RouterLink } from "react-router-dom"
import { NetworkName } from "../utils/network"
import { Horizontal } from "./Layout"

import logoLight from "./img/logo-light.png"


const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'left',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 8,
		marginTop: theme.spacing(1),
		minWidth: 200,
		// boxShadow: "0 1px 27px 0 rgba(0,0,0,0.19)",
		boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
	},
	'& .MuiMenu-list': {
		padding: '4px 0',
		backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[100] : theme.palette.grey[800],
	},
}));


const useStyles = makeStyles(theme => ({
	container: {
		backgroundColor: theme.palette.type === 'light' ? '#fff' :'#000',

	},

	wrapper: {
		maxWidth: 1200,
		margin: "auto",

		display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        flexFlow: "row wrap",
        alignItems: "center",
        gap: theme.spacing(0),
		padding: 0,
		paddingLeft: 10,
		marginTop: 0,

		[theme.breakpoints.down('xs')]: {
			marginLeft: 0,
		},
	},

	menu: {
		borderRadius: 8,
	},

	menuItems: {
		display: "flex",
		justifyContent: "space-around",
		flexDirection: "row",
		flexFlow: "row wrap",
		alignItems: "center",
		gap: theme.spacing(2),

		[theme.breakpoints.down('xs')]: {
			display: "none"
		},
	},

	darkModeSwitch: {
		display: 'flex',
		alignItems: 'center',
	},

	rightItmesContainer: {
		paddingTop: theme.spacing(2),
		paddingRight: theme.spacing(2),
		paddingBottom: theme.spacing(2),

		display: "flex",
		justifyContent: "flex-end",
		gap: theme.spacing(2),
	},
	
	logoFilter: {
		filter: theme.palette.type === 'light' ?  "invert(0%)" : "invert(100%)"
	}
}))




export interface ConnectedInfo {
	chainId: number | undefined,
	account: string | undefined
}

interface HeaderProps {
	lightTheme: boolean,
	toggleTheme: (isLight: boolean) => void,

	setAccount: React.Dispatch<React.SetStateAction<string | undefined>>,
	setChainId: React.Dispatch<React.SetStateAction<number | undefined>>,

	networkChangedHandler: (chainId: number) => void,
}


export const Header = ({ lightTheme, toggleTheme, setAccount, setChainId, networkChangedHandler }: HeaderProps) => {

	const classes = useStyles()
	const theme = useTheme();
	const lightMode = theme.palette.type === 'light'

	// watch the network name to show the user the real network connected
	const { chainId, account, deactivate } = useEthers()
	console.log("Header useEthers - chainId:", chainId)

	const [networkName, setNetworkName] = useState<string>("")

	const handleModeChange = () => {
		localStorage.setItem("theme", lightTheme ? 'dark' : 'light');
		toggleTheme(!lightTheme);
	};

	
	useEffect(() => {
		console.log("Header useEffect - chainId:", chainId, "account", account)
		setAccount(account)
		if (chainId) {
			const network = NetworkName(chainId) ?? "Unknown"
			setNetworkName(network)
			networkChangedHandler(chainId)
		} 
	
	}, [chainId, account, networkChangedHandler, setAccount])
	

	// manage menu
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const [menuOpen, setMenuOpen] = useState(false)

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		setMenuOpen(true)
	};
	const handleClose = () => {
		setAnchorEl(null);
		setMenuOpen(false)
	};

	const disconnectPressed = () => {
		deactivate()
		console.log("disconnected!")
		window.location.reload()
	}


	const shortAccount = account ? shortenAddress(account) : ''
	const theLocation = useLocation();
	const isHome = theLocation.pathname === '/'
	const isConnected = account !== undefined

	return (

		<header className={classes.container}>

			<Box className={classes.wrapper}>

				<Link component={RouterLink} to="https://hashstrat.com" >
					<Button> <img src={logoLight} style={{ width: 150, height: 33 }} className={classes.logoFilter} alt="logo" /> </Button>
				</Link>
				
				<div className={classes.rightItmesContainer}>

					<div>
						<Button className={classes.menu}
							id="account-button"
							variant="outlined"
							color='primary'
							disableElevation
							onClick={handleClick}
							endIcon={ menuOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown /> }
						>
							
							{ isConnected ? 
							<Horizontal valign='center'>{shortAccount}
								<Jazzicon diameter={20} seed={jsNumberForAddress(account)} />
							</Horizontal> :
							<MenuIcon />}
						</Button>

						<StyledMenu
							id="account-menu"
							anchorEl={anchorEl}
							getContentAnchorEl={null}
							open={open}
							onClose={handleClose}
						>
								
							<nav>
								
								<Link component={RouterLink} to="/invest">
									<MenuItem onClick={handleClose}> Invest </MenuItem>
								</Link>

								<Link component={RouterLink} to="/dao">
									<MenuItem onClick={handleClose}> DAO </MenuItem>
								</Link>

								<Link component={RouterLink} to="/strategies">
									<MenuItem onClick={handleClose}>Strategies</MenuItem>
								</Link>

								<Link href="https://medium.com/@hashstrat" target="_blank">
									<MenuItem onClick={handleClose}>Blog</MenuItem>
								</Link>
								
								<Link href="./whitepaper.pdf" target="_blank">
									<MenuItem onClick={handleClose}>Whitepaper</MenuItem>
								</Link>

								<Divider />

								<MenuItem onClick={handleClose}>
									<span style={{minWidth: 110}}> { lightMode ?  'Dark' : 'Light' } mode </span>

									<Switch
										checked={lightMode === false}
										onChange={handleModeChange}
										name="toggleDark"
										color="default"
									/>
									{ lightMode && <Brightness3 color='primary'/> }
									{ !lightMode && <WbSunny color='primary'/> }
								</MenuItem>
							</nav>


							{isConnected &&
								<div>
									<Divider />
									<MenuItem onClick={handleClose}>
										<Typography variant='body1'> Connected to {networkName.toUpperCase()} </Typography>
									</MenuItem>
									<MenuItem onClick={handleClose} >
										<Button color="primary" variant="contained" onClick={disconnectPressed} fullWidth >Disconnect</Button>
									</MenuItem>
								</div>
							}
						</StyledMenu>
					</div>
					

				</div> 
					
			</Box>
			<Divider />
		</header>
	)
}