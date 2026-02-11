/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useEffect,
  cloneElement,
  ReactElement,
  isValidElement,
} from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import SearchBar from "@/components/client/SearchBar";
import PrimaryButton from "@/common/PrimaryButton";
import CreateProgramModal from "@/components/client/AllProgram/CreateProgramModal";
import SuccessModal from "@/components/client/SuccessModal";
import NotificationModal from "@/components/client/NotificationModal";
import { toast } from "sonner";
import AddEmployeeModal from "@/components/client/Employee/AddEmployeeModal";
import NewProjectModal from "@/components/client/NewProjectModal";
import ProjectSuccessModal from "./CreateProject/ProjectSuccessModal";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Plus,
  Upload,
  UserPlus,
} from "lucide-react";
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
import CreateProject from "./CreateProject/CreateProject";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  setIsPreview,
  setIsPublished,
} from "@/store/Slices/ChartSlice/ChartSlice";
import { Download } from "lucide-react";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { useLazyGetAllTheLeafChartQuery } from "@/store/Api/ChartApi/ChartApi";

interface ClientDashboardHeaderProps {
  name?: string;
}

const ClientDashboardHeader: React.FC<ClientDashboardHeaderProps> = () => {
  // const [projectName, setProjectName] = useState<string>("");

  const { programId, projectId: projectIdFromParams, id } = useParams();
  const projectIdFromState = useAppSelector(
    (state) => state.chartSlice.projectId,
  );
  console.log(projectIdFromState, "Project Id From State");
  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();
  const projectId = projectIdFromParams || id;
  const location = useLocation();
  const currentPath = location.pathname;

  // Path detection
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
  const isProjectReviewDetailsPage = currentPath.startsWith(
    "/client-panel/project-review/project-details/",
  );
  const isActivityLogPage = currentPath.includes("/client-panel/activity-log");
  const isSupportPage = currentPath.includes("/client-panel/help");
  const { data: ProjectData } = useGetProjectByIdQuery(projectId as string, {
    skip: !projectId,
  });

  const projectName = ProjectData?.data?.project?.name;

  const allRoutes = React.useMemo(() => {
    return getClientSidebarItems().flatMap((group) => group.items);
  }, []);

  const isOverviewProjectDetailsPage = currentPath.includes(
    "/client-panel/overview/project-details/",
  );

  const showProgramOverviewBreadcrumb = currentPath.startsWith(
    "/client-panel/all-program/program-overview/",
  );

  // Determine current route
  const currentRoute = React.useMemo(() => {
    let route = allRoutes.find((r) => {
      // Match exact path or any child path
      if (r.children) {
        return r.children.some(
          (child) => `${r.path}/${child.path}` === currentPath,
        );
      }
      return r.path === currentPath;
    });

    // Special case for Program Overview: map to All Program
    if (showProgramOverviewBreadcrumb) {
      route = allRoutes.find((r) => r.path === "/client-panel/all-program");
    }

    // Special case for Project Review Details: map to Project Review
    if (isProjectReviewDetailsPage) {
      route = allRoutes.find((r) => r.path === "/client-panel/project-review");
    }

    // Special case for Overview Project Details: map to Overview
    if (isOverviewProjectDetailsPage) {
      route = allRoutes.find((r) => r.path === "/client-panel");
    }

    return route;
  }, [
    allRoutes,
    currentPath,
    showProgramOverviewBreadcrumb,
    isProjectReviewDetailsPage,
    isOverviewProjectDetailsPage,
  ]);

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
  const [projectSuccessData, setProjectSuccessData] = useState<{
    projectName: string;
    projectId: string;
  } | null>(null);
  const [projectSuccessOpen, setProjectSuccessOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isPreview, isPublished } = useAppSelector(
    (state) => state.chartSlice,
  );

  useEffect(() => {
    setIsEmployeeModalOpen(false);
    setIsDropdownOpen(false);
  }, [currentPath]);

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

  const handleProjectSuccess = (projectName: string, projectId: string) => {
    setIsProjectModalOpen(false);
    setProjectSuccessData({ projectName, projectId });
    setProjectSuccessOpen(true);
  };

  const handleDownloadCSV = async () => {
    if (!projectIdFromState) {
      toast.error("Project ID is missing");
      return;
    }
    const toastId = toast.loading("Downloading...");
    try {
      const res = await getAllTheLeafChart(
        projectIdFromState as string,
      ).unwrap();
      const leafCharts = res?.data || [];

      if (leafCharts.length === 0) {
        toast.error("No data found to download", { id: toastId });
        return;
      }

      // Find template structure from first leaf chart that has data
      let templateXAxis: string[] = [];
      let templateLegends: any[] = [];

      for (const node of leafCharts) {
        let xAxis = node.xAxisValues || [];
        if (!xAxis.length && node.xAxis) {
          try {
            const parsed =
              typeof node.xAxis === "string"
                ? JSON.parse(node.xAxis)
                : node.xAxis;
            xAxis = Array.isArray(parsed) ? parsed : parsed.labels || [];
          } catch {
            /* ignore */
          }
        }

        let legends = node.legendValues || [];
        const nodeWidgets = node.widgets || node.barChart?.widgets;
        if (!legends.length && nodeWidgets?.length > 0) {
          legends = nodeWidgets.map((w: any) => ({
            label: w.legendName || w.label || "Legend",
            field: (w.legendName || w.label || "field")
              .toLowerCase()
              .replace(/\s+/g, ""),
            color: w.color || "#000000",
          }));
        }

        if (xAxis.length > 0 && legends.length > 0) {
          templateXAxis = xAxis;
          templateLegends = legends;
          break;
        }
      }

      const wb = XLSX.utils.book_new();
      const ids: string[] = [];
      const usedNames = new Set<string>();

      const getUniqueSheetName = (name: string, id: string) => {
        let baseName = (name || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim();
        const idSuffix = id ? `_${id.slice(-8)}` : "";
        if (baseName.length + idSuffix.length > 31) {
          baseName = baseName.substring(0, 31 - idSuffix.length);
        }
        const combinedName = baseName + idSuffix;
        let uniqueName = combinedName;
        let counter = 1;
        while (usedNames.has(uniqueName.toLowerCase())) {
          const suffix = `_${counter}`;
          if (combinedName.length + suffix.length > 31) {
            uniqueName = combinedName.substring(0, 31 - suffix.length) + suffix;
          } else {
            uniqueName = combinedName + suffix;
          }
          counter++;
        }
        usedNames.add(uniqueName.toLowerCase());
        return uniqueName;
      };

      leafCharts.forEach((node: any) => {
        ids.push(node.id);

        let xAxis = node.xAxisValues || [];
        if (!xAxis.length && node.xAxis) {
          try {
            const parsed =
              typeof node.xAxis === "string"
                ? JSON.parse(node.xAxis)
                : node.xAxis;
            xAxis = Array.isArray(parsed) ? parsed : parsed.labels || [];
          } catch {
            /* ignore */
          }
        }

        let legends = node.legendValues || [];
        const nodeWidgets = node.widgets || node.barChart?.widgets;
        if (!legends.length && nodeWidgets?.length > 0) {
          legends = nodeWidgets.map((w: any) => ({
            label: w.legendName || w.label || "Legend",
            field: (w.legendName || w.label || "field")
              .toLowerCase()
              .replace(/\s+/g, ""),
            color: w.color || "#000000",
          }));
        }

        // Apply template fallback
        if (!xAxis.length) xAxis = templateXAxis;
        if (!legends.length) legends = templateLegends;

        const headers = ["Label", ...legends.map((l: any) => l.label)];
        const rows = xAxis.map((label: string) => [
          label,
          ...legends.map(() => ""),
        ]);
        const data = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const sheetName = getUniqueSheetName(
          node.title || node.name || "Tier",
          node.id,
        );
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      const filename = `${projectName || "Project"}_ID_${ids.join("_")}.xlsx`;
      XLSX.writeFile(wb, filename);
      toast.success("Excel downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Excel download failed", error);
      toast.error("Failed to download Excel", { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const renderQuickActionButton = () => {
    if (isEmployeePage)
      return (
        <PrimaryButton
          title="Add Employee"
          leftIcon={<UserPlus />}
          type="Primary"
          onClick={() => setIsEmployeeModalOpen(true)}
        />
      );

    if (isAllProgramPage)
      return (
        <PrimaryButton
          title="Add Program"
          leftIcon={<Plus />}
          type="Primary"
          onClick={() => setActiveModal("Add Program")}
        />
      );

    if (isProgramOverviewPage)
      return (
        <PrimaryButton
          title="Add Project"
          leftIcon={<Plus />}
          type="Primary"
          onClick={() => setIsProjectModalOpen(true)}
        />
      );

    if (isHighwayExpansionPage)
      return (
        <PrimaryButton
          title="Add Project"
          leftIcon={<Plus />}
          type="Primary"
          onClick={() => setIsProjectModalOpen(true)}
        />
      );

    if (isProjectBuilderPage) {
      if (isPreview || isPublished) {
        return (
          <div className="flex gap-4">
            <PrimaryButton
              title="Import CSV"
              type="Outline"
              leftIcon={<Upload />}
              onClick={() => {
                navigate("/client-panel/project-builder/import-csv");
              }}
            />
            <PrimaryButton
              title="Download CSV"
              leftIcon={<Download />}
              type="Primary"
              onClick={() => {
                handleDownloadCSV();
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
    const shouldHideAddProgram =
      isProjectReviewPage ||
      isActivityLogPage ||
      isProjectDetailsPage ||
      isSupportPage;
    return (
      <>
        <div>
          {!shouldHideAddProgram && (
            <PrimaryButton
              title="Add Program"
              leftIcon={<Plus />}
              type="Primary"
              onClick={() => setActiveModal("Add Program")}
            />
          )}
        </div>
      </>
    );
  };
  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center py-5 justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <SidebarTrigger className="md:hidden shrink-0" />
          {currentPath.includes("/client-panel") && (
            <div className="min-w-0">
              <h1 className="text-2xl md:text-[32px] font-semibold truncate">
                Good Morning, 👋
              </h1>
              <p className="text-sm md:text-base text-gray-500 truncate">
                This is dashboard overview of Acme Corporation
              </p>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-[200px] grid place-content-center order-2  w-full sm:w-auto mt-2 sm:mt-0">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-4 lg:gap-6 relative order-3 lg:order-3 ml-auto lg:ml-0">
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

          {/* Activity Modals */}
          {isEmployeeModalOpen && (
            <AddEmployeeModal
              open={isEmployeeModalOpen}
              onClose={() => setIsEmployeeModalOpen(false)}
            />
          )}

          {isProjectModalOpen && isProgramOverviewPage && (
            <CreateProject
              programId={programId as string}
              onClose={() => setIsProjectModalOpen(false)}
              onSuccess={handleProjectSuccess}
            />
          )}

          {isProjectModalOpen && isHighwayExpansionPage && (
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
          )}

          {activeModal === "Add Program" && (
            <CreateProgramModal
              open
              onOpenChange={(open) => !open && setActiveModal(null)}
              onSuccess={handleProgramSuccess}
              title="Add Program"
            />
          )}

          {successData && (
            <SuccessModal
              open={successOpen}
              onOpenChange={setSuccessOpen}
              programName={successData.programName}
              redirectPath={`/client-panel/program-builder`}
            />
          )}

          {projectSuccessData && (
            <ProjectSuccessModal
              open={projectSuccessOpen}
              onOpenChange={setProjectSuccessOpen}
              projectName={projectSuccessData.projectName}
              projectId={projectSuccessData.projectId}
              programId={programId}
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
                {isProjectReviewDetailsPage && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-[#356DF0]">
                        {projectName || "Project Details"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
                {isOverviewProjectDetailsPage && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-[#356DF0]">
                        {projectName || "Project Details"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </>
            )}
            {isProjectDetailsPage && !isOverviewProjectDetailsPage && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#356DF0]">
                    {projectName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default ClientDashboardHeader;
