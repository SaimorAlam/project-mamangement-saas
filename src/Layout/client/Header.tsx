import React, { cloneElement, useEffect, useState } from "react";
import SearchBar from "@/components/client/SearchBar";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Plus,
  UserPlus,
} from "lucide-react";
import CreateProgramModal from "@/components/client/AllProgram/CreateProgramModal";
import SuccessModal from "@/components/client/SuccessModal";
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
import PrimaryButton from "@/components/client/common/PrimaryButton";
import AddEmployeeModal from "@/components/client/Employee/AddEmployeeModal";
import { motion, AnimatePresence } from "framer-motion";
import NewProjectModal from "@/components/client/NewProjectModal";
import { getSidebarItems } from "./sidebarItems";

const Header = ({ name }: { name: string }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] =
    useState(false);
  const ClientSidebarGroups = getSidebarItems();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  const allRoutes = ClientSidebarGroups.flatMap(
    (group) => group.items
  );
  const currentRoute = allRoutes.find(
    (route) => route.path === currentPath
  );

  const dropdownItems = ["Create Program"];

  const handleDropdownClick = (item: string) => {
    if (item === "Create Program") {
      setActiveModal("Create Program");
    } else {
      console.log("Other action clicked:", item);
    }
    setIsDropdownOpen(false);
  };

  const handleProgramSuccess = (programName: string) => {
    setActiveModal(null);
    setSuccessData(programName);
    setSuccessOpen(true);
  };

  // Detect current tab
  const isEmployeePage =
    currentPath.includes("/employee") || currentPath === "/employee";
  const isAllProgramPage =
    currentPath.includes("/all-program") ||
    currentPath === "/all-program";
  const isHighwayExpansionPage =
    currentPath.includes("/highway-expansion/all-highway") ||
    currentPath === "/highway-expansion/all-highway";

  useEffect(() => {
    // close dropdown and modals when route changes
    setIsEmployeeModalOpen(false);
    setIsDropdownOpen(false);
  }, [currentPath]);

  return (
    <div>
      <div className="flex items-center py-5 justify-between">
        {/* Greeting */}
        <div>
          <h1 className="text-[32px] font-semibold">
            Good Morning 👋, {name}
          </h1>
          <p className="text-base text-gray-500">
            This is dashboard overview of Acme Corporation
          </p>
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

          {/* Date Filter */}
          <PrimaryButton
            title={"Last 1 Week"}
            leftIcon={<CalendarDays />}
            rightIcon={<ChevronDown />}
            type={"Outline"}
          />
          {/* 🔹 Conditional Quick Action */}
          <div className="relative">
            {isEmployeePage ? (
              <>
                <PrimaryButton
                  title={"Add Employee"}
                  leftIcon={<UserPlus />}
                  type={"Primary"}
                  onClick={() => setIsEmployeeModalOpen(true)}
                />
                <AddEmployeeModal
                  open={isEmployeeModalOpen}
                  onClose={() => setIsEmployeeModalOpen(false)}
                />
              </>
            ) : isAllProgramPage ? (
              <>
                <PrimaryButton
                  title={"Add Program"}
                  leftIcon={<Plus />}
                  type={"Primary"}
                  onClick={() => setActiveModal("Create Program")}
                />
              </>
            ) : isHighwayExpansionPage ? (
              <>
                <PrimaryButton
                  title={"Add Project"}
                  leftIcon={<Plus />}
                  type={"Primary"}
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
            ) : (
              <>
                <PrimaryButton
                  title={"Quick Action"}
                  leftIcon={<Plus />}
                  rightIcon={<ChevronDown />}
                  type={"Primary"}
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
                      {dropdownItems.map((item, index) => (
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
            )}

            {/* Modals */}
            {activeModal === "Create Program" && (
              <CreateProgramModal
                open={true}
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
                    ? "/highway-expansion/all-highway"
                    : "/all-program"
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

export default Header;
