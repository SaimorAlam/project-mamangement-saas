import { useState } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../WidgetForChartModuleOne";
import CalendarHeatmapChart from "@/common/Charts/CalendarHeatmapChart";

const CalendarHeatmapChartModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Activity Calendar");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(1);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#216e39" },
  ]);

  // Calendar heatmap doesn't use X-axis values or Y-axis ranges
  const [numOfXAxisDataSet] = useState<number>(0);
  const [xAxisValues] = useState<string[]>([]);
  const [startingRange] = useState<number>(0);
  const [endingRange] = useState<number>(100);

  // Dummy handlers (not used in Calendar heatmap)
  const handleSetNumOfXAxisDataSet = () => {
    // Not used for Calendar heatmap
  };

  const handleXAxisValueChange = () => {
    // Not used for Calendar heatmap
  };

  // Toggle widget visibility
  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };

  // Close widget
  const handleCloseWidget = () => {
    setShowWidget(false);
  };

  return (
    <div className="flex gap-3 h-full">
      <div className="flex-1 h-full sticky top-5">
        <CalendarHeatmapChart
          widgetTitle={widgetTitle}
          legendValues={legendValues}
          numOfLegendDataSet={numOfLegendDataSet}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
          isCreationMode={true}
        />
      </div>
      {showWidget && (
        <ProjectConfiguration
          widgedName="Calendar Heatmap"
          widgetTitle={widgetTitle}
          widgetCategory="CALENDAR"
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
          setStartingRange={() => {}}
          endingRange={endingRange}
          setEndingRange={() => {}}
          onClose={handleCloseWidget}
        />
      )}
    </div>
  );
};

export default CalendarHeatmapChartModule;