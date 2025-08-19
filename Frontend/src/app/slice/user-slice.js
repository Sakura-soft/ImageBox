import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  appLoading: null,
  userLoading: null,
  userError: null,
  nameAvailable: null,
  nameLoading: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserLoading: (state, action) => {
      state.userLoading = action.payload;
    },
    setUserError: (state, action) => {
      state.userError = action.payload;
    },
    setAppLoading: (state, action) => {
      state.appLoading = action.payload;
    },
    setNameAvailable: (state, action) => {
      state.nameAvailable = action.payload;
    },
    setNameLoading: (state, action) => {
      state.nameLoading = action.payload;
    },
  },
});

export const {
  setUser,
  setUserError,
  setUserLoading,
  setAppLoading,
  setNameAvailable,
  setNameLoading,
} = userSlice.actions;

export default userSlice.reducer;
