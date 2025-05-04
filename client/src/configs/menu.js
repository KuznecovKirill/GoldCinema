//Импорт иконок
import HomeOutlinedIcon from "@mui/icons-material/Home"; //иконка домика
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import LiveTvOutlined from "@mui/icons-material/LiveTvOutlined";
import FavoriteBorderOutlined from "@mui/icons-material/FavoriteBorderOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import ReviewIcon from "@mui/icons-material/RateReviewOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined"; // иконка сброса
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; //иконка админа
const main = [
  {
    display: "Главная",
    path: "/",
    icon: <HomeOutlinedIcon />,
    state: "home",
  },
  {
    display: "Фильмы",
    path: "/FILM",
    icon: <MovieOutlinedIcon />,
    state: "FILM",
  },
  {
    display: "Сериалы",
    path: "/TV_SERIES",
    icon: <LiveTvOutlined />,
    state: "TV_SERIES",
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
        display: "Избранное",
        path: "/favorites",
        icon: <FavoriteBorderOutlined />,
        state: "favorite"
      },
      {
        display: "Мои отзывы",
        path: "/reviews",
        icon: <ReviewIcon />,
        state: "reviews"
      },
      {
        display: "Изменить пароль",
        path: "/password-update",
        icon: <LockResetOutlinedIcon />,
        state: "password.update"
      },
      {
        display: "Админ",
        path: "/admin",
        icon: <AdminPanelSettingsIcon />,
        state: "admin",
        adminOnly: true // Флаг для фильтрации
    },
]
const menuConfigs = {main, user};
export default menuConfigs;
