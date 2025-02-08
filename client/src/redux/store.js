import { configureStore } from "@reduxjs/toolkit";
import { authModalSlice } from "./slices/authModalSlice";
import { userSlice } from "./slices/userSlice";
import { themeSlice } from "./slices/themeSlice";
import { globalLoadingSlice } from "./slices/globalLoadingSlice";
import { appStateSlice } from "./slices/appStateSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    authModal: authModalSlice,
    themeSlice: themeSlice,
    globalLoadingSlice: globalLoadingSlice,
    appStateSlice: appStateSlice
  }
});

export default store;