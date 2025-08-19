import Logo from "@/components/logo/Logo";
import React, { useState } from "react";
import MenuCard from "./MenuCard";
import { FiUpload } from "react-icons/fi";
import { FiFolderPlus } from "react-icons/fi";
import { MdWorkspacePremium } from "react-icons/md";
import { FiInbox } from "react-icons/fi";
import { handleMousedownClick } from "@/hooks/utils-hooks/handleMouseDownClick";
import useUpload from "@/context/UploadContext";
import { TbFolderFilled } from "react-icons/tb";
import { FaImage } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ContentHome = () => {
  const navigate = useNavigate();

  const { setUploadImage, setCreateFolder, setPreviewImage } = useUpload();

  const { folder } = useSelector((state) => state.folder);

  const [recentlyView, setRecentlyView] = useState({
    folder: localStorage.getItem("reFolder")
      ? JSON.parse(localStorage.getItem("reFolder"))
      : null,
    image: localStorage.getItem("reImage")
      ? JSON.parse(localStorage.getItem("reImage"))
      : null,
  });

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Logo text="welcome to" size="25px" className="ml-1" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[
              {
                name: "Upload Image",
                icon: <FiUpload />,
                bg: "dark:bg-zinc-200 bg-zinc-800",
                onClick: () => handleMousedownClick(setUploadImage),
              },
              {
                name: "Create Folder",
                icon: <FiFolderPlus />,
                bg: "dark:bg-zinc-200 bg-zinc-800",
                onClick: () => handleMousedownClick(setCreateFolder),
              },
              {
                name: "Storage Usage",
                icon: <FiInbox />,
                onClick: () => {
                  navigate("/user/storage");
                },
              },
              {
                name: "Upgrade",
                icon: <MdWorkspacePremium />,
                onClick: () => {
                  navigate("/user/upgrade-plan");
                },
              },
            ].map((mi) => (
              <MenuCard
                key={mi?.name}
                name={mi?.name}
                icon={mi?.icon}
                bg={mi?.bg}
                onClick={mi?.onClick}
              />
            ))}
          </div>
        </div>
        {(recentlyView?.image || recentlyView?.folder) && (
          <div className="flex flex-col gap-4">
            <span className="text-sm font-medium pb-2 border-b ml-1">
              Recently Viewed
            </span>
            <div className="flex items-center gap-4">
              {recentlyView?.folder &&
                typeof recentlyView.folder === "object" && (
                  <Link
                    to={`/user/folder/${recentlyView?.folder?._id}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="md:w-45 md:h-45 h-35 w-35 rounded-lg bg-stone-100 dark:bg-[#212121] flex justify-center items-center">
                      <TbFolderFilled className="md:text-[150px] text-[120px]" />
                    </div>
                    <div className="flex items-center gap-3">
                      <TbFolderFilled size={25} />
                      <div className="text-[13px] flex flex-col truncate md:max-w-35 max-w-25">
                        <span>{recentlyView.folder.name}</span>
                        <span className="text-xs text-zinc-500 truncate md:max-w-35 max-w-25 ">
                          {recentlyView.folder.formatedSize || "0.00 MB"}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              {recentlyView?.image &&
                typeof recentlyView.image === "object" && (
                  <Link
                    onClick={() => setPreviewImage(recentlyView?.image)}
                    to={`/user/folder/${recentlyView?.image?.folderId}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="md:w-45 md:h-45 h-35 w-35 rounded-lg bg-stone-100 dark:bg-[#212121] flex justify-center items-center overflow-hidden">
                      <img
                        className="object-contain h-full w-full"
                        src={recentlyView.image.url}
                        alt={recentlyView.image.name}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <FaImage size={20} />
                      <div className="text-[13px] flex flex-col">
                        <span
                          className="truncate md:max-w-35 max-w-25 "
                          title={recentlyView.image.name}
                        >
                          {recentlyView.image.name}
                        </span>
                        <span className="text-xs text-zinc-500 truncate md:max-w-35 max-w-25">
                          {recentlyView.image.formatedSize || "0.00 MB"}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-sm font-medium pb-2 border-b ml-1">
            All Folders
          </span>
          <div className="divide-y divide-zinc-800 ">
            {folder?.length > 0 ? (
              folder?.map((f) => (
                <Link
                  key={f?._id}
                  to={`/user/folder/${f?._id}`}
                  className="flex items-center justify-between p-3 border-b border-zinc-500/20 cursor-pointer smooth hover:bg-stone-500/6"
                >
                  <div className="flex items-center gap-3">
                    <TbFolderFilled size={25} />
                    <span className="text-sm font-medium line-clamp-1">
                      {f?.name}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">
                    {f?.formatedSize || "0.00 MB"}
                  </span>
                </Link>
              ))
            ) : (
              <div
                onClick={() => handleMousedownClick(setCreateFolder)}
                className="flex items-center justify-between p-3 border-b border-zinc-500/20 cursor-pointer smooth hover:bg-stone-500/6"
              >
                <div className="flex items-center gap-3">
                  <FiFolderPlus size={22} />
                  <span className="text-sm font-medium line-clamp-1">
                    Create New Folder
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentHome;
