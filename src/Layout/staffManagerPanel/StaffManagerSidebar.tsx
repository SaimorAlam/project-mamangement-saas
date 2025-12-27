/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "@/assets/client/logo.png";
import UserProfile from "@/components/client/UserProfile";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronRight, Heart } from "lucide-react";
import { getStaffManagerSidebarItems } from "./staffManagerSidebarItem";
import { useGetFavoriteProjectsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
interface favorite {
  id: string;
  name: string;
  path: string;
  icon?: React.ReactElement;
}

const StaffManagerSidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const groups = getStaffManagerSidebarItems();
  console.log("g",groups);

  const {data} = useGetFavoriteProjectsQuery();

  // if(error) return (<div className="text-xs text-wrap">Error loading favorite projects</div>);

  const favorites:favorite[] = []
  
  data?.data.forEach((item:any) => {
    favorites.push({
      id: item.project.id,
      name: item.project.name,
      path: `/staff-manager-panel/projects/${item.project.id}`,
      icon: <Heart />
    });
  });

  groups[1].items= favorites || groups[1].items;

  // Active logic — active if route matches current path or any child route matches
  const isRouteActive = (item: any, parentPath = ""): boolean => {
    const fullPath = item.index
      ? parentPath
      : item.path?.startsWith("/")
      ? item.path
      : `${parentPath}/${item.path}`;

    if (location.pathname === fullPath) return true;
    if (item.children) {
      return item.children.some((child: any) =>
        isRouteActive(child, fullPath)
      );
    }
    return false;
  };

  const renderSidebarItem = (item: any, parentPath = "") => {
    const fullPath = item.index
      ? parentPath
      : item.path?.startsWith("/")
      ? item.path
      : `${parentPath}/${item.path}`;

    const active = isRouteActive(item, parentPath);

    // Dropdown (parent with children)
    if (item.children && item.children.length > 0) {

      return (
        <SidebarMenuItem key={fullPath}>
          <DropdownMenu onOpenChange={(v) => setOpen(v)}>
            <DropdownMenuTrigger className="w-full">
              <SidebarMenuButton
                asChild
                className={`self-stretch px-4 py-5 rounded-[10px] inline-flex justify-start items-center w-full
                  ${
                    active
                      ? "bg-gradient-to-b from-[#4881FF] to-[#0151FFD6] text-white hover:text-white"
                      : "text-gray-900"
                  }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="flex items-center gap-2">
                    <span className="size-6">{item.icon}</span>
                    <span className="text-base font-normal">
                      {item.name}
                    </span>
                  </span>

                  <ChevronRight
                    className={`${
                      open ? "rotate-90 duration-200" : ""
                    }`}
                  />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="bg-white border border-[#CBD5E1] p-1 space-y-1"
            >
              {item.children.map((child: any) => (
                <DropdownMenuItem
                  key={`${fullPath}-${child.path}`}
                  asChild
                  className="p-0"
                >
                  <div className="w-full">
                    {renderSidebarItem(child, fullPath)}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      );
    }

    // Normal link (leaf)
    return (
      <SidebarMenuItem key={fullPath}>
        <Link to={fullPath}>
          <SidebarMenuButton
            asChild
            className={`self-stretch px-4 py-5 rounded-[10px] inline-flex justify-start items-center w-full
              ${
                active
                  ? "bg-gradient-to-b from-[#4881FF] to-[#0151FFD6] text-white hover:text-white"
                  : "text-gray-900"
              }`}
          >
            <div className="flex items-center gap-2">
              <span className="size-6">{item.icon}</span>
              <span className="text-base font-normal">
                {item.name}
              </span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="border border-slate-200 px-2 py-8 space-y-8 bg-white! overflow-y-auto">
      <SidebarHeader className="bg-white!">
        <Link to="/">
          <img src={Logo} alt="Logo" className="w-44 h-[50px]" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-white!">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((group) => (
                <div key={group.label}>
                  <SidebarGroupLabel className="text-[#64748B] text-sm font-medium">
                    {group.label}
                  </SidebarGroupLabel>

                  <SidebarMenu className="space-y-2.5">
                    {group.items.map((item) =>
                      renderSidebarItem(item)
                    )}
                  </SidebarMenu>

                  <hr className="w-56 text-slate-300 my-5" />
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white!">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default StaffManagerSidebar;
