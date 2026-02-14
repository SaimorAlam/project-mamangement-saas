/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import DoughnutChart from "@/common/Charts/DoughnutChart";
import HeatmapChart from "@/common/Charts/HeatmapChart";
import RadarCharts from "@/common/Charts/RadarChart";
import ProjectStats from "@/components/client/ProgramBuilder/ProjectStats";
import StackedBarChartModule from "@/components/client/ProjectBuilder/chartModules/StackedBarChartModule";
import LineChartModule from "@/components/client/ProjectBuilder/chartModules/LineChartModule";
import ChartModuleOne from "@/components/client/ProjectBuilder/chartModules/ChartModuleOne";
import HorizontalBarChartModule from "@/components/client/ProjectBuilder/chartModules/HorizontalBarChartModule";
import FunnelChartModule from "@/components/client/ProjectBuilder/chartModules/FunnelChartModule";
import ScatterChartModule from "@/components/client/ProjectBuilder/chartModules/ScatterChartModule";
import ParetoChartModule from "@/components/client/ProjectBuilder/chartModules/ParetoChartModule";
import WaterfallChartModule from "@/components/client/ProjectBuilder/chartModules/WaterfallChartModule";
import RadarChartModule from "@/components/client/ProjectBuilder/chartModules/RadarChartModule";
import CandleChartModule from "@/components/client/ProjectBuilder/chartModules/CandleChartModule";
import ProgressRingModule from "@/components/client/ProjectBuilder/chartModules/ProgressRingModule";
import HistogramChartModule from "@/components/client/ProjectBuilder/chartModules/HistogramChartModule";
import GaugeChartModule from "@/components/client/ProjectBuilder/chartModules/GaugeChartModule";
import BubbleChartModule from "@/components/client/ProjectBuilder/chartModules/BubbleChartModule";
import ColumnBarChartModule from "@/components/client/ProjectBuilder/chartModules/ColumnBarChartModule";
import PieChartModule from "@/components/client/ProjectBuilder/chartModules/PieChartModule";
import TreemapChartModule from "@/components/client/ProjectBuilder/chartModules/TreemapChartModule";
import CalendarHeatmapModule from "@/components/client/ProjectBuilder/chartModules/CalendarHeatmapModule";
import GanttChartNewModule from "@/components/client/ProjectBuilder/chartModules/GanttChartNewModule";
import MatrixTableChartModule from "@/components/client/ProjectBuilder/chartModules/MatrixTableChartModule";
import ComboChartModule from "@/components/client/ProjectBuilder/chartModules/ComboChartModule";
import BulletChartModule from "@/components/client/ProjectBuilder/chartModules/BulletChartModule";
import HorizontalStackedBarChartModule from "@/components/client/ProjectBuilder/chartModules/HorizontalStackedBarChartModule";
import SparkLineChartModule from "@/components/client/ProjectBuilder/chartModules/SparkLineChartModule";
import LogarithmicChartModule from "@/components/client/ProjectBuilder/chartModules/LogarithmicChartModule";
import DecompositionTreeModule from "@/components/client/ProjectBuilder/chartModules/DecompositionTreeModule";
import MarimekkoChartModule from "@/components/client/ProjectBuilder/chartModules/MarimekkoChartModule";
import BoxPlotChartModule from "@/components/client/ProjectBuilder/chartModules/BoxPlotChartModule";
import CohortAnalysisModule from "@/components/client/ProjectBuilder/chartModules/CohortAnalysisModule";
import GeographicMapModule from "@/components/client/ProjectBuilder/chartModules/GeographicMapModule";
import RagChartModule from "@/components/client/ProjectBuilder/chartModules/RagChartModule";
import RibbonChartModule from "@/components/client/ProjectBuilder/chartModules/RibbonChartModule";
import KpiModule from "@/components/client/ProjectBuilder/chartModules/KpiModule";
import DefaultChartData from "./DefaultChartData";
import { useGetRootChartQuery } from "@/store/Api/ChartApi/ChartApi";

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
  const { data: projectsChart } = useGetRootChartQuery(projectId, {
    skip: !projectId,
  });

  const projectsChartsData = useMemo(() => {
    return projectsChart?.data;
  }, [projectsChart]);

  return (
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
        {projectsChartsData && projectsChartsData.length > 0 ? (
          <div className={isPreviewOrPublished ? "col-span-full" : ""}>
            <DefaultChartData projectsChartsData={projectsChartsData} />
          </div>
        ) : (
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
          )
        )}

        {selectedWidgets.includes("kpi") && (
          <div className={isPreviewOrPublished ? "col-span-full" : ""}>
            <KpiModule
              onDelete={
                isPreviewOrPublished
                  ? undefined
                  : () => handleWidgetDelete("kpi")
              }
              isPreview={isPreviewOrPublished}
            />
          </div>
        )}

        {selectedWidgets.includes("bar-chart") && (
          <StackedBarChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("bar-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("progress-ring") && (
          <ProgressRingModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("progress-ring")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("pie-chart") && (
          <PieChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("pie-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("line-chart") && (
          <LineChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("line-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("data-table") && (
          <div className="p-6 border border-gray-200 rounded-lg text-center text-gray-500">
            Data Table coming soon...
          </div>
        )}

        {selectedWidgets.includes("horizontal-bar-chart") && (
          <HorizontalBarChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("horizontal-bar-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("heat-map-chart") && (
          <ChartModuleOne
            chartName="heat-map-chart"
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("heat-map-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("area-chart") && (
          <ChartModuleOne
            chartName="area-chart"
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("area-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("spline-area-chart") && (
          <ChartModuleOne
            chartName="spline-area-chart"
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("spline-area-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("sparklines-chart") && (
          <SparkLineChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("sparklines-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("logarithmic-chart") && (
          <LogarithmicChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("logarithmic-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("decomposition-tree") && (
          <DecompositionTreeModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("decomposition-tree")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("gauge-chart") && (
          <GaugeChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("gauge-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("histogram-chart") && (
          <HistogramChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("histogram-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("bubble-chart") && (
          <BubbleChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("bubble-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("column-chart") && (
          <ColumnBarChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("column-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("funnel-chart") && (
          <FunnelChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("funnel-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("scatter-chart") && (
          <ScatterChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("scatter-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("pareto-chart") && (
          <ParetoChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("pareto-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("waterfall-chart") && (
          <WaterfallChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("waterfall-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("radar-chart") && (
          <RadarChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("radar-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("candle-chart") && (
          <CandleChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("candle-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("treemap-chart") && (
          <TreemapChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("treemap-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("calendar-heatmap-chart") && (
          <CalendarHeatmapModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("calendar-heatmap-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("gantt-new-chart") && (
          <GanttChartNewModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("gantt-new-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("matrix-table-chart") && (
          <MatrixTableChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("matrix-table-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("combo-chart") && (
          <ComboChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("combo-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("horisontal-stacked-bar-chart") && (
          <HorizontalStackedBarChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("horisontal-stacked-bar-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("bullet-chart") && (
          <BulletChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("bullet-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("marimekko-chart") && (
          <MarimekkoChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("marimekko-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("box-plot") && (
          <BoxPlotChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("box-plot")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("cohort-analysis") && (
          <CohortAnalysisModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("cohort-analysis")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("geographic-map") && (
          <GeographicMapModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("geographic-map")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("rag-chart") && (
          <RagChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("rag-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}

        {selectedWidgets.includes("ribbon-chart") && (
          <RibbonChartModule
            onDelete={
              isPreviewOrPublished
                ? undefined
                : () => handleWidgetDelete("ribbon-chart")
            }
            isPreview={isPreviewOrPublished}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectDashboardView;
