import { useState } from "react";
import DoughnutChart from "@/common/Charts/DoughnutChart";
import GanttChart from "@/common/Charts/GanttChart";
import HeatmapChart from "@/common/Charts/HeatmapChart";
import RadarCharts from "@/common/Charts/RadarChart";
import ProjectStats from "@/components/client/ProgramBuilder/ProjectStats";
import ProjectWidget from "@/components/client/ProjectBuilder/ProjectWidget";
import StackedBarChartModule from "@/components/client/ProjectBuilder/chartModules/StackedBarChartModule";
import LineChartModule from "@/components/client/ProjectBuilder/chartModules/LineChartModule";
import ChartModuleOne from "@/components/client/ProjectBuilder/chartModules/ChartModuleOne";
import HorizontalBarChartModule from '../../../components/client/ProjectBuilder/chartModules/HorizontalBarChartModule';
import { useAppSelector } from "@/hooks/useRedux";
import { useGetChartByProjectIdQuery } from "@/store/Api/ChartApi/ChartApi";
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
import DefaultChartData from "./Components/DefaultChartData";
import { toast } from "sonner";

const ClientProjectBuilder = () => {
  const projectId = useAppSelector((state) => state.chartSlice?.projectId)
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [activeWidget, setActiveWidget] = useState("KPI Widget");
  const { data: projectsChart } = useGetChartByProjectIdQuery(projectId)
  const projectsChartsData = projectsChart?.data
  const handleWidgetSelect = (widgetId: string) => {
    if (widgetId === "kpi") {
      setSelectedWidgets([]);
      setActiveWidget("KPI widget");
    } else {
      // Toggle widget selection - add if not present, remove if already selected
      setSelectedWidgets((prev) => {
        if (prev.includes(widgetId)) {
          return prev.filter((id) => id !== widgetId);
        } else {
          return [...prev, widgetId];
        }
      });
      setActiveWidget(widgetId);
    }
  };

  const handleWidgetDelete = (widgetId: string) => {
    const toastId = toast.loading("Deleting widget...");
    setSelectedWidgets((prev) => {
      return (
        prev.filter((id) => id !== widgetId)
      )
    });
    toast.success("Widget deleted successfully", { id: toastId })

  };

  return (
    <div className="flex gap-6">
      <ProjectWidget
        onWidgetSelect={handleWidgetSelect}
        selectedWidgets={selectedWidgets}
      />
      <div className="flex flex-col gap-6 border border-gray-200 rounded-lg p-4 w-full h-full mb-10">
        <ProjectStats activeWidget={activeWidget} />

        {
          projectsChartsData?.length > 0 ? (
            <DefaultChartData projectsChartsData={projectsChartsData} />
          ) : selectedWidgets.length === 0 && (
            <>
              {/* <StackedBarChart /> */}
              <div className="flex gap-4">
                <RadarCharts />
                <DoughnutChart
                  title="Doughnut Pie"
                  centerLabel="Total Visitor"
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
              </div>
              <HeatmapChart />
            </>
          )
        }
        {selectedWidgets.includes("bar-chart") && (
          <StackedBarChartModule
            onDelete={() => handleWidgetDelete("bar-chart")}
          />
        )}
        {selectedWidgets.includes("progress-ring") && (
          <ProgressRingModule
            onDelete={() => handleWidgetDelete("progress-ring")}
          />
        )}

        {selectedWidgets.includes("pie-chart") && (
          <PieChartModule onDelete={() => handleWidgetDelete("pie-chart")} />
        )}

        {selectedWidgets.includes("line-chart") && (
          <LineChartModule onDelete={() => handleWidgetDelete("line-chart")} />
        )}

        {selectedWidgets.includes("data-table") && (
          <div className="p-6 border border-gray-200 rounded-lg text-center text-gray-500">
            Data Table coming soon...
          </div>
        )}

        {selectedWidgets.includes("gantt-chart") && (
          <div className="p-6 border border-gray-200 rounded-lg text-center text-gray-500">
            <GanttChart />
          </div>
        )}

        {selectedWidgets.includes("picture-video") && (
          <div className="p-6 border border-gray-200 rounded-lg text-center text-gray-500">
            Picture/Video coming soon...
          </div>
        )}

        {selectedWidgets.includes("horizontal-bar-chart") && (
          <HorizontalBarChartModule
            onDelete={() => handleWidgetDelete("horizontal-bar-chart")}
          />
        )}

        {selectedWidgets.includes("heat-map-chart") && (
          <ChartModuleOne
            chartName="heat-map-chart"
            onDelete={() => handleWidgetDelete("heat-map-chart")}
          />
        )}

        {selectedWidgets.includes("area-chart") && (
          <ChartModuleOne
            chartName="area-chart"
            onDelete={() => handleWidgetDelete("area-chart")}
          />
        )}
        {selectedWidgets.includes("spline-area-chart") && (
          <ChartModuleOne
            chartName="spline-area-chart"
            onDelete={() => handleWidgetDelete("spline-area-chart")}
          />
        )}

        {selectedWidgets.includes("gauge-chart") && (
          <GaugeChartModule onDelete={() => handleWidgetDelete("gauge-chart")} />
        )}

        {selectedWidgets.includes("histogram-chart") && (
          <HistogramChartModule />
        )}

        {selectedWidgets.includes("bubble-chart") && <BubbleChartModule />}
        {selectedWidgets.includes("column-chart") && (
          <ColumnBarChartModule />
        )}
        {selectedWidgets.includes("funnel-chart") && <FunnelChartModule />}
        {selectedWidgets.includes("scatter-chart") && <ScatterChartModule />}
        {selectedWidgets.includes("pareto-chart") && <ParetoChartModule />}
        {selectedWidgets.includes("waterfall-chart") && <WaterfallChartModule />}
        {selectedWidgets.includes("radar-chart") && <RadarChartModule />}
        {selectedWidgets.includes("candle-chart") && <CandleChartModule />}
      </div>
      {/* <ProjectConfiguration /> */}
    </div>
  );
};
export default ClientProjectBuilder;
