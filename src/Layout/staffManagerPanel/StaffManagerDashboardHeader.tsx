import React, { cloneElement, useState, useMemo, isValidElement, ReactElement } from "react";
import { Bell, Eye, FileText, Megaphone, Upload } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getStaffManagerSidebarItems } from "./staffManagerSidebarItem";
import PrimaryButton from "@/common/PrimaryButton";
import NotificationModalNew from "@/components/staffManager/NotificationModalNew";
import { useNotification } from "@/context/NotificationContext";
import GlobalSearch from "@/components/staffManager/GlobalSearch";

const StaffManagerDashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { unreadCount } = useNotification();

  const allRoutes = useMemo(
    () => getStaffManagerSidebarItems().flatMap((group) => group.items),
    []
  );

  // Build breadcrumb path by finding matching routes
  const breadcrumbData = useMemo(() => {
    const items: Array<{
      label: string;
      path?: string;
      icon?: React.ReactNode;
      isPage?: boolean;
    }> = [{ label: "Home", path: "/staff-manager-panel" }];

    // Find the current route
    let currentRoute = allRoutes.find((r) => r.path === currentPath);
    
    // If not direct match, check for parent routes with children
    if (!currentRoute) {
      for (const route of allRoutes) {
        if (route.children) {
          const childMatch = route.children.find(
            (child) => `${route.path}/${child.path}` === currentPath
          );
          if (childMatch) {
            // Add parent to breadcrumb
            items.push({
              label: route.name as string,
              path: route.path as string,
              icon: route.icon,
            });
            // Add child as current page
            items.push({ label: childMatch.name as string, isPage: true });
            return items;
          }
        }
      }
    }

    // Add current route
    if (currentRoute) {
      items.push({
        label: currentRoute.name as string,
        path: currentRoute.path as string,
        icon: currentRoute.icon,
      });
    }

    return items;
  }, [currentPath, allRoutes]);

  const previewButtonPaths = [
    "/staff-manager-panel/projects/upload-submission",
    "/staff-manager-panel/project-builder",
  ];
  const saveDraftButtonPaths = ["/staff-manager-panel/project-builder"];
  const publishButtonPaths = [
    "/staff-manager-panel/projects/upload-submission",
    "/staff-manager-panel/project-builder",
  ];
  const uploadSubmissionButtonPaths = [
    "/staff-manager-panel/projects",
    "/staff-manager-panel",
  ];

  const userName = localStorage.getItem("userName");
  const name = localStorage.getItem("name");

  return (
    <div className="flex flex-col gap-2 py-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <SidebarTrigger className="md:hidden shrink-0" />
          <div className="min-w-0">
            <h1 className="text-2xl md:text-[32px] font-semibold truncate">
              Good Morning {userName || name}, 👋
            </h1>
            <p className="text-sm md:text-base text-gray-500 truncate">
              This is dashboard overview of Acme Corporation
            </p>
          </div>
        </div>
        {/* Search */}
        <GlobalSearch />

        {/* Right Controls */}
        <div className="flex items-center justify-between gap-2 relative">
          {/* Notifications */}
          <div className="relative">
            <PrimaryButton
              leftIcon={<Bell className="text-2xl" />}
              type={"Outline"}
              onClick={() => setIsOpen(true)}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <NotificationModalNew
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />

          {previewButtonPaths.includes(currentPath) && (
            <PrimaryButton
              leftIcon={<Eye className="text-2xl" />}
              title="Preview"
              type={"Outline"}
              onClick={() => console.log("clicked")
                }
            />
          )}

          {saveDraftButtonPaths.includes(currentPath) && (
            <PrimaryButton
              leftIcon={<FileText className="text-2xl" />}
              title="Save Draft"
              type={"Outline"}
              onClick={() => console.log("clicked")}
            />
          )}
          {publishButtonPaths.includes(currentPath) && (
            <PrimaryButton
              leftIcon={<Megaphone className="text-2xl" />}
              title="Publish"
              type={"Primary"}
              onClick={() => console.log("clicked")}
            />
          )}

          {uploadSubmissionButtonPaths.includes(currentPath) && (
            <PrimaryButton
              leftIcon={<Upload className="text-2xl" />}
              title="Upload Submission"
              type="Primary"
              onClick={() =>
                navigate("/staff-manager-panel/projects/upload-submission")
              }
            />
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="overflow-x-auto no-scrollbar py-1">
        <Breadcrumb className="my-2 min-w-max">
          <BreadcrumbList>
            {breadcrumbData.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.isPage ? (
                    <BreadcrumbPage className="text-[#356DF0]">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        to={item.path || "#"}
                        className={
                          index > 0
                            ? "text-[#356DF0] font-semibold flex items-center gap-1"
                            : ""
                        }
                      >
                        {item.icon &&
                          isValidElement(item.icon) &&
                          cloneElement(
                            item.icon as ReactElement<{ className?: string }>,
                            { className: "w-4 h-4" }
                          )}
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbData.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default StaffManagerDashboardHeader;
