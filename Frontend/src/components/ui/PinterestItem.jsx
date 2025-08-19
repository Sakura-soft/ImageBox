import useUpload from "@/context/UploadContext";
import { useLongPress } from "@/hooks/ui-hooks/useLongPress";
import React from "react";
import { Checkbox } from "./checkbox";

const PinterestItem = ({ image, quickView, setPreviewImage, showCheckbox }) => {
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
      className="relative mb-4 cursor-pointer rounded-xl overflow-hidden shadow-md hover:scale-102 smooth"
    >
      <img
        src={image.url}
        alt={image.name || "Image"}
        className="w-full object-cover"
      />
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

export default PinterestItem;
