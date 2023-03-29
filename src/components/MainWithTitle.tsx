import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ChildrenProps {
    children: React.ReactNode,
}

export const MainWithTitle = ( { children } : ChildrenProps )  =>  { 
    const theLocation = useLocation();
    const currentLocation = theLocation.pathname

    useEffect(() => {
        const page = `${currentLocation.replace('/', '')}`
        const pageCapitalized = page.length > 0 ? `${page.charAt(0).toUpperCase() + page.slice(1)}` : 'Digital Asset Investments'
        document.title = `HashStrat | ${pageCapitalized}`
    }, [currentLocation])
  
    return (
        <main>
            {children}
        </main>
    )
}