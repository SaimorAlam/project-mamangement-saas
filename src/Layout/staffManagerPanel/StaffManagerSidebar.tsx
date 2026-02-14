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
  SidebarTrigger,
  useSidebar,
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
  const { state, isMobile } = useSidebar();
  const groups = getStaffManagerSidebarItems();

  const { data } = useGetFavoriteProjectsQuery();

  const isExpanded = state === "expanded" || isMobile;

  const favorites: favorite[] = [];

  data?.data.forEach((item: any) => {
    favorites.push({
      id: item.project.id,
      name: item.project.name,
      path: `/staff-manager-panel/projects/${item.project.id}`,
      icon: <Heart />,
    });
  });

  groups[1].items = favorites || groups[1].items;

  // Active logic — active if route matches current path or any child route matches
  const isRouteActive = (item: any, parentPath = ""): boolean => {
    const fullPath = item.index
      ? parentPath
      : item.path?.startsWith("/")
        ? item.path
        : `${parentPath}/${item.path}`;

    const currentPath = location.pathname;

    // Exact match
    if (currentPath === fullPath) return true;

    // Nested match: current path starts with item path followed by a slash
    // We exclude the base root path to prevent it from matching every sub-route
    if (
      fullPath !== "/staff-manager-panel" &&
      fullPath !== "" &&
      currentPath.startsWith(fullPath + "/")
    ) {
      return true;
    }

    if (item.children) {
      return item.children.some((child: any) => isRouteActive(child, fullPath));
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
        <SidebarMenuItem key={fullPath} className="w-full ">
          <DropdownMenu onOpenChange={(v) => setOpen(v)}>
            <DropdownMenuTrigger asChild className="border-none">
              <button
                className={`self-stretch rounded-[10px] inline-flex items-center 
                  ${isExpanded
                    ? "px-4 py-3 justify-start w-full"
                    : "px-1 justify-center"
                  }
                  ${active
                    ? "bg-linear-to-b from-[#4881FF] to-[#0151FFD6] text-white hover:text-white"
                    : "text-gray-900 hover:bg-slate-100"
                  }`}
              >
                <div
                  className={`flex items-center ${isExpanded ? "justify-between w-full" : "justify-center"
                    }`}
                >
                  <span
                    className={`flex items-center ${isExpanded ? "gap-2" : ""}`}
                  >
                    <span className="size-6 shrink-0">{item.icon}</span>
                    {isExpanded && (
                      <span className="text-base font-normal truncate">
                        {item.name}
                      </span>
                    )}
                  </span>

                  {isExpanded && (
                    <ChevronRight
                      className={`shrink-0 ${open ? "rotate-90 duration-200" : ""
                        }`}
                    />
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side={!isExpanded ? "right" : "bottom"}
              align={!isExpanded ? "start" : "end"}
              className="bg-white border border-[#CBD5E1] p-1 space-y-1 min-w-[200px]"
            >
              {item.children.map((child: any) => (
                <DropdownMenuItem
                  key={`${fullPath}-${child.path}`}
                  asChild
                  className="p-0 w-full"
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
            className={`self-stretch rounded-[10px] inline-flex items-center w-full
              ${isExpanded
                ? "px-4 py-5 justify-start"
                : "px-2 py-3 justify-center"
              }
              ${active
                ? "bg-linear-to-b from-[#4881FF] to-[#0151FFD6] text-white hover:text-white"
                : "text-gray-900"
              }`}
          >
            <div className={`flex items-center ${isExpanded ? "gap-2" : ""}`}>
              <span className="size-6 shrink-0">{item.icon}</span>
              {isExpanded && (
                <span className="text-base font-normal w-full truncate">
                  {item.name}
                </span>
              )}
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border border-slate-200 px-2 py-8 space-y-8 bg-white overflow-y-auto"
    >
      <SidebarHeader className="bg-white">
        <div
          className={`flex ${!isExpanded ? "flex-col" : ""
            } items-center justify-between`}
        >
          {
            <Link to="/staff-manager-panel">
              <img
                src={Logo}
                alt="Logo"
                className="w-[176px] h-auto hover:scale-110 duration-300"
              />
            </Link>
          }
          <SidebarTrigger className={!isExpanded ? "mx-auto" : "ml-auto"} />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white grid items-start justify-center scrollbar-hide">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((group) => {
                if (group.items.length === 0) return null;
                return (
                  <SidebarMenuItem key={group.label}>
                    {isExpanded && (
                      <SidebarGroupLabel className="text-[#64748B] text-sm font-medium">
                        {group.label}
                      </SidebarGroupLabel>
                    )}

                    <SidebarMenu className="space-y-2.5">
                      {group.items.map((item) => renderSidebarItem(item))}
                    </SidebarMenu>

                    {isExpanded && <hr className="w-56 text-slate-300 my-5" />}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white">
        <UserProfile state={isExpanded ? "expanded" : "collapsed"} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default StaffManagerSidebar;
