import { setFolderError } from "@/app/slice/folder-slice";
import { Button } from "@/components/ui/button";
import CInput from "@/components/ui/CInput";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import useUpload from "@/context/UploadContext";
import { DialogClose } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaRegFolderClosed } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { setImageUploadError } from "@/app/slice/image-slice";
import useImageApi from "@/hooks/api-hooks/ImageApi";
import CLoader from "@/components/ui/CLoader";

const UploadImage = () => {
  const { folder } = useSelector((state) => state.folder);

  const { imageUploadError, imageUploading } = useSelector(
    (state) => state.image
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const dispatch = useDispatch();

  const { uploadImage, setUploadImage } = useUpload();

  const { addImages } = useImageApi();

  const [previewFiles, setPreviewFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPreviewFiles(files);
  };

  const handleRemoveImage = (index) => {
    const updated = previewFiles.filter((_, i) => i !== index);
    setPreviewFiles(updated);
  };

  const handleUploadImages = async (data) => {
    if (previewFiles.length === 0) {
      dispatch(setImageUploadError("Select Images"));
      return;
    }
    const formData = new FormData();
    previewFiles.forEach((file) => {
      formData.append("images", file);
    });
    addImages(data?.folderId, formData);
    setUploadImage(false);
    setPreviewFiles([]);
  };

  return (
    <Dialog
      open={uploadImage}
      onOpenChange={(open) => {
        setUploadImage(open);
        if (!open) {
          dispatch(setFolderError(null));
          dispatch(setImageUploadError(null));
          setPreviewFiles([]);
          reset();
        }
      }}
    >
      <DialogContent className="dark:bg-[#212121] bg-[#F7F5F2]">
        <DialogHeader>
          <DialogTitle>Upload New Images</DialogTitle>
          <DialogDescription>
            Upload images to your collection. Please select the destination
            folder where you want the images to be stored.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleUploadImages)}
          className="flex flex-col gap-6 w-full"
        >
          <div>
            <div className="flex gap-6 items-start">
              <div>
                <CInput
                  accept="image/*"
                  multiple
                  label="Images"
                  id="images"
                  profile={true}
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              {previewFiles.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 items-start">
                  {previewFiles?.map((file, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleRemoveImage(idx)}
                      className="cursor-pointer flex items-center gap-2 max-h-8 text-xs font-medium rounded-full border border-zinc-500/20 px-2 py-1 w-25 shadow group bg-zinc-100 dark:bg-zinc-700"
                    >
                      <div className="line-clamp-1 w-[70%]">{file?.name}</div>
                      <AiOutlineClose size={14} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {imageUploadError && (
              <span className="text-red-500 text-xs m-1">
                {imageUploadError}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="" className="text-xs font-medium ml-1">
              Select Folder
            </label>
            <Controller
              name="folderId"
              defaultValue=""
              control={control}
              rules={{ required: "Please select a folder" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Select Folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Folder</SelectLabel>
                      {folder?.map((f) => (
                        <SelectItem
                          className="text-[12px]"
                          key={f._id}
                          value={f._id}
                        >
                          <FaRegFolderClosed />
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            {errors.folderId && (
              <span className="text-red-500 text-xs m-1">
                {errors.folderId.message}
              </span>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadImage(false)}
              >
                Cancel
              </Button>
            </DialogClose>

            <Button disabled={imageUploading} type="submit">
              {imageUploading && <CLoader />}Upload
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImage;
