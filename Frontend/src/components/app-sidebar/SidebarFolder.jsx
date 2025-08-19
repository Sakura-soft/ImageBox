import React, { useEffect } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { FaRegFolderClosed, FaRegFolderOpen } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useFolderApi from "@/hooks/api-hooks/FolderApi";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { IoMdAdd } from "react-icons/io";
import useUpload from "@/context/UploadContext";
import useImageApi from "@/hooks/api-hooks/ImageApi";

const SidebarFolder = () => {
  const location = useLocation();

  const { folder, initialFolderLoading } = useSelector((state) => state.folder);

  const { image } = useSelector((state) => state.image);

  const { getFolder } = useFolderApi();

  const { getImages } = useImageApi();

  const { setCreateFolder } = useUpload();

  useEffect(() => {
    getFolder();
  }, []);

  const handleGetImagesByFolder = (folderId) => {
    const folderState = image[folderId];
    if (!folderState?.fetched) {
      getImages(folderId);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Folders</SidebarGroupLabel>
      <SidebarGroupContent className="">
        <SidebarMenu className="gap-1">
          {initialFolderLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <SidebarMenuItem key={idx} className="ml-2">
                <Skeleton className="h-8 w-full rounded-md bg-zinc-500/15" />
              </SidebarMenuItem>
            ))
          ) : folder?.length > 0 ? (
            folder?.map((f) => (
              <Link
                key={f?._id || f?.name}
                to={`/user/folder/${f?._id}`}
                onClick={() => (
                  handleGetImagesByFolder(f?._id),
                  localStorage.setItem("reFolder", JSON.stringify(f))
                )}
              >
                <SidebarMenuItem className="ml-2">
                  <SidebarMenuButton
                    className={`${
                      location.pathname.includes(f?._id)
                        ? "shadow-md smooth bg-zinc-800 text-white hover:bg-zinc-800 hover:text-white dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-300 dark:hover:text-black"
                        : "text-zinc-800 dark:text-zinc-300"
                    } 
                      cursor-pointer text-[13px]`}
                  >
                    {location.pathname.includes(f?._id) ? (
                      <FaRegFolderOpen />
                    ) : (
                      <FaRegFolderClosed />
                    )}
                    {f?.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            ))
          ) : (
            <Button variant="outline" onClick={() => setCreateFolder(true)}>
              <IoMdAdd />
              Create
            </Button>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarFolder;
