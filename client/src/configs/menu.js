//Импорт иконок
import HomeOutlinedIcon from "@mui/icons-material/Home"; //иконка домика
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import LiveTvOutlined from "@mui/icons-material/LiveTvOutlined";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ReviewIcon from "@mui/icons-material/RateReviewOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined"; // иконка сброса

const main = [
  {
    display: "Главная",
    path: "/",
    icon: <HomeOutlinedIcon />,
    state: "home",
  },
  {
    display: "Фильмы",
    path: "/movies",
    icon: <MovieOutlinedIcon />,
    state: "movie",
  },
  {
    display: "Сериалы",
    path: "/tv",
    icon: <LiveTvOutlined />,
    state: "tv",
  },
  {
    display: "Поиск",
    path: "/search",
    icon: <SearchOutlined />,
    state: "search",
  },
];
const user = [
    {
        display: "favorites",
        path: "/favorites",
        icon: <FavoriteBorderOutlined />,
        state: "favorite"
      },
      {
        display: "reviews",
        path: "/reviews",
        icon: <ReviewIcon />,
        state: "reviews"
      },
      {
        display: "password update",
        path: "/password-update",
        icon: <LockResetOutlinedIcon />,
        state: "password.update"
      }
]
const menuConfigs = {main, user};
export default menuConfigs;
