import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { PiCaretUpDownLight } from "react-icons/pi";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LuLogOut } from "react-icons/lu";
import useUserApi from "@/hooks/api-hooks/UserApi";
import { slice } from "@/hooks/utils-hooks/slice";
import Logo from "../logo/Logo";
import SidebarFolder from "./SidebarFolder";
import SidebarOverview from "./SidebarOverview";
import { Link } from "react-router-dom";
import Add from "./Add";
import DropMenu from "../ui/DropMenu";

export function AppSidebar() {
  const { user } = useSelector((state) => state.user);

  const { logout } = useUserApi();

  return (
    <Sidebar>
      <SidebarHeader>
        <DropMenu
          triggerContent={
            <div className="w-full flex items-center justify-between gap-4 cursor-pointer overflow-hidden p-2 smooth rounded-md hover:bg-zinc-500/15">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    className="object-cover"
                    src={user?.profilePhoto}
                  />
                  <AvatarFallback>
                    {user?.userName.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-start flex-col">
                  <span className="text-xs font-medium line-clamp-1">
                    {slice(user?.userName, 20)}
                  </span>
                  <span className="text-[10px] line-clamp-1 text-zinc-500">
                    {slice(user?.email, 25)}
                  </span>
                </div>
              </div>
              <PiCaretUpDownLight />
            </div>
          }
          contentData={[
            {
              name: "Log Out",
              onClick: () => logout(),
              endIcon: <LuLogOut />,
            },
          ]}
        />
      </SidebarHeader>
      <SidebarContent className="custom-scroll">
        <Add />
        <SidebarOverview />
        <SidebarFolder />
      </SidebarContent>
      <SidebarFooter>
        <div className="w-full flex items-center justify-center">
          <Link to="/" className="w-[max-content]">
            <Logo size="22px" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
