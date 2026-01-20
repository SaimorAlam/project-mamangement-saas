import React, { cloneElement, useState } from "react";
import { Bell, Eye, FileText, Upload } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PrimaryButton from "@/common/PrimaryButton";
import { useHeaderContext } from "./StaffEmployeeHeaderContext";
import { getStaffEmployeeSidebarItems } from "./staffEmployeeSidebarMenuItems";
import GlobalSearch from "@/components/staffManager/GlobalSearch";
import NotificationModalNew from '@/components/staffManager/NotificationModalNew';

const StaffEmployeeDashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ClientSidebarGroups = getStaffEmployeeSidebarItems();
  const { heading, breadcrumb } = useHeaderContext();

  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const allRoutes = ClientSidebarGroups.flatMap(
    (group) => group.items
  );
  const currentRoute = allRoutes.find(
    (route) => route.path === currentPath
  );

  const previewButtonPaths = [
      "/staff-employee-panel/upload-submission",
      "/staff-employee-panel/project-builder",
    ];
    const saveDraftButtonPaths = [
      "/staff-employee-panel/project-builder",
      
    ];
    const publishButtonPaths = [
      "/staff-employee-panel/upload-submission",
      "/staff-employee-panel/project-builder",
    ];
    const uploadSubmissionButtonPaths = [
      "/staff-employee-panel/projects",
      "/staff-employee-panel",
    ];

  return (
    <div>
      <div className="flex items-center py-5 justify-between">
        {/* Greeting */}
        <div>
          <h1 className="text-[32px] font-semibold">{heading}</h1>
          <p className="text-base text-gray-500">{breadcrumb}</p>
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
              leftIcon={<Upload className="text-2xl" />}
              title="Submit for Review"
              type={"Primary"}
              onClick={() => setIsOpen(true)}
            />
          )}

          {uploadSubmissionButtonPaths.includes(currentPath) && (
            <PrimaryButton
              leftIcon={<Upload className="text-2xl" />}
              title="Upload Submission"
              type="Primary"
              onClick={() => navigate("/staff-employee-panel/upload-submission")}
            />
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {currentRoute ? (
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#356DF0] flex items-center justify-center gap-1 ">
                  {currentRoute.icon &&
                    React.isValidElement(currentRoute.icon)
                    ? cloneElement(
                      currentRoute.icon as React.ReactElement<{
                        className?: string;
                      }>,
                      { className: "w-4 h-4" }
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
      </div>
    </div>
  );
};

export default StaffEmployeeDashboardHeader;
