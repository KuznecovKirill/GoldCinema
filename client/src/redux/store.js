import { configureStore } from "@reduxjs/toolkit";
import  authModalSlice  from "./slices/authModalSlice";
import  userSlice  from "./slices/userSlice";
import  themeModeSlice  from "./slices/themeModeSlice";
import  globalLoadingSlice from "./slices/globalLoadingSlice";
import  appStateSlice from "./slices/appStateSlice";
const store = configureStore({
  reducer: {
    user: userSlice,
    authModal: authModalSlice,
    themeMode: themeModeSlice,
    globalLoadingSlice: globalLoadingSlice,
    appStateSlice: appStateSlice
  }
});

export default store;