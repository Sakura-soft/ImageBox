import { setFolderError } from "@/app/slice/folder-slice";
import { Button } from "@/components/ui/button";
import CInput from "@/components/ui/CInput";
import CLoader from "@/components/ui/CLoader";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useUpload from "@/context/UploadContext";
import useFolderApi from "@/hooks/api-hooks/FolderApi";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const EditeFolder = ({ folderId, folderName, editeFolder, setEditeFolder }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  const {} = useUpload();

  const { folderLoading, folderError } = useSelector((state) => state.folder);

  const { updateFolder } = useFolderApi();

  const handleCreateFolder = async (data) => {
    const success = await updateFolder(data, folderId);
    if (success) {
      dispatch(setFolderError(null));
      setEditeFolder(false);
      reset();
    }
  };

  return (
    <Dialog
      open={editeFolder}
      onOpenChange={(open) => {
        setEditeFolder(open);
        if (!open) {
          dispatch(setFolderError(null));
          reset();
        }
      }}
    >
      <DialogContent className="dark:bg-[#212121] bg-[#F7F5F2]">
        <DialogHeader>
          <DialogTitle>Update Folder - {folderName}</DialogTitle>
          <DialogDescription>
            Enter new Folder name to Uplade Folder.
          </DialogDescription>
        </DialogHeader>
        <div>
          <form
            onSubmit={handleSubmit(handleCreateFolder)}
            className="flex flex-col gap-4"
          >
            <div>
              <CInput
                label="Folder"
                id="folder"
                placeholder="New name here . . . ."
                type="text"
                {...register("name", {
                  required: "New Folder name is required !",
                  maxLength: {
                    value: 30,
                    message: "New Folder name must be at most 30 characters",
                  },
                  validate: (value) =>
                    value.trim() !== "" ||
                    "New Folder name cannot be empty spaces",
                })}
              />
              {errors.name && (
                <span className="text-red-500 text-xs m-1">
                  {errors.name.message}
                </span>
              )}
              {folderError && (
                <span className="text-red-500 text-xs m-1">{folderError}</span>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditeFolder(false)}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() => setEditeFolder(false)}
                disabled={folderLoading}
              >
                {folderLoading && <CLoader />}Update
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditeFolder;
