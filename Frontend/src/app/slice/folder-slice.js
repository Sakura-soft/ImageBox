import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  folder: [],
  initialFolderLoading: null,
  folderError: null,
  folderLoading: null,
  folderFetched: null,
};

const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    setFolder: (state, action) => {
      state.folder = action.payload;
    },
    setInitialFolderLoading: (state, action) => {
      state.initialFolderLoading = action.payload;
    },
    setFolderError: (state, action) => {
      state.folderError = action.payload;
    },
    setFolderLoading: (state, action) => {
      state.folderLoading = action.payload;
    },
    setFolderFetched: (state, action) => {
      state.folderFetched = action.payload;
    },
    updateFolder: (state, action) => {
      const { folderId, size, formatedSize } = action.payload;
      state.folder = state.folder?.map((f) =>
        f._id === folderId ? { ...f, size, formatedSize } : f
      );
    },
  },
});

export const {
  setFolder,
  setFolderError,
  setInitialFolderLoading,
  setFolderLoading,
  setFolderFetched,
  updateFolder,
} = folderSlice.actions;

export default folderSlice.reducer;
