import React, { cloneElement, useState } from "react";
import SearchBar from "@/components/client/SearchBar";
import { Bell, Eye, FileText, Home, Megaphone, Upload } from "lucide-react";
import NotificationModal from "@/components/client/NotificationModal";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getStaffManagerSidebarItems } from "./staffManagerSidebarItem";
import PrimaryButton from "@/common/PrimaryButton";
import { useHeaderContext } from "./StaffManagerHeaderContext";

const StaffManagerDashboardHeader = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const StaffManagerSidebarItems = getStaffManagerSidebarItems();
  // const { heading, breadcrumb, showButton } = useHeaderContext();
  const { breadcrumb, showButton } = useHeaderContext();

  const location = useLocation();
  const currentPath = location.pathname;

  const allRoutes = StaffManagerSidebarItems.flatMap(
    (group) => group.items
  );
  const currentRoute = allRoutes.find(
    (route) => route.path === currentPath
  );

  return (
    <div>
      <div className="flex items-center py-5 justify-between">
        {/* Greeting */}
        {/* <div>
          <h1 className="text-[32px] font-semibold">{heading}</h1>
          <p className="text-base text-gray-500">{breadcrumb}</p>
        </div> */}
        {/* Breadcrumb */}
        <div className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <div className="text-xl flex items-center justify-center gap-1 ">
                    <Home className="w-6 h-6" />
                    <Link to="/">Home</Link>
                  </div>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {currentRoute ? (
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#356DF0] text-xl flex items-center justify-center gap-1 ">
                    {currentRoute.icon &&
                      React.isValidElement(currentRoute.icon)
                      ? cloneElement(
                        currentRoute.icon as React.ReactElement<{
                          className?: string;
                        }>,
                        { className: "w-6 h-6" }
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
            <p className="text-base text-gray-500">{breadcrumb}</p>
          )}

        </div>

        {/* Search */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Right Controls */}
        <div className="flex items-center justify-between gap-2 relative">
          {/* Notifications */}
          <PrimaryButton
            leftIcon={<Bell className="text-2xl" />}
            type={"Outline"}
            onClick={() => setIsOpen(true)}
          />
          <NotificationModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />

          {currentPath === "/staff-manager-panel/projects/upload-submission" && (
            <>
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
                type={"Primary"}
                onClick={() => setIsOpen(true)}
              />
            </>
          )
          }

          {/* Conditional Quick Action */}
          {currentPath === "/staff-manager-panel" && (
            <div className="relative">
              <>
                {showButton && (
                  <PrimaryButton
                    leftIcon={<Upload className="text-2xl" />}
                    title="Upload Submission"
                    type="Primary"
                    onClick={() => navigate("/staff-manager-panel/projects/upload-submission")}
                  />
                )}
              </>
            </div>
          )}
          {currentPath === "/staff-manager-panel/projects" && (
            <div className="relative">
              <>
                {showButton && (
                  <PrimaryButton
                    leftIcon={<Upload className="text-2xl" />}
                    title="Upload Submission"
                    type="Primary"
                    onClick={() => navigate("/staff-manager-panel/projects/upload-submission")}
                  />
                )}
              </>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default StaffManagerDashboardHeader;
