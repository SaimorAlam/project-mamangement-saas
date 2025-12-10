import React, { cloneElement, useState } from "react";
import SearchBar from "@/components/client/SearchBar";
import { Bell, Upload } from "lucide-react";
import NotificationModal from "@/components/client/NotificationModal";
import { useLocation, Link } from "react-router-dom";
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
  const StaffManagerSidebarItems = getStaffManagerSidebarItems();
  const { heading, breadcrumb, showButton } = useHeaderContext();

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
        <div>
          <h1 className="text-[32px] font-semibold">{heading}</h1>
          <p className="text-base text-gray-500">{breadcrumb}</p>
        </div>

        {/* Search */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Right Controls */}
        <div className="flex items-center justify-between gap-6 relative">
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

          {/* 🔹 Conditional Quick Action */}
          <div className="relative">
            <>
              {showButton && (
                <PrimaryButton
                  title={"Upload Submission"}
                  leftIcon={<Upload />}
                  type={"Primary"}
                />
              )}
            </>
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

export default StaffManagerDashboardHeader;
