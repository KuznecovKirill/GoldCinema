import { configureStore } from "@reduxjs/toolkit";
import { authModalSlice } from "./slices/authModalSlice";
import { userSlice } from "./slices/userSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    authModal: authModalSlice,
  }
});

export default store;