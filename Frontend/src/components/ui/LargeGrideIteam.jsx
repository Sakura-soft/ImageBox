import useUpload from "@/context/UploadContext";
import { useLongPress } from "@/hooks/ui-hooks/useLongPress";
import React from "react";
import { Checkbox } from "./checkbox";

const LargeGrideIteam = ({
  image,
  quickView,
  setPreviewImage,
  showCheckbox,
}) => {
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
      className="relative rounded-xl overflow-hidden shadow-md hover:scale-102 transition cursor-pointer border border-zinc-500/30"
    >
      <div className="w-full h-72 bg-zinc-500/20">
        <img
          src={image?.url}
          alt={image?.name}
          className="w-full h-full  object-contain"
        />
      </div>
      <div className="p-3 text-sm flex flex-col gap-0.5">
        <div className="font-semibold line-clamp-1">{image?.name}</div>
        <div className="text-zinc-500 text-xs">{image?.formatedSize}</div>
      </div>
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

export default LargeGrideIteam;
