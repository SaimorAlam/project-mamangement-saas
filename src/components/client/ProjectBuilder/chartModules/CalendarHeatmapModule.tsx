import { useState } from "react";
import CalendarHeatmapChart, {
  CalendarHeatmapValue,
} from "@/common/Charts/CalendarHeatmapChart";
import ProjectConfigurationTypeOne, { LegendValue } from "../ProjectConfigurationTypeOne";

const CalendarHeatmapModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Activity Heatmap");
  const [showWidget, setShowWidget] = useState(false);

  // Legend configuration (for color scale reference)
  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState(3);
  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "Low Activity", field: "low", color: "#9be9a8" },
    { label: "Medium Activity", field: "medium", color: "#40c463" },
    { label: "High Activity", field: "high", color: "#216e39" },
  ]);

  // Y-Axis range for data intensity
  const [startingRange, setStartingRange] = useState(0);
  const [endingRange, setEndingRange] = useState(10);

  // Calendar heatmap doesn't use X-axis values
  const [numOfXAxisDataSet] = useState(0);
  const [xAxisValues] = useState<string[]>([]);

  // Generate heatmap data for the past 6 months
  const generateHeatmapData = (): CalendarHeatmapValue[] => {
    const data: CalendarHeatmapValue[] = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    for (let i = 0; i < 180; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString().split("T")[0],
        count:
          Math.floor(Math.random() * (endingRange - startingRange + 1)) +
          startingRange,
      });
    }
    return data;
  };

  const heatmapValues = generateHeatmapData();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  const endDate = new Date();

  // Handlers
  const handleSetNumOfXAxisDataSet = () => {
    // Not used for calendar heatmap
  };

  const handleXAxisValueChange = () => {
    // Not used for calendar heatmap
  };

  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };

  const handleCloseWidget = () => {
    setShowWidget(false);
  };

//   const handleSave = () => {
//     console.log("Saving Calendar Heatmap config:", {
//       widgetTitle,
//       legendValues,
//       startingRange,
//       endingRange,
//     });
//     // Add your save logic here (API call, etc.)
//     setShowWidget(false);
//   };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <CalendarHeatmapChart
          widgetTitle={widgetTitle}
          values={heatmapValues}
          startDate={startDate}
          endDate={endDate}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
        />
      </div>

      {showWidget && (
        <ProjectConfigurationTypeOne
          widgedName="Calendar Heatmap"
          widgetTitle={widgetTitle}
          widgetCategory="HEATMAP"
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

export default CalendarHeatmapModule;