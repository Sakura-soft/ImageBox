import React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { GrHome } from "react-icons/gr";
import { FiInbox } from "react-icons/fi";
import { MdWorkspacePremium } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import useTrashApi from "@/hooks/api-hooks/TrashApi";

const SidebarOverview = () => {
  const location = useLocation();

  const { getTrash } = useTrashApi();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Overview</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {[
              {
                name: "Home",
                icon: <GrHome />,
                path: "/user/home",
                onClick: () => {},
              },
              {
                name: "Storage",
                icon: <FiInbox />,
                path: "/user/storage",
                onClick: () => getTrash(),
              },
              {
                name: "Upgrade",
                icon: <MdWorkspacePremium />,
                path: "/user/upgrade-plan",
                onClick: () => {},
              },
            ].map((m) => (
              <Link onClick={m.onClick} key={m.name} to={m.path}>
                <SidebarMenuItem className="ml-2">
                  <SidebarMenuButton
                    className={`${
                      location.pathname.includes(m.path)
                        ? "shadow-md smooth bg-zinc-800 text-white hover:bg-zinc-800 hover:text-white dark:bg-zinc-300 dark:text-black dark:hover:bg-zinc-300 dark:hover:text-black"
                        : "text-zinc-800 dark:text-zinc-300"
                    } 
                      cursor-pointer text-[13px]`}
                  >
                    {m.icon}
                    {m.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default SidebarOverview;
