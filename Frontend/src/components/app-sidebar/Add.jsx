import React from "react";
import { Button } from "../ui/button";
import { IoMdAdd } from "react-icons/io";
import { RiImageAddFill } from "react-icons/ri";
import { VscNewFolder } from "react-icons/vsc";
import useUpload from "@/context/UploadContext";
import DropMenu from "../ui/DropMenu";
import { handleMousedownClick } from "@/hooks/utils-hooks/handleMouseDownClick.js";

const Add = () => {
  const { setUploadImage, setCreateFolder } = useUpload();

  const data = [
    {
      name: "Images",
      icon: <RiImageAddFill />,
      onClick: () => handleMousedownClick(setUploadImage),
    },
    {
      name: "Folder",
      icon: <VscNewFolder strokeWidth={0.3} />,
      onClick: () => handleMousedownClick(setCreateFolder),
    },
  ];

  return (
    <DropMenu
      triggerContent={
        <div className="w-full px-3.5">
          <Button variant="outline" size="icon">
            <IoMdAdd />
          </Button>
        </div>
      }
      contentData={data}
    />
  );
};

export default Add;
