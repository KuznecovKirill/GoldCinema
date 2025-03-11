import HomePage from "../pages/HomePage";
import MediaPage from "../pages/MediaPage";
export const routesGen = {
    home: "/",
    mediaList: (type) => `/${type}`,
    mediaInfo: (type, id) => `/${type}/${id}`,
  };
  const routes = [
    {
        index: true,
        element: <HomePage/>,
        state: "home"
    },
    {
        path: "/:mediaType/:id_media",
        element: <MediaPage/>
    },
    { 
      path: "/search",
      state: "search"

    }
  ];
  export default routes;