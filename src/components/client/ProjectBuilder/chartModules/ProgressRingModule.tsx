import { useState } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../WidgetForChartModuleOne";
import ProgressRing from "@/common/Charts/ProgressRing";

const ProgressRingModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("My-CSV");
  const [showWidget, setShowWidget] = useState(false); // Widget hidden by default

  const [numOfLegendDataSet, setNumOfLegendDataSet] =
    useState<number>(3);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#13A490" },
    { label: "", field: "", color: "#35B6EE" },
    { label: "", field: "", color: "#6F78F9" },
  ]);

  // Progress Ring doesn't use X-axis values or Y-axis ranges, but we need placeholders for ProjectConfiguration
  const [numOfXAxisDataSet] = useState<number>(0);
  const [xAxisValues] = useState<string[]>([]);
  const [startingRange] = useState<number>(0);
  const [endingRange] = useState<number>(100);

  // Dummy handler for X-axis (not used in progress ring)
  const handleSetNumOfXAxisDataSet = () => {
    // Not used for progress ring
  };

  const handleXAxisValueChange = () => {
    // Not used for progress ring
  };

  // Toggle widget visibility
  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };

  // Close widget (for X button)
  const handleCloseWidget = () => {
    setShowWidget(false);
  };

  return (
    <div className="flex gap-3">
      <ProgressRing
        widgetTitle={widgetTitle}
        legendValues={legendValues}
        numOfLegendDataSet={numOfLegendDataSet}
        startingRange={startingRange}
        endingRange={endingRange}
        onToggleWidget={handleToggleWidget}
        onDelete={onDelete}
      />
      {showWidget && (
        <ProjectConfiguration
          widgedName="Progress Ring"
          widgetTitle={widgetTitle}
          widgetCategory="PROGRESS_RING"
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

export default ProgressRingModule;
