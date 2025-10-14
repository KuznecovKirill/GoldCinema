import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import favoriteModule from "../api/modules/favoriteModule";
import { setGlobalLoading } from "../redux/slices/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/slices/authModalSlice";
import { addFavorite, removeFavorite } from "../redux/slices/userSlice";
import UI from "../configs/UI";

import mediaModule from "../api/modules/mediaModule";
import HeaderPoster from "../components/common/HeaderPoster";
import ImageSlide from "../components/common/ImageSlide";
import Container from "../components/common/Container";
import configs from "../api/configs/configs";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import CircleRate from "../components/common/CircleRate";
import SimilarSlide from "../components/common/SimilarSlide";
import MediaReview from "../components/common/MediaReview";

const MediaPage = () => {
  const { mediaType, id_media } = useParams();
  const [isFav, setIsFav] = useState(false);

  const [media, setMedia] = useState(null);
  const [images, setImages] = useState(null);
  const [similars, setSimilars] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);
  const { user, listFavorites } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));

      const { response, err } = await mediaModule.getInfo({ id_media });
      dispatch(setGlobalLoading(false));
      if (response) {
        setMedia(response.media);
        setIsFav(response.isFavorite);
        setGenres([response.media.genres]);
        setImages(response.images);
        setSimilars(response.similars);
        setReviews(response.reviews);
      }
      if (err) toast.error(err.message);
    };
    getMedia();
  }, [mediaType, id_media, dispatch]);
  useEffect(() => {
    if (genres.length > 0) {
      console.log("Обновленный images:", images); // Сработает при изменении media
    }
  }, [genres]);

  // очистка данных после перехода на новый медиа
  useEffect(() => {
  setMedia(null);
  setIsFav(false);
  setGenres([]);
  setImages(null);
  setSimilars(null);
  setReviews(null);
}, [id_media]);

  //Добавление медиа в избранное через клик
  const addFavClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true)); //без авторизации нельзя добавить в избранное

    if (onRequest) return;

    if (isFav) {
      removeFavClick();
      return;
    }

    setOnRequest(true);

    const body = {
      id_media: media.id_media,
      title: media.title,
      mediaType: media.mediaType,
      country: media.country,
      year: media.year,
      //genre: media.genres,
      running_time: media.running_time,
      rars: media.rars,
      rating: media.rating,
      descrition: media.descrition,
      cover: media.cover,
    };

    const { response, err } = await favoriteModule.add(body);

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(addFavorite(response));
      setIsFav(true);
      toast.success("Медиа добавлен в избранное успешно!");
    }
  };

  const removeFavClick = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const favorite = listFavorites.find(
      (e) => e.id_media.toString() === media.id_media.toString()
    );

    const { response, err } = await favoriteModule.remove({
      id_favorite: favorite.id_favorite,
    });

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(removeFavorite(favorite));
      setIsFav(false);
      toast.success("Медиа удалён из избранного!");
    }
  };
  return media ? (
    <>
      <HeaderPoster posterPath={media.cover} />
      <Box
        sx={{
          marginTop: { xs: "-8rem", md: "-14rem", lg: "-25rem" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            gap: { xs: 2, md: 4 },
          }}
        >
          {/* Картинка */}
          <Box
            sx={{
              width: { xs: "60%", sm: "45%", md: "35%" },
              margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" },
              borderRadius: "8px",
              overflow: "hidden", //Обрезание выхода за границы
            }}
          >
            <Box
              sx={{
                paddingTop: "120%",
                //height: 0,
                ...UI.style.backgroundImage(configs.posterPath(media.id_media)),
              }}
            />
          </Box>
          {/* Картинка */}
          {/* Медиа */}
          <Box
            sx={{
              width: { xs: "100%", md: "60%" },
              color: "text.primary",
            }}
          >
            <Stack spacing={4}>
              {/* Название */}
              <Typography
                variant="h4"
                fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                fontWeight="700"
                sx={{ ...UI.style.typoLines(2, "left"), lineHeight: 1.1 }}
              >
                {`${media.title} ${media.year}`}
              </Typography>
              {/* Название */}

              <Stack direction="row" spacing={1} alignItems="center">
                {/* Рейтинг */}
                <CircleRate value={media.rating} />
                {/* Рейтинг */}
                <Divider orientation="vertical" />
                {/* Жанры */}
                {genres[0]?.split(", ").map((genre, index) => (
                  <Chip
                    label={genre}
                    variant="filled"
                    color="primary"
                    key={index}
                  />
                ))}
                {/* Жанры */}
              </Stack>

              {/* Описание */}
              <Typography variant="body1" sx={{ ...UI.style.typoLines(5) }}>
                {media.descrition}
              </Typography>
              {/* Описание */}

              {/* Кнопки */}
              <Stack direction="row" spacing={1}>
                <LoadingButton
                  variant="text"
                  sx={{
                    width: "max-content",
                    "& .MuiButon-starIcon": { marginRight: "0" },
                  }}
                  size="large"
                  startIcon={
                    isFav ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />
                  }
                  loadingPosition="start"
                  loading={onRequest}
                  onClick={addFavClick}
                />
                {/* Кнопки просмотра */}
                <Button
                  variant="contained"
                  sx={{ width: "max-content" }}
                  size="large"
                  startIcon={<PlayArrowIcon />}
                >
                  Смотреть
                </Button>
                {/* Кнопки просмотра */}
              </Stack>
              {/* Кнопки */}
              {/* Похожие проекты */}
              <Container header="Похожие медиа">
                <SimilarSlide similars={similars} />
              </Container>
              {/* Похожие проекты */}
            </Stack>
          </Box>
          {/* Медиа */}
        </Box>
        {/* Картинки медиа */}
        {images?.length > 0 ? (
          <Container
            header="Изображения"
            sx={{
              marginTop: "2rem",
              maxWidth: "1366px",
              paddingX: { xs: "1rem", md: "2rem" },
            }}
          >
            <ImageSlide images={images} />
          </Container>
        ) : null}
        {/* Картинки медиа */}
        <MediaReview reviews={reviews} media={media} />
      </Box>
    </>
  ) : null;
};

export default MediaPage;
