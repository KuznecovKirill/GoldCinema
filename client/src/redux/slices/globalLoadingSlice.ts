// import { createSlice } from "@reduxjs/toolkit";

// export const globalLoadingSlice = createSlice({
//   name: "AuthModal",
//   initialState: {
//     globalLoading: false
//   },
//   reducers: {
//     setGlobalLoading: (state, action) => {
//       state.globalLoading = action.payload;
//     }
//   }
// });

// export const {
//   setGlobalLoading
// } = globalLoadingSlice.actions;

// export default globalLoadingSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalLoadingState {
  globalLoading: boolean;
}

const initialState: GlobalLoadingState = {
  globalLoading: false,
};

export const globalLoadingSlice = createSlice({
  name: "GlobalLoading", // Исправлено с "AuthModal" на правильное имя
  initialState,
  reducers: {
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
  },
});

export const { setGlobalLoading } = globalLoadingSlice.actions;
export default globalLoadingSlice.reducer;