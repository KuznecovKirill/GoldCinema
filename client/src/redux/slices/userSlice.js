import { createSlice } from "@reduxjs/toolkit";

//Создание среза для User
export const userSlice = createSlice({
  name: "User",
  initialState: { //начальное состояние
    user: null
  },
  reducers: {
    setUser: (state, action) => {
      if (action.payload === null) {
        localStorage.removeItem("token");
      } else if (action.payload.token) localStorage.setItem("token", action.payload.token);

      state.user = action.payload;
      console.log("setUser payload", action.payload);
    },
    setListFavorites: (state, action) => {
      state.listFavorites = action.payload;
    },
  }
});

export const {
  setUser,
} = userSlice.actions;

export default userSlice.reducer;