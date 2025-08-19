import {
  setIsTrashFetched,
  setTrashFolder,
  setTrashLoading,
} from "@/app/slice/trash-slice";
import { setUser } from "@/app/slice/user-slice";
import { backendUrl } from "@/const/const";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function useTrashApi() {
  const dispatch = useDispatch();

  const { isTrashFetched, trashFolder } = useSelector((state) => state.trash);

  const { user } = useSelector((state) => state.user);

  const getTrash = async () => {
    if (isTrashFetched) return;
    dispatch(setTrashLoading(true));
    try {
      const res = await axios.get(`${backendUrl}/get/trash`, {
        withCredentials: true,
      });

      const trashData = res?.data?.data;
      if (trashData) {
        dispatch(setTrashFolder(trashData?.trashFolders));
      }
      dispatch(setIsTrashFetched(true));
      return true;
    } catch (error) {
      toast.error("Failed to get trash data");
    } finally {
      dispatch(setTrashLoading(false));
    }
  };

  const folderDelete = async (folderId) => {
    const oldTrashFolder = trashFolder;
    const updatedTrashFolder = trashFolder.filter((tf) => tf._id !== folderId);
    dispatch(setTrashFolder(updatedTrashFolder));
    try {
      const res = await axios.delete(
        `${backendUrl}/folder/deleteFolderpermanently/${folderId}`,
        { withCredentials: true }
      );

      if (res?.data?.data?.updatedUserMetadata) {
        dispatch(
          setUser({
            ...user,
            metadata: res.data.data.updatedUserMetadata,
          })
        );
      }
      return true;
    } catch (error) {
      toast.error("Failed to Delete folder");
      dispatch(setTrashFolder(oldTrashFolder));
    }
  };

  const cleanUpTrashFolder = async () => {
    const oldTrashFolder = trashFolder;
    dispatch(setTrashFolder([]));
    try {
      const res = await axios.delete(
        `${backendUrl}/folder/trash/cleanUpTrashFolder  `,
        { withCredentials: true }
      );
      const updatedStorage = res?.data?.data?.updatedUserMetadata;
      if (res) {
        dispatch(
          setUser({
            ...user,
            metadata: updatedStorage,
          })
        );
      }
      return true;
    } catch (error) {
      dispatch(setTrashFolder(oldTrashFolder));
      toast.error("Faild to clean up trash !");
    }
  };

  return {
    getTrash,
    folderDelete,
    cleanUpTrashFolder,
  };
}
