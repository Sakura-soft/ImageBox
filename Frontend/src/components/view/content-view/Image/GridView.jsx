import CLoader from "@/components/ui/CLoader";
import GridItem from "@/components/ui/GridItem";
import useUpload from "@/context/UploadContext";
import React from "react";

const GridView = ({ images = [], loading, quickView, setPreviewImage }) => {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {images?.map((img) => (
        <GridItem
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

export default GridView;
