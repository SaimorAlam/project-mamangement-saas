/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
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

import { ChevronRight, Star } from "lucide-react";
import { getClientSidebarItems } from "./clientSidebarItems";
import { useGetFavoriteProjectsQuery } from "@/store/Api/FavoriteProjectApi/FavoriteProjectApi";

const ClientSidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { state } = useSidebar();

  const { data, isLoading } = useGetFavoriteProjectsQuery({});

  /**
   * 01. Build favorite items
   */
  const favoriteItems = useMemo(() => {
    return (
      data?.data?.map((item: any) => ({
        icon: <Star className="size-6" />,
        name: item.project.name,
        path: `/client-panel/project-details/${item.project.id}`,
      })) || []
    );
  }, [data]);

  /**
   * 02. Inject favorites immutably
   */
  const groups = useMemo(() => {
    return getClientSidebarItems().map((group) => {
      if (group.label !== "Favorites") return group;

      return {
        ...group,
        items: favoriteItems,
      };
    });
  }, [favoriteItems]);

  /**
   * Active route logic
   */
  const isRouteActive = (item: any, parentPath = ""): boolean => {
    const fullPath = item.index
      ? parentPath
      : item.path?.startsWith("/")
      ? item.path
      : `${parentPath}/${item.path}`;

    if (location.pathname === fullPath) return true;

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

    if (item.children && item.children.length > 0) {
      return (
        <SidebarMenuItem key={fullPath}>
          <DropdownMenu onOpenChange={(v) => setOpen(v)}>
            <DropdownMenuTrigger asChild>
              <button
                className={`self-stretch rounded-[10px] inline-flex items-center w-full
                  ${
                    state === "expanded"
                      ? "px-4 py-5 justify-start"
                      : "px-2 py-3 justify-center"
                  }
                  ${
                    active
                      ? "bg-gradient-to-b from-[#4881FF] to-[#0151FFD6] text-white hover:text-white"
                      : "text-gray-900 hover:bg-slate-100"
                  }`}
              >
                <div
                  className={`flex items-center ${
                    state === "expanded"
                      ? "justify-between w-full"
                      : "justify-center"
                  }`}
                >
                  <span
                    className={`flex items-center ${
                      state === "expanded" ? "gap-2" : ""
                    }`}
                  >
                    <span className="size-6 flex-shrink-0">{item.icon}</span>
                    {state === "expanded" && (
                      <span className="text-base font-normal">{item.name}</span>
                    )}
                  </span>

                  {state === "expanded" && (
                    <ChevronRight
                      className={`flex-shrink-0 ${
                        open ? "rotate-90 duration-200" : ""
                      }`}
                    />
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side={state === "collapsed" ? "right" : "bottom"}
              align={state === "collapsed" ? "start" : "end"}
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

    return (
      <SidebarMenuItem key={fullPath}>
        <Link to={fullPath}>
          <SidebarMenuButton
            asChild
            className={`self-stretch rounded-[10px] inline-flex items-center w-full
              ${
                state === "expanded"
                  ? "px-4 py-5 justify-start"
                  : "px-2 py-3 justify-center"
              }
              ${
                active
                  ? "bg-gradient-to-b from-[#4881FF] to-[#0151FFD6] text-white hover:text-white"
                  : "text-gray-900"
              }`}
          >
            <div
              className={`flex items-center ${
                state === "expanded" ? "gap-2" : ""
              }`}
            >
              <span className="size-6 flex-shrink-0">{item.icon}</span>
              {state === "expanded" && (
                <span className="text-base font-normal">{item.name}</span>
              )}
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  };

  /**
   * Favorites skeleton rows
   */
  const renderFavoritesSkeleton = () =>
    Array.from({ length: 3 }).map((_, idx) => (
      <SidebarMenuItem key={`fav-skeleton-${idx}`}>
        <div
          className={`rounded-[10px] flex items-center animate-pulse
          ${
            state === "expanded"
              ? "px-4 py-5 gap-2"
              : "px-2 py-3 justify-center"
          }`}
        >
          <div className="h-6 w-6 bg-slate-200 rounded flex-shrink-0" />
          {state === "expanded" && (
            <div className="h-4 w-32 bg-slate-200 rounded" />
          )}
        </div>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar
      collapsible="icon"
      className="border-1 border-slate-200 px-2 py-8 space-y-8 bg-white overflow-y-auto"
    >
      <SidebarHeader className="!bg-white">
        <div className="flex items-center justify-between">
          {state === "expanded" && (
            <Link to="/">
              <img
                src={Logo}
                alt="Logo"
                className="w-[176px] h-[50px] hover:scale-110 duration-300"
              />
            </Link>
          )}
          <SidebarTrigger
            className={state === "collapsed" ? "mx-auto" : "ml-auto"}
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="!bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((group) => (
                <div key={group.label}>
                  {state === "expanded" && (
                    <SidebarGroupLabel className="text-[#64748B] text-sm font-medium">
                      {group.label}
                    </SidebarGroupLabel>
                  )}

                  <SidebarMenu className="space-y-[10px]">
                    {group.label === "Favorites" && isLoading
                      ? renderFavoritesSkeleton()
                      : group.items.map((item: any) => renderSidebarItem(item))}
                  </SidebarMenu>

                  {state === "expanded" && (
                    <hr className="w-56 text-slate-300 my-5" />
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="!bg-white">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default ClientSidebar;
