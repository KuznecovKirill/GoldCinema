import { createSlice } from "@reduxjs/toolkit";
import privateClient from "../../api/client/privateClient";
//Создание среза для User
export const userSlice = createSlice({
  name: "User",
  initialState: {
    //начальное состояние
    user: null,
    listFavorites: [],
  },
  reducers: {
    setUser: (state, action) => {
      const payload = action.payload;
      console.log(payload)
      const oldToken = localStorage.getItem("abcde");
      if (payload === null) {
        localStorage.removeItem("abcde");
        state.user = null;
        return;
      } else if (payload.authToken){
        localStorage.setItem("abcde", payload.authToken);
        state.user = payload.user;
      } else if (oldToken) {
        localStorage.setItem("abcde", oldToken);
        state.user = payload.user;
      }
      //state.user = payload;
    },
    setListFavorites: (state, action) => {
      state.listFavorites = action.payload;
    },
    addFavorite: (state, action) => {
      state.listFavorites = [action.payload, ...state.listFavorites];
    },
    removeFavorite: (state, action) => {
      const { id_media } = action.payload;
      state.listFavorites = [...state.listFavorites].filter(
        (e) => e.id_media.toString() !== id_media.toString(),
      );
    },
  },
});

export const { setUser, setListFavorites, addFavorite, removeFavorite } =
  userSlice.actions;

export default userSlice.reducer;

// Функция для восстановления состояния пользователя
export const restoreUserState = async () => {
  console.log("Восстановление");
  const token = localStorage.getItem("abcde");
  if (token) {
    try {
      const response = await privateClient.get("/user/info");
      return setUser(response);
    } catch (error) {
      console.error("Ошибка при восстановлении данных пользователя:", error);
      return setUser(null);
    }
  } else {
    return setUser(null);
  }
};
