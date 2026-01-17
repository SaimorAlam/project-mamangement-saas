import { useState } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../WidgetForChartModuleOne";
import TreemapChart from "@/common/Charts/TreemapChart";

const TreemapChartModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Treemap Chart");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(12);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#3B93A5" },
    { label: "", field: "", color: "#F7B844" },
    { label: "", field: "", color: "#ADD8C7" },
    { label: "", field: "", color: "#EC3C65" },
    { label: "", field: "", color: "#CDD7B6" },
    { label: "", field: "", color: "#C1F666" },
    { label: "", field: "", color: "#D43F97" },
    { label: "", field: "", color: "#1E5D8C" },
    { label: "", field: "", color: "#421243" },
    { label: "", field: "", color: "#7F94B0" },
    { label: "", field: "", color: "#EF6537" },
    { label: "", field: "", color: "#C0ADDB" },
  ]);

  // Treemap charts don't use X-axis values or Y-axis ranges
  const [numOfXAxisDataSet] = useState<number>(0);
  const [xAxisValues] = useState<string[]>([]);
  const [startingRange] = useState<number>(0);
  const [endingRange] = useState<number>(100);

  // Dummy handlers (not used in Treemap chart)
  const handleSetNumOfXAxisDataSet = () => {
    // Not used for Treemap chart
  };

  const handleXAxisValueChange = () => {
    // Not used for Treemap chart
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
      <TreemapChart
        widgetTitle={widgetTitle}
        legendValues={legendValues}
        numOfLegendDataSet={numOfLegendDataSet}
        onToggleWidget={handleToggleWidget}
        onDelete={onDelete}
      />
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
          setStartingRange={() => {}}
          endingRange={endingRange}
          setEndingRange={() => {}}
          onClose={handleCloseWidget}
        />
      )}
    </div>
  );
};

export default TreemapChartModule;