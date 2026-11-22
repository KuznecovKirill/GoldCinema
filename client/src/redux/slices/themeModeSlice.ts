// import { createSlice } from "@reduxjs/toolkit";

// export const themeModeSlice = createSlice({
//   name: "ThemeMode",
//   initialState: {
//     themeMode: "dark"
//   },
//   reducers: {
//     setThemeMode: (state, action) => {
//       state.themeMode = action.payload;
//     }
//   }
// });

// export const {
//   setThemeMode
// } = themeModeSlice.actions;

// export default themeModeSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "dark" | "light";

interface ThemeModeState {
  themeMode: ThemeMode;
}

const initialState: ThemeModeState = {
  themeMode: "dark",
};

export const themeModeSlice = createSlice({
  name: "ThemeMode",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
  },
});

export const { setThemeMode } = themeModeSlice.actions;
export default themeModeSlice.reducer;