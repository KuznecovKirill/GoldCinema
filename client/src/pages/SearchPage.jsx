import React, { useEffect, useState, useCallback } from "react";
import mediaModule from "../api/modules/mediaModule";
import { toast } from "react-toastify";
import UI from "../configs/UI";
import MediaGrid from "../components/common/MediaGrid";
import { Box, Button, Stack, TextField, Toolbar } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const mediaTypeOptions = [
  { key: "FILM", label: "Фильм" },
  { key: "TV_SERIES", label: "Сериал" },
  { key: "ALL", label: "Все" }
];

let timer;
const timeOut = 1000;
const skip = 8;

const SearchPage = () => {
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState(mediaTypeOptions[0].key);
  const [query, setQuery] = useState("");
  const [medias, setMedias] = useState([]);
  const [filtredMedias, setFiltredMedias] = useState([]); // медиа, которые будут отображаться
  const [page, setPage] = useState(0);

  const search = useCallback(async () => {
    if (query.trim().length === 0) {
      setMedias([]);
      setFiltredMedias([]);
      setPage(0);
      return;
    }

    setLoading(true);
    const { response, err } = await mediaModule.search({
      mediaType,
      query,
      // Можно не передавать page
    });
    setLoading(false);

    if (err) {
      toast.error(err.message);
      return;
    }

    if (response) {
      setMedias(response);
      setPage(0);
      setFiltredMedias(response.slice(0, skip)); // берутся следующие 8 медиа
    }
  }, [mediaType, query]);

  useEffect(() => {
    search();
  }, [search]);

  useEffect(() => {
    // Сброс результата при смене типа
    setMedias([]);
    setFiltredMedias([]);
    setPage(0);
  }, [mediaType]);

  //Загрузить ещё медиа
  const onLoadMore = () => {
    const nextPage = page + 1;
    const newItems = medias.slice(nextPage * skip, nextPage * skip + skip);
    setFiltredMedias(prev => [...prev, ...newItems]);
    setPage(nextPage);
  };

  const categoryChange = (cat) => setMediaType(cat);

  const queryChange = (e) => {
    const newQuery = e.target.value;
    clearTimeout(timer);
    timer = setTimeout(() => setQuery(newQuery), timeOut);
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
                  color:
                    mediaType === item.key
                      ? "primary.contrastText"
                      : "text.primary",
                }}
                onClick={() => categoryChange(item.key)}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          <TextField
            color="success"
            placeholder="Поиск GoldCinema"
            sx={{ width: "100%" }}
            autoFocus
            onChange={queryChange}
          />

          {filtredMedias.length > 0 && (
            <MediaGrid medias={filtredMedias} mediaType={mediaType} />
          )}

          {filtredMedias.length < medias.length && (
            <LoadingButton loading={loading} onClick={onLoadMore}>
              Загрузить ещё
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default SearchPage;