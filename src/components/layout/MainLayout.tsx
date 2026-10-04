import { Box } from "@mui/material"
import Navbar from "./Navbar"
import Footer from "./Footer"
import { Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import CartDrawer from "./drawer/CartDrawer"


const MainLayout = () => {

    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    // handle cart drawer
    const [openCartDrawer, setOpenCartDrawer] = useState(false);
    const toggleDrawer = (open: boolean) => {
        setOpenCartDrawer(open);
    }



    return (

        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }} >
            <Navbar toggleDrawer={toggleDrawer} />

            <Box sx={{ flexGrow: '1', p: '3' }}>

                <Outlet context={{ toggleDrawer }} />

            </Box>
            <Footer />

            <CartDrawer openDrawer={openCartDrawer} toggleDrawer={toggleDrawer} />

        </Box>
    )
}
export default MainLayout