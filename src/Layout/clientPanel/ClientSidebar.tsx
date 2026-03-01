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
  const { state, isMobile } = useSidebar();

  const { data, isLoading } = useGetFavoriteProjectsQuery({});
  const isExpanded = state === "expanded" || isMobile;

  /**
   * 01. Build favorite items
   */
  const favoriteItems = useMemo(() => {
    const projects = data?.data || [];
    return projects.map((item: any) => ({
      icon: <Star className="size-6" />,
      name: item.project.name,
      path: `/client-panel/project-details/${item.project.id}`,
    }));
  }, [data]);

  /**
   * 02. Inject favorites immutably
   */
  const groups = useMemo(() => {
    return getClientSidebarItems()
      .map((group) => {
        if (group.label !== "Favorites") return group;
        return {
          ...group,
          items: favoriteItems,
        };
      })
      .filter((group) => {
        if (group.label === "Favorites") {
          return isLoading || favoriteItems.length > 0;
        }
        return true;
      });
  }, [favoriteItems, isLoading]);

  /**
   * Active route logic
   */
  const isRouteActive = (item: any, parentPath = ""): boolean => {
    const fullPath = item.index
      ? parentPath
      : item.path?.startsWith("/")
        ? item.path
        : `${parentPath}/${item.path}`;

    const currentPath = location.pathname;

    // Special case for Overview Project Details
    if (
      fullPath === "/client-panel" &&
      currentPath.includes("/overview/project-details")
    ) {
      return true;
    }

    // Exact match
    if (currentPath === fullPath) return true;

    // Nested match
    if (
      fullPath !== "/client-panel" &&
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

  const NavItem = ({ item, parentPath = "" }: { item: any; parentPath?: string }) => {
    const { isMobile, setOpenMobile } = useSidebar();
    const isExpandedState = state === "expanded" || isMobile;
    const [isOpen, setIsOpen] = useState(false);
    
    const fullPath = item.index
      ? parentPath
      : item.path?.startsWith("/")
        ? item.path
        : `${parentPath}/${item.path}`;

    const active = isRouteActive(item, parentPath);

    if (item.children && item.children.length > 0) {
      return (
        <SidebarMenuItem key={fullPath} className="w-full">
          <DropdownMenu onOpenChange={setIsOpen}>
            <DropdownMenuTrigger
              asChild
              className={`border-none ${isExpanded ? "py-3!" : "py-2!"}`}
            >
              <button
                className={`self-stretch rounded-[10px] inline-flex items-center 
                  ${
                    isExpandedState
                      ? "px-4 py-3 justify-start w-full"
                      : "px-1 justify-center"
                  }
                  ${
                    active
                      ? "bg-linear-to-b from-[#4881FF] to-[#0151FFD6] text-white hover:text-white"
                      : "text-gray-900 hover:bg-slate-100"
                  }`}
              >
                <div
                  className={`flex items-center ${
                    isExpandedState ? "justify-between w-full" : "justify-center"
                  }`}
                >
                  <span
                    className={`flex items-center ${isExpandedState ? "gap-2" : ""}`}
                  >
                    <span className="size-6 shrink-0">{item.icon}</span>
                    {isExpandedState && (
                      <span className="text-base font-normal truncate">
                        {item.name}
                      </span>
                    )}
                  </span>

                  {isExpandedState && (
                    <ChevronRight
                      size={20}
                      className={`shrink-0 ${
                        isOpen ? "rotate-90 duration-200" : ""
                      }`}
                    />
                  )}
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side={!isExpandedState ? "right" : "bottom"}
              align={!isExpandedState ? "start" : "end"}
              className="bg-white border border-[#CBD5E1] p-1  min-w-[200px]"
            >
              {item.children.map((child: any) => (
                <DropdownMenuItem
                  key={`${fullPath}-${child.path}`}
                  asChild
                  className="p-0 w-full"
                >
                  <div className="w-full">
                    <NavItem item={child} parentPath={fullPath} />
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
        <Link 
          to={fullPath} 
          onClick={() => {
            if (isMobile) setOpenMobile(false);
          }}
        >
          <SidebarMenuButton
            asChild
            className={`self-stretch rounded-[10px] inline-flex items-center w-full
              ${
                isExpandedState
                  ? "px-4 py-5 justify-start"
                  : "px-2 py-3 justify-center"
              }
              ${
                active
                  ? "bg-linear-to-b from-[#4881FF] to-[#0151FFD6] text-white hover:text-white"
                  : "text-gray-900"
              }`}
          >
            <div className={`flex items-center ${isExpandedState ? "gap-2" : ""}`}>
              <span className="size-6 shrink-0">{item.icon}</span>
              {isExpandedState && (
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

  const renderFavoritesSkeleton = () =>
    Array.from({ length: 3 }).map((_, idx) => (
      <SidebarMenuItem key={`fav-skeleton-${idx}`}>
        <div
          className={`rounded-[10px] flex items-center animate-pulse
          ${isExpanded ? "px-4 py-5 gap-2" : "px-2 py-3 justify-center"}`}
        >
          <div className="h-6 w-6 bg-slate-200 rounded shrink-0" />
          {isExpanded && <div className="h-4 w-32 bg-slate-200 rounded" />}
        </div>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar
      collapsible="icon"
      className="border border-slate-200 px-2 py-8 space-y-8 bg-white overflow-y-auto"
    >
      <SidebarHeader className="bg-white">
        <div
          className={`flex ${!isExpanded ? "flex-col" : ""} items-center justify-between`}
        >
          {
            <Link to="/">
              <img
                src={Logo}
                alt="Logo"
                className="w-44 h-auto hover:scale-110 duration-300"
              />
            </Link>
          }

          <SidebarTrigger className={!isExpanded ? "mx-auto" : "ml-auto"} />
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white! grid items-start justify-center scrollbar-hide">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((group) => (
                <SidebarMenuItem key={group.label}>
                  {isExpanded && (
                    <SidebarGroupLabel className="text-[#64748B] text-sm font-medium">
                      {group.label}
                    </SidebarGroupLabel>
                  )}

                  <SidebarMenu className="space-y-2.5">
                    {group.label === "Favorites" && isLoading
                      ? renderFavoritesSkeleton()
                      : group.items.map((item: any) => (
                          <NavItem key={item.path} item={item} />
                        ))}
                  </SidebarMenu>

                  {isExpanded && <hr className="w-56 text-slate-300 my-5" />}
                </SidebarMenuItem>
              ))}
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

export default ClientSidebar;
