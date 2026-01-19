import { useState } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../WidgetForChartModuleOne";
import BulletChart from "@/common/Charts/BulletChart";

type BulletChartModuleProps = {
  onDelete?: () => void;
  isPreview?: boolean;
};

const BulletChartModule = ({ onDelete, isPreview = false }: BulletChartModuleProps) => {
  const [widgetTitle, setWidgetTitle] = useState("Bullet Performance");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(3);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#e62325" },
    { label: "", field: "", color: "#0058e9" },
    { label: "#111", field: "", color: "#111" },
  ]);

  // Bullet charts don't use X-axis values
  const [numOfXAxisDataSet] = useState<number>(0);
  const [xAxisValues] = useState<string[]>([]);
  const [startingRange, setStartingRange] = useState<number>(-10);
  const [endingRange, setEndingRange] = useState<number>(100);

  // Toggle widget visibility
  const handleToggleWidget = () => {
    if (!isPreview) {
      setShowWidget(!showWidget);
    }
  };

  // Close widget
  const handleCloseWidget = () => {
    setShowWidget(false);
  };

  return (
    <div className="flex gap-3 h-full w-full">
      <div className="flex-1 min-w-0 h-full sticky top-5">
        <BulletChart
          widgetTitle={widgetTitle}
          legendValues={legendValues}
          numOfLegendDataSet={numOfLegendDataSet}
          startingRange={startingRange}
          endingRange={endingRange}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
          isPreview={isPreview}
        />
      </div>
      {!isPreview && showWidget && (
        <ProjectConfiguration
          widgedName="Bullet Chart"
          widgetTitle={widgetTitle}
          widgetCategory="BULLET"
          setWidgetTitle={setWidgetTitle}
          numOfXAxisDataSet={numOfXAxisDataSet}
          handleSetNumOfXAxisDataSet={() => {}}
          xAxisValues={xAxisValues}
          handleXAxisValueChange={() => {}}
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
