import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { handleDownload } from "@/hooks/utils-hooks/handleDownload";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";
import CLoader from "@/components/ui/CLoader";
import { LuImageOff } from "react-icons/lu";
import Logo from "@/components/logo/Logo";
import CInput from "@/components/ui/CInput";
import { backendUrl } from "@/const/const";

export const ShareImagePreview = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { sToken } = useParams();

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchImage = async (data) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${backendUrl}/get/image/share/${sToken}?password=${data.password}`
      );
      const resImage = res.data.data;
      if (resImage) {
        setImage(resImage);
      }
    } catch (error) {
      console.log(error);

      setError(error.response?.data?.message || "Failed to get image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-[#1a1a1a] p-2
        bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:18px_18px]
        dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]
      "
    >
      {loading ? (
        <CLoader />
      ) : image ? (
        image?.url || image?.src ? (
          <>
            <img
              src={image?.url || image?.src}
              alt={image?.name || "Preview"}
              className="max-w-full max-h-full object-contain shadow-md"
            />
            <Button
              onClick={() => {
                if (image) {
                  handleDownload(image?.url || image?.src, image?.name);
                }
              }}
              size="icon"
              className="fixed top-2 right-2 z-10"
            >
              <FiDownload />
            </Button>
          </>
        ) : (
          <div className="text-zinc-500 text-center flex items-center justify-center flex-col gap-4">
            <LuImageOff size={40} strokeWidth={1} />
            <p className="text-xs italic font-medium">No Image Preview</p>
          </div>
        )
      ) : (
        <div className="max-w-[330px] w-full p-6 flex flex-col overflow-hidden gap-8 items-center justify-center bg-zinc-100 dark:bg-[#292929] border border-zinc-500/30 shadow-md rounded-2xl">
          <div className="flex flex-col gap-1 items-center">
            <Logo size="35px" />
            <span className="text-sm text-center">
              Enter Password of this shared image to view.
            </span>
          </div>
          <form
            onSubmit={handleSubmit(fetchImage)}
            className=" flex flex-col gap-2.5 w-full items-center"
          >
            <div className="w-full">
              <CInput
                label="Password"
                id="Password"
                type="Password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500 text-xs m-1">
                  {errors.password.message}
                </span>
              )}
              {error && (
                <span className="text-red-500 text-xs ml-1">{error}</span>
              )}
            </div>
            <Button disabled={loading} className="mt-2 w-[max-content]">
              {loading && <CLoader />} Get Image
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
