import React, { cloneElement, useState } from "react";
import SearchBar from "@/components/client/SearchBar";
import { Bell, Eye, FileText, Megaphone } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
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
import UploadSubmission from "@/components/staffManager/overview/UploadSubmission";
import StaffEmployeeNotificationModal from "./../../components/staffEmployee/StaffEmployeeNotificationModal";

const StaffEmployeeDashboardHeader = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const ClientSidebarGroups = getStaffEmployeeSidebarItems();
  const { heading, breadcrumb, showButton } = useHeaderContext();

  const location = useLocation();
  const currentPath = location.pathname;

  const allRoutes = ClientSidebarGroups.flatMap(
    (group) => group.items
  );
  const currentRoute = allRoutes.find(
    (route) => route.path === currentPath
  );

  return (
    <div>
      <div className="flex items-center py-5 justify-between">
        {/* Greeting */}
        <div>
          <h1 className="text-[32px] font-semibold">{heading}</h1>
          <p className="text-base text-gray-500">{breadcrumb}</p>
        </div>

        {/* Search */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className="flex items-center justify-between gap-2 relative">
          {/* Notifications */}
          <PrimaryButton
            leftIcon={<Bell className="text-2xl" />}
            type={"Outline"}
            onClick={() => setIsOpen(true)}
          />
          <StaffEmployeeNotificationModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />

          {/* Preview */}
          <PrimaryButton
            leftIcon={<Eye className="text-2xl" />}
            title="Preview"
            type={"Outline"}
            onClick={() => setIsOpen(true)}
          />

          {/* Save Draft */}
          <PrimaryButton
            leftIcon={<FileText className="text-2xl" />}
            title="Save Draft"
            type={"Outline"}
            onClick={() => setIsOpen(true)}
          />

          {/* Publish */}
          <PrimaryButton
            leftIcon={<Megaphone className="text-2xl" />}
            title="Publish"
            type={
              currentPath === "/staff-manager-panel"
                ? "Outline"
                : "Primary"
            }
            onClick={() => setIsOpen(true)}
          />

          {/* Conditional Quick Action */}
          {currentPath === "/staff-employee-panel" && (
            <div className="relative">
              <>{showButton && <UploadSubmission />}</>
            </div>
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
