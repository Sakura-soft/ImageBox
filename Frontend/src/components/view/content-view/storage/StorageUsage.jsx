import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FiInbox } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { TiCloudStorage } from "react-icons/ti";
import { IoBagAdd } from "react-icons/io5";
import { MdRestoreFromTrash } from "react-icons/md";
import { TbFolderFilled } from "react-icons/tb";
import { HiDotsVertical } from "react-icons/hi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import useTrashApi from "@/hooks/api-hooks/TrashApi";
import DropMenu from "@/components/ui/DropMenu";
import { LuRefreshCw } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import useFolderApi from "@/hooks/api-hooks/FolderApi";
import useImageApi from "@/hooks/api-hooks/ImageApi";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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

const StorageUsage = () => {
  const { user } = useSelector((state) => state.user);

  const { trashFolder, trashLoading } = useSelector((state) => state.trash);

  const { getTrash, folderDelete, cleanUpTrashFolder } = useTrashApi();

  const { moveToTrashFolder } = useFolderApi();

  const {
    storageUsed,
    storageLimit,
    trashStorage,
    formatedStorageUsed,
    formatedStorageLimit,
    formatedTrashStorage,
  } = user?.metadata;

  const usedPercentage = Math.min((storageUsed / storageLimit) * 100, 100);
  const trashPercentage = Math.min((trashStorage / storageLimit) * 100, 100);

  useEffect(() => {
    getTrash();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-medium ml-1 mt-2">Storage</h1>
        <div className="w-full flex flex-col gap-2">
          <div className="items-center text-zinc-500 inline">
            <FiInbox size={20} className="inline mr-2" strokeWidth={1.5} />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {formatedStorageUsed}
            </span>
            <span className="text-sm"> / {formatedStorageLimit} used</span>
            <span className="mx-2 text-zinc-400">|</span>
            <span className="text-sm">
              Trash:{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {formatedTrashStorage}
              </span>
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-zinc-500/20 overflow-hidden flex cursor-pointer smooth">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="h-full bg-zinc-800 dark:bg-zinc-200 smooth"
                  style={{
                    width: `${usedPercentage - trashPercentage}%`,
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-3 text-sm p-1 font-medium">
                  <TiCloudStorage size={20} />
                  <p className="flex gap-2 items-end">
                    Total used : {formatedStorageUsed}
                    <span className="text-xs text-zinc-500 ">
                      ( with Trash )
                    </span>
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="h-full bg-zinc-500 transition-all"
                  style={{ width: `${trashPercentage}%` }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-3 text-sm p-1 font-medium">
                  <MdRestoreFromTrash size={20} />
                  Trash Storage : {formatedTrashStorage}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={"/user/upgrade-plan"}>
            <Button variant="outline">
              <IoBagAdd /> Get More Storage
            </Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">Clean up Trash</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Clean up Trash</DialogTitle>
                <DialogDescription>
                  You’re about to{" "}
                  <span className="text-red-500 font-semibold">
                    permanently delete
                  </span>{" "}
                  all items in your trash. This will free up storage space, but
                  <span className="text-red-500 font-semibold">
                    {" "}
                    this action can not be undone.
                  </span>
                  <br />
                  Do you want to proceed?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (trashFolder.length > 0) {
                        cleanUpTrashFolder();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium pb-2 border-b ml-1">
          Trash Folders
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-4 gap-2">
          {trashLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-1.5 p-1.5 w-full h-46 border border-zinc-500/20 shadow rounded-md overflow-hidden animate-pulse opacity-50"
              >
                <Skeleton className="w-full h-[80%] rounded" />
                <Skeleton className="w-full h-[20%] rounded" />
              </div>
            ))
          ) : (
            <>
              {trashFolder?.length > 0 ? (
                trashFolder?.map((tf) => (
                  <div
                    key={tf._id}
                    className="flex flex-col gap-1.5 p-1.5 w-full h-46 border border-zinc-500/20 shadow rounded-md overflow-hidden"
                  >
                    <div className="w-full h-[80%] bg-stone-100 dark:bg-[#212121] rounded flex items-center justify-center">
                      <TbFolderFilled className="size-[70%]" />
                    </div>
                    <DropMenu
                      triggerContent={
                        <div className="cursor-pointer hover:bg-stone-200 hover:dark:bg-[#181818] h-[20%] w-full flex items-center justify-between gap-2 px-2 py-1 bg-stone-100 dark:bg-[#212121] rounded">
                          <span className="flex-1 line-clamp-1 overflow-hidden text-sm font-medium">
                            {tf.name}
                          </span>
                          <button>
                            <HiDotsVertical />
                          </button>
                        </div>
                      }
                      lable={
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm text-zinc-500">
                            {tf.name}
                          </span>
                          <span className="text-xs text-zinc-500">
                            {tf.formatedSize}
                          </span>
                        </div>
                      }
                      contentData={[
                        {
                          name: "Restore",
                          icon: <LuRefreshCw className="text-blue-500" />,
                          onClick: () => {
                            moveToTrashFolder(tf);
                          },
                        },
                        {
                          name: "Delete permanently ",
                          icon: (
                            <RiDeleteBin6Line className="text-red-500 dark:text-red-400" />
                          ),
                          onClick: () => folderDelete(tf._id),
                        },
                      ]}
                    />
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center mt-2">
                  <span className="text-xs font-medium italic text-zinc-500">
                    No trash Folders !
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageUsage;
