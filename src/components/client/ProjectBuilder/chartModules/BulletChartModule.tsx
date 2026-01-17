import { useState } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../WidgetForChartModuleOne";
import BulletChart from "@/common/Charts/BulletChart";

const BulletChartModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Bullet Chart");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(3);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#e62325" },
    { label: "", field: "", color: "#0058e9" },
    { label: "", field: "", color: "#111" },
  ]);

  // Bullet charts don't use X-axis values
  const [numOfXAxisDataSet] = useState<number>(0);
  const [xAxisValues] = useState<string[]>([]);
  const [startingRange, setStartingRange] = useState<number>(-10);
  const [endingRange, setEndingRange] = useState<number>(100);

  // Dummy handlers (not used in Bullet chart)
  const handleSetNumOfXAxisDataSet = () => {
    // Not used for Bullet chart
  };

  const handleXAxisValueChange = () => {
    // Not used for Bullet chart
  };

  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };

  const handleCloseWidget = () => {
    setShowWidget(false);
  };

  return (
    <div className="flex gap-3">
      <BulletChart
        widgetTitle={widgetTitle}
        legendValues={legendValues}
        numOfLegendDataSet={numOfLegendDataSet}
        startingRange={startingRange}
        endingRange={endingRange}
        onToggleWidget={handleToggleWidget}
        onDelete={onDelete}
        isCreationMode={true}
      />
      {showWidget && (
        <ProjectConfiguration
          widgedName="Bullet Chart"
          widgetTitle={widgetTitle}
          widgetCategory="BULLET"
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

export default BulletChartModule;