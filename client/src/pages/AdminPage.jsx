import React, { useState } from "react";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import adminModule from "../api/modules/adminModule";
import Container from "../components/common/Container";

const AdminPage = () => {
  const [command, setCommand] = useState("addMedia");
  const [onRequest, setOnRequest] = useState(false);

  const form = useFormik({
    initialValues: {
      id_media: "",
      collection: "TOP_250_MOVIES",
      mediaType: "MOVIE",
      page: 1,
    },
    onSubmit: async (values) => {
      if (onRequest) return;
      setOnRequest(true);

      const { response, err } = await adminModule.executeCommand({
        command,
        params: values,
      });

      setOnRequest(false);
      if (err) {
        if (err.status === 400) toast.warn(err.message);
        else toast.error(err.message);
      }
      if (response) {
        if (response.status === 400) {
          toast.warn(response.message);
        } else {
          toast.success(
            `Команда "${getCommandLabel(command)}" выполнена успешно`
          );
          form.resetForm();
        }
      }
    },
  });

  const getCommandLabel = (cmd) => {
    const labels = {
      addMedia: "Добавить медиа",
      addMediaList: "Добавить список медиа",
      updatePopular: "Обновить популярные",
    };
    return labels[cmd] || "";
  };

  return (
    <Container title="Панель Администратора">
      <Box component="form" onSubmit={form.handleSubmit}>
        <Stack spacing={3}>
          <FormControl fullWidth>
            <InputLabel>Команда</InputLabel>
            <Select
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              label="Команда"
            >
              <MenuItem value="addMedia">Добавить медиа</MenuItem>
              <MenuItem value="addMediaList">Добавить список медиа</MenuItem>
              <MenuItem value="updatePopular">Обновить популярные</MenuItem>
            </Select>
          </FormControl>

          {command === "addMedia" && (
            <TextField
              name="id_media"
              label="ID медиа"
              value={form.values.id_media}
              onChange={form.handleChange}
              fullWidth
            />
          )}

          {command === "addMediaList" && (
            <>
              <FormControl fullWidth>
                <InputLabel>Тип коллекции</InputLabel>
                <Select
                  name="collection"
                  value={form.values.collection}
                  onChange={form.handleChange}
                  label="Тип коллекции"
                >
                  <MenuItem value="TOP_250_MOVIES">Лучшие фильмы</MenuItem>
                  <MenuItem value="TOP_250_SERIES">Лучшие сериалы</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="number"
                name="page"
                label="Номер страницы"
                value={form.values.page}
                onChange={form.handleChange}
                fullWidth
              />
            </>
          )}

          {command === "updatePopular" && (
            <>
              <FormControl fullWidth>
                <InputLabel>Тип медиа</InputLabel>
                <Select
                  name="mediaType"
                  value={form.values.mediaType}
                  onChange={form.handleChange}
                  label="Тип медиа"
                >
                  <MenuItem value="FILM">Фильмы</MenuItem>
                  <MenuItem value="TV_SERIES">Сериалы</MenuItem>
                </Select>
              </FormControl>
              <TextField
                type="number"
                name="page"
                label="Номер страницы"
                value={form.values.page}
                onChange={form.handleChange}
                fullWidth
              />
            </>
          )}

          <LoadingButton type="submit" variant="contained" loading={onRequest}>
            Выполнить
          </LoadingButton>
        </Stack>
      </Box>
    </Container>
  );
};

export default AdminPage;
