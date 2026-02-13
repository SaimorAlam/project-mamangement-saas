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
import { SidebarTrigger } from "@/components/ui/sidebar";
import PrimaryButton from "@/common/PrimaryButton";
import { useHeaderContext } from "./StaffEmployeeHeaderContext";
import { getStaffEmployeeSidebarItems } from "./staffEmployeeSidebarMenuItems";
import GlobalSearch from "@/components/staffManager/GlobalSearch";
import NotificationModalNew from "@/components/staffManager/NotificationModalNew";
import { useGetUser } from "@/hooks/useGetUser";

const StaffEmployeeDashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const ClientSidebarGroups = getStaffEmployeeSidebarItems();
  const { breadcrumb } = useHeaderContext();
  // const shortedLocation = breadcrumb.split(",").pop();
  const { name } = useGetUser();

  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const allRoutes = ClientSidebarGroups.flatMap((group) => group.items);
  const currentRoute = allRoutes.find((route) => route.path === currentPath);

  const previewButtonPaths = [
    "/staff-employee-panel/upload-submission",
    "/staff-employee-panel/project-builder",
  ];
  const saveDraftButtonPaths = ["/staff-employee-panel/project-builder"];
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
      <div className="flex flex-col md:flex-row items-start gap-5 py-5 justify-between">
        {/* Greeting */}
        <div className="max-w-xl flex items-center gap-4">
          <SidebarTrigger className="md:hidden shrink-0" />
          <div className="max-w-xl">
            <h1 className="text-[32px] font-semibold">
              {name ? name : "Mr./Mrs. Employee"}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-base text-gray-500">{breadcrumb}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 grow">
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
                onClick={() =>
                  navigate("/staff-employee-panel/upload-submission")
                }
              />
            )}
          </div>
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
      </div>
    </div>
  );
};

export default StaffEmployeeDashboardHeader;
