import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import {useFormik} from "formik";
import * as Yup from "yup";
import userModule from "../../api/modules/userModule";
import { setUser } from '../../redux/slices/userSlice';
import { setAuthModalOpen } from '../../redux/slices/authModalSlice';
import { toast } from "react-toastify";
import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import {LoadingButton} from "@mui/lab";
const SignIn = ({ switchAuthState }) => {
    const dispatch = useDispatch();
    const [isLoginRequest, setIsLoginRequest] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    const SignIn = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: Yup.object({
            username: Yup.string().min(8, "имя пользователя минимум из 8 символов")
            .required("необходимо имя пользователя"),
            password: Yup.string().min(8, "пароль минимум из 8 символов")
            .required("Необходим пароль")

        }),
        onSubmit: async values => {
            setErrorMessage(undefined);
            setIsLoginRequest(true);
            const {response, err} = await userModule.signIn(values);
            setIsLoginRequest(false);

            if (response) {
                SignIn.resetForm();
                dispatch(setUser(response));
                dispatch(setAuthModalOpen(false));
                toast.success("Вход успешен");
            }
            if (err) setErrorMessage(err.message);
        }
    });
  return (
    <Box component="form" onSubmit={SignIn.handleSubmit}>
        <Stack spacing={3}>
            <TextField 
            type='password'
            placeholder='password'
            name='password'
            fullWidth
            value={SignIn.values.password}
            onChange={SignIn.handleChange}
            color="success"
            error={SignIn.touched.password && SignIn.errors.password !== undefined}
            helperText={SignIn.touched.password && SignIn.errors.password}
            />
        </Stack>
        <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
        >
            Вход
        </LoadingButton>
        <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => switchAuthState()}
      >
        Вход
      </Button>
      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined" >{errorMessage}</Alert>
        </Box>
      )}
    </Box>
  )
}

export default SignIn