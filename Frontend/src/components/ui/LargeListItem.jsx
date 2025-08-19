import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { useLongPress } from "@/hooks/ui-hooks/useLongPress";
import useUpload from "@/context/UploadContext";
import { Checkbox } from "./checkbox";

const LargeListItem = ({ image, quickView, setPreviewImage, showCheckbox }) => {
  const { selectedImages, handleSelect } = useUpload();

  const isSelected = selectedImages?.includes(image._id);

  const events = useLongPress(
    () => {
      if (!showCheckbox) {
        quickView
          ? handleSelect(image._id, image.folderId)
          : setPreviewImage(image);
      }
    },
    () => {
      if (!showCheckbox) {
        quickView
          ? setPreviewImage(image)
          : handleSelect(image._id, image.folderId);
      }
    }
  );

  return (
    <div
      {...(!showCheckbox ? events : {})}
      className="flex items-center justify-between p-4 border-b border-zinc-500/20 cursor-pointer relative smooth hover:bg-stone-500/6 "
    >
      <div className="flex items-center gap-4 w-1/2">
        <Avatar className="w-16 h-16 rounded-md">
          <AvatarImage
            className="object-cover"
            src={image?.url}
            alt={image?.name}
          />
          <AvatarFallback>{image?.name?.slice(0, 1) || "?"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base font-medium line-clamp-1">
            {image?.name}
          </span>
        </div>
      </div>
      <span className="w-24 text-sm shrink-0 text-zinc-500">
        {image?.formatedSize}
      </span>
      {showCheckbox && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 left-2 z-10 cursor-pointer"
        >
          <Checkbox
            className="cursor-pointer"
            checked={isSelected}
            onCheckedChange={() => handleSelect(image._id, image.folderId)}
          />
        </div>
      )}
    </div>
  );
};

export default LargeListItem;
