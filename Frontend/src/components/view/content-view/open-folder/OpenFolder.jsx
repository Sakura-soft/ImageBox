import { Button } from "@/components/ui/button";
import DropMenu from "@/components/ui/DropMenu";
import Headers from "@/components/ui/Headers";
import useImageApi from "@/hooks/api-hooks/ImageApi";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useUpload from "@/context/UploadContext";
import EditeFolder from "../../pop-up/EditeFolder";
import useFolderApi from "@/hooks/api-hooks/FolderApi";
import CLoader from "@/components/ui/CLoader";
import { RiShareBoxLine, RiFilter2Fill, RiEdit2Fill } from "react-icons/ri";
import {
  TbLayoutSidebarRightFilled,
  TbCalendarWeekFilled,
} from "react-icons/tb";
import {
  MdToday,
  MdCalendarMonth,
  MdOutlineTrendingUp,
  MdOutlineTrendingDown,
  MdOutlineDoneAll,
} from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import { LuTrash2 } from "react-icons/lu";
import { FcAlphabeticalSortingAz } from "react-icons/fc";
import { HiStar, HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { RxViewGrid } from "react-icons/rx";
import { BsGrid3X3 } from "react-icons/bs";
import { FaThList, FaPinterestSquare } from "react-icons/fa";
import { FaList, FaRegFolderOpen, FaRegTrashCan } from "react-icons/fa6";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import { GiClick } from "react-icons/gi";
import { TbHandClick } from "react-icons/tb";
import GalleryView from "../Image/GalleryView";
import PreviewImage from "../Image/PreviewImage";
import { handleMousedownClick } from "@/hooks/utils-hooks/handleMouseDownClick";
import { FiUpload } from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import PinterestView from "../Image/PinterestView";
import GridView from "../Image/GridView";
import LargeGridView from "../Image/LargeGridView";
import ListView from "../Image/ListView";
import LargeListView from "../Image/LargeListView";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const OpenFolder = () => {
  const { folderId } = useParams();

  const {
    editeFolder,
    setEditeFolder,
    setUploadImage,
    previewImage,
    setPreviewImage,
    selectedImages,
    selectedFolderId,
    setSelectedImages,
    setSelectedFolderId,
  } = useUpload();

  const { folder, folderLoading } = useSelector((state) => state.folder);

  const { image, imageLoading, imageUploadLoading } = useSelector(
    (state) => state.image
  );

  const isUploadingToThisFolder = imageUploadLoading?.[folderId] || false;

  const OpenFolder = folder?.find((f) => f?._id === folderId);

  const { getImages, deleteMultipleImages } = useImageApi();

  const { moveToTrashFolder } = useFolderApi();

  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem("layout");
    return saved
      ? JSON.parse(saved)
      : { name: "Gallery view", icon: <TfiLayoutGrid3Alt /> };
  });

  const layoutOptions = [
    {
      name: "Grid",
      icon: <BsGrid3X3 />,
      onClick: () => {
        const newLayout = { name: "Grid", icon: <BsGrid3X3 /> };
        setLayout(newLayout);
        localStorage.setItem(
          "layout",
          JSON.stringify({ name: newLayout.name })
        );
      },
    },
    {
      name: "Large Grid",
      icon: <RxViewGrid />,
      onClick: () => {
        const newLayout = {
          name: "Large Grid",
          icon: <RxViewGrid />,
        };
        setLayout(newLayout);
        localStorage.setItem(
          "layout",
          JSON.stringify({ name: newLayout.name })
        );
      },
    },
    {
      name: "List",
      icon: <FaList />,
      onClick: () => {
        const newLayout = { name: "List", icon: <FaList /> };
        setLayout(newLayout);
        localStorage.setItem(
          "layout",
          JSON.stringify({ name: newLayout.name })
        );
      },
    },
    {
      name: "Large List",
      icon: <FaThList />,
      onClick: () => {
        const newLayout = {
          name: "Large List",
          icon: <FaThList />,
        };
        setLayout(newLayout);
        localStorage.setItem(
          "layout",
          JSON.stringify({ name: newLayout.name })
        );
      },
    },
    {
      name: "Gallery view",
      icon: <TfiLayoutGrid3Alt />,
      onClick: () => {
        const newLayout = {
          name: "Gallery view",
          icon: <TfiLayoutGrid3Alt />,
        };
        setLayout(newLayout);
        localStorage.setItem(
          "layout",
          JSON.stringify({ name: newLayout.name })
        );
      },
    },
    {
      name: "Pinterest view",
      icon: <FaPinterestSquare />,
      onClick: () => {
        const newLayout = {
          name: "Pinterest view",
          icon: <FaPinterestSquare />,
        };
        setLayout(newLayout);
        localStorage.setItem(
          "layout",
          JSON.stringify({ name: newLayout.name })
        );
      },
    },
  ];

  const [short, setShort] = useState("");

  const [filter, setFilter] = useState("");

  const [quickView, setQuickView] = useState(
    localStorage.getItem("quickView") === null
      ? true
      : localStorage.getItem("quickView") === "true"
  );

  useEffect(() => {
    const folderState = image[folderId];
    if (!folderState?.fetched) {
      getImages(folderId);
    }
  }, []);

  const imageInFolder = image[folderId];
  const originalImages = imageInFolder?.data || [];

  let filteredImages = [...originalImages];

  if (filter === "Your Favorite") {
    filteredImages = filteredImages.filter((img) => img.favorite);
  }
  if (filter === "Today Upload") {
    const today = new Date().toDateString();
    filteredImages = filteredImages.filter((img) => {
      const createdDate = new Date(img.createdAt).toDateString();
      return createdDate === today;
    });
  }
  if (filter === "This week") {
    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    filteredImages = filteredImages.filter(
      (img) => new Date(img.createdAt) >= weekAgo
    );
  }
  if (filter === "This Month") {
    const now = new Date();
    filteredImages = filteredImages.filter((img) => {
      const date = new Date(img.createdAt);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });
  }

  if (short === "A - Z") {
    filteredImages.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }
  if (short === "Low - Hight") {
    filteredImages.sort((a, b) => (a.size || 0) - (b.size || 0));
  }
  if (short === "Hight - Low") {
    filteredImages.sort((a, b) => (b.size || 0) - (a.size || 0));
  }
  if (short === "Newest") {
    filteredImages.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
  if (short === "Oldest") {
    filteredImages.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  if (!folder || !folderId || !OpenFolder) {
    return (
      <div className="h-50 w-full flex items-center justify-center">
        <span className="text-xs italic font-medium text-zinc-500">
          Select or Create Folder !
        </span>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex items-center gap-4 justify-between">
          <div className="flex items-center gap-3 ">
            <Headers
              icon={<FaRegFolderOpen size={20} />}
              tital={OpenFolder.name}
            />
            <DropMenu
              open={folderLoading}
              triggerContent={
                <Button variant="ghost" size="sm">
                  <HiDotsVertical />
                </Button>
              }
              lable={
                <div className="flex items-end justify-between gap-8">
                  <span>{OpenFolder?.name}</span>
                  <span className="text-xs text-zinc-500 font-medium">
                    {OpenFolder?.formatedSize}
                  </span>
                </div>
              }
              contentData={[
                {
                  name: "Rename",
                  icon: <RiEdit2Fill />,
                  onClick: () => handleMousedownClick(setEditeFolder),
                },
                {
                  name: "Open In New Tab",
                  icon: <RiShareBoxLine />,
                  separator: true,
                  onClick: () => {
                    window.open(
                      `http://localhost:5173/user/folder/${folderId}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  },
                },
                {
                  name: "Move to Trash",
                  icon: folderLoading ? (
                    <CLoader />
                  ) : (
                    <LuTrash2 className="text-red-500 dark:text-red-400" />
                  ),
                  onClick: () => moveToTrashFolder(OpenFolder),
                },
              ]}
            />
          </div>
          <Button
            onClick={() => setUploadImage(true)}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            <FiUpload /> Image
          </Button>
        </div>
        {isUploadingToThisFolder && (
          <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 mt-4">
            <div className="flex items-center gap-3">
              <CLoader className="w-4 h-4 text-black dark:text-white" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-black dark:text-white">
                  Uploading images to {OpenFolder.name}
                </span>
                <span className="text-xs text-zinc-700 dark:text-zinc-300">
                  Please wait while your images are being processed
                </span>
              </div>
            </div>
          </div>
        )}
        <div className="w-full flex items-start justify-between gap-1 pt-4 pb-2 border-b-2 border-zinc-500/15">
          <div className="flex items-start gap-1 flex-wrap">
            <div className="flex flex-col">
              <DropMenu
                triggerContent={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-80 hover:opacity-100"
                  >
                    <RiFilter2Fill />
                    <span className="text-xs">Filter</span>
                  </Button>
                }
                lable={"Filter"}
                contentData={[
                  {
                    name: "All Images",
                    icon: <MdOutlineDoneAll />,
                    separator: true,
                    onClick: () => setFilter(""),
                  },
                  {
                    lable: "Favorite",
                    name: "Your Favorite",
                    icon: <HiStar />,
                    separator: true,
                    onClick: () => setFilter("Your Favorite"),
                  },
                  {
                    lable: "Upload Time",
                    name: "Today's Upload",
                    icon: <MdToday />,
                    onClick: () => setFilter("Today Upload"),
                  },
                  {
                    name: "This week",
                    icon: <TbCalendarWeekFilled />,
                    onClick: () => setFilter("This week"),
                  },
                  {
                    name: "This Month",
                    icon: <MdCalendarMonth />,
                    onClick: () => setFilter("This Month"),
                  },
                ]}
              />
              {filter && (
                <Button
                  onClick={() => setFilter("")}
                  variant="ghost"
                  size="sm"
                  className="text-xs opacity-80 hover:opacity-100"
                >
                  <IoMdCloseCircleOutline /> Clear
                </Button>
              )}
            </div>
            <div className="flex flex-col">
              <DropMenu
                triggerContent={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-80 hover:opacity-100"
                  >
                    <HiOutlineAdjustmentsHorizontal />
                    <span className="text-xs">Short</span>
                  </Button>
                }
                lable={"Short"}
                contentData={[
                  {
                    name: "Default",
                    separator: true,
                    onClick: () => setShort(""),
                  },
                  {
                    lable: "Alphabetical",
                    name: "A - Z",
                    icon: <FcAlphabeticalSortingAz />,
                    separator: true,
                    onClick: () => setShort("A - Z"),
                  },
                  {
                    lable: "Image Size",
                    name: "Low - Hight",
                    icon: <MdOutlineTrendingUp />,
                    onClick: () => setShort("Low - Hight"),
                  },
                  {
                    name: "Hight - Low",
                    icon: <MdOutlineTrendingDown />,
                    separator: true,
                    onClick: () => setShort("Hight - Low"),
                  },
                  {
                    lable: "Upload Time",
                    name: "New uploaded to old",
                    onClick: () => setShort("Newest"),
                  },
                  {
                    name: "Old uploaded to New",
                    onClick: () => setShort("Oldest"),
                  },
                ]}
              />
              {short && (
                <Button
                  onClick={() => setShort("")}
                  variant="ghost"
                  size="sm"
                  className="text-xs opacity-80 hover:opacity-100"
                >
                  <IoMdCloseCircleOutline /> Clear
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <DropMenu
              triggerContent={
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-80 hover:opacity-100"
                >
                  {layoutOptions.find((opt) => opt.name === layout?.name).icon}
                  <span className="text-xs">Layout</span>
                </Button>
              }
              lable={"Layout / view"}
              contentData={layoutOptions}
            />
            <DropMenu
              triggerContent={
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-80 hover:opacity-100"
                >
                  <TbLayoutSidebarRightFilled />
                  <span className="text-xs">
                    {quickView ? "Quick" : "Hold to"} Image view
                  </span>
                </Button>
              }
              lable={"Image view control"}
              contentData={[
                {
                  name: "Quick view on Click",
                  icon: <GiClick />,
                  onClick: () => {
                    setQuickView(true);
                    localStorage.setItem("quickView", true);
                  },
                },
                {
                  name: "Long press To view",
                  icon: <TbHandClick />,
                  onClick: () => {
                    setQuickView(false);
                    localStorage.setItem("quickView", false);
                  },
                },
              ]}
            />
          </div>
        </div>
        {selectedFolderId === folderId &&
          filteredImages &&
          filteredImages.length > 0 &&
          selectedImages &&
          selectedImages.length > 0 && (
            <div className="flex items-center justify-end gap-4 pt-4 px-4">
              <div className="flex items-center gap-1">
                <Checkbox
                  className="cursor-pointer rounded-[0px]"
                  checked={
                    selectedImages.length === filteredImages.length &&
                    filteredImages.length > 0
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedImages(filteredImages.map((img) => img._id));
                    } else {
                      setSelectedImages([]);
                      setSelectedFolderId(null);
                    }
                  }}
                  id="select-all-checkbox"
                />
                <label
                  htmlFor="select-all-checkbox"
                  className="text-sm text-muted-foreground cursor-pointer select-none"
                >
                  {selectedImages.length === filteredImages.length &&
                  filteredImages.length > 0
                    ? "Unselect All"
                    : "Select All"}
                </label>
              </div>
              <Dialog
                onOpenChange={(open) => {
                  if (!open) {
                    setSelectedFolderId(null);
                    setSelectedImages([]);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <button
                    className="p-1 hover:text-red-500 cursor-pointer"
                    aria-label="Delete selected images"
                  >
                    <FaRegTrashCan />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Delete Selected Images Permanently
                    </DialogTitle>
                    <DialogDescription>
                      Are you sure you want to permanently delete all selected
                      images? This action cannot be undone and the images will
                      be removed forever.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedFolderId(null);
                          setSelectedImages([]);
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setTimeout(() => {
                          setSelectedImages([]);
                          deleteMultipleImages(
                            selectedImages,
                            selectedFolderId
                          );
                          setSelectedFolderId(null);
                        }, 50);
                      }}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        <div className="mt-4">
          {/* loader here  */}
          {layout.name === "Gallery view" && (
            <GalleryView
              images={filteredImages || []}
              loading={imageLoading[folderId] || false}
              quickView={quickView}
              setPreviewImage={setPreviewImage}
            />
          )}

          {layout.name === "Grid" && (
            <GridView
              images={filteredImages || []}
              loading={imageLoading[folderId] || false}
              quickView={quickView}
              setPreviewImage={setPreviewImage}
            />
          )}
          {layout.name === "Large Grid" && (
            <LargeGridView
              images={filteredImages || []}
              loading={imageLoading[folderId] || false}
              quickView={quickView}
              setPreviewImage={setPreviewImage}
            />
          )}
          {layout.name === "List" && (
            <ListView
              images={filteredImages || []}
              loading={imageLoading[folderId] || false}
              quickView={quickView}
              setPreviewImage={setPreviewImage}
            />
          )}
          {layout.name === "Large List" && (
            <LargeListView
              images={filteredImages || []}
              loading={imageLoading[folderId] || false}
              quickView={quickView}
              setPreviewImage={setPreviewImage}
            />
          )}
          {layout.name === "Pinterest view" && (
            <PinterestView
              images={filteredImages || []}
              loading={imageLoading[folderId] || false}
              quickView={quickView}
              setPreviewImage={setPreviewImage}
            />
          )}
        </div>
      </div>
      <EditeFolder
        folderId={folderId}
        folderName={OpenFolder?.name}
        editeFolder={editeFolder}
        setEditeFolder={setEditeFolder}
      />
      <PreviewImage image={previewImage} setPreviewImage={setPreviewImage} />
    </>
  );
};

export default OpenFolder;
