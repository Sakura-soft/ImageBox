// UploadContext.jsx
import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadImage, setUploadImage] = useState(false);
  const [createFolder, setCreateFolder] = useState(false);
  const [editeImage, setEditeImage] = useState(false);
  const [editeFolder, setEditeFolder] = useState(false);
  const [createShareLink, setCreateShareLink] = useState(false);
  const [previewImage, setPreviewImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const handleSelect = (imageId, folderId) => {
    if (!selectedFolderId) {
      setSelectedFolderId(folderId);
    }
    if (selectedFolderId === folderId || !selectedFolderId) {
      setSelectedImages((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        let newSelection;
        if (safePrev.includes(imageId)) {
          newSelection = safePrev.filter((id) => id !== imageId);
        } else {
          newSelection = [...safePrev, imageId];
        }
        if (newSelection.length === 0) {
          setSelectedFolderId(null);
        }
        return newSelection;
      });
      return;
    }

    toast.error(
      "You can only select multiple images from the same folder. Clear selection to switch folders."
    );
  };

  const value = {
    uploadImage,
    setUploadImage,
    createFolder,
    setCreateFolder,
    editeImage,
    setEditeImage,
    editeFolder,
    setEditeFolder,
    createShareLink,
    setCreateShareLink,
    previewImage,
    setPreviewImage,
    selectedImages,
    handleSelect,
    setSelectedImages,
    selectedFolderId,
    setSelectedFolderId,
  };

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

export default function useUpload() {
  return useContext(UploadContext);
}
