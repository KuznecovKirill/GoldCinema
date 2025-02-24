import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UI from "../../configs/UI"
import { setThemeMode } from '../../redux/slices/themeModeSlice';
import { themeModes } from "../../configs/theme";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import Logo from './Logo';
import menuConfigs from '../../configs/menu';
import { Link } from 'react-router-dom';

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
const Sidebar = ({open, toggleSidebar}) => {
  const dispatch = useDispatch();

  const {user} = useSelector((state) => state.user);
  const {appState} = useSelector((state) => state.appState);
  const {themeMode} = useSelector((state) => state.themeMode);

  const sidebarWith = UI.size.sidebarWith;
  
  const onSwitchTheme = () => {
    const theme = themeMode === themeModes.dark ? themeModes.light : themeModes.dark;
    dispatch(setThemeMode(theme));
  };

  const drawer = (
    <>
    <Toolbar sx={{paddingY: "20px", color: "text.primary" }}>
      <Stack width="100%" direction="row" justifyContent="center">
        <Logo/>
      </Stack>
    </Toolbar>
    <List sx={{paddingX: "30px"}}>
      <Typography variant="h5" marginBottom="20px">Меню</Typography>
      {menuConfigs.main.map((item,index) => (
        <ListItemButton
        key={index}
        sx={{
          borderRadius: "10px", 
          marginY: 1, 
          backgroundColor: appState.includes(item.state) ? "primary.main" : "unser"}}
          component={Link}
          to={item.path}
          onClick={() => toggleSidebar(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText disableTypography primary={<Typography textTransform="uppercase">
              {item.display}
            </Typography>}/>
          </ListItemButton>
      ))}

      {user && (
        <>
        <Typography variant="h6" marginBottom="20px">Пользователь</Typography>
        {menuConfigs.user.map((item,index) => (
          <ListItemButton
          key={index}
          sx={{
            borderRadius: "10px",
            margin: 1,
            backgroundColor: appState.includes(item.state) ? "primary.main" : "unset"
          }}
          component={Link}
          to={item.path}
          onClick={() => toggleSidebar(false)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText disableTypography primary={<Typography textTransform="uppercase">
                {item.display}
              </Typography>} />
          </ListItemButton>
        ))}
        </>)}


        <Typography variant="h5" marginBottom="20px">Тема</Typography>
        <ListItemButton onClick={onSwitchTheme}>
          <ListItemIcon>
            {themeMode === themeModes.dark && <DarkModeOutlinedIcon />}
            {themeMode === themeModes.light && <WbSunnyOutlinedIcon />}
          </ListItemIcon>
          <ListItemText disableTypography primary={<Typography textTransform="uppercase">
              {themeMode === themeModes.dark ? "Тьма" : "Свет"}
            </Typography>
          }/>
        </ListItemButton>
    </List>
    </>
  );

  return(
    <Drawer
    open={open}
    onClose={() => toggleSidebar(false)}
    sx={{ "& .MuiDrawer-Paper": {
      boxSizing: "border-box",
      widh: sidebarWith,
      borderRight: "0px"}
    }}
    > {drawer}
    </Drawer>
  );
};

export default Sidebar