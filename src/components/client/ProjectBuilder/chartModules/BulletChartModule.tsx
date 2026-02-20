import { useState } from "react";
import { LegendValue } from "../../../../common/Charts/CompletedCharts/Widgets/WidgetForChartModuleOne";
import BulletChart from "@/common/Charts/BulletChart";
import BulletChartConfiguration from "./BulletChartConfiguration";

type BulletChartModuleProps = {
  onDelete?: () => void;
  isPreview?: boolean;
};

const BulletChartModule = ({
  onDelete,
  isPreview = false,
}: BulletChartModuleProps) => {
  const [widgetTitle, setWidgetTitle] = useState("Bullet Performance");
  const [showWidget, setShowWidget] = useState(false);

  // Initial set of legend values (metrics)
  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "Revenue", field: "revenue", color: "#3b82f6" },
    { label: "Expansion", field: "expansion", color: "#10b981" },
    { label: "Support", field: "support", color: "#f59e0b" },
  ]);

  const [startingRange, setStartingRange] = useState<number>(0);
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
          numOfLegendDataSet={legendValues.length}
          startingRange={startingRange}
          endingRange={endingRange}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
          isPreview={isPreview}
        />
      </div>
      {!isPreview && showWidget && (
        <BulletChartConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
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
