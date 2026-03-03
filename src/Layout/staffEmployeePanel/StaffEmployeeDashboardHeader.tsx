/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  cloneElement,
  useState,
  useMemo,
  isValidElement,
  ReactElement,
} from "react";
import { Bell, Download, Eye, FileText, Upload } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "sonner";
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
import { useGetUser } from "@/hooks/useGetUser";
import { useNotification } from "@/context/NotificationContext";
import StaffEmployeeGlobalSearch from "@/components/staffEmployee/StaffEmployeeGlobalSearch";
import StaffEmployeeNotificationModal from "@/components/staffEmployee/StaffEmployeeNotificationModal";
import { useLazyGetAllTheLeafChartQuery } from "@/store/Api/ChartApi/ChartApi";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
// import { setIsPreview } from "@/store/Slices/ChartSlice/ChartSlice";

const StaffEmployeeDashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  // Mirror client panel: read isPreview from Redux
  // const { isPreview } = useAppSelector((state) => state.chartSlice);

  const { breadcrumb } = useHeaderContext();
  const { name } = useGetUser();
  const { unreadCount } = useNotification();

  //  Detect project-details page & extract projectId 
  const projectDetailsMatch = currentPath.match(
    /\/projects\/project-details\/([^/]+)/
  );
  const projectIdFromUrl = projectDetailsMatch?.[1] ?? null;
  const isOnProjectDetails = !!projectIdFromUrl;

  //  Fetch project to get programId 
  const { data: projectData } = useGetProjectByIdQuery(
    projectIdFromUrl as string,
    { skip: !projectIdFromUrl }
  );
  const projectName = projectData?.data?.project?.name;
  const programId =
    projectData?.data?.project?.program?.id ??
    projectData?.data?.project?.programId ??
    null;

  //  Chart download (mirrors client panel logic) 
  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();

  const handleDownloadCharts = async () => {
    if (!projectIdFromUrl) {
      toast.error("Project ID is missing");
      return;
    }
    const toastId = toast.loading("Downloading charts…");
    try {
      const res = await getAllTheLeafChart(projectIdFromUrl).unwrap();
      const groups = res?.data || [];
      const allCharts = groups.flatMap((group: any) => group.charts || []);

      if (allCharts.length === 0) {
        toast.error("No chart data found to download", { id: toastId });
        return;
      }

      // Build global template from first chart that has a 2-D xAxis
      let templateAOA: any[][] = [];
      for (const node of allCharts) {
        let xAxis = node.xAxis;
        if (typeof xAxis === "string") {
          try {
            xAxis = JSON.parse(xAxis);
          } catch {
            /* ignore */
          }
        }
        if (Array.isArray(xAxis) && xAxis.length > 1 && Array.isArray(xAxis[0])) {
          templateAOA = xAxis.map((row: any[], rIdx: number) =>
            row.map((cell: any, cIdx: number) =>
              rIdx === 0 || cIdx === 0 ? cell : ""
            )
          );
          break;
        }
      }

      const wb = XLSX.utils.book_new();
      const ids: string[] = [];
      const usedNames = new Set<string>();

      const getUniqueSheetName = (sheetLabel: string, id: string) => {
        let baseName = (sheetLabel || "Sheet")
          .replace(/[:/?*[\]\\]/g, " ")
          .trim();
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
              Math.min(combinedName.length, 31 - suffix.length)
            ) + suffix;
          counter++;
        }
        usedNames.add(uniqueName.toLowerCase());
        return uniqueName;
      };

      allCharts.forEach((node: any) => {
        ids.push(node.id);
        let currentAOA: any[][] = [];

        let xAxis = node.xAxis;
        if (typeof xAxis === "string") {
          try {
            xAxis = JSON.parse(xAxis);
          } catch {
            /* ignore */
          }
        }

        if (
          Array.isArray(xAxis) &&
          xAxis.length > 1 &&
          Array.isArray(xAxis[0])
        ) {
          currentAOA = xAxis.map((row: any[], rIdx: number) =>
            row.map((cell: any, cIdx: number) =>
              rIdx === 0 || cIdx === 0 ? cell : ""
            )
          );
        } else {
          const nodeWidgets =
            node.widgets ||
            node.barChart?.widgets ||
            node.multiAxisChart?.widgets ||
            node.horizontalBarChart?.widgets ||
            node.areaChart?.widgets ||
            node.pi?.widgets ||
            [];

          if (nodeWidgets.length > 0) {
            const legends = nodeWidgets.map(
              (w: any) => w.legendName || w.label || "Legend"
            );
            const xAxisLabels =
              node.xAxisValues ||
              (node.xAxis &&
                Array.isArray(node.xAxis) &&
                !Array.isArray(node.xAxis[0])
                ? node.xAxis
                : ["Data"]);
            const headers = ["Label", ...legends];
            const rows = xAxisLabels.map((label: string) => [
              label,
              ...legends.map(() => ""),
            ]);
            currentAOA = [headers, ...rows];
          }
        }

        if (currentAOA.length === 0 && templateAOA.length > 0) {
          currentAOA = templateAOA;
        }

        if (currentAOA.length > 0) {
          const ws = XLSX.utils.aoa_to_sheet(currentAOA);
          XLSX.utils.book_append_sheet(
            wb,
            ws,
            getUniqueSheetName(node.title || node.name || "Tier", node.id)
          );
        }
      });

      if (wb.SheetNames.length === 0) {
        toast.error("No valid chart structure found to generate Excel", {
          id: toastId,
        });
        return;
      }

      // Embed ALL chart IDs in the filename (first 5 + "more" if many)
      const filenameIds =
        ids.length > 5
          ? ids.slice(0, 5).join("_") + "_more"
          : ids.join("_");
      XLSX.writeFile(
        wb,
        `${projectName || "Project"}_Template_${filenameIds}.xlsx`
      );
      toast.success("Excel template downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Excel download failed", error);
      toast.error("Failed to download Excel", { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  // ─── Navigate to Upload Submission (with or without IDs) ───────────────────
  const handleUploadSubmission = () => {
    if (projectIdFromUrl && programId) {
      navigate(
        `/staff-employee-panel/upload-submission?projectId=${projectIdFromUrl}&programId=${programId}`
      );
    } else {
      navigate("/staff-employee-panel/upload-submission");
    }
  };

  // ─── Sidebar / breadcrumb ──────────────────────────────────────────────────
  const allRoutes = useMemo(
    () => getStaffEmployeeSidebarItems().flatMap((group) => group.items),
    []
  );

  const breadcrumbData = useMemo(() => {
    const items: Array<{
      label: string;
      path?: string;
      icon?: React.ReactNode;
      isPage?: boolean;
    }> = [{ label: "Home", path: "/staff-employee-panel" }];

    let currentRoute = allRoutes.find((r) => r.path === currentPath);

    if (!currentRoute) {
      for (const route of allRoutes) {
        if (route.children) {
          const childMatch = route.children.find(
            (child) => `${route.path}/${child.path}` === currentPath
          );
          if (childMatch) {
            items.push({
              label: route.name as string,
              path: route.path as string,
              icon: route.icon,
            });
            items.push({ label: childMatch.name as string, isPage: true });
            return items;
          }
        }
      }
    }

    if (currentRoute) {
      items.push({
        label: currentRoute.name as string,
        path: currentRoute.path as string,
        icon: currentRoute.icon,
      });
    }

    // Extra breadcrumb when on project details
    if (isOnProjectDetails) {
      items.push({
        label: "Projects",
        path: "/staff-employee-panel/projects",
      });
      if (projectName) {
        items.push({ label: projectName, isPage: true });
      }
    }

    return items;
  }, [currentPath, allRoutes, isOnProjectDetails, projectName]);

  // ── Conditional button visibility ────────────────────────────────────────
  // These paths show the legacy standalone preview/save-draft (project builder page)
  const previewButtonPaths = ["/staff-employee-panel/project-builder"];
  const saveDraftButtonPaths = ["/staff-employee-panel/project-builder"];

  // ── Status badge colour helper ────────────────────────────────────────────
  const statusColor = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "active" || s === "live") return "bg-green-100 text-green-700";
    if (s === "draft") return "bg-yellow-100 text-yellow-700";
    if (s === "pending") return "bg-orange-100 text-orange-700";
    if (s === "completed") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  const projectStatus = projectData?.data?.project?.status;

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start gap-5 py-5 justify-between">
        {/* Greeting / Project Title */}
        <div className="max-w-xl flex items-center gap-4">
          <SidebarTrigger className="md:hidden shrink-0" />
          <div className="max-w-xl">
            {isOnProjectDetails && projectName ? (
              <>
                <h1 className="text-[28px] font-bold truncate">{projectName}</h1>
                {projectStatus && (
                  <span
                    className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor(projectStatus)}`}
                  >
                    {projectStatus}
                  </span>
                )}
              </>
            ) : (
              <>
                <h1 className="text-[32px] font-semibold">
                  Hi, {name ? name : "Mr./Mrs. Employee"}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-base text-gray-500">{breadcrumb}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* {!isOnProjectDetails && (
          <StaffEmployeeGlobalSearch />
        )} */}
        <StaffEmployeeGlobalSearch />

        {/* Right Controls */}
        <div className="flex items-center justify-between gap-2 relative">
          {/* Notifications */}
          <div className="relative">
            <PrimaryButton
              leftIcon={<Bell className="text-2xl" />}
              type={"Outline"}
              onClick={() => setIsOpen(true)}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <StaffEmployeeNotificationModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />

          {/* ── Project-builder-only buttons ── */}
          {previewButtonPaths.includes(currentPath) && (
            <PrimaryButton
              leftIcon={<Eye className="text-2xl" />}
              title="Preview"
              type={"Outline"}
              onClick={() => console.log("preview clicked")}
            />
          )}
          {saveDraftButtonPaths.includes(currentPath) && (
            <PrimaryButton
              leftIcon={<FileText className="text-2xl" />}
              title="Save Draft"
              type={"Outline"}
            />
          )}

          {/* ── Upload Submission (always visible except on project-details where it appears below) ── */}
          {!isOnProjectDetails && (
            <PrimaryButton
              leftIcon={<Upload className="text-2xl" />}
              title="Upload Submission"
              type="Primary"
              onClick={handleUploadSubmission}
            />
          )}
          {isOnProjectDetails && (
            <>
              {/* Preview toggle — same Redux action as client panel */}
              {/* <PrimaryButton
                title={isPreview ? "Exit Preview" : "Preview"}
                type="Outline"
                onClick={() => dispatch(setIsPreview(!isPreview))}
              /> */}
              {/* <DateRangePicker /> */}

              {/* Save as Draft — same UX as client panel */}
              <PrimaryButton
                leftIcon={<FileText className="text-2xl" />}
                title="Save as Draft"
                type="Outline"
                onClick={() => toast.success("Project saved as draft")}
              />

              {/* Download Charts */}
              <PrimaryButton
                leftIcon={<Download />}
                className="bg-green-700 hover:bg-green-800"
                type="Primary"
                onClick={handleDownloadCharts}
              />

              {/* Upload Submission */}
              <PrimaryButton
                leftIcon={<Upload className="text-2xl" />}
                title="Upload Submission"
                type="Primary"

                onClick={handleUploadSubmission}
              />
            </>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="overflow-x-auto no-scrollbar py-1">
        <Breadcrumb className="my-2 min-w-max">
          <BreadcrumbList>
            {breadcrumbData.map((item, index) => (
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
                            { className: "w-4 h-4" }
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
    </div>
  );
};

export default StaffEmployeeDashboardHeader;
