/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useEffect,
  cloneElement,
  ReactElement,
  isValidElement,
  useMemo,
} from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
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
  Plus,
  Upload,
  UserPlus,
  Download,
  Layers,
  Briefcase,
  MapPin,
  GitBranch,
  List,
  LayoutGrid,
  Clock,
  FileText,
  AlertTriangle,
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
import CreateProject from "./CreateProject/CreateProject";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  setIsPreview,
  setIsPublished,
} from "@/store/Slices/ChartSlice/ChartSlice";
import {
  useGetProjectByIdQuery,
  useGetAllProjectsQuery,
} from "@/store/Api/ProjectApi/ProjectApi";
import { useLazyGetAllTheLeafChartQuery } from "@/store/Api/ChartApi/ChartApi";
import { useGetAllProgramQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { useDebounce } from "@/hooks/useDebounce";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import FileUpload from "@/pages/client/ProjectBuilder/Components/FileUpload";
import { useGetNotificationsQuery } from "@/store/Api/NotificationApi/NotificationApi";

interface ClientDashboardHeaderProps {
  name?: string;
}

const ClientDashboardHeader: React.FC<ClientDashboardHeaderProps> = () => {
  const { programId, projectId: projectIdFromParams } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";

  const tabs = [
    { id: "gantt", name: "Gantt", icon: List },
    { id: "sheet", name: "Sheet", icon: LayoutGrid },
    { id: "dashboard", name: "Dashboard", icon: Clock },
    { id: "files", name: "Files", icon: FileText },
    { id: "raidlog", name: "Raid Log", icon: AlertTriangle },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentPath = location.pathname;

  const projectIdFromState = useAppSelector(
    (state) => state.chartSlice.projectId,
  );
  const { isPreview, isPublished } = useAppSelector(
    (state) => state.chartSlice,
  );

  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();
  const projectId = projectIdFromParams || projectIdFromState;
  // Optimized Page Type Detection
  const isPage = useMemo(() => {
    const p = currentPath;
    return {
      employee: p.includes("/employee"),
      highway: p.includes("/highway-expansion/all-highway"),
      allProgram: p === "/client-panel/all-program",
      programOverview:
        p.includes("/all-program/program-overview/") &&
        !p.includes("/project-details/"),
      projectDetails: p.includes("/project-details/"),
      projectReview: p.includes("/client-panel/project-review"),
      projectBuilder:
        p.includes("/client-panel/project-builder") &&
        !p.includes("/project-details/"),
      publish: p.includes("/project-builder/publish"),
      importCSV: p.includes("/project-builder/file-upload"),
      projectReviewDetails: p.startsWith(
        "/client-panel/project-review/project-details/",
      ),
      activityLog: p.includes("/client-panel/activity-log"),
      support: p.includes("/client-panel/help"),
      overviewProjectDetails: p.includes(
        "/client-panel/overview/project-details/",
      ),
      showProgramOverviewBreadcrumb: p.startsWith(
        "/client-panel/all-program/program-overview/",
      ),
    };
  }, [currentPath]);

  const { data: ProjectData } = useGetProjectByIdQuery(projectId as string, {
    skip: !projectId,
  });
  const projectName = ProjectData?.data?.project?.name;

  const allRoutes = useMemo(
    () => getClientSidebarItems().flatMap((group) => group.items),
    [],
  );

  // Optimized Route Mapping
  const currentRoute = useMemo(() => {
    if (isPage.showProgramOverviewBreadcrumb)
      return allRoutes.find((r) => r.path === "/client-panel/all-program");
    if (isPage.projectReviewDetails)
      return allRoutes.find((r) => r.path === "/client-panel/project-review");
    if (isPage.overviewProjectDetails)
      return allRoutes.find((r) => r.path === "/client-panel");
    if (isPage.publish || isPage.importCSV)
      return allRoutes.find((r) => r.path === "/client-panel/project-builder");

    return allRoutes.find((r) => {
      if (r.children)
        return r.children.some(
          (child) => `${r.path}/${child.path}` === currentPath,
        );
      return r.path === currentPath;
    });
  }, [allRoutes, currentPath, isPage]);

  // Optimized Breadcrumb Data Structure
  const breadcrumbData = useMemo(() => {
    const items: Array<{
      label: string;
      path?: string;
      icon?: React.ReactNode;
      isPage?: boolean;
    }> = [{ label: "Home", path: "/client-panel" }];

    if (currentRoute) {
      items.push({
        label: currentRoute?.name as string,
        path: currentRoute.path as string,
        icon: currentRoute.icon,
      });

      if (isPage.showProgramOverviewBreadcrumb) {
        items.push({
          label: "Program Overview",
          path: `/client-panel/all-program/program-overview/${programId}`,
        });
      }

      if (isPage.publish) {
        items.push({
          label: projectName as string,
          path: "/client-panel/project-builder",
        });
        items.push({ label: "Publish", isPage: true });
      } else if (isPage.importCSV) {
        items.push({
          label: projectName as string,
          path: "/client-panel/project-builder",
        });
        items.push({
          label: "Publish",
          path: "/client-panel/project-builder/publish",
        });
        items.push({ label: "Import CSV", isPage: true });
      }
    }

    // Final Project Page Identifier (Mutual Exclusion)
    const isSpecialProjectPage = isPage.publish || isPage.importCSV;
    if (isPage.projectDetails && !isSpecialProjectPage && projectName) {
      items.push({ label: projectName, isPage: true });
    }

    return items;
  }, [currentRoute, isPage, projectName, programId]);

  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    programName: string;
    id: string;
  }>({ programName: "", id: "" });
  const [successOpen, setSuccessOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectSuccessData, setProjectSuccessData] = useState<{
    projectName: string;
    projectId: string;
  } | null>(null);
  const [projectSuccessOpen, setProjectSuccessOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: allProgramsData } = useGetAllProgramQuery({});
  const { data: allProjectsData } = useGetAllProjectsQuery({});
  const { data: notificationData } = useGetNotificationsQuery({});

  const unreadCount = useMemo(() => {
    return (notificationData?.data || []).filter((n: any) => !n.isRead).length;
  }, [notificationData]);

  const statusColor = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "active" || s === "live") return "bg-green-100 text-green-600";
    if (s === "draft") return "bg-yellow-100 text-yellow-600";
    if (s === "pending") return "bg-orange-100 text-orange-600";
    if (s === "completed") return "bg-blue-100 text-blue-600";
    if (s === "in review")
      return "bg-orange-50 text-[#FFA800] border-[#FFD994]";
    return "bg-gray-100 text-gray-600";
  };

  const projectStatus = ProjectData?.data?.project?.status;

  // Search Logic
  const filteredPrograms = useMemo(() => {
    if (!debouncedSearchTerm) return [];
    const programs = allProgramsData?.data?.data || [];
    return Array.isArray(programs)
      ? programs.filter((p: any) =>
          p.programName
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()),
        )
      : [];
  }, [debouncedSearchTerm, allProgramsData]);

  const filteredProjects = useMemo(() => {
    if (!debouncedSearchTerm) return [];
    const projects =
      allProjectsData?.data?.projects?.data ||
      allProjectsData?.data?.data ||
      [];
    return Array.isArray(projects)
      ? projects.filter((p: any) =>
          p.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
        )
      : [];
  }, [debouncedSearchTerm, allProjectsData]);

  useEffect(() => {
    setIsEmployeeModalOpen(false);
  }, [currentPath]);

  // Handlers
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
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }
    const toastId = toast.loading("Downloading...");
    try {
      const res = await getAllTheLeafChart(projectId as string).unwrap();
      const groups = res?.data || [];
      // Flatten charts from all groups
      const allCharts = groups.flatMap((group: any) => group.charts || []);

      if (allCharts.length === 0) {
        toast.error("No data found to download", { id: toastId });
        return;
      }

      const wb = XLSX.utils.book_new();
      const ids: string[] = [];
      const usedNames = new Set<string>();

      const getUniqueSheetName = (name: string, id: string) => {
        let baseName = (name || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim();
        const idSuffix = id ? `_${id.slice(-8)}` : "";
        if (baseName.length + idSuffix.length > 31)
          baseName = baseName.substring(0, 31 - idSuffix.length);
        const combinedName = baseName + idSuffix;
        let uniqueName = combinedName;
        let counter = 1;
        while (usedNames.has(uniqueName.toLowerCase())) {
          const suffix = `_${counter}`;
          uniqueName =
            combinedName.substring(
              0,
              Math.min(combinedName.length, 31 - suffix.length),
            ) + suffix;
          counter++;
        }
        usedNames.add(uniqueName.toLowerCase());
        return uniqueName;
      };

      allCharts.forEach((node: any) => {
        ids.push(node.id);
        let currentAOA: any[][] = [];

        // 1. Normalize xAxis data
        let xAxis = node.xAxis;
        if (typeof xAxis === "string") {
          try {
            xAxis = JSON.parse(xAxis);
          } catch {
            /* ignore */
          }
        }

        const rawData =
          xAxis && !Array.isArray(xAxis) && xAxis.labels ? xAxis.labels : xAxis;

        // 2. Extract Data Structure
        if (Array.isArray(rawData) && rawData.length > 0) {
          if (Array.isArray(rawData[0])) {
            // It's a 2D array (table-like)
            // Check if Row 0 is a header (all items are strings)
            const isHeader = rawData[0].every(
              (item: any) => typeof item === "string",
            );

            // Normalize Header
            const headerRow = isHeader ? [...rawData[0]] : [];
            if (isHeader) {
              headerRow[0] = "Label";
            } else {
              // If row 0 is data, synthesize header from legends
              const legends = (
                node.widgets ||
                node.barChart?.widgets ||
                node.splineChart?.widgets ||
                node.areaChart?.widgets ||
                node.multiAxisChart?.widgets ||
                []
              ).map((w: any) => w.legendName || "Legend");
              headerRow.push(
                "Label",
                ...(legends.length > 0
                  ? legends
                  : Array(rawData[0].length - 1).fill("Legend")),
              );
            }

            const dataRows = isHeader ? rawData.slice(1) : rawData;
            const rows = dataRows.map((row: any[]) =>
              row.map((cell: any, cIdx: number) => {
                if (cIdx === 0) return cell; // Keep label
                return cell !== undefined && cell !== null ? cell : 0;
              }),
            );

            currentAOA = [headerRow, ...rows];
          } else {
            // It's a flat array of labels
            const isHeader =
              typeof rawData[0] === "string" && isNaN(Number(rawData[0]));

            const legends = (
              node.widgets ||
              node.barChart?.widgets ||
              node.splineChart?.widgets ||
              node.areaChart?.widgets ||
              node.multiAxisChart?.widgets ||
              []
            ).map((w: any) => w.legendName || "Legend");
            if (legends.length === 0) legends.push("Value");

            const headers = ["Label", ...legends];
            // Skip index 0 only if it's a header
            const dataLabels = isHeader ? rawData.slice(1) : rawData;

            const rows = dataLabels
              .filter((lbl: any) => String(lbl || "").trim() !== "")
              .map((lbl: any) => [String(lbl || ""), ...legends.map(() => 0)]);

            currentAOA = [headers, ...rows];
          }
        } else {
          // 3. Last resort fallback from widgets
          const nodeWidgets =
            node.widgets ||
            node.barChart?.widgets ||
            node.splineChart?.widgets ||
            node.areaChart?.widgets ||
            [];
          const legends = nodeWidgets.map((w: any) => w.legendName || "Legend");
          if (legends.length > 0) {
            const headers = ["Label", ...legends];
            currentAOA = [headers, ["Sample Entry", ...legends.map(() => 0)]];
          }
        }

        if (currentAOA.length > 0) {
          const ws = XLSX.utils.aoa_to_sheet(currentAOA);
          XLSX.utils.book_append_sheet(
            wb,
            ws,
            getUniqueSheetName(node.title || node.name || "Tier", node.id),
          );
        }
      });

      if (wb.SheetNames.length === 0) {
        toast.error("No valid chart structure found to generate Excel", {
          id: toastId,
        });
        return;
      }

      const filenameIds =
        ids.length > 5 ? ids.slice(0, 5).join("_") + "_more" : ids.join("_");
      XLSX.writeFile(
        wb,
        `${projectName || "Project"}_Data_${filenameIds}.xlsx`,
      );
      toast.success("Excel downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Excel download failed", error);
      toast.error("Failed to download Excel", { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const renderQuickActionButton = () => {
    if (isPage.employee)
      return (
        <PrimaryButton
          title="Add Employee"
          leftIcon={<UserPlus />}
          type="Primary"
          onClick={() => setIsEmployeeModalOpen(true)}
        />
      );
    if (isPage.allProgram)
      return (
        <PrimaryButton
          title="Add Program"
          leftIcon={<Plus />}
          type="Primary"
          onClick={() => setActiveModal("Add Program")}
        />
      );
    if (isPage.programOverview || isPage.highway)
      return (
        <PrimaryButton
          title="Add Project"
          leftIcon={<Plus />}
          type="Primary"
          onClick={() => setIsProjectModalOpen(true)}
        />
      );

    // if (isPage.projectDetails) {
    //   return (

    //   );
    // }

    if (isPage.projectBuilder) {
      if (isPage.importCSV) return null;
      if (isPreview || isPublished) {
        return (
          <div className="flex gap-4">
            <PrimaryButton
              title="Import CSV"
              type="Outline"
              leftIcon={<Upload />}
              onClick={() =>
                navigate("/client-panel/project-builder/file-upload")
              }
            />
            <PrimaryButton
              title="Download CSV"
              leftIcon={<Download />}
              type="Primary"
              onClick={handleDownloadCSV}
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
            onClick={() => toast.success("Project saved as draft")}
          />
          <PrimaryButton
            title="Publish"
            type="Primary"
            onClick={() => {
              dispatch(setIsPublished(true));
              navigate("/client-panel/project-builder/publish");
            }}
          />
        </div>
      );
    }

    const shouldHideAddProgram =
      isPage.projectReview ||
      isPage.activityLog ||
      isPage.projectDetails ||
      isPage.support;
    return !shouldHideAddProgram ? (
      <PrimaryButton
        title="Add Program"
        leftIcon={<Plus />}
        type="Primary"
        onClick={() => setActiveModal("Add Program")}
      />
    ) : null;
  };

  return (
    <div>
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-center py-5 justify-between gap-4 lg:gap-0">
        <div className="flex items-center gap-4 w-full lg:w-auto min-w-0">
          <SidebarTrigger className="md:hidden shrink-0" />
          {currentPath.includes("/client-panel") && (
            <div className="min-w-0">
              {isPage.projectDetails && projectName ? (
                <>
                  <div className="flex items-center gap-3">
                    <h1 className="text-[28px] md:text-[32px] font-bold truncate">
                      {projectName}
                    </h1>
                    {projectStatus && (
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-xs font-semibold capitalize border ${statusColor(projectStatus)}`}
                      >
                        {projectStatus}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-gray-500">
                    <MapPin className="w-4 h-4 shrink-0 text-[#98A2B3]" />
                    <p className="text-sm md:text-[15px] truncate border-b border-blue-200/50 pb-0.5 leading-tight text-[#475467]">
                      25 Union Square W, New York, NY 10003, USA
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-2xl md:text-[32px] font-semibold truncate">
                    Good Morning, 👋
                  </h1>
                  <p className="text-sm md:text-base text-gray-500 truncate">
                    This is dashboard overview of Acme Corporation
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 w-full lg:w-auto flex justify-center mt-2 lg:mt-0 relative group px-0 lg:px-4">
          {isPage.projectDetails ? (
            <div className="flex bg-white items-center border border-gray-200 rounded-lg space-x-1 p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSearchParams({ tab: tab.id })}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer rounded-lg ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              {searchTerm && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-[400px] overflow-y-auto z-50 py-2">
                  {filteredPrograms.length === 0 &&
                  filteredProjects.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No results found
                    </div>
                  ) : (
                    <>
                      {filteredPrograms.length > 0 && (
                        <div className="mb-2">
                          <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Programs
                          </h3>
                          {filteredPrograms.map((program: any) => (
                            <div
                              key={program.id}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                              onClick={() => {
                                setSearchTerm("");
                                navigate(
                                  `/client-panel/all-program/program-overview/${program.id}`,
                                );
                              }}
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <Layers className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {program.programName || program.name}
                                </p>
                                <p className="text-xs text-gray-500">Program</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {filteredProjects.length > 0 && (
                        <div>
                          <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Projects
                          </h3>
                          {filteredProjects.map((project: any) => (
                            <div
                              key={project.id}
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors"
                              onClick={() => {
                                setSearchTerm("");
                                navigate(
                                  `/client-panel/all-program/program-overview/${project.programId}/project-details/${project.id}`,
                                );
                              }}
                            >
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                <Briefcase className="w-4 h-4 text-indigo-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {project.name}
                                </p>
                                <p className="text-xs text-gray-500">Project</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-4 lg:gap-6 relative w-full lg:w-auto mt-2 lg:mt-0">
          <div className="relative">
            <PrimaryButton
              leftIcon={<Bell className="text-xl md:text-2xl" />}
              type="Outline"
              onClick={() => setIsNotificationOpen(true)}
              className="p-2 md:p-3"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
          {isPage.projectDetails && (
            <div className="flex items-center gap-2 md:gap-4">
              <PrimaryButton
                leftIcon={<Upload className="text-xl md:text-2xl" />}
                type="Outline"
                onClick={() => setIsUploadModalOpen(true)}
                className="p-2 md:p-3"
              />
              <PrimaryButton
                // title="Download CSV"
                leftIcon={<Download className="text-xl md:text-2xl" />}
                type="Primary"
                onClick={handleDownloadCSV}
                className="p-2 md:p-3"
              />
              <PrimaryButton
                leftIcon={<GitBranch className="text-xl md:text-2xl" />}
                title="Show Version"
                type="Primary"
                onClick={() => console.log("Show Version clicked")}
                className="hidden md:flex"
              />
            </div>
          )}
          <NotificationModal
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
          />
          <div className="relative">{renderQuickActionButton()}</div>
        </div>
      </div>

      {/* Optimized Breadcrumb Section */}
      <div className="overflow-x-auto no-scrollbar py-1">
        <Breadcrumb className="my-2 min-w-max">
          <BreadcrumbList>
            {breadcrumbData.map((item, index: number) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.isPage ? (
                    <BreadcrumbPage className="text-[#356DF0]">
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        to={item.path || "#"}
                        className={
                          index > 0
                            ? "text-[#356DF0] font-semibold flex items-center gap-1"
                            : ""
                        }
                      >
                        {item.icon &&
                          isValidElement(item.icon) &&
                          cloneElement(
                            item.icon as ReactElement<{ className?: string }>,
                            { className: "w-4 h-4" },
                          )}
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbData.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Modals */}
      {isEmployeeModalOpen && (
        <AddEmployeeModal
          open={isEmployeeModalOpen}
          onClose={() => setIsEmployeeModalOpen(false)}
        />
      )}
      {isProjectModalOpen && isPage.programOverview && (
        <CreateProject
          programId={programId as string}
          onClose={() => setIsProjectModalOpen(false)}
          onSuccess={handleProjectSuccess}
        />
      )}
      {isProjectModalOpen && isPage.highway && (
        <NewProjectModal
          open={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
          onSuccess={(name: string) => {
            setIsProjectModalOpen(false);
            setSuccessData({ programName: name || "New Project", id: "" });
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
      {successOpen && (
        <SuccessModal
          open={successOpen}
          onOpenChange={setSuccessOpen}
          programName={successData.programName}
          redirectPath={`/client-panel/program-builder`}
        />
      )}
      {projectSuccessOpen && projectSuccessData && (
        <ProjectSuccessModal
          open={projectSuccessOpen}
          onOpenChange={setProjectSuccessOpen}
          projectName={projectSuccessData.projectName}
          projectId={projectSuccessData.projectId}
          programId={programId}
        />
      )}

      {/* Upload Dialog */}
      {isPage.projectDetails && (
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none [&>button]:right-4 [&>button]:top-4 [&>button]:bg-white [&>button]:rounded-full [&>button]:p-1">
            <FileUpload
              isModal
              projectId={projectId as string}
              onFileUpload={() => setIsUploadModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ClientDashboardHeader;
