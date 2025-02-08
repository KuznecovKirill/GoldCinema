//Основная структура
import React from 'react'
import {Box} from "@mui/material";
import { Outlet } from "react-router-dom";
const Layout = () => {
  return (
    <>
    <Box display="flex" minHeight="90vh">
        <Box component="main" flexGrow={1} overflow="hidden" minHeight="90vh">
            <Outlet />

        </Box>

    </Box>
    </>
  )
}

export default Layout;