import { useState, useEffect } from "react";
import ProjectWidget from "@/common/Charts/CompletedCharts/Widgets/ProjectWidget";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useLocation } from "react-router-dom";
import {
  setSelectedWidgets,
  setIsPreview,
  setIsPublished,
  setProjectId,
  setProgramId,
  resetChartState,
} from "@/store/Slices/ChartSlice/ChartSlice";
import { toast } from "sonner";
import ProjectDashboardView from "./Components/ProjectDashboardView";

const ClientProjectBuilder = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const isProgramBuilder = pathname.split("/")[2] === "program-builder";

  const {
    projectId,
    isPreview,
    isPublished,
    widgetConfigs,
    selectedWidgets,
  } = useAppSelector((state) => state.chartSlice);
  const [activeWidget, setActiveWidget] = useState("KPI widget");

  useEffect(() => {
    dispatch(setIsPreview(false));
    dispatch(setIsPublished(false));
  }, [dispatch]);

  const location = useLocation();
  const locationState = location.state as {
    projectId?: string;
    programId?: string;
  } | null;

  // Reset state when builder type changes & Pick up IDs from location state
  useEffect(() => {
    dispatch(resetChartState());

    if (locationState?.projectId) {
      dispatch(setProjectId(locationState.projectId));
    }
    if (locationState?.programId) {
      dispatch(setProgramId(locationState.programId));
    }
  }, [isProgramBuilder, dispatch, locationState?.projectId, locationState?.programId]);
// Removed redundant useEffect since we'll handle it inside the isProgramBuilder one if needed or just initialize properly

  const handleWidgetSelect = (widgetId: string) => {
    if (widgetId) {
      const newSelected = selectedWidgets.includes(widgetId)
        ? selectedWidgets.filter((id) => id !== widgetId)
        : [...selectedWidgets, widgetId];
      dispatch(setSelectedWidgets(newSelected));
      setActiveWidget(widgetId);
    }
  };

  const handleWidgetDelete = (widgetId: string) => {
    // const toastId = toast.loading("Deleting widget...");
    dispatch(
      setSelectedWidgets(selectedWidgets.filter((id) => id !== widgetId)),
    );
    // toast.success("Widget deleted successfully", { id: toastId });
  };

  useEffect(() => {
    const handleDownload = () => {
      const headers = ["Widget ID", "Configuration"];
      const rows = selectedWidgets.map((id) => {
        const config = widgetConfigs[id] || "Default Configuration";
        const configStr =
          typeof config === "string"
            ? config
            : JSON.stringify(config).replace(/\t/g, " ");
        return [id, configStr];
      });

      const csvContent =
        "data:text/csv;charset=utf-8," +
        headers.join("\t") +
        "\n" +
        rows.map((e) => e.join("\t")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "project_configuration.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Configuration downloaded successfully");
    };

    window.addEventListener("download-project-config", handleDownload);
    return () =>
      window.removeEventListener("download-project-config", handleDownload);
  }, [selectedWidgets, widgetConfigs]);

  const [hiddenDefaultWidgets, setHiddenDefaultWidgets] = useState<string[]>(
    [],
  );

  const handleDefaultDelete = (widgetId: string) => {
    setHiddenDefaultWidgets((prev) => [...prev, widgetId]);
    toast.success("Widget removed");
  };

  const handleDefaultCopy = (widgetName: string) => {
    navigator.clipboard.writeText(`Data for ${widgetName}`);
    toast.success(`${widgetName} data copied to clipboard`);
  };

  const isPreviewOrPublished = isPreview || isPublished;

  return (
    <div className={`flex gap-6 ${isPreviewOrPublished ? "flex-col" : ""}`}>
      {!isPreviewOrPublished && (
        <ProjectWidget
          onWidgetSelect={handleWidgetSelect}
          selectedWidgets={selectedWidgets}
        />
      )}
      <ProjectDashboardView
        projectId={projectId as string}
        isProgramBuilder={isProgramBuilder}
        isPreviewOrPublished={isPreviewOrPublished}
        selectedWidgets={selectedWidgets}
        activeWidget={activeWidget}
        hiddenDefaultWidgets={hiddenDefaultWidgets}
        handleDefaultDelete={handleDefaultDelete}
        handleDefaultCopy={handleDefaultCopy}
        handleWidgetDelete={handleWidgetDelete}
      />
    </div>
  );
};

export default ClientProjectBuilder;
