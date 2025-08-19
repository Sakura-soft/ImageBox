import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUpload from "@/context/UploadContext";
import { useLongPress } from "@/hooks/ui-hooks/useLongPress";
import { Checkbox } from "./checkbox";

const GalleryItem = ({ image, quickView, setPreviewImage, showCheckbox }) => {
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
      className={`relative w-full aspect-square overflow-hidden group cursor-pointer border-y-2 border-x-1 border-zinc-500/15`}
    >
      <Avatar className="w-full h-full object-cover rounded-[0px]">
        <AvatarImage
          src={image?.url}
          className="w-full h-full object-cover group-hover:object-contain"
        />
        <AvatarFallback>{image?.name?.slice(0, 1) || "?"}</AvatarFallback>
      </Avatar>
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

export default GalleryItem;
