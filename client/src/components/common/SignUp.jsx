import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import userModule from "../../api/modules/userModule";
import { setUser } from "../../redux/slices/userSlice";
import { setAuthModalOpen } from "../../redux/slices/authModalSlice";
import { toast } from "react-toastify";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const SignUp = ({ switchAuthState }) => {
  const dispatch = useDispatch();
  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const SignIn = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(6, "имя пользователя минимум из 6 символов")
        .required("необходимо имя пользователя"),
      password: Yup.string()
        .min(6, "пароль минимум из 6 символов")
        .required("Необходим пароль"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Неправильное подтверждение пароля")
        .min(6, "Пароль минимум из 6 символов")
        .required("Необходимо подтвержить пароль"),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      const { response, err } = await userModule.signUp(values);
      setIsLoginRequest(false);

      if (response) {
        SignIn.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Вход успешен");
      }
      if (err) setErrorMessage(err.message);
    },
  });
  return (
    <Box component="form" onSubmit={SignIn.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="username"
          placeholder="Имя пользователя"
          name="username"
          fullWidth
          value={SignIn.values.username}
          onChange={SignIn.handleChange}
          color="success"
          error={
            SignIn.touched.username && SignIn.errors.username !== undefined
          }
          helperText={SignIn.touched.username && SignIn.errors.username}
        />
        <TextField
          type="password"
          placeholder="Пароль"
          name="password"
          fullWidth
          value={SignIn.values.password}
          onChange={SignIn.handleChange}
          color="success"
          error={
            SignIn.touched.password && SignIn.errors.password !== undefined
          }
          helperText={SignIn.touched.password && SignIn.errors.password}
        />
        <TextField
          type="confirmPassword"
          placeholder="Подтвердите пароль"
          name="confirmPassword"
          fullWidth
          value={SignIn.values.confirmPassword}
          onChange={SignIn.handleChange}
          color="success"
          error={
            SignIn.touched.confirmPassword &&
            SignIn.errors.confirmPassword !== undefined
          }
          helperText={
            SignIn.touched.confirmPassword && SignIn.errors.confirmPassword
          }
        />
        <Select
          name="role"
          fullWidth
          value={SignIn.values.role}
          onChange={SignIn.handleChange}
          error={SignIn.touched.role && SignIn.errors.role !== undefined}
          displayEmpty // Отображает пустое значение
        >
          <MenuItem value="" disabled>
            <em>Выберите роль</em>
          </MenuItem>
          <MenuItem value="Пользователь">Пользователь</MenuItem>
          <MenuItem value="Администратор">Администратор</MenuItem>
        </Select>
        {SignIn.touched.role && SignIn.errors.role && (
          <Box sx={{ color: "error.main" }}>{SignIn.errors.role}</Box>
        )}
      </Stack>
      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        Регистрация
      </LoadingButton>
      <Button fullWidth sx={{ marginTop: 1 }} onClick={() => switchAuthState()}>
        Регистрация
      </Button>
      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined">
            {errorMessage}
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default SignUp;
