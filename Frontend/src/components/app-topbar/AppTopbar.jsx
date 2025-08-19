import React, { useState } from "react";
import ThemeToggle from "@/theme/ThemeToggle";
import { GoSearch } from "react-icons/go";
import Search from "../view/pop-up/search";

const AppTopbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="w-full flex items-center justify-center gap-2">
          <div
            onClick={() => setOpen(true)}
            className="flex-1 p-2 rounded-lg border flex gap-2 text-zinc-500 items-center border-zinc-500/35 hover:border-zinc-500/70 cursor-pointer"
          >
            <GoSearch className="shrink-0" />
            <span className="text-[13px] font-medium text-zinc-500/60 line-clamp-1">
              Search Folders, Images . . . . .
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
      <Search open={open} setOpen={setOpen} />
    </>
  );
};

export default AppTopbar;
