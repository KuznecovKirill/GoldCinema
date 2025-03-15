import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";
import favoriteUtils from "../../utils/favoriteUtils";
import { routesGen } from "../../routes/routes";
import configs from "../../api/configs/configs";
import UI from "../../configs/UI";
import CircleRate from "./CircleRate";

const MediaItem = ({ media, mediaType }) => {
  //const { listFavorites } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [rating, setRating] = useState(null);
  useEffect(() => {
    setTitle(media.title);

    setPosterPath(configs.posterPath(media.id_media));

    setRating(media.rating || media.rating);
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

      </Box>
    </Link>
  );
};
export default MediaItem;
