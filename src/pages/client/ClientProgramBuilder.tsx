import { useState } from "react";

import HeatmapChart from "@/common/Charts/HeatmapChart";
import GanttChart from "@/common/Charts/GanttChart";
import PieChart from "@/common/Charts/PieChart";
import ProgressRing from "@/common/Charts/ProgressRing";
import HorizontalBarChart from "@/common/Charts/HorizontalBarChart";

import ProjectStats from "@/components/client/ProgramBuilder/ProjectStats";
import WidgetLibrary from "@/components/client/ProgramBuilder/WidgetLibrary";
import ChartModuleOne from "@/components/client/ProjectBuilder/chartModules/ChartModuleOne";


const ClientProgramBuilder = () => {
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

  // for stacked bar chart 
  


  return (
    <div className="flex gap-6">
      <WidgetLibrary onWidgetSelect={handleWidgetSelect} />
      <div className="flex flex-col gap-6 border border-gray-200 rounded-lg p-4 w-full h-full mb-10">

        {!selectedWidget && (
          <>
          <ProjectStats activeWidget={activeWidget} />
            {/* <StackedBarChart /> */}
            {/* <div className="flex gap-4">
              <RadarChart />
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
            <HeatmapChart /> */}
          </>
        )}

        {selectedWidget === "bar-chart" && <ChartModuleOne chartName="bar-chart" />}
        {/* {selectedWidget === "bar-chart" && <StackedBarChart />} */}
        {selectedWidget === "progress-ring" && (
          <ProgressRing
            title="Project Progress"
            centerLabel="Total Progress"
            data={[
              {
                name: "In Progress",
                value: 65,
                count: 12,
                color: "#5D8AF3",
              },
              {
                name: "Completed",
                value: 14,
                count: 30,
                color: "#169E7B",
              },
              {
                name: "Overdue",
                value: 13,
                count: 8,
                color: "#DA4352",
              },
              {
                name: "Not Started",
                value: 8,
                count: 8,
                color: "#E2E8F0",
              },
            ]}
          />
        )}

        {selectedWidget === "pie-chart" && <PieChart />}

        {selectedWidget === "line-chart" && <ChartModuleOne chartName="line-chart" />}
        {/* {selectedWidget === "line-chart" && <MultiAxisLineChart />} */}

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
          <HorizontalBarChart />
        )}

        {selectedWidget === "heat-map-chart" && <HeatmapChart />}

        {selectedWidget === "area-chart" && <ChartModuleOne chartName="area-chart" />}
        {/* {selectedWidget === "area-chart" && <AreaChart />} */}
      </div>

      {/* {selectedWidget === "bar-chart" && <ProjectConfiguration />} */}
      {/* {selectedWidget === "KPI Widget" && <WidgetConfiguration />}
      {selectedWidget === "progress-ring" && <WidgetConfiguration />}
      {selectedWidget === "pie-chart" && <WidgetConfiguration />}
      {selectedWidget === "line-chart" && <WidgetConfiguration />}
      {selectedWidget === "data-table" && <WidgetConfiguration />}
      {selectedWidget === "gantt-chart" && <WidgetConfiguration />}
      {selectedWidget === "picture-video" && <WidgetConfiguration />}
      {selectedWidget === "horizontal-bar-chart" && <WidgetConfiguration />}
      {selectedWidget === "heat-map-chart" && <WidgetConfiguration />}
      {selectedWidget === "area-chart" && <WidgetConfiguration />} */}
    </div>
  );
};
export default ClientProgramBuilder;
