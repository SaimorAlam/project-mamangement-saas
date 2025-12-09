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
import { getSidebarItems } from "@/components/client/sidebarItems";

const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const ClientSidebarGroups = getSidebarItems();

  return (
    <Sidebar className="border-1 border-slate-200 px-2 py-8 space-y-8 bg-white overflow-y-auto">
      <SidebarHeader className="bg-white">
        <Link to="/">
          <img src={Logo} alt="Logo" className="w-[176px] h-[50px]" />
        </Link>
      </SidebarHeader>

      <SidebarContent
        style={{ scrollbarWidth: "none" }}
        className="bg-white"
      >
        <SidebarGroup className="scrollbar-hidden">
          <SidebarGroupContent>
            <SidebarMenu className="overflow-hidden">
              {ClientSidebarGroups.map((group) => (
                <div
                  key={group.label}
                  className="text-[#64748B] text-sm font-medium"
                >
                  <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

                  <SidebarMenu className="space-y-[10px]">
                    {group.items.map((item) => {
                      const isActive =
                        location.pathname === item.path;
                      return (
                        <SidebarMenuItem
                          key={`group-${group.label}-item-${item.name}`}
                        >
                          {item.children ? (
                            <DropdownMenu
                              onOpenChange={() => setIsOpen(!isOpen)}
                            >
                              <DropdownMenuTrigger className="w-full">
                                <SidebarMenuButton
                                  asChild
                                  className={`self-stretch px-4 py-5 rounded-[10px] inline-flex justify-start items-center w-full ${
                                    isActive
                                      ? "bg-gradient-to-b from-blue-500 to-blue-600/80 text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <span className="flex items-center gap-2">
                                      <span className="size-6">
                                        {item.icon}
                                      </span>
                                      <span className="text-base font-normal">
                                        {item.name}
                                      </span>
                                    </span>
                                    <ChevronRight
                                      className={`${
                                        isOpen
                                          ? "rotate-90 duration-200"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                </SidebarMenuButton>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                align="end"
                                className="bg-white border border-[#CBD5E1]"
                              >
                                {item.children.map((child) => {
                                  const isChildActive =
                                    location.pathname ===
                                    `${item.path}/${child.path}`;
                                  return (
                                    <DropdownMenuItem
                                      key={`${item.path}-${child.path}`}
                                      asChild
                                    >
                                      <Link
                                        to={`${item.path}/${child.path}`}
                                        className="w-full"
                                      >
                                        <SidebarMenuButton
                                          asChild
                                          className={`w-full self-stretch px-4 py-3 rounded-[10px] inline-flex justify-start items-center ${
                                            isChildActive
                                              ? "bg-gradient-to-b from-blue-500 to-blue-600/80 text-white"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          <div className="w-full flex items-center gap-2">
                                            <span>{child.icon}</span>
                                            <span className="text-base font-normal">
                                              {child.name}
                                            </span>
                                          </div>
                                        </SidebarMenuButton>
                                      </Link>
                                    </DropdownMenuItem>
                                  );
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <Link to={item.path as string}>
                              <SidebarMenuButton
                                asChild
                                className={`self-stretch px-4 py-5 rounded-[10px] inline-flex justify-start items-center w-full ${
                                  isActive
                                    ? "bg-gradient-to-b from-blue-500 to-blue-600/80 text-white hover:text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="size-6">
                                    {item.icon}
                                  </span>
                                  <span className="text-base font-normal">
                                    {item.name}
                                  </span>
                                </div>
                              </SidebarMenuButton>
                            </Link>
                          )}
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                  <hr className="w-56 text-slate-300 my-5" />
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-white">
        {/* Profile */}
        <UserProfile
          name="Sofia Martin"
          role="Team Leader"
          avatar="https://randomuser.me/api/portraits/women/47.jpg"
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
