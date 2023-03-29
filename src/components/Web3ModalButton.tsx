import { useEffect, useState } from 'react'
import { useEthers, shortenAddress, useLookupAddress } from '@usedapp/core'
import { Box, Button } from  "@material-ui/core"
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'


export const Web3ModalButton = () => {

  const { account, activate, deactivate } = useEthers()
  const { ens } = useLookupAddress(account)
  const [activateError, setActivateError] = useState('')
  const { error } = useEthers()


  useEffect(() => {
    if (error) {
      setActivateError(error.message)
    }
  }, [error])

  const activateProvider = async () => {
    const providerOptions = {
      injected: {
        display: {
          name: 'Metamask',
          description: 'Connect with the provider in your Browser',
        },
        package: null,
      },
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          bridge: 'https://bridge.walletconnect.org',
          infuraId: 'd8df2cb7844e4a54ab0a782f608749dd',
        },
      },
    }

    const web3Modal = new Web3Modal({
      providerOptions,
    })
    try {
      const provider = await web3Modal.connect()
      await activate(provider)
      setActivateError('')
    } catch (error: any) {
      setActivateError(error.message)
    }
  }

  return (
    <Box>
      <label>{activateError}</label>
      {account ? (
        <>
          <label >{ens ?? shortenAddress(account)}</label>
          <Button onClick={() => deactivate()}>Disconnect</Button>
        </>
      ) : (
        <Button onClick={activateProvider}>Connect</Button>
      )}
    </Box>
  )
}
