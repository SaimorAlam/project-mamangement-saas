import React, {
  useState,
  useEffect,
  cloneElement,
  ReactElement,
  isValidElement,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/client/SearchBar";
import PrimaryButton from "@/common/PrimaryButton";
import CreateProgramModal from "@/components/client/AllProgram/CreateProgramModal";
import SuccessModal from "@/components/client/SuccessModal";
import NotificationModal from "@/components/client/NotificationModal";
import AddEmployeeModal from "@/components/client/Employee/AddEmployeeModal";
import NewProjectModal from "@/components/client/NewProjectModal";
import { Bell, CalendarDays, ChevronDown, Plus, UserPlus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getClientSidebarItems } from "./clientSidebarItems";

interface ClientDashboardHeaderProps {
  name: string;
}

const DROPDOWN_ITEMS = ["Create Program"];

const ClientDashboardHeader: React.FC<ClientDashboardHeaderProps> = ({
  name,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const ClientSidebarGroups = getClientSidebarItems();
  const allRoutes = ClientSidebarGroups.flatMap((group) => group.items);

  // Determine current route
  let currentRoute = allRoutes.find((route) => {
    // Match exact path or any child path
    if (route.children) {
      return route.children.some(
        (child) => `${route.path}/${child.path}` === currentPath
      );
    }
    return route.path === currentPath;
  });

  // Special case for Program Overview: map to All Program
  const showProgramOverviewBreadcrumb = currentPath.startsWith(
    "/client-panel/all-program/program-overview/"
  );
  if (showProgramOverviewBreadcrumb) {
    currentRoute = allRoutes.find(
      (r) => r.path === "/client-panel/all-program"
    );
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [successData, setSuccessData] = useState();
  const [successOpen, setSuccessOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const isEmployeePage = currentPath.includes("/employee");
  const isHighwayExpansionPage = currentPath.includes(
    "/highway-expansion/all-highway"
  );
  const isAllProgramPage = currentPath.startsWith("/client-panel/all-program");
  const isProgramOverviewPage = currentPath.startsWith(
    "/client-panel/program-overview/"
  );
  useEffect(() => {
    setIsEmployeeModalOpen(false);
    setIsDropdownOpen(false);
  }, [currentPath]);

  const handleDropdownClick = (item: string) => {
    if (item === "Create Program") setActiveModal(item);
    setIsDropdownOpen(false);
  };

  const handleProgramSuccess = (programName: string) => {
    setActiveModal(null);
    setSuccessData(programName);
    setSuccessOpen(true);
  };

  const renderQuickActionButton = () => {
    if (isEmployeePage)
      return (
        <>
          <PrimaryButton
            title="Add Employee"
            leftIcon={<UserPlus />}
            type="Primary"
            onClick={() => setIsEmployeeModalOpen(true)}
          />
          <AddEmployeeModal
            open={isEmployeeModalOpen}
            onClose={() => setIsEmployeeModalOpen(false)}
          />
        </>
      );

    if (isAllProgramPage)
      return (
        <PrimaryButton
          title="Add Program"
          leftIcon={<Plus />}
          type="Primary"
          onClick={() => setActiveModal("Create Program")}
        />
      );
    if (isProgramOverviewPage)
      return (
        <>
          <PrimaryButton
            title="Add Project"
            leftIcon={<Plus />}
            type="Primary"
            onClick={() => setIsProjectModalOpen(true)}
          />
          <NewProjectModal
            open={isProjectModalOpen}
            onClose={() => setIsProjectModalOpen(false)}
            onSuccess={(projectName: string) => {
              setIsProjectModalOpen(false);
              setSuccessData(projectName || "New Project");
              setSuccessOpen(true);
            }}
          />
        </>
      );
    if (isHighwayExpansionPage)
      return (
        <>
          <PrimaryButton
            title="Add Project"
            leftIcon={<Plus />}
            type="Primary"
            onClick={() => setIsProjectModalOpen(true)}
          />
          <NewProjectModal
            open={isProjectModalOpen}
            onClose={() => setIsProjectModalOpen(false)}
            onSuccess={(projectName: string) => {
              setIsProjectModalOpen(false);
              setSuccessData(projectName || "New Project");
              setSuccessOpen(true);
            }}
          />
        </>
      );

    return (
      <>
        <PrimaryButton
          title="Quick Action"
          leftIcon={<Plus />}
          rightIcon={<ChevronDown />}
          type="Primary"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        />
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[55px] right-0 w-70 bg-white shadow-lg border border-gray-200 rounded-xl p-3 z-50"
            >
              {DROPDOWN_ITEMS.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleDropdownClick(item)}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-800 border border-gray-300 text-gray-700 hover:text-white mb-2 last:mb-0 cursor-pointer duration-300"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center py-5 justify-between">
        <div>
          <h1 className="text-[32px] font-semibold">Good Morning 👋, {name}</h1>
          <p className="text-base text-gray-500">
            This is dashboard overview of Acme Corporation
          </p>
        </div>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="flex items-center justify-between gap-6 relative">
          <PrimaryButton
            leftIcon={<Bell className="text-2xl" />}
            type="Outline"
            onClick={() => setIsNotificationOpen(true)}
          />
          <NotificationModal
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />

          <PrimaryButton
            title="Last 1 Week"
            leftIcon={<CalendarDays />}
            rightIcon={<ChevronDown />}
            type="Outline"
          />

          <div className="relative">{renderQuickActionButton()}</div>

          {activeModal === "Create Program" && (
            <CreateProgramModal
              open
              onOpenChange={(open) => !open && setActiveModal(null)}
              onSuccess={handleProgramSuccess}
              title="Create Program"
            />
          )}

          {successData && (
            <SuccessModal
              open={successOpen}
              onOpenChange={setSuccessOpen}
              programName={successData}
              redirectPath={
                isHighwayExpansionPage
                  ? "/program-overview/:id"
                  : "/all-program"
              }
            />
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/client-panel">Client</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {currentRoute && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to={currentRoute.path as string}
                    className="text-[#356DF0] font-semibold flex items-center gap-1"
                  >
                    {currentRoute.icon &&
                      isValidElement(currentRoute.icon) &&
                      cloneElement(
                        currentRoute.icon as ReactElement<{
                          className?: string;
                        }>,
                        { className: "w-4 h-4" }
                      )}
                    {currentRoute.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {showProgramOverviewBreadcrumb && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-[#356DF0]">
                      Program Overview
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default ClientDashboardHeader;
