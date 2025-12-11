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

import { ChevronRight } from "lucide-react";
import { getClientSidebarItems } from "./clientSidebarItems";

const ClientSidebar = () => {
  const location = useLocation();
  const groups = getClientSidebarItems();

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
      const [open, setOpen] = useState(active);

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
              className="bg-white border border-[#CBD5E1] p-1 space-y-1 w-full"
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
    <Sidebar className="border-1 border-slate-200 px-2 py-8 space-y-8 bg-white overflow-y-auto">
      <SidebarHeader className="!bg-white">
        <Link to="/">
          <img src={Logo} alt="Logo" className="w-[176px] h-[50px]" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="!bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((group) => (
                <div key={group.label}>
                  <SidebarGroupLabel className="text-[#64748B] text-sm font-medium">
                    {group.label}
                  </SidebarGroupLabel>

                  <SidebarMenu className="space-y-[10px]">
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

      <SidebarFooter className="!bg-white">
        <UserProfile
          name="Sofia Martin"
          role="Team Leader"
          avatar="https://randomuser.me/api/portraits/women/47.jpg"
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default ClientSidebar;
