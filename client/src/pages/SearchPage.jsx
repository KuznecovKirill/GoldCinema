import React, { useCallback, useEffect, useState } from "react";
import mediaModule from "../api/modules/mediaModule";
import { toast } from "react-toastify";
import UI from "../configs/UI";
import MediaGrid from "../components/common/MediaGrid";
import { Box, Button, Stack, TextField, Toolbar } from "@mui/material";
import { LoadingButton } from "@mui/lab";
const mediaTypes = ["FILM", "TV_SERIES", "MINI_SERIES", "ALL"];
let timer;
const timeOut = 1000;
const SearchPage = () => {
  const [searchM, setSearchM] = useState(false);
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
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
    console.log("Поиск начат");
    console.log(response);
    setSearchM(false);
    if (err) toast.error(err.message);
    if (response) {
      console.log(response);
      if (page > 1) setMedias((med) => [...med, ...response]);
      else setMedias([...response]);
    }
  }, [mediaType, query, page]);
  useEffect(() => {
    if (query.trim().length === 0) {
      setMedias([]);
      setPage(1);
    } else search();
  }, [search, query, mediaType, page]);
  useEffect(() => {
    setMedias([]);
    setPage(1);
  }, [mediaType]);

  const categoryChange = (cat) => setMediaType(cat);
  const queryChange = (q) => {
    const newQuerry = q.target.value;
    clearTimeout(timer);

    timer = setTimeout(() => {
      setQuerry(newQuerry);
    }, timeOut);
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
            {mediaTypes.map((item, index) => (
              <Button
                size="large"
                key={index}
                variant={mediaType === item ? "contained" : "text"}
                sx={{
                  color:
                    mediaType === item
                      ? "primary.contrastText"
                      : "text.primary",
                }}
                onClick={() => categoryChange(item)}
              >
                {item}
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
              загрузить ещё
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default SearchPage;
