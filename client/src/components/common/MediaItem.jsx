import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import favoriteUtils from "../../utils/favoriteUtils";
import { routesGen } from "../../routes/routes";
import configs from "../../api/configs/configs";
import UI from "../../configs/UI";
import CircleRate from "./CircleRate";

const MediaItem = ({ media, mediaType }) => {
  const { listFavorites } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [year, setYear] = useState(null);
  const [rating, setRating] = useState(null);
  useEffect(() => {
    setTitle(media.title);

    setPosterPath(configs.posterPath(media.id_media));
    setYear(media.year);

    setRating(media.rating);
  }, [media, mediaType]);

  return (
    <Link to={routesGen.mediaInfo(mediaType, media.id_media)}>
      <Box
        sx={{
          ...UI.style.backgroundImage(posterPath),
          paddingTop: "160%",
          "&:hover .media-info": { opacity: 1, bottom: 0 },
          "&:hover .media-back-drop, &:hover .media-play-btn": { opacity: 1 },
          color: "primary.contrastText",
        }}>
          {/* Фильмы и сериалы */}
        {
          <>
            {favoriteUtils.check({ listFavorites, id_media: media.id_media }) && (
              <FavoriteIcon
                color="primary"
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  fontSize: "2rem"
                }}
              />
            )}
            <Box className="media-back-drop" sx={{
              opacity: { xs: 1, md: 0 },
              transition: "all 0.3s ease",
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              backgroundImage: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))"
            }} />
            {/* Кнопка просмотра */}
            <Button
              className="media-play-btn"
              variant="contained"
              startIcon={<PlayArrowIcon />}
              sx={{
                display: { xs: "none", md: "flex" },
                opacity: 0,
                transition: "all 0.3s ease",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                "& .MuiButton-startIcon": { marginRight: "-4px" }
              }}
            />
            <Box
              className="media-info"
              sx={{
                transition: "all 0.3s ease",
                opacity: { xs: 1, md: 0 },
                position: "absolute",
                bottom: { xs: 0, md: "-20px" },
                width: "100%",
                height: "max-content",
                boxSizing: "border-box",
                padding: { xs: "10px", md: "2rem 1rem" }
              }}
            >
              <Stack spacing={{ xs: 1, md: 2 }} sx={{ color: "white" }}>
                {rating && <CircleRate value={rating} />}
                <Typography>{year}</Typography>

                {/* Можно будет добавить жанры */}

                <Typography
                  variant="body1"
                  fontWeight="700"
                  sx={{
                    fontSize: "1rem",
                    ...UI.style.typoLines(1, "left"),
                     color: "white"
                  }}
                >
                  {title}
                </Typography>
              </Stack>
            </Box>
          </>
        }
        {/* Фильмы и сериалы */}   
      </Box>
    </Link>
  );
};
export default MediaItem;
