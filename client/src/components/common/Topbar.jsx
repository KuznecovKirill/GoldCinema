import React, { cloneElement, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { Link } from "react-router-dom";
import { AppBar, Box, Button, IconButton, Stack, Toolbar, useScrollTrigger } from '@mui/material';
import {themeModes} from "../../configs/theme";
import { setThemeMode } from "../../redux/slices/themeModeSlice";
import { setAuthModalOpen } from "../../redux/slices/authModalSlice";
import menuConfigs from '../../configs/menu';
import Logo from './Logo';
import UserMenu from './UserMenu';
import Sidebar from './Sidebar';

const ScrollAppBar = ({children, window}) => {
    const {themeMode} = useSelector((state) => state.themeMode)

    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 50,
        target: window ? window(): undefined

    })
    return cloneElement(children, {
        sx: {
            color: trigger ? "text.primary" : themeModes === themeModes.dark ? "primary.contrastText" : "text.primary", //для смены цвета при переходе на другую тему
            backgroundColor: trigger ? "background.paper" : themeMode === themeMode.dark ? "transparent" : "background.paper" //для смены бекграунда
        }
    });
}
const Topbar = () => {
    const {user} = useSelector((state) => state.user);
    const {appState} = useSelector((state) => state.appState);
    const {themeMode} = useSelector((state) => state.themeMode);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const dispatch = useDispatch();
    const onSwithTheme = () => {
        const theme = themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
        dispatch(setThemeMode(theme));
      };
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ScrollAppBar>
        <AppBar elevation={0} sx={{ zIndex: 9999 }}>
          <Toolbar sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                color="inherit"
                sx={{ mr: 2, display: { md: "none" } }}
                onClick={toggleSidebar}
              >
                <MenuIcon />
              </IconButton>

              <Box sx={{ display: { xs: "inline-block", md: "none" } }}>
                <Logo />
              </Box>
            </Stack>

            {/* Главное меню */}
            <Box flexGrow={1} alignItems="center" display={{ xs: "none", md: "flex" }}>
              <Box sx={{ marginRight: "30px" }}>
                <Logo />
              </Box>
              {menuConfigs.main.map((item, index) => (
                <Button
                  key={index}
                  sx={{
                    color: appState.includes(item.state) ? "primary.contrastText" : "inherit", //цвет для ключевых слов в меню
                    mr: 2
                  }}
                  component={Link}
                  to={item.path}
                  variant={appState.includes(item.state) ? "contained" : "text"}
                >
                  {item.display}
                </Button>
              ))}
              <IconButton
                sx={{ color: "inherit" }}
                onClick={onSwithTheme}
              >
                {themeMode === themeModes.dark && <DarkModeOutlinedIcon />}
                {themeMode === themeModes.light && <WbSunnyOutlinedIcon />}
              </IconButton>
            </Box>
            {/* Главное меню */}

            {/* User */}
            <Stack spacing={2} direction="row" alignItems="center">
              {!user &&  <Button variant="contained"  onClick={()=> dispatch(setAuthModalOpen(true))}> 
                Войти
                </Button>
                }
            </Stack>
            {user && <UserMenu/>}
            
            {/* User */}
          </Toolbar>
        </AppBar>
      </ScrollAppBar>
    </>
  );
}

export default Topbar