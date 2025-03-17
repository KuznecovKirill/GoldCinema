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
import configs from "../api/configs/configs";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import CircleRate from "../components/common/CircleRate";
const MediaPage = () => {
  const { mediaType, id_media } = useParams();
  const [fav, setFav] = useState(false);

  const [media, setMedia] = useState(null);
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
      if (response.media) {
        console.log(response);
        setMedia(response.media);
        setFav(response.isFavorite);
        setGenres([response.media.genre]);
      }
      if (err) toast.error(err.message);
    };
    getMedia();
  }, [mediaType, id_media, dispatch]);
  useEffect(() => {
    if (genres.length > 0) {
      console.log("Обновленный media:", genres); // Сработает при изменении media
    }
  }, [genres]);

  //Добавление медиа в избранное через клик
  const addFavClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (fav) {
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
      genre: media.genres,
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
      setFav(true);
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
      favoriteId: favorite.id_favorite,
    });

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(removeFavorite(favorite));
      setFav(false);
      toast.success("Медиа удалён из избранного!");
    }
  };
  return media ? (
    <>
      <HeaderPoster posterPath={media.cover} />
      <Box
        sx={{
          marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" },
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: { md: "row", xs: "column" } }}
        >
          {/* Картинка */}
          <Box
            sx={{
              width: { xs: "70%", sm: "50%", md: "40%" },
              margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" },
            }}
          >
            <Box
              sx={{
                paddingTop: "140%",
                height: 0,
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
                sx={{ ...UI.style.typoLines(2, "left") }}
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
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  ) : null;
};

export default MediaPage;
