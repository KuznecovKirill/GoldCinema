import React, { useState } from 'react'
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined"
import { useDispatch, useSelector } from 'react-redux';
import menuConfigs from '../../configs/menu';
import {setUser} from "../../redux/slices/userSlice";
import { ListItemButton, ListItemIcon, ListItemText, Menu, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  const { user } = useSelector((state) => state.user);

  const dispatch =  useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

    // Фильтруем меню
    const filteredMenu = menuConfigs.user.filter(item => {
    if (item.adminOnly) {
      return user?.id_role === 2; // Проверяем id_role
    }
    return true;
  });

  const toggleMenu = (e) => setAnchorEl(e.currentTarget);
  return (
    <>
    {user && (
      <>
      <Typography
      variant='h6'
      sx={{cursor: "pointer", userSelect: "none"}}
      onClick={toggleMenu}
      >
        {user.username}
      </Typography>
      <Menu
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      >
        {filteredMenu.map((item, index) => (
          <ListItemButton
          component={Link}
          to={item.path}
          key={index}
          onClick={() => setAnchorEl(null)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText disableTypography primary={
              <Typography textTransform="uppercase">{item.display}</Typography>
            }/>

          </ListItemButton>
        ))}
        <ListItemButton
        sx={{borderRadius: "10px"}}
        onClick={() => dispatch(setUser(null))}
        >
          <ListItemIcon><LogoutOutlinedIcon/></ListItemIcon>
          <ListItemText disableTypography primary={
              <Typography textTransform="uppercase">Выход из системы</Typography>
            }/>

        </ListItemButton>
      </Menu>
      </>
    )}
    </>
  )
}

export default UserMenu