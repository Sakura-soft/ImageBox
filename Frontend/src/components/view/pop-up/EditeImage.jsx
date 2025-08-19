import { setImageError } from "@/app/slice/image-slice";
import { Button } from "@/components/ui/button";
import CInput from "@/components/ui/CInput";
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
import useImageApi from "@/hooks/api-hooks/ImageApi";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

const EditeImage = ({ image, folderId, setPreviewImage }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: image?.name,
    },
  });

  const dispatch = useDispatch();

  const { editeImage, setEditeImage } = useUpload();

  const { updateImage } = useImageApi();

  const handleUpdateImage = async (data) => {
    updateImage(data, image._id, folderId);
    setPreviewImage({
      ...image,
      name: data.name,
    });
    setEditeImage(false);
  };

  return (
    <Dialog
      open={editeImage}
      onOpenChange={(open) => {
        setEditeImage(null);
        if (!open) {
          dispatch(setImageError({ folderId, error: "" }));
          reset();
        }
      }}
    >
      <DialogContent className="dark:bg-[#212121] bg-[#F7F5F2]">
        <DialogHeader>
          <DialogTitle>Rename the Image name</DialogTitle>
          <DialogDescription>
            Enter the new Name of image to change with old name.
          </DialogDescription>
        </DialogHeader>
        <div>
          <form
            onSubmit={handleSubmit(handleUpdateImage)}
            className="flex flex-col gap-4"
          >
            <div>
              <CInput
                label="New name"
                id="name"
                placeholder={image?.name || "Image name here . . . ."}
                type="text"
                {...register("name", {
                  required: "Image's new name is required !",
                  validate: (value) =>
                    value.trim() !== "" || "Image name cannot be empty spaces",
                })}
              />
              {errors.name && (
                <span className="text-red-500 text-xs m-1">
                  {errors.name.message}
                </span>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditeImage(false)}
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button>Update</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditeImage;
