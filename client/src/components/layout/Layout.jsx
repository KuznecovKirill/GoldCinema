//Основная структура
import React from 'react'
import {Box} from "@mui/material";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
const Layout = () => {
  const { user } = useSelector((state) => state.user);
  return (
    <>
      <Box display="flex" minHeight="100vh">
        <Box
          component="main"
          flexGrow={1}
          overflow="hidden"
          minHeight="100vh"
        >
          <Outlet />
        </Box>
      </Box>


    </>
  )
}

export default Layout;