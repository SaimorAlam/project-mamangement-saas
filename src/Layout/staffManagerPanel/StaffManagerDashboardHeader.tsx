import React, { cloneElement, useState } from "react";
import { Bell, Eye, FileText, Home, Megaphone, Upload } from "lucide-react";
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
import { useHeaderContext } from "./StaffManagerHeaderContext";
import NotificationModalNew from "@/components/staffManager/NotificationModalNew";
import GlobalSearch from "@/components/staffManager/GlobalSearch";

const StaffManagerDashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const StaffManagerSidebarItems = getStaffManagerSidebarItems();
  // const { heading, breadcrumb, showButton } = useHeaderContext();
  const { breadcrumb } = useHeaderContext();

  const location = useLocation();
  const currentPath = location.pathname;

  const allRoutes = StaffManagerSidebarItems.flatMap((group) => group.items);
  const currentRoute = allRoutes.find((route) => route.path === currentPath);

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
          <PrimaryButton
            leftIcon={<Bell className="text-2xl" />}
            type={"Outline"}
            onClick={() => setIsOpen(true)}
          />
          <NotificationModalNew
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />

          {previewButtonPaths.includes(currentPath) && (
            <PrimaryButton
              leftIcon={<Eye className="text-2xl" />}
              title="Preview"
              type={"Outline"}
              onClick={() => setIsOpen(true)}
            />
          )}

          {saveDraftButtonPaths.includes(currentPath) && (
            <PrimaryButton
              leftIcon={<FileText className="text-2xl" />}
              title="Save Draft"
              type={"Outline"}
              onClick={() => setIsOpen(true)}
            />
          )}
          {publishButtonPaths.includes(currentPath) && (
            <PrimaryButton
              leftIcon={<Megaphone className="text-2xl" />}
              title="Publish"
              type={"Primary"}
              onClick={() => setIsOpen(true)}
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
      <div className="flex flex-col gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <div className="text-sm flex items-center justify-center gap-1 ">
                  <Home className="w-4 h-4" />
                  <Link to="/">Home</Link>
                </div>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {currentRoute ? (
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#356DF0] text-sm flex items-center justify-center gap-1 ">
                  {currentRoute.icon && React.isValidElement(currentRoute.icon)
                    ? cloneElement(
                        currentRoute.icon as React.ReactElement<{
                          className?: string;
                        }>,
                        { className: "w-4 h-4" },
                      )
                    : null}
                  {currentRoute.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage></BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        {currentPath === "/staff-manager-panel/projects" && (
          <p className="text-sm text-gray-500">{breadcrumb}</p>
        )}
      </div>
    </div>
  );
};

export default StaffManagerDashboardHeader;
