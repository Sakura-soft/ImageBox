import React from "react";
import CLoader from "@/components/ui/CLoader";
import GalleryItem from "@/components/ui/GalleryItem";
import useUpload from "@/context/UploadContext";

const GalleryView = ({ images = [], loading, quickView, setPreviewImage }) => {
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
    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
      {images?.map((img) => (
        <GalleryItem
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

export default GalleryView;
