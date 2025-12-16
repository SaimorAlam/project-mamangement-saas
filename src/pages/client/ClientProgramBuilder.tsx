import { useState } from "react";

import DoughnutChart from "@/common/Charts/DoughnutChart";
import HeatmapChart from "@/common/Charts/HeatmapChart";
import RadarChart from "@/common/Charts/RadarChart";
import StackedBarChart from "@/common/Charts/StackedBarChart";
import GanttChart from "@/common/Charts/GanttChart";
import PieChart from "@/common/Charts/PieChart";
import ProgressRing from "@/common/Charts/ProgressRing";
import MultiAxisLineChart from "@/common/Charts/LineChart";
import HorizontalBarChart from "@/common/Charts/HorizontalBarChart";
import AreaChart from "@/common/Charts/AreaChart";

import ProjectStats from "@/components/client/ProgramBuilder/ProjectStats";
import WidgetLibrary from "@/components/client/ProgramBuilder/WidgetLibrary";
// import WidgetConfiguration from "@/components/client/ProgramBuilder/WidgetConfiguration";
import ProjectConfiguration, { LegendValue } from "@/components/client/ProjectBuilder/ProjectConfiguration";


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
  const [widgetTitle, setWidgetTitle] = useState("My-CSV");

    const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(1)
    const [xAxisValues, setXAxisValues] = useState<string[]>([]);
  
    const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(3);
  
    const [legendValues, setLegendValues] = useState<LegendValue[]>([
      { label: "", field: "", color: "#13A490" },
      { label: "", field: "", color: "#35B6EE" },
      { label: "", field: "", color: "#6F78F9" },
    ]);
    const [startingRange, setStartingRange] = useState<number>(0); //for y axis
    const [endingRange, setEndingRange] = useState<number>(100); // for y axis
  
    const minXaxisField = 1;
    const maxXaxisField = 7;
    const handleSetNumOfXAxisDataSet = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (isNaN(value)) {
        setNumOfXAxisDataSet(1);
      }
      else if (value >= minXaxisField && value <= maxXaxisField) {
        setNumOfXAxisDataSet(value);
      } else {
        setNumOfXAxisDataSet(1);
        alert(`Please enter a number between ${minXaxisField} and ${maxXaxisField}`);
      }
  
      setXAxisValues((prev) => {
        const updated = [...prev];
        // Adding empty values if increased
        while (updated.length < value) {
          updated.push("");
        }
        // Removing extra values if decreased
        return updated.slice(0, value);
      });
    }
  
    const handleXAxisValueChange = (
      index: number,
      value: string
    ) => {
      setXAxisValues((prev) => {
        const updated = [...prev];
        updated[index] = value;
        return updated;
      });
      console.log("parant x values: ",xAxisValues);
    };


  return (
    <div className="flex gap-6">
      <WidgetLibrary onWidgetSelect={handleWidgetSelect} />
      <div className="flex flex-col gap-6 border border-gray-200 rounded-lg p-4 w-full h-full mb-10">

        {!selectedWidget && (
          <>
          <ProjectStats activeWidget={activeWidget} />
            <StackedBarChart />
            <div className="flex gap-4">
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
            <HeatmapChart />
          </>
        )}

        {selectedWidget === "bar-chart" && (
          <div className="flex gap-3">
            <StackedBarChart 
            widgetTitle={widgetTitle}
            xAxisValues={xAxisValues}
            legendValues={legendValues}
            numOfLegendDataSet={numOfLegendDataSet}
            startingRange={startingRange}
            endingRange={endingRange}
            />
            <ProjectConfiguration 
            widgetTitle={widgetTitle} 
            setWidgetTitle={setWidgetTitle}
            numOfXAxisDataSet={numOfXAxisDataSet}
            handleSetNumOfXAxisDataSet={handleSetNumOfXAxisDataSet}
            xAxisValues={xAxisValues}
            handleXAxisValueChange={handleXAxisValueChange}
            numOfLegendDataSet={numOfLegendDataSet}
            setNumOfLegendDataSet={setNumOfLegendDataSet}
            legendValues={legendValues}
            setLegendValues={setLegendValues}
            startingRange={startingRange}
            setStartingRange={setStartingRange}
            endingRange={endingRange}
            setEndingRange={setEndingRange}
            />
            </div>)}
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

        {selectedWidget === "line-chart" && <MultiAxisLineChart />}

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

        {selectedWidget === "area-chart" && <AreaChart />}
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
