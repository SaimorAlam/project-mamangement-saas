import { useState } from "react";
import TreemapChart from "@/common/Charts/TreemapChart";
import ProjectConfiguration, { LegendValue } from "../WidgetForChartModuleOne";

type TreemapDataPoint = {
  x: string;
  y: number;
};

const TreemapChartModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("City Population Treemap");
  const [showWidget, setShowWidget] = useState(false);

  // X-Axis configuration for treemap labels
  const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState(5);
  const [xAxisValues, setXAxisValues] = useState([
    "New Delhi",
    "Mumbai",
    "Kolkata",
    "Bangalore",
    "Chennai",
  ]);

  // Legend configuration
  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState(3);
  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "High", field: "high", color: "#13A490" },
    { label: "Medium", field: "medium", color: "#35B6EE" },
    { label: "Low", field: "low", color: "#6F78F9" },
  ]);

  // Y-Axis range for data values
  const [startingRange, setStartingRange] = useState(20);
  const [endingRange, setEndingRange] = useState(250);

  // Generate random data for treemap
  const generateRandomValue = () =>
    Math.floor(Math.random() * (endingRange - startingRange + 1)) + startingRange;

  const treemapData: TreemapDataPoint[] = xAxisValues
    .filter((v) => v.trim() !== "")
    .map((label) => ({
      x: label,
      y: generateRandomValue(),
    }));

  // Handlers
  const handleSetNumOfXAxisDataSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1 || value > 20) {
      alert("Please enter a number between 1 and 20");
      return;
    }

    setNumOfXAxisDataSet(value);
    setXAxisValues((prev) => {
      const updated = [...prev];
      while (updated.length < value) {
        updated.push("");
      }
      return updated.slice(0, value);
    });
  };

  const handleXAxisValueChange = (index: number, value: string) => {
    setXAxisValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };

  const handleCloseWidget = () => {
    setShowWidget(false);
  };

//   const handleSave = () => {
//     console.log("Saving Treemap config:", {
//       widgetTitle,
//       xAxisValues,
//       legendValues,
//       startingRange,
//       endingRange,
//     });
//     setShowWidget(false);
//   };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <TreemapChart
          widgetTitle={widgetTitle}
          data={treemapData}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
        />
      </div>

      {showWidget && (
        <ProjectConfiguration
          widgedName="Treemap Chart"
          widgetTitle={widgetTitle}
          widgetCategory="TREEMAP"
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
          onClose={handleCloseWidget}
        />
      )}
    </div>
  );
};

export default TreemapChartModule;