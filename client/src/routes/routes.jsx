import AdminPage from "../pages/AdminPage";
import FavoritesPage from "../pages/FavoritesPage";
import HomePage from "../pages/HomePage";
import MediaList from "../pages/MediaList";
import MediaPage from "../pages/MediaPage";
import PasswordUpdate from "../pages/PasswordUpdate";
import ReviewList from "../pages/ReviewList";
import SearchPage from "../pages/SearchPage";
export const routesGen = {
    home: "/",
    mediaList: (type) => `/${type}`,
    mediaInfo: (type, id) => `/${type}/${id}`,
    mediaSearch: "/search",
    passwordUpdate: "password-update",
    favoriteList: "/favorites",
    reviewList: "/reviews",
  };
  const routes = [
    {
        index: true,
        element: <HomePage/>,
        state: "home"
    },
   
    { 
      path: "/search",
      element: <SearchPage/>,
      state: "search"

    },
    {
      path: "/favorites",
      element: <FavoritesPage/>,
      state: "favorites"
    },
    {
      path: "/reviews",
      element: <ReviewList/>,
      state: "reviews"
    },
    {
      path: "/password-update",
      element: <PasswordUpdate/>,
      state: "password-update"
    },
    {
      path: "/admin",
      element: <AdminPage/>,
      state: "admin"
    },

    {
      path: "/:mediaType",
      element: <MediaList/>,
      
      //
    },
    {
      path: "/:mediaType/:id_media",
      element: <MediaPage/>,
  },
  ];
  export default routes;