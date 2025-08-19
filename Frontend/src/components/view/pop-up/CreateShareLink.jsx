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
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { copy } from "@/hooks/utils-hooks/copy";
import CLoader from "@/components/ui/CLoader";
import { toast } from "sonner";

const CreateShareLink = ({ imageId, folderId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      password: "",
      expiryDate: null,
    },
  });

  const [loading, setLoading] = useState(false);

  const [res, setRes] = useState("");

  const dispatch = useDispatch();

  const { createShareLink, setCreateShareLink } = useUpload();

  const { createImageShareLink } = useImageApi();

  const handleCreateShareLink = async (data) => {
    setLoading(true);
    const success = await createImageShareLink(imageId, data);
    if (success) {
      dispatch(setImageError({ folderId, error: "" }));
      setRes(success);
    } else {
      setRes("Failed to create a share link");
    }
    setLoading(false);
  };

  const handleClose = () => {
    setCreateShareLink(false);
    setLoading(false);
    setRes("");
    dispatch(setImageError({ folderId, error: "" }));
    reset();
  };

  return (
    <Dialog
      open={createShareLink}
      onOpenChange={(o) => {
        if (!o) {
          handleClose();
        }
      }}
    >
      <DialogContent className="dark:bg-[#212121] bg-[#F7F5F2]">
        <DialogHeader>
          <DialogTitle>Create a Secure Share Link</DialogTitle>
          <DialogDescription>
            Generate a unique, secure link to share this image.
          </DialogDescription>
        </DialogHeader>
        <div>
          <form
            onSubmit={handleSubmit(handleCreateShareLink)}
            className="flex flex-col gap-4"
          >
            {res ? (
              <div className="flex flex-col gap-3 items-center">
                {res.startsWith("http") ? (
                  <>
                    <div className="text-xs font-medium break-all px-3 py-2 border border-zinc-500/50 rounded-lg shadow-md">
                      <span className="break-all">{res}</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-fit hover:border-green-500 hover:bg-green-500/20"
                      onClick={() =>
                        copy(res)
                          .then(() => toast.success("Link copied successfully"))
                          .catch(() => toast.error("Failed to copy link"))
                      }
                    >
                      Copy Link
                    </Button>
                  </>
                ) : (
                  <div className="text-red-500 text-xs font-medium text-center">
                    {res}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div>
                  <CInput
                    label="Password"
                    id="password"
                    placeholder="Create secure password . . . ."
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: { value: 4, message: "Minimum length is 4" },
                    })}
                  />
                  {errors.password && (
                    <span className="text-red-500 text-xs m-1">
                      {errors.password.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium ml-1">
                    Expiry Date
                  </label>
                  <Controller
                    control={control}
                    name="expiryDate"
                    render={({ field }) => (
                      <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat="yyyy-MM-dd"
                        minDate={new Date()}
                        className="border border-zinc-500/20 rounded-md px-3 py-[9px] shadow bg-zinc-500/2 w-full text-xs outline-0"
                        placeholderText="Select expiry date"
                      />
                    )}
                  />
                </div>
              </>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </DialogClose>
              {!res && (
                <Button disabled={loading}>
                  {loading && <CLoader />} Create
                </Button>
              )}
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateShareLink;
