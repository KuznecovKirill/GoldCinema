import React, { useState } from 'react';
import * as Yup from "yup";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {useFormik} from "formik";
import mediaModule from "../api/modules/mediaModule";
import userModule from "../api/modules/userModule";

import { setUser } from '../redux/slices/userSlice';
import { setAuthModalOpen } from '../redux/slices/authModalSlice';

import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField } from "@mui/material";
import { toast } from 'react-toastify';

import Container from "../components/common/Container";
import UI from "../configs/UI";

const PasswordUpdate = () => {
    const [onRequest, setOnRequest] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Пароль состоит минимум из 6 символов")
        .required("Требуется пароль"),
      newPassword: Yup.string()
        .min(6, "Новый пароль состоит минимум из 6 символов")
        .required("Требуется новый пароль"),
      confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Пароли не совпадают")
        .min(6, "Новый пароль состоит минимум из 6 символов")
        .required("Требуется подтвердить новый пароль")
    }),
    onSubmit: async values => onUpdate(values)
  });

  const onUpdate = async (values) => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, err } = await userModule.updatePassword(values);

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      console.log(response);
      form.resetForm();
      navigate("/");
      dispatch(setUser(null));
      dispatch(setAuthModalOpen(true));
      toast.success("Пароль был успешно изменён! Выполнен выход из системы.");
    }
  };

  return (
    <Box sx={{ ...UI.style.mainContent }}>
      <Container header="Обновление пароля">
        <Box component="form" maxWidth="400px" onSubmit={form.handleSubmit}>
          <Stack spacing={2}>
            <TextField
              type="password"
              placeholder="пароль"
              name="password"
              fullWidth
              value={form.values.password}
              onChange={form.handleChange}
              color="success"
              error={form.touched.password && form.errors.password !== undefined}
              helperText={form.touched.password && form.errors.password}
            />
            <TextField
              type="password"
              placeholder="новый пароль"
              name="newPassword"
              fullWidth
              value={form.values.newPassword}
              onChange={form.handleChange}
              color="success"
              error={form.touched.newPassword && form.errors.newPassword !== undefined}
              helperText={form.touched.newPassword && form.errors.newPassword}
            />
            <TextField
              type="password"
              placeholder="подтверждение пароля"
              name="confirmNewPassword"
              fullWidth
              value={form.values.confirmNewPassword}
              onChange={form.handleChange}
              color="success"
              error={form.touched.confirmNewPassword && form.errors.confirmNewPassword !== undefined}
              helperText={form.touched.confirmNewPassword && form.errors.confirmNewPassword}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              fullWidth
              sx={{ marginTop: 4 }}
              loading={onRequest}
            >
              изменить пароль
            </LoadingButton>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}

export default PasswordUpdate