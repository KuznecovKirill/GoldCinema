import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper/modules";

import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { setGlobalLoading } from "../../redux/slices/globalLoadingSlice";
import { routesGen } from "../../routes/routes";
import uiConfigs from "../../configs/UI";
import CircleRate from "./CircleRate";
import configs from "../../api/configs/configs";

import genreModule from "../../api/modules/genreModule";
import mediaModule from "../../api/modules/mediaModule";
const MainSlide = ({ mediaType, mediaCategory }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [medias, setMedias] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const getMedias = async () => {
      const { response, err } = await mediaModule.getMedias({
        mediaType,
        mediaCategory,
        page: 1,
        limit: 10,
      });
      if (response) {
        console.log(response);
        setMedias(response.medias);
      }
      if (err) toast.error(err.message);
      dispatch(setGlobalLoading(false));
    };
    const getGenres = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await genreModule.getList({ mediaType });
      if (response) {
        setGenres(response);
        getMedias();
      }
      if (err) {
        toast.error(err.message);
        setGlobalLoading(false);
      }
    };

    getGenres();
  }, [mediaType, mediaCategory, dispatch]);

  return (
    //Затемнение по вертекали
    <Box
      sx={{
        position: "relative",
        color: "primary.contrastText",
        "&::before": {
          content: '""',
          width: "100%",
          height: "30%",
          position: "absolute",
          bottom: 0,
          left: 0,
          zIndex: 2,
          pointerEvents: "none",
          ...uiConfigs.style.gradientBgImage[theme.palette.mode],
        },
      }}
    >
      <Swiper
        grabCursor={true}
        loop={true}
        // modules={[Autoplay]}
        style={{ width: "100%", height: "max-content" }}
        // autoplay={{
        //   delay: 3000,
        //   disableOnInteraction: false,
        // }}
      >
        {medias.map((med, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                paddingTop: {
                  xs: "120%",
                  sm: "70%",
                  md: "60%",
                  lg: "35%",
                  "@media (min-width: 1200px)": {
                    paddingTop: "40%",
                  },
                },
                overflow: "hidden",
                backgroundPosition: "top",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                // backgroundImage: `url(${configs.backdropPath(med.id_media)})`,
                backgroundImage: `url(${med.cover})`,
              }}
            />
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                ...uiConfigs.style.horizontalGradientBgImage[
                  theme.palette.mode
                ],
              }}
            />
            <Box
              sx={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                paddingX: { sm: "10px", md: "5rem", lg: "10rem" },
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  paddingX: "30px",
                  color: "text.primary",
                  width: { sm: "unset", md: "50%", lg: "60%" },
                  paddingLeft: { sm: "20px", md: "5px", lg: "0px" },
                }}
              >
                <Stack spacing={4} direction="column">
                  {/* Название медиа*/}
                  <Typography
                    variant="h2"
                    fontSize={{ xs: "2rem", md: "2.5rem", lg: "3rem" }}
                    fontWeight="800"
                    sx={{
                      //Само название
                      ...uiConfigs.style.typoLines(2, "left"),
                      maxWidth: "100%",
                      overflowWrap: "break-word",
                    }}
                  >
                    {med.title}
                  </Typography>
                  {/* Название медиа */}

                  <Stack direction="row" spacing={1} alignItems="center">
                    {/* Рейтинг */}
                    <CircleRate value={med.rating} />

                    <Divider orientation="vertical" />
                    {/* Жанры*/}
                    <Stack direction="row" spacing={1}>
                      {med.genres
                        .split(", ")
                        .slice(0, 3)
                        .map((genres, index) => (
                          <Chip
                            variant="filled"
                            color="primary"
                            key={index}
                            label={genres}
                            sx={{
                              fontSize: "1rem",
                              height: "30px", // Фиксированная высота для Chip
                              padding: "5px 12px",
                            }}
                          />
                        ))}
                    </Stack>
                    {/* Жанры */}
                    {/* Возрастной рейтинг */}
                    {med.rars && (
                      <Chip
                        variant="filled"
                        color="error" // Используйте другой цвет, например, "error"
                        label={med.rars}
                        sx={{
                          fontSize: "1rem",
                          height: "30px", // Фиксированная высота для Chip
                          padding: "5px 12px",
                          marginLeft: "10px", // Добавить отступ для разделения от жанров
                        }}
                      />
                    )}
                    {/* Возрастной рейтинг */}
                  </Stack>
                  {/* Описание*/}
                  <Typography
                    variant="body1"
                    sx={{
                      ...uiConfigs.style.typoLines(3),
                    }}
                  >
                    {med.descrition}
                  </Typography>
                  {/* Описание */}
                  {/* Кнопка */}
                  <Button
                    variant="contained"
                    size="large"
                    // startIcon={<PlayArrowIcon />}
                    component={Link}
                    to={routesGen.mediaInfo(mediaType, med.id_media)}
                    sx={{ width: "max-content" }}
                  >
                    Смотреть подробнее
                  </Button>
                  {/* Кнопка */}
                </Stack>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};
export default MainSlide;
