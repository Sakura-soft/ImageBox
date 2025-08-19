import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "@/const/const";
import CLoader from "@/components/ui/CLoader";
import { LuImageOff } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";
import { handleDownload } from "@/hooks/utils-hooks/handleDownload";

const ImagePreview = () => {
  const { imageId } = useParams();

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/get/image/${imageId}`);
        const resImage = res?.data?.data;
        if (resImage) {
          setImage(resImage);
        }
        console.log(resImage);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchImage();
  }, [imageId]);

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-[#1a1a1a] p-2
        bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:18px_18px]
        dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]
      "
    >
      {loading ? (
        <CLoader />
      ) : image?.url || image?.src ? (
        <img
          src={image?.url || image?.src}
          alt={image?.name || "Preview"}
          className="max-w-full max-h-full object-contain shadow-md"
        />
      ) : (
        <div className="text-zinc-500 text-center flex items-center justify-center flex-col gap-4">
          <LuImageOff size={40} strokeWidth={1} />
          <p className="text-xs italic font-medium">No Image Preview</p>
        </div>
      )}
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
    </div>
  );
};

export default ImagePreview;
