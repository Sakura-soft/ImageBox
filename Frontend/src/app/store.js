import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/user-slice.js";
import folderSlice from "./slice/folder-slice.js";
import imageSlice from "./slice/image-slice.js";
import trashSlice from "./slice/trash-slice.js";

const store = configureStore({
  reducer: {
    user: userSlice,
    folder: folderSlice,
    image: imageSlice,
    trash: trashSlice,
  },
});

export default store;
