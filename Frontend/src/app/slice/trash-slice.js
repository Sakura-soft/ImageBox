import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trashFolder: [],
  trashLoading: null,
  trashError: null,
  isTrashFetched: null,
};

const trashSlice = createSlice({
  name: "trash",
  initialState,
  reducers: {
    setTrashFolder: (state, action) => {
      state.trashFolder = action.payload;
    },
    setTrashLoading: (state, action) => {
      state.trashLoading = action.payload;
    },
    setTrashError: (state, action) => {
      state.trashError = action.payload;
    },
    setIsTrashFetched: (state, action) => {
      state.isTrashFetched = action.payload;
    },
  },
});

export const {
  setTrashFolder,
  setTrashLoading,
  setTrashError,
  setIsTrashFetched,
} = trashSlice.actions;

export default trashSlice.reducer;
