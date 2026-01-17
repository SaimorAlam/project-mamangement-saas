import { useState } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../WidgetForChartModuleOne";
import GanttChartNew from "@/common/Charts/GanttChartNew";

const GanttChartNewModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Project Timeline");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(5);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#008FFB" },
    { label: "", field: "", color: "#00E396" },
    { label: "", field: "", color: "#775DD0" },
    { label: "", field: "", color: "#FEB019" },
    { label: "", field: "", color: "#FF4560" },
  ]);

  // Gantt charts don't use X-axis values or Y-axis ranges
  const [numOfXAxisDataSet] = useState<number>(0);
  const [xAxisValues] = useState<string[]>([]);
  const [startingRange] = useState<number>(0);
  const [endingRange] = useState<number>(100);

  // Dummy handlers (not used in Gantt chart)
  const handleSetNumOfXAxisDataSet = () => {
    // Not used for Gantt chart
  };

  const handleXAxisValueChange = () => {
    // Not used for Gantt chart
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
    <div className="flex gap-3">
      <GanttChartNew
        widgetTitle={widgetTitle}
        legendValues={legendValues}
        numOfLegendDataSet={numOfLegendDataSet}
        onToggleWidget={handleToggleWidget}
        onDelete={onDelete}
      />
      {showWidget && (
        <ProjectConfiguration
          widgedName="Gantt Chart"
          widgetTitle={widgetTitle}
          widgetCategory="GANTT"
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

export default GanttChartNewModule;