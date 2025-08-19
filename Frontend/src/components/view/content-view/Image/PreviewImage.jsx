import { Button } from "@/components/ui/button";
import DropMenu from "@/components/ui/DropMenu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React, { useEffect } from "react";
import { FiDownload, FiLink } from "react-icons/fi";
import { HiDotsHorizontal } from "react-icons/hi";
import { RiEdit2Fill } from "react-icons/ri";
import { FaStar } from "react-icons/fa6";
import { PiStar } from "react-icons/pi";
import { LuTrash2 } from "react-icons/lu";
import { LuImageOff } from "react-icons/lu";
import { RiShareBoxLine } from "react-icons/ri";
import { handleDownload } from "@/hooks/utils-hooks/handleDownload";
import { copy } from "@/hooks/utils-hooks/copy";
import useImageApi from "@/hooks/api-hooks/ImageApi";
import useUpload from "@/context/UploadContext";
import { MdLockOutline } from "react-icons/md";
import { HiShare } from "react-icons/hi";
import EditeImage from "@/components/view/pop-up/EditeImage";
import { handleMousedownClick } from "@/hooks/utils-hooks/handleMouseDownClick";
import CreateShareLink from "@/components/view/pop-up/CreateShareLink";
import { PiCopy } from "react-icons/pi";
import { toast } from "sonner";
import { frontendUrl } from "@/const/const";

const PreviewImage = ({ image, setPreviewImage }) => {
  const { addFavorite, deleteImage } = useImageApi();

  const { setEditeImage, setCreateShareLink } = useUpload();

  useEffect(() => {
    if (image) {
      localStorage.setItem("reImage", JSON.stringify(image));
    }
  }, [image]);

  return (
    <>
      <Sheet open={image} onOpenChange={() => setPreviewImage(false)}>
        <SheetContent className="w-full h-full dark:bg-[#212121] flex flex-col">
          <SheetHeader>
            <SheetTitle className="line-clamp-1 truncate w-[80%]">
              {image?.name}
            </SheetTitle>
            <SheetDescription className="text-xs font-medium text-zinc-500">
              {image?.formatedSize}
            </SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-between gap-2 px-4 pb-2 border-b flex-shrink-0">
            <Button
              variant="ghost"
              className="flex items-center gap-2"
              onClick={() =>
                handleDownload(
                  image?.url || image?.src,
                  image?.name || "ImageBox"
                )
              }
              disabled={!image?.url && !image?.src}
            >
              <FiDownload />
              Download
            </Button>
            <DropMenu
              triggerContent={
                <Button variant="ghost">
                  <HiDotsHorizontal />
                </Button>
              }
              contentData={[
                {
                  name: "Rename",
                  icon: <RiEdit2Fill />,
                  onClick: () => handleMousedownClick(setEditeImage),
                },
                {
                  name: image?.favorite ? "Stared" : "Star",
                  icon: image?.favorite ? <FaStar /> : <PiStar />,
                  onClick: () => {
                    addFavorite(image.folderId, image?._id);
                    setPreviewImage({
                      ...image,
                      favorite: !image?.favorite,
                    });
                  },
                },
                {
                  name: "Link",
                  icon: <FiLink />,
                  endIcon: <PiCopy />,
                  onClick: () => {
                    copy(`${frontendUrl}/image/preview/${image?._id}`).then(
                      () => toast.success("Link copied successfully")
                    );
                  },
                },
                {
                  name: "Open In New Tab",
                  icon: <RiShareBoxLine />,
                  onClick: () => {
                    const link = `${frontendUrl}/image/preview/${image?._id}`;
                    window.open(link, "_blank", "noopener,noreferrer");
                  },
                },
                {
                  name: "Secure Link",
                  icon: <HiShare />,
                  endIcon: <MdLockOutline />,
                  onClick: () => handleMousedownClick(setCreateShareLink),
                  separator: true,
                },
                {
                  name: "Delete permanently",
                  icon: <LuTrash2 className="text-red-500 dark:text-red-400" />,
                  onClick: () => {
                    deleteImage(image, image?.folderId), setPreviewImage(null);
                  },
                },
              ]}
            />
          </div>
          <div
            className="flex-1 flex items-center justify-center bg-zinc-50 dark:bg-[#1a1a1a] min-h-0 -mt-4 p-2
         bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:18px_18px]
        dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]
        "
          >
            <div className="w-full h-full flex items-center justify-center">
              {image?.url || image?.src ? (
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
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <EditeImage
        image={image}
        folderId={image?.folderId}
        setPreviewImage={setPreviewImage}
      />
      <CreateShareLink imageId={image?._id} folderId={image?.folderId} />
    </>
  );
};

export default PreviewImage;
