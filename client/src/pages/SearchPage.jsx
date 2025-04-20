import React, { useCallback, useEffect, useState } from "react";
import mediaModule from "../api/modules/mediaModule";
import { toast } from "react-toastify";
import UI from "../configs/UI";
import MediaGrid from "../components/common/MediaGrid";
import { Box, Button, Stack, TextField, Toolbar } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// Опции для разделения английских и русских слов
const mediaTypeOptions = [
  { key: "FILM", label: "Фильм" },
  { key: "TV_SERIES", label: "Сериал" },
  { key: "ALL", label: "Все" }
];

let timer;
const timeOut = 1000;

const SearchPage = () => {
  const [searchM, setSearchM] = useState(false);
  const [mediaType, setMediaType] = useState(mediaTypeOptions[0].key); // Используется ключ
  const [query, setQuerry] = useState("");
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);

  const search = useCallback(async () => {
    setSearchM(true);
    const { response, err } = await mediaModule.search({
      mediaType,
      query,
      page,
    });
    setSearchM(false);
    
    if (err) toast.error(err.message);
    if (response) {
      page > 1 ? setMedias((med) => [...med, ...response]) : setMedias([...response]);
    }
  }, [mediaType, query, page]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setMedias([]);
      setPage(1);
    } else {
      search();
    }
  }, [search, query, mediaType, page]);

  useEffect(() => {
    setMedias([]);
    setPage(1);
  }, [mediaType]);

  const categoryChange = (cat) => setMediaType(cat);
  
  const queryChange = (e) => {
    const newQuery = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => setQuerry(newQuery), timeOut);
  };

  return (
    <>
      <Toolbar />
      <Box sx={{ ...UI.style.mainContent }}>
        <Stack spacing={2}>
          <Stack
            spacing={2}
            direction="row"
            justifyContent="center"
            sx={{ width: "100%" }}
          >
            {mediaTypeOptions.map((item) => (
              <Button
                size="large"
                key={item.key}
                variant={mediaType === item.key ? "contained" : "text"}
                sx={{
                  color: mediaType === item.key 
                    ? "primary.contrastText" 
                    : "text.primary",
                }}
                onClick={() => categoryChange(item.key)}
              >
                {item.label} {/* Отображение типов на русском*/}
              </Button>
            ))}
          </Stack>
          
          <TextField
            color="success"
            placeholder="Search GoldCinema"
            sx={{ width: "100%" }}
            autoFocus
            onChange={queryChange}
          />

          {medias.length > 0 && (
            <MediaGrid medias={medias} mediaType={mediaType} />
          )}

          {medias.length > 0 && (
            <LoadingButton loading={searchM} onClick={() => setPage(page + 1)}>
              Загрузить ещё
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default SearchPage;
