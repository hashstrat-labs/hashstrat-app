import React from 'react';
import { Polygon } from '@usedapp/core';


interface AppContextInterface {
    chainId: number;
    connectedChainId: number | undefined;
    wrongNetwork: (connectedChainId: number) => boolean;
}

export const initialContext : AppContextInterface = {
    connectedChainId: undefined,
    chainId: Polygon.chainId,
    wrongNetwork: ( chainId : number) => chainId !== Polygon.chainId,
}

export const AppContext = React.createContext<AppContextInterface>(initialContext);
