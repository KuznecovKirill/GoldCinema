//Основная структура
import React from 'react'
import {Box} from "@mui/material";
import { Outlet } from "react-router-dom";
import GlobalLoading from '../common/GlobalLoading';
import Footer from '../common/Footer';
import Topbar from '../common/Topbar';
import AuthModal from '../common/AuthModal';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import userModule from '../../api/modules/userModule';
import favoriteModule from "../../api/modules/favoriteModule";
import { setListFavorites, setUser } from '../../redux/slices/userSlice';
const Layout = () => {
  //Нужно сделать так, чтобы при перезагрузке пользователь не выходил из системы
  //Состояния пользователя нужно получать через JWT
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.user);

  useEffect(() => {
    const authUser = async () => {
      const { response, err } = await userModule.getInfo();

      if (response) dispatch(setUser(response));
      if (err) dispatch(setUser(null));
    };

    authUser();
  }, [dispatch]);

  // useEffect(() => {
  //   const getFavorites = async () => {
  //     const { response, err } = await favoriteModule.getList();

  //     if (response) dispatch(setListFavorites(response));
  //     if (err) toast.error(err.message);
  //   };

  //   if (user) getFavorites();
  //   if (!user) dispatch(setListFavorites([]));
  // }, [user, dispatch]);


  return (
    <>
    <GlobalLoading />
    <AuthModal/>
      <Box display="flex" minHeight="100vh">
        <Topbar />
        <Box 
          component="main"
          flexGrow={1}
          overflow="hidden"
          minHeight="100vh"
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />

    </>
  )
}

export default Layout;