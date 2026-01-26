import React, {
  useState,
  useEffect,
  cloneElement,
  ReactElement,
  isValidElement,
} from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/client/SearchBar";
import PrimaryButton from "@/common/PrimaryButton";
import CreateProgramModal from "@/components/client/AllProgram/CreateProgramModal";
import SuccessModal from "@/components/client/SuccessModal";
import NotificationModal from "@/components/client/NotificationModal";
import { toast } from "sonner";
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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getClientSidebarItems } from "./clientSidebarItems";
// import CreateProjectModal from "./CreateProjectModal";
import CreateProject from "./CreateProject";
import { useGetUser } from "@/hooks/useGetUser";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  setIsPreview,
  setIsPublished,
} from "@/store/Slices/ChartSlice/ChartSlice";
import { Download } from "lucide-react";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";

interface ClientDashboardHeaderProps {
  name?: string;
}

const DROPDOWN_ITEMS = ["Create Program"];

const ClientDashboardHeader: React.FC<ClientDashboardHeaderProps> = ({
  name,
}) => {
  const [projectName, setProjectName] = useState<string>("");
  const { name: userName } = useGetUser();
  const { programId, projectId: projectIdFromParams, id } = useParams();
  const projectId = projectIdFromParams || id;
  const location = useLocation();
  const currentPath = location.pathname;

  const { data: ProjectData, isLoading } = useGetProjectByIdQuery(
    projectId as string,
    { skip: !projectId },
  );
  useEffect(() => {
    if (projectId && !isLoading && ProjectData) {
      setProjectName(ProjectData?.data?.project.name);
    }
  }, [projectId, ProjectData, isLoading]);
  const ClientSidebarGroups = getClientSidebarItems();
  const allRoutes = ClientSidebarGroups.flatMap((group) => group.items);

  // Determine current route
  let currentRoute = allRoutes.find((route) => {
    // Match exact path or any child path
    if (route.children) {
      return route.children.some(
        (child) => `${route.path}/${child.path}` === currentPath,
      );
    }
    return route.path === currentPath;
  });

  // Special case for Program Overview: map to All Program
  const showProgramOverviewBreadcrumb = currentPath.startsWith(
    "/client-panel/all-program/program-overview/",
  );
  if (showProgramOverviewBreadcrumb) {
    currentRoute = allRoutes.find(
      (r) => r.path === "/client-panel/all-program",
    );
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    programName: string;
    id: string;
  }>({ programName: "", id: "" });
  const [successOpen, setSuccessOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [, setIsDropdownOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const isEmployeePage = currentPath.includes("/employee");
  const isHighwayExpansionPage = currentPath.includes(
    "/highway-expansion/all-highway",
  );
  const isAllProgramPage = currentPath === "/client-panel/all-program";
  const isProgramOverviewPage =
    currentPath.includes("/all-program/program-overview/") &&
    !currentPath.includes("/project-details/");
  const isProjectDetailsPage = currentPath.includes("/project-details/");
  const isProjectReviewPage = currentPath.includes(
    "/client-panel/project-review",
  );
  const isProjectBuilderPage = currentPath.includes(
    "/client-panel/project-builder",
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isPreview, isPublished } = useAppSelector(
    (state) => state.chartSlice,
  );

  useEffect(() => {
    setIsEmployeeModalOpen(false);
    setIsDropdownOpen(false);
  }, [currentPath]);

  const handleDropdownClick = (item: string) => {
    if (item === "Create Program") setActiveModal(item);
    setIsDropdownOpen(false);
  };

  const handleProgramSuccess = ({
    programName,
    id,
  }: {
    programName: string;
    id: string;
  }) => {
    setActiveModal(null);
    setSuccessData({ programName, id });
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
          {/* <CreateProjectModal
            open={isProjectModalOpen}
            programId={programId as string}
            onClose={() => setIsProjectModalOpen(false)}
          /> */}
          {isProjectModalOpen && (
            <CreateProject
              programId={programId as string}
              onClose={() => setIsProjectModalOpen(false)}
            />
          )}
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
              setSuccessData({
                programName: projectName || "New Project",
                id: "",
              });
              setSuccessOpen(true);
            }}
          />
        </>
      );

    if (isProjectReviewPage) {
      return (
        <PrimaryButton
          title="Create Support Ticket"
          leftIcon={<Plus />}
          type="Primary"
          onClick={() => navigate("/client-panel/help/support/create-tickets")}
        />
      );
    }

    if (isProjectBuilderPage) {
      if (isPreview || isPublished) {
        return (
          <div className="flex gap-4">
            <PrimaryButton
              title="Download CSV"
              leftIcon={<Download />}
              type="Primary"
              onClick={() => {
                // Trigger CSV download event
                window.dispatchEvent(
                  new CustomEvent("download-project-config"),
                );
              }}
            />
            <PrimaryButton
              title="Back to Editor"
              type="Outline"
              onClick={() => {
                dispatch(setIsPreview(false));
                dispatch(setIsPublished(false));
              }}
            />
          </div>
        );
      }
      return (
        <div className="flex gap-3">
          <PrimaryButton
            title="Preview"
            type="Outline"
            onClick={() => dispatch(setIsPreview(true))}
          />
          <PrimaryButton
            title="Save as Draft"
            type="Outline"
            onClick={() => {
              // Handle save as draft logic if needed
              toast.success("Project saved as draft");
            }}
          />
          <PrimaryButton
            title="Publish"
            type="Primary"
            onClick={() => dispatch(setIsPublished(true))}
          />
        </div>
      );
    }

    return (
      <>
        {/* <PrimaryButton
          title="Quick Action"
          leftIcon={<Plus />}
          rightIcon={<ChevronDown />}
          type="Primary"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        /> */}
        <AnimatePresence>
          {/* {isDropdownOpen && ( */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className=""
          >
            {DROPDOWN_ITEMS.map((item) => (
              <PrimaryButton
                title={item}
                leftIcon={<Plus />}
                type="Primary"
                onClick={() => handleDropdownClick(item)}
              />
              // <button
              //   key={index}

              //   className="w-full text-left px-4 py-4 rounded-md hover:bg-gray-800 border border-gray-300 text-gray-700 hover:text-white mb-2 last:mb-0 cursor-pointer duration-300"
              // >
              //   {item}
              // </button>
            ))}
          </motion.div>
          {/* )} */}
        </AnimatePresence>
      </>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center py-5 justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <SidebarTrigger className="md:hidden shrink-0" />
          {currentPath === "/client-panel" && (
            <div className="min-w-0">
              <h1 className="text-2xl md:text-[32px] font-semibold truncate">
                Good Morning 👋, {userName || name}
              </h1>
              <p className="text-sm md:text-base text-gray-500 truncate">
                This is dashboard overview of Acme Corporation
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-[200px] order-3 lg:order-2 w-full lg:w-auto">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-4 lg:gap-6 relative order-2 lg:order-3 ml-auto lg:ml-0">
          <PrimaryButton
            leftIcon={<Bell className="text-xl md:text-2xl" />}
            type="Outline"
            onClick={() => setIsNotificationOpen(true)}
            className="p-2 md:p-3"
          />
          <NotificationModal
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />

          <div className="hidden sm:block">
            <PrimaryButton
              title="Last 1 Week"
              leftIcon={<CalendarDays className="size-4 md:size-5" />}
              rightIcon={<ChevronDown className="size-4 md:size-5" />}
              type="Outline"
            />
          </div>

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
              programName={successData.programName}
              redirectPath={`/client-panel/program-overview/${successData?.id}`}
            />
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="overflow-x-auto no-scrollbar py-1">
        <Breadcrumb className="my-2 min-w-max">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/client-panel">Home</Link>
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
                          { className: "w-4 h-4" },
                        )}
                      {currentRoute.name}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {showProgramOverviewBreadcrumb && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link
                          to={`/client-panel/all-program/program-overview/${programId}`}
                          className="text-[#356DF0]"
                        >
                          Program Overview
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}

                {isProjectDetailsPage && projectName && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-[#356DF0]">
                        {projectName}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default ClientDashboardHeader;
