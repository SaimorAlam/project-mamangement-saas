/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  cloneElement,
  useState,
  useMemo,
  isValidElement,
  ReactElement,
} from "react";
import {
  Bell,
  Download,
  Eye,
  FileText,
  Megaphone,
  Radio,
  Undo2,
  Upload,
} from "lucide-react";
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
import { getStaffManagerSidebarItems } from "./staffManagerSidebarItem";
import PrimaryButton from "@/common/PrimaryButton";
import NotificationModalNew from "@/components/staffManager/NotificationModalNew";
import { useNotification } from "@/context/NotificationContext";
import GlobalSearch from "@/components/staffManager/GlobalSearch";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  setIsPreview,
  setIsPublished,
} from "@/store/Slices/ChartSlice/ChartSlice";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { useLazyGetAllTheLeafChartQuery } from "@/store/Api/ChartApi/ChartApi";
import {
  useEditSubmissionMutation,
} from "@/store/Api/staffManagerApi/StaffManagerApi";

const StaffManagerDashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const currentPath = location.pathname;
  const locationState = location.state as {
    submissionId?: string;
    employeeName?: string;
    fromReview?: boolean;
  } | null;

  const { unreadCount } = useNotification();

  // ── Redux chart state (for project-builder) ────────────────────────────────
  const { isPreview, isPublished } = useAppSelector(
    (state) => state.chartSlice
  );
  const projectIdFromRedux = useAppSelector(
    (state) => state.chartSlice.projectId
  );

  // ── Extract projectId directly from the URL (works from any nesting level) ──
  const projectIdFromUrl = useMemo(() => {
    const match = currentPath.match(/\/project-details\/([^/]+)/);
    return match?.[1] ?? null;
  }, [currentPath]);

  // Active projectId (from URL or Redux for project-builder)
  const projectId = projectIdFromUrl || projectIdFromRedux;

  // ── Page-type detection ────────────────────────────────────────────────────
  const isPage = useMemo(() => {
    const p = currentPath;
    // project-builder root or its sub-pages (but NOT /project-builder/project-details/:id)
    const isOnProjectBuilder = p.includes("/staff-manager-panel/project-builder");
    const isOnProjectBuilderPublish = p.includes("/project-builder/publish");
    const isOnProjectBuilderFileUpload = p.includes("/project-builder/file-upload");
    // A pure project-details page (from any flow)
    const isOnProjectDetails =
      (p.includes("/projects/project-details/") ||
        (p.includes("/all-program/") && p.includes("/project-details/")) ||
        p.includes("/project-builder/project-details/"));
    // Project builder root only — not sub-pages or project-details under it
    const isOnProjectBuilderRoot =
      isOnProjectBuilder &&
      !isOnProjectBuilderPublish &&
      !isOnProjectBuilderFileUpload &&
      !isOnProjectDetails;

    return {
      projectDetails: isOnProjectDetails,
      projectBuilder: isOnProjectBuilderRoot,
      projectBuilderPublish: isOnProjectBuilderPublish,
      projectBuilderFileUpload: isOnProjectBuilderFileUpload,
      // Only show Return/GoLive when manager came from review view
      projectReviewDetails: isOnProjectDetails && !!locationState?.fromReview,
    };
  }, [currentPath, locationState]);

  // ── Fetch project (name + status + programId) ──────────────────────────────
  const { data: projectData } = useGetProjectByIdQuery(projectId as string, {
    skip: !projectId,
  });
  const projectName = projectData?.data?.project?.name;
  const projectStatus = projectData?.data?.project?.status;
  const programId =
    projectData?.data?.project?.program?.id ??
    projectData?.data?.project?.programId ??
    null;

  // ── Navigate to Upload Submission (with or without pre-filled IDs) ──────────
  const handleUploadSubmission = () => {
    if (projectIdFromUrl && programId) {
      navigate(
        `/staff-manager-panel/projects/upload-submission?projectId=${projectIdFromUrl}&programId=${programId}`
      );
    } else {
      navigate("/staff-manager-panel/projects/upload-submission");
    }
  };

  // ── Status badge colour helper ─────────────────────────────────────────────
  const statusColor = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "active" || s === "live") return "bg-green-100 text-green-700";
    if (s === "draft") return "bg-yellow-100 text-yellow-700";
    if (s === "pending") return "bg-orange-100 text-orange-700";
    if (s === "completed") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-600";
  };

  // ── Chart download (mirrors client / employee panel logic) ─────────────────
  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();

  const handleDownloadCharts = async () => {
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }
    const toastId = toast.loading("Downloading charts…");
    try {
      const res = await getAllTheLeafChart(projectId as string).unwrap();
      const groups = res?.data || [];
      const allCharts = groups.flatMap((group: any) => group.charts || []);

      if (allCharts.length === 0) {
        toast.error("No chart data found to download", { id: toastId });
        return;
      }

      let templateAOA: any[][] = [];
      for (const node of allCharts) {
        let xAxis = node.xAxis;
        if (typeof xAxis === "string") {
          try { xAxis = JSON.parse(xAxis); } catch { /* ignore */ }
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

      const getUniqueSheetName = (label: string, id: string) => {
        let baseName = (label || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim();
        const idSuffix = id ? `_${id.slice(-8)}` : "";
        if (baseName.length + idSuffix.length > 31)
          baseName = baseName.substring(0, 31 - idSuffix.length);
        const combinedName = baseName + idSuffix;
        let uniqueName = combinedName;
        let counter = 1;
        while (usedNames.has(uniqueName.toLowerCase())) {
          const suffix = `_${counter}`;
          uniqueName =
            combinedName.substring(0, Math.min(combinedName.length, 31 - suffix.length)) +
            suffix;
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
          try { xAxis = JSON.parse(xAxis); } catch { /* ignore */ }
        }
        if (Array.isArray(xAxis) && xAxis.length > 1 && Array.isArray(xAxis[0])) {
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
              (node.xAxis && Array.isArray(node.xAxis) && !Array.isArray(node.xAxis[0])
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
        toast.error("No valid chart structure found to generate Excel", { id: toastId });
        return;
      }

      const filenameIds =
        ids.length > 5 ? ids.slice(0, 5).join("_") + "_more" : ids.join("_");
      XLSX.writeFile(wb, `${projectName || "Project"}_Template_${filenameIds}.xlsx`);
      toast.success("Excel template downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Excel download failed", error);
      toast.error("Failed to download Excel", { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  // ── Submission status update (Return / Go Live) ────────────────────────────
  const [editSubmission, { isLoading: isUpdatingStatus }] = useEditSubmissionMutation();

  const handleUpdateStatus = async (status: "REJECTED" | "APPROVED") => {
    const submissionId = locationState?.submissionId;
    if (!submissionId) {
      toast.error("Submission ID not found. Please navigate from Project Review.");
      return;
    }
    const toastId = toast.loading(
      status === "APPROVED" ? "Approving submission…" : "Returning for edit…"
    );
    try {
      await editSubmission({ submissionId, action: status }).unwrap();
      toast.success(
        status === "APPROVED"
          ? "Submission approved and project is now Live!"
          : "Submission returned for edit.",
        { id: toastId }
      );
      navigate("/staff-manager-panel/project-review");
    } catch {
      toast.error("Failed to update submission status.", { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  // ── Sidebar / breadcrumb ──────────────────────────────────────────────────
  const allRoutes = useMemo(
    () => getStaffManagerSidebarItems().flatMap((group) => group.items),
    []
  );

  const userName = localStorage.getItem("userName");
  const name = localStorage.getItem("name");

  const breadcrumbData = useMemo(() => {
    const items: Array<{
      label: string;
      path?: string;
      icon?: React.ReactNode;
      isPage?: boolean;
    }> = [{ label: "Home", path: "/staff-manager-panel" }];

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

    // Extra breadcrumb when on project-details from project-review
    if (isPage.projectReviewDetails) {
      items.push({
        label: "Project Review",
        path: "/staff-manager-panel/project-review",
      });
    } else if (isPage.projectDetails) {
      items.push({
        label: "Projects",
        path: "/staff-manager-panel/projects",
      });
    }

    if (isPage.projectDetails && projectName) {
      items.push({ label: projectName, isPage: true });
    }

    return items;
  }, [currentPath, allRoutes, isPage, projectName]);

  return (
    <div className="flex flex-col gap-2 py-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        {/* Greeting / Project Title */}
        <div className="flex items-center gap-4 min-w-0">
          <SidebarTrigger className="md:hidden shrink-0" />
          <div className="min-w-0">
            {isPage.projectDetails && projectName ? (
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
                <h1 className="text-2xl md:text-[32px] font-semibold truncate">
                  Good Afternoon {userName || name}, 👋
                </h1>
                <p className="text-sm md:text-base text-gray-500 truncate">
                  This is dashboard overview of Acme Corporation
                </p>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <GlobalSearch />

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
          <NotificationModalNew
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />

          {/* ── Project Builder buttons (same as client panel) ─────────────── */}
          {isPage.projectBuilder && (
            <>
              {isPreview || isPublished ? (
                <>
                  <PrimaryButton
                    title="Import CSV"
                    type="Outline"
                    leftIcon={<Upload />}
                    onClick={() =>
                      navigate("/staff-manager-panel/project-builder/file-upload")
                    }
                  />
                  <PrimaryButton
                    leftIcon={<Download />}
                    title="Download CSV"
                    type="Primary"
                    onClick={handleDownloadCharts}
                  />
                </>
              ) : (
                <>
                  <PrimaryButton
                    leftIcon={<Eye className="text-2xl" />}
                    title="Preview"
                    type={"Outline"}
                    onClick={() => dispatch(setIsPreview(true))}
                  />
                  <PrimaryButton
                    leftIcon={<FileText className="text-2xl" />}
                    title="Save Draft"
                    type={"Outline"}
                    onClick={() => toast.success("Project saved as draft")}
                  />
                  <PrimaryButton
                    leftIcon={<Megaphone className="text-2xl" />}
                    title="Publish"
                    type={"Primary"}
                    onClick={() => {
                      dispatch(setIsPublished(true));
                      navigate("/staff-manager-panel/project-builder/publish");
                    }}
                  />
                </>
              )}
            </>
          )}

          {/* ── Project-details buttons (download + upload submission) ─────────────── */}
          {isPage.projectDetails && !isPage.projectBuilder && (
            <>
              <PrimaryButton
                leftIcon={<Download />}
                type="Primary"
                onClick={handleDownloadCharts}
              />
              <PrimaryButton
                leftIcon={<Upload />}
                type="Primary"
                onClick={handleUploadSubmission}
              />
            </>
          )}

          {/* ── Upload Submission on non-project-details pages ────────────────── */}
          {!isPage.projectDetails && !isPage.projectBuilder && (
            <PrimaryButton
              leftIcon={<Upload />}
              title="Upload Submission"
              type="Primary"
              onClick={handleUploadSubmission}
            />
          )}

          {/* ── Review-specific: Return for Edit & Go Live ───────────────── */}
          {isPage.projectReviewDetails && (
            <>

              <PrimaryButton
                leftIcon={<Undo2 className="text-2xl" />}
                className="bg-red-700 hover:bg-red-800 border-none"
                title="Send Back"
                type="Primary"
                onClick={() => handleUpdateStatus("REJECTED")}
                disabled={isUpdatingStatus}
              />
              <PrimaryButton
                leftIcon={<Radio className="text-2xl" />}
                className="bg-green-700 hover:bg-green-800"
                title="Go Live"
                type="Primary"
                onClick={() => handleUpdateStatus("APPROVED")}
                disabled={isUpdatingStatus}
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

export default StaffManagerDashboardHeader;
