import { AppSidebar } from "@/components/app-sidebar/AppSidebar";
import AppTopbar from "@/components/app-topbar/AppTopbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ContentHome from "@/components/view/content-view/home/ContentHome";
import OpenFolder from "@/components/view/content-view/open-folder/OpenFolder";
import StorageUsage from "@/components/view/content-view/storage/StorageUsage";
import Upgrade from "@/components/view/content-view/up-grade/Upgrade";
import CreateFolder from "@/components/view/pop-up/CreateFolder";
import UploadImage from "@/components/view/pop-up/UploadImage";
import React from "react";
import { Route, Routes } from "react-router-dom";

const AppLayout = ({ children }) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col w-full">
          <div className="flex gap-1.5 items-center w-full sticky top-0 z-20 bg-white p-2 dark:bg-[#181818]">
            <SidebarTrigger className="size-9 cursor-pointer opacity-70 hover:opacity-100" />
            <div className="flex-1">
              <AppTopbar />
            </div>
          </div>
          <div className="md:px-6 md:py-3 px-4 py-2">
            <Routes>
              <Route path="/home" element={<ContentHome />} />
              <Route path="/folder/:folderId" element={<OpenFolder />} />
              <Route path="/storage" element={<StorageUsage />} />
              <Route path="/upgrade-plan" element={<Upgrade />} />
            </Routes>
          </div>
        </main>
      </SidebarProvider>
      <UploadImage />
      <CreateFolder />
    </div>
  );
};

export default AppLayout;
