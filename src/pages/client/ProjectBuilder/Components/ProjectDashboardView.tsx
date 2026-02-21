import { useMemo, Suspense } from "react";
import {
  useGetRootChartQuery,
  useGetProgramBuilderChartQuery,
} from "@/store/Api/ChartApi/ChartApi";
import ProjectBuilderPlaceholderChartSkeleton from "@/common/Skeleton/ProjectBuilderPlaceholderChartSkeleton";
import ChartModuleSkeleton from "@/common/Skeleton/ChartModuleSkeleton";
import { useAppSelector } from "@/hooks/useRedux";
import {
  CHART_REGISTRY,
  DoughnutChart,
  HeatmapChart,
  RadarCharts,
  ProjectStats,
  DefaultChartData,
} from "./ChartRegistry";

interface ProjectDashboardViewProps {
  projectId: string;
  isPreviewOrPublished: boolean;
  selectedWidgets: string[];
  activeWidget: string;
  hiddenDefaultWidgets: string[];
  handleDefaultDelete: (id: string) => void;
  handleDefaultCopy: (name: string) => void;
  handleWidgetDelete: (id: string) => void;
}

const ProjectDashboardView = ({
  projectId,
  isPreviewOrPublished,
  selectedWidgets,
  activeWidget,
  hiddenDefaultWidgets,
  handleDefaultDelete,
  handleDefaultCopy,
  handleWidgetDelete,
}: ProjectDashboardViewProps) => {
  const { programId } = useAppSelector((state) => state.chartSlice);

  const { data: projectsChart } = useGetRootChartQuery(projectId, {
    skip: !projectId,
  });

  const { data: programCharts } = useGetProgramBuilderChartQuery(programId, {
    skip: !programId,
  });

  const projectsChartsData = useMemo(() => {
    if (projectId) return projectsChart?.data;
    return null;
  }, [projectsChart, projectId]);

  const programChartsData = useMemo(() => {
    if (programId) return programCharts?.data?.charts;
    return null;
  }, [programCharts, programId]);

  return (
    <Suspense fallback={<ProjectBuilderPlaceholderChartSkeleton />}>
      <div
        className={`flex-1 min-w-0 flex flex-col gap-6 ${
          !isPreviewOrPublished ? "border border-gray-200 rounded-lg p-4" : ""
        } h-full mb-10 relative`}
      >
        <div
          className={`${
            isPreviewOrPublished
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6"
              : "flex flex-col gap-6"
          }`}
        >
          {projectsChartsData && projectsChartsData.length > 0 && (
            <div className={isPreviewOrPublished ? "col-span-full" : ""}>
              <DefaultChartData projectsChartsData={projectsChartsData} />
            </div>
          )}

          {programChartsData && programChartsData.length > 0 && (
            <div className={isPreviewOrPublished ? "col-span-full" : ""}>
              <DefaultChartData projectsChartsData={programChartsData} />
            </div>
          )}

          {(!projectsChartsData || projectsChartsData.length === 0) &&
            (!programChartsData || programChartsData.length === 0) &&
            selectedWidgets.length === 0 && (
              <div className={isPreviewOrPublished ? "col-span-full" : ""}>
                {!hiddenDefaultWidgets.includes("project-stats") && (
                  <ProjectStats activeWidget={activeWidget} />
                )}
                <div className="flex gap-4 mt-6">
                  {!hiddenDefaultWidgets.includes("radar-chart") && (
                    <RadarCharts
                      onDelete={() => handleDefaultDelete("radar-chart")}
                      onCopy={() => handleDefaultCopy("Radar Chart")}
                    />
                  )}
                  {!hiddenDefaultWidgets.includes("doughnut-chart") && (
                    <DoughnutChart
                      title="Doughnut Pie"
                      centerLabel="Total Visitor"
                      onDelete={() => handleDefaultDelete("doughnut-chart")}
                      onCopy={() => handleDefaultCopy("Doughnut Pie")}
                      data={[
                        {
                          name: "Paid traffic",
                          value: 65,
                          count: 12,
                          color: "#19A1E9",
                        },
                        {
                          name: "Social traffic",
                          value: 21,
                          count: 30,
                          color: "#F7AF21",
                        },
                        {
                          name: "Organic traffic",
                          value: 14,
                          count: 8,
                          color: "#10A683",
                        },
                      ]}
                    />
                  )}
                </div>
                {!hiddenDefaultWidgets.includes("heat-map-chart") && (
                  <div className="mt-6">
                    <HeatmapChart
                      onDelete={() => handleDefaultDelete("heat-map-chart")}
                      onCopy={() => handleDefaultCopy("Heat Map Chart")}
                    />
                  </div>
                )}
              </div>
            )}

          {/* Dynamic Widget Rendering */}
          {selectedWidgets.map((widgetId) => {
            // Special case for data-table which is not yet a module
            if (widgetId === "data-table") {
              return (
                <div
                  key={widgetId}
                  className="p-6 border border-gray-200 rounded-lg text-center text-gray-500"
                >
                  Data Table coming soon...
                </div>
              );
            }

            const config = CHART_REGISTRY[widgetId];
            if (!config) return null;

            const ChartComponent = config.component;

            return (
              <div
                key={widgetId}
                className={
                  isPreviewOrPublished && config.isFullWidth
                    ? "col-span-full"
                    : ""
                }
              >
                <Suspense fallback={<ChartModuleSkeleton />}>
                  <ChartComponent
                    chartName={widgetId} // Used by ChartModuleOne
                    onDelete={
                      isPreviewOrPublished
                        ? undefined
                        : () => handleWidgetDelete(widgetId)
                    }
                    isPreview={isPreviewOrPublished}
                  />
                </Suspense>
              </div>
            );
          })}
        </div>
      </div>
    </Suspense>
  );
};

export default ProjectDashboardView;
