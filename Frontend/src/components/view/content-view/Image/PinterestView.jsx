import React from "react";
import CLoader from "@/components/ui/CLoader";
import PinterestItem from "@/components/ui/PinterestItem";
import useUpload from "@/context/UploadContext";

const PinterestView = ({
  images = [],
  loading,
  quickView,
  setPreviewImage,
}) => {
  const { selectedImages, selectedFolderId } = useUpload();

  if (loading) {
    return (
      <div className="w-full h-50 flex items-center justify-center">
        <CLoader />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-50 flex items-center justify-center">
        <span className="text-xs font-medium text-zinc-500 italic">
          No Images !
        </span>
      </div>
    );
  }

  return (
    <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 p-2">
      {images?.map((image) => (
        <PinterestItem
          key={image._id || image.url}
          image={image}
          quickView={quickView}
          setPreviewImage={setPreviewImage}
          showCheckbox={
            selectedImages?.length > 0 &&
            (!selectedFolderId || selectedFolderId === image.folderId)
          }
        />
      ))}
    </div>
  );
};

export default PinterestView;
