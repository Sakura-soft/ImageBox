import React from "react";
import LargeGrideIteam from "@/components/ui/LargeGrideIteam";
import CLoader from "@/components/ui/CLoader";
import useUpload from "@/context/UploadContext";

const LargeGridView = ({
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
        <span className="text-sm font-medium text-zinc-500 italic">
          No Images !
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images?.map((img) => (
        <LargeGrideIteam
          key={img?._id || img.url}
          image={img}
          quickView={quickView}
          setPreviewImage={setPreviewImage}
          showCheckbox={
            selectedImages?.length > 0 &&
            (!selectedFolderId || selectedFolderId === img.folderId)
          }
        />
      ))}
    </div>
  );
};

export default LargeGridView;
