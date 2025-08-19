import axios from "axios";
import { backendUrl } from "@/const/const";
import { useSelector, useDispatch } from "react-redux";
import {
  appendImage,
  setImage,
  setImageError,
  setImageLoading,
  setImageUploadError,
  setImageUploading,
  setImageUploadLoading,
} from "@/app/slice/image-slice";
import { toast } from "sonner";
import { setFolder, updateFolder } from "@/app/slice/folder-slice";
import { setUser } from "@/app/slice/user-slice";

export default function useImageApi() {
  const dispatch = useDispatch();

  const { image } = useSelector((state) => state.image);

  const { user } = useSelector((state) => state.user);

  const { folder } = useSelector((state) => state.folder);

  const getImages = async (folderId) => {
    dispatch(setImageLoading({ folderId, loading: true }));
    try {
      const res = await axios.get(`${backendUrl}/get/images/${folderId}`, {
        withCredentials: true,
      });
      const images = res.data.data;
      if (images) {
        dispatch(setImage({ folderId, images }));
      }
      return true;
    } catch (error) {
      toast.error("Failed to get images");
      dispatch(
        setImageError({
          folderId,
          error: error.response?.data?.message || "Failed to get images",
        })
      );
    } finally {
      dispatch(setImageLoading({ folderId, loading: false }));
    }
  };

  const addImages = async (folderId, formData) => {
    dispatch(setImageUploadLoading({ folderId, loading: true }));
    dispatch(setImageUploading(true));
    try {
      const res = await axios.post(
        `${backendUrl}/image/add/${folderId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      const uploadedData = res?.data?.data;
      if (uploadedData) {
        dispatch(
          appendImage({ folderId: folderId, images: uploadedData?.addedImages })
        );
        dispatch(
          updateFolder({
            folderId,
            size: uploadedData?.updatedFolderSize?.size,
            formatedSize: uploadedData?.updatedFolderSize?.formatedSize,
          })
        );
        dispatch(
          setUser({
            ...user,
            metadata: {
              ...user?.metadata,
              storageUsed: uploadedData?.updatedStorage?.storageUsed,
              formatedStorageUsed:
                uploadedData?.updatedStorage?.formatedStorageUsed,
            },
          })
        );
      }
      return true;
    } catch (error) {
      toast.error("Failed to upload images");
      dispatch(
        setImageUploadError(
          error.response?.data?.message || "Failed to upload images"
        )
      );
    } finally {
      dispatch(setImageUploadLoading({ folderId, loading: false }));
      dispatch(setImageUploading(false));
    }
  };

  const updateImage = async (data, imageId, folderId) => {
    const currentImages = image[folderId]?.data || [];
    const oldImages = currentImages;
    const updatedImages = currentImages.map((img) =>
      img._id === imageId ? { ...img, name: data.name } : img
    );
    dispatch(setImage({ folderId, images: updatedImages, fetched: true }));
    try {
      const res = await axios.put(
        `${backendUrl}/image/update/${imageId}`,
        data,
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      dispatch(setImage({ folderId, images: oldImages, fetched: true }));
      toast.error("Failed to update image name !");
      dispatch(
        setImageError(
          error.response?.data?.message || "Failed to update image name !"
        )
      );
    }
  };

  const addFavorite = async (folderId, imageId) => {
    const currentImages = image[folderId]?.data || [];
    const updatedImages = currentImages.map((img) =>
      img._id === imageId ? { ...img, favorite: !img.favorite } : img
    );
    const oldImages = currentImages;
    dispatch(setImage({ folderId, images: updatedImages, fetched: true }));
    try {
      const res = await axios.put(
        `${backendUrl}/image/favorite/${imageId}`,
        {},
        { withCredentials: true }
      );
      return true;
    } catch (error) {
      dispatch(setImage({ folderId, images: oldImages, fetched: true }));
      toast.error("Failed to Set Image as Favorite !");
      dispatch(
        setImageError(
          error.response?.data?.message || "Failed to Set Image as Favorite !"
        )
      );
    }
  };

  const deleteImage = async (Dimage, folderId) => {
    const currentImages = image[folderId]?.data || [];
    const oldImages = currentImages;
    const updatedImages = currentImages.filter((img) => img._id !== Dimage._id);
    dispatch(setImage({ folderId, images: updatedImages, fetched: true }));
    try {
      const res = await axios.put(
        `${backendUrl}/image/delete/${Dimage._id}/${folderId}`,
        {},
        { withCredentials: true }
      );
      const updatedStorage = res?.data?.data;
      dispatch(
        setUser({ ...user, metadata: updatedStorage?.updatedUserMetadata })
      );
      const updatedFolder = folder?.map((f) =>
        f._id === folderId
          ? {
              ...f,
              size: updatedStorage?.updateFolderSize?.size,
              formatedSize: updatedStorage?.updateFolderSize?.formatedSize,
            }
          : f
      );
      dispatch(setFolder(updatedFolder));
      return true;
    } catch (error) {
      dispatch(setImage({ folderId, images: oldImages, fetched: true }));
      toast.error("Failed to delete image permanently!");
      dispatch(
        setImageError(
          error.response?.data?.message || "Failed to delete image permanently!"
        )
      );
      return false;
    }
  };

  const deleteMultipleImages = async (imageIds, folderId) => {
    const currentImages = image[folderId]?.data || [];
    const updatedImages = currentImages.filter(
      (img) => !imageIds.includes(img._id)
    );
    const oldImages = currentImages;
    dispatch(setImage({ folderId, images: updatedImages, fetched: true }));
    try {
      const res = await axios.put(
        `${backendUrl}/image/deleteMultipleImages/${folderId}`,
        { imageIds },
        { withCredentials: true }
      );
      const updatedStorage = res?.data?.data;
      dispatch(
        setUser({ ...user, metadata: updatedStorage?.updatedUserMetadata })
      );
      const updatedFolder = folder?.map((f) =>
        f._id === folderId
          ? {
              ...f,
              size: updatedStorage?.updateFolderSize?.size,
              formatedSize: updatedStorage?.updateFolderSize?.formatedSize,
            }
          : f
      );
      dispatch(setFolder(updatedFolder));
      return true;
    } catch (error) {
      dispatch(setImage({ folderId, images: oldImages, fetched: true }));
      toast.error("Failed to delete selected images!");
      dispatch(
        setImageError(
          error.response?.data?.message || "Failed to delete selected images!"
        )
      );
      return false;
    }
  };

  const createImageShareLink = async (imageId, data) => {
    try {
      const res = await axios.post(
        `${backendUrl}/image/createSharedLink/${imageId}`,
        data,
        { withCredentials: true }
      );
      return res.data.data.url;
    } catch (error) {
      toast.error("Failed to create Share Link");
      return false;
    }
  };

  return {
    getImages,
    addImages,
    updateImage,
    addFavorite,
    deleteImage,
    deleteMultipleImages,
    createImageShareLink,
  };
}
