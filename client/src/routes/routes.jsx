import HomePage from "../pages/HomePage";
import MediaPage from "../pages/MediaPage";
export const routesGen = {
    home: "/",
    mediaList: (type) => `/${type}`,
    mediaInfo: (type, id) => `/${type}/${id}`,
    mediaSearch: "/search",
    passwordUpdate: "passwordUpdate",
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
        path: "/:mediaType/:id_media",
        element: <MediaPage/>,
    },
    { 
      path: "/search",
      //Добавить потом элемент для search
      state: "search"

    },
    {
      path: "/passwordUpdate",
      //
      state: "passwordUpdate"
    },
    {
      path: "/favorites",
      //
      state: "favorites"
    },
    {
      path: "/reviews",
      //
      state: "reviews"
    },
    {
      path: "/:mediaType",
      //
    },
  ];
  export default routes;