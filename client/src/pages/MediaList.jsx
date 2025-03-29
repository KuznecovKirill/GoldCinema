import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack, Typography } from "@mui/material";

import configs from "../api/configs/configs";
import mediaModule from "../api/modules/mediaModule";
import UI from "../configs/UI";

import MainSlide from '../components/common/MainSlide';
import MediaGrid from "../components/common/MediaGrid";
import { setAppState } from "../redux/slices/appStateSlice";
import { setGlobalLoading } from "../redux/slices/globalLoadingSlice";
import { toast } from "react-toastify";
import usePrevious from "../hooks/usePrevious";

const MediaList = () => {
    const { mediaType } = useParams();
    const [medias, setMedias] = useState([]);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [currCategory, setCurrCategory] = useState(0);
    const [currPage, setCurrPage] = useState(1);
  
    const prevMediaType = usePrevious(mediaType);
    const dispatch = useDispatch();
  
    const mediaCategories = useMemo(() => ["popular", "rated","all"], []);
    const category = ["popular", "rated", "all"];
  
    useEffect(() => {
      dispatch(setAppState(mediaType));
      window.scrollTo(0, 0);
    }, [mediaType, dispatch]);
  
    useEffect(() => {
      const getMedias = async () => {
        if (currPage === 1) dispatch(setGlobalLoading(true));
        setMediaLoading(true);
  
        const { response, err } = await mediaModule.getMedias({
          mediaType,
          mediaCategory: mediaCategories[currCategory],
          page: currPage,
          limit: 15
        });
  
        setMediaLoading(false);
        dispatch(setGlobalLoading(false));
  
        if (err) toast.error(err.message);
        if (response) {
          if (currPage !== 1) setMedias(m => [...m, ...response.medias]);
          else setMedias([...response.medias]);
        }
      };
  
      if (mediaType !== prevMediaType) {
        setCurrCategory(0);
        setCurrPage(1);
      }

      getMedias();
    //   if (mediaType !== prevMediaType || currPage !== 1 || currCategory !== 0) {
    //     getMedias();
    // }
    }, [
      mediaType,
      currCategory,
      prevMediaType,
      currPage,
      mediaCategories,
      dispatch
    ]);
    const onCategoryChange = (categoryIndex) => {
      if (currCategory === categoryIndex) return;
      setMedias([]);
      setCurrPage(1);
      setCurrCategory(categoryIndex);
    };
  
    const onLoadMore = () => setCurrPage(currPage + 1);
  return (
    <>
    <MainSlide mediaType={mediaType} mediaCategory={mediaCategories[currCategory]} />
    <Box sx={{ ...UI.style.mainContent }}>
      <Stack
        spacing={2}
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginBottom: 4 }}
      >
        <Typography fontWeight="700" variant="h5">
          {mediaType === configs.mediaType.FILM ? "Фильмы" : "Сериалы"}
        </Typography>
        <Stack direction="row" spacing={2}>
          {category.map((cate, index) => (
            <Button
              key={index}
              size="large"
              variant={currCategory === index ? "contained" : "text"}
              sx={{
                color: currCategory === index ? "primary.contrastText" : "text.primary"
              }}
              onClick={() => onCategoryChange(index)}
            >
              {cate}
            </Button>
          ))}
        </Stack>
      </Stack>
       {/* Рендерим MediaGrid только если medias не пустой */}
       {medias.length > 0 && (
                    <MediaGrid medias={medias} mediaType={mediaType} />
                )}
      <LoadingButton
        sx={{ marginTop: 8 }}
        fullWidth
        color="primary"
        loading={mediaLoading}
        onClick={onLoadMore}
      >
        загрузить ещё
      </LoadingButton>
    </Box>
  </>
  )
}

export default MediaList