import { useState } from "react";

// import AreaChart from "@/common/Charts/AreaChart";
import DoughnutChart from "@/common/Charts/DoughnutChart";
import GanttChart from "@/common/Charts/GanttChart";
import HeatmapChart from "@/common/Charts/HeatmapChart";
// import HorizontalBarChart from "@/common/Charts/HorizontalBarChart";
// import MultiAxisLineChart from "@/common/Charts/LineChart";
// import PieChart from "@/common/Charts/PieChart";
import ProgressRing from "@/common/Charts/ProgressRingTest";
import RadarCharts from "@/common/Charts/RadarChart";
// import StackedBarChart from "@/common/Charts/StackedBarChart";
// import ProjectConfiguration from "@/components/client/ProjectBuilder/ProjectConfiguration";
import ProjectStats from "@/components/client/ProgramBuilder/ProjectStats";
import ProjectWidget from "@/components/client/ProjectBuilder/ProjectWidget";
import StackedBarChartModule from "@/components/client/ProjectBuilder/chartModules/StackedBarChartModule";
import LineChartModule from "@/components/client/ProjectBuilder/chartModules/LineChartModule";
import ChartModuleOne from "@/components/client/ProjectBuilder/chartModules/ChartModuleOne";
import ChartModuleTwo from "@/components/client/ProjectBuilder/chartModules/ChartModuleTwo";
import HorizontalBarChartModule from './../../components/client/ProjectBuilder/chartModules/HorizontalBarChartModule';

const ClientProjectBuilder = () => {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [activeWidget, setActiveWidget] = useState("KPI Widget");

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

  return (
    <div className="flex gap-6">
      <ProjectWidget onWidgetSelect={handleWidgetSelect} />
      <div className="flex flex-col gap-6 border border-gray-200 rounded-lg p-4 w-full h-full mb-10">
        <ProjectStats activeWidget={activeWidget} />

        {selectedWidgets.length === 0 && (
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

        {selectedWidgets.includes("bar-chart") && <StackedBarChartModule />}
        {selectedWidgets.includes("progress-ring") && (
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

        {selectedWidgets.includes("pie-chart") && (
          <ChartModuleTwo chartName="pie-chart" />
        )}

        {selectedWidgets.includes("line-chart") && <LineChartModule />}

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
          <HorizontalBarChartModule />
        )}

        {selectedWidgets.includes("heat-map-chart") && <HeatmapChart />}

        {selectedWidgets.includes("area-chart") && (
          <ChartModuleOne chartName="area-chart" />
        )}
      </div>
      {/* <ProjectConfiguration /> */}
    </div>
  );
};
export default ClientProjectBuilder;
