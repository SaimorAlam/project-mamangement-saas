import React, { cloneElement, useState } from "react";
import SearchBar from "@/components/client/SearchBar";
import PrimaryButton from "@/common/PrimaryButton";
import { Bell, CalendarDays, ChevronDown } from "lucide-react";
import { useLocation, Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { getViewerPanelSidebarItems } from "./viewerPanelSidebarItems";
import ViewerNotificationModal from "./ViewerNotificationModal";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";

const ViewerPanelHeader = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const ClientSidebarGroups = getViewerPanelSidebarItems();


  const location = useLocation();
  const { projectId } = useParams();
  const { data } = useGetProjectByIdQuery(projectId!, {
    skip: !projectId,
  });
  const projectDetails = data?.data;

  const currentPath = location.pathname;

  const allRoutes = ClientSidebarGroups.flatMap((group) => group.items);
  const currentRoute = allRoutes.find((route) => route.path === currentPath);

  return (
    <div>
      <div className="flex items-center py-5 justify-between">
        {/* Greeting */}
        <div className="flex-1">
          <h1 className="text-[32px] font-semibold">
            Good Morning👋,
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Right Controls */}
        <div className="flex-1 flex items-center justify-end gap-4 relative">
          {/* Notifications */}
          <PrimaryButton
            leftIcon={<Bell className="text-2xl" />}
            type={"Outline"}
            onClick={() => setIsOpen(true)}
          />
          <ViewerNotificationModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
          <div className="hidden sm:block">
            <PrimaryButton
              title="Last 1 Week"
              leftIcon={<CalendarDays className="size-4 md:size-5" />}
              rightIcon={<ChevronDown className="size-4 md:size-5" />}
              type="Primary"
            />
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
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-[#356DF0]">
                    <Link to={`/viewer-panel`}>Overview</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {projectDetails?.project?.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default ViewerPanelHeader;
