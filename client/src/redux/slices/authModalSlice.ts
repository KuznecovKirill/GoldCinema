// import { createSlice } from "@reduxjs/toolkit";
// //Для управления модальным окном аунтефикации

// export const authModalSlice = createSlice({
//   name: "AuthModal",
//   initialState: {
//     authModalOpen: false
//   },
//   reducers: {
//     setAuthModalOpen: (state, action) => {
//       state.authModalOpen = action.payload;
//     }
//   }
// });

// export const {
//   setAuthModalOpen
// } = authModalSlice.actions;

// export default authModalSlice.reducer;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthModalState {
  authModalOpen: boolean;
}

const initialState: AuthModalState = {
  authModalOpen: false,
};

export const authModalSlice = createSlice({
  name: "AuthModal",
  initialState,
  reducers: {
    setAuthModalOpen: (state, action: PayloadAction<boolean>) => {
      state.authModalOpen = action.payload;
    },
  },
});

export const { setAuthModalOpen } = authModalSlice.actions;
export default authModalSlice.reducer;