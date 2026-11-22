// import { createSlice } from "@reduxjs/toolkit";
// import privateClient from "../../api/client/privateClient";
// //Создание среза для User
// export const userSlice = createSlice({
//   name: "User",
//   initialState: {
//     //начальное состояние
//     user: null,
//     listFavorites: [],
//   },
//   reducers: {
//     setUser: (state, action) => {
//       const payload = action.payload;
//       console.log(payload)
//       const oldToken = localStorage.getItem("abcde");
//       if (payload === null) {
//         localStorage.removeItem("abcde");
//         state.user = null;
//         return;
//       } else if (payload.authToken){
//         localStorage.setItem("abcde", payload.authToken);
//         state.user = payload.user;
//       } else if (oldToken) {
//         localStorage.setItem("abcde", oldToken);
//         state.user = payload.user;
//       }
//       //state.user = payload;
//     },
//     setListFavorites: (state, action) => {
//       state.listFavorites = action.payload;
//     },
//     addFavorite: (state, action) => {
//       state.listFavorites = [action.payload, ...state.listFavorites];
//     },
//     removeFavorite: (state, action) => {
//       const { id_media } = action.payload;
//       state.listFavorites = [...state.listFavorites].filter(
//         (e) => e.id_media.toString() !== id_media.toString(),
//       );
//     },
//   },
// });

// export const { setUser, setListFavorites, addFavorite, removeFavorite } =
//   userSlice.actions;

// export default userSlice.reducer;

// // Функция для восстановления состояния пользователя
// export const restoreUserState = async () => {
//   console.log("Восстановление");
//   const token = localStorage.getItem("abcde");
//   if (token) {
//     try {
//       const response = await privateClient.get("/user/info");
//       return setUser(response.data);
//     } catch (error) {
//       console.error("Ошибка при восстановлении данных пользователя:", error);
//       return setUser(null);
//     }
//   } else {
//     return setUser(null);
//   }
// };


import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/client/axiosClient";
import { AuthResponse, User, Favorite } from "../../types";

interface UserState {
  user: User | null;
  listFavorites: Favorite[];
}

const initialState: UserState = {
  user: null,
  listFavorites: [],
};

export const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    // payload может быть AuthResponse (при логине), User (при getInfo) или null (при логауте)
    setUser: (state, action: PayloadAction<AuthResponse | User | null>) => {
      const payload = action.payload;
      const oldToken = localStorage.getItem("abcde");

      if (payload === null) {
        localStorage.removeItem("abcde");
        state.user = null;
        return;
      }

      // Если payload является ответом авторизации (есть ли там токен)
      if ("authToken" in payload) {
        localStorage.setItem("abcde", payload.authToken);
        state.user = payload.user;
      } else if (oldToken) {
        // Если это User
        state.user = payload; 
      } else {
        state.user = payload;
      }
    },
    setListFavorites: (state, action: PayloadAction<Favorite[]>) => {
      state.listFavorites = action.payload;
    },
    addFavorite: (state, action: PayloadAction<Favorite>) => {
      state.listFavorites = [action.payload, ...state.listFavorites];
    },
    removeFavorite: (state, action: PayloadAction<{ id_media: number | string }>) => {
      const { id_media } = action.payload;
      state.listFavorites = state.listFavorites.filter(
        (e) => e.id_media.toString() !== id_media.toString()
      );
    },
  },
});

export const { setUser, setListFavorites, addFavorite, removeFavorite } = userSlice.actions;
export default userSlice.reducer;

// Функция для восстановления состояния пользователя (вызывается при перезагрузке)
export const restoreUserState = async () => {
  const token = localStorage.getItem("abcde");
  if (token) {
    try {
      // axiosClient.get возвращает сразу data, поэтому типизируем как User
      const response = await axiosClient.get<User>("/user/info");
      return setUser(response);
    } catch (error) {
      console.error("Ошибка при восстановлении данных пользователя:", error);
      return setUser(null);
    }
  } else {
    return setUser(null);
  }
};
