import { useState } from "react";

import DoughnutChart from "@/common/Charts/DoughnutChart";
import HeatmapChart from "@/common/Charts/HeatmapChart";
import RadarCharts from "@/common/Charts/RadarChart";
import ProjectStats from "@/components/client/ProgramBuilder/ProjectStats";
import ProjectWidget from "@/components/client/ProjectBuilder/ProjectWidget";
// import ProgressRing from "@/common/Charts/ProgressRingTest";
// import HorizontalBarChart from "@/common/Charts/HorizontalBarChart";
import GanttChart from "@/common/Charts/GanttChart";
import StackedBarChartModule from "@/components/client/ProjectBuilder/chartModules/StackedBarChartModule";
import LineChartModule from "@/components/client/ProjectBuilder/chartModules/LineChartModule";
import ChartModuleOne from "@/components/client/ProjectBuilder/chartModules/ChartModuleOne";
// import ChartModuleTwo from "@/components/client/ProjectBuilder/chartModules/ChartModuleTwo";
import PieChartModule from "./../../components/client/ProjectBuilder/chartModules/PieChartModule";
import HorizontalBarChartModule from "./../../components/client/ProjectBuilder/chartModules/HorizontalBarChartModule";
import ProgressRingModule from "./../../components/client/ProjectBuilder/chartModules/ProgressRingModule";
import ColumnBarChartModule from "@/components/client/ProjectBuilder/chartModules/ColumnBarChartModule";

const StaffManagerProjectBuilder = () => {
  const [selectedWidget, setSelectedWidget] = useState<string>("");
  const [activeWidget, setActiveWidget] = useState("KPI Widget");

  const handleWidgetSelect = (widgetId: string) => {
    if (widgetId === "kpi") {
      setSelectedWidget("");
      setActiveWidget("KPI widget");
    } else {
      setSelectedWidget(widgetId);
      setActiveWidget(widgetId);
    }
  };

  return (
    <div className="flex gap-6">
      <ProjectWidget onWidgetSelect={handleWidgetSelect} />
      <div className="flex flex-col gap-6 border border-gray-200 rounded-lg p-4 w-full h-full mb-10">
        <ProjectStats activeWidget={activeWidget} />

        {!selectedWidget && (
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
        )}

        {selectedWidget === "bar-chart" && <StackedBarChartModule />}
        {selectedWidget === "progress-ring" && <ProgressRingModule />}

        {selectedWidget === "pie-chart" && <PieChartModule />}

        {selectedWidget === "line-chart" && <LineChartModule />}

        {selectedWidget === "data-table" && (
          <div className="p-6 border border-gray-200 rounded-lg text-center text-gray-500">
            Data Table coming soon...
          </div>
        )}

        {selectedWidget === "gantt-chart" && (
          <div className="p-6 border border-gray-200 rounded-lg text-center text-gray-500">
            <GanttChart />
          </div>
        )}

        {selectedWidget === "picture-video" && (
          <div className="p-6 border border-gray-200 rounded-lg text-center text-gray-500">
            Picture/Video coming soon...
          </div>
        )}

        {selectedWidget === "horizontal-bar-chart" && (
          <HorizontalBarChartModule />
        )}

        {selectedWidget === "heat-map-chart" && <ChartModuleOne chartName="heat-map-chart" />}

        {selectedWidget === "area-chart" && (
          <ChartModuleOne chartName="area-chart" />
        )}

        {selectedWidget === "column-chart" && <ColumnBarChartModule />}
        {selectedWidget === "funnel-chart" && <ColumnBarChartModule />}
        {selectedWidget === "scatter-chart" && <ColumnBarChartModule />}
      </div>
      {/* <ProjectConfiguration /> */}
    </div>
  );
};
export default StaffManagerProjectBuilder;
