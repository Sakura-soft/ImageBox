import CLoader from "@/components/ui/CLoader";
import ListItem from "@/components/ui/ListItem";
import useUpload from "@/context/UploadContext";
import React from "react";

const ListView = ({ images = [], loading, quickView, setPreviewImage }) => {
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
    <div className="divide-y divide-zinc-800 -mt-[16px]">
      {images?.map((img) => (
        <ListItem
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

export default ListView;
