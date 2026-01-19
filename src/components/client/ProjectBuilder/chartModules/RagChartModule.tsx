import { useState } from "react";
import RagChart, { RagDataPoint, RagThresholds } from "@/common/Charts/RagChart";
import RagConfiguration from "./RagConfiguration";

const sampleData: RagDataPoint[] = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 65 },
  { name: "Mar", value: 35 },
  { name: "Apr", value: 85 },
  { name: "May", value: 55 },
  { name: "Jun", value: 95 },
  { name: "Jul", value: 75 },
];

const defaultThresholds: RagThresholds = {
  poor: 50,
  average: 80,
  good: 100,
};

type RagChartModuleProps = {
  onDelete?: () => void;
  isPreview?: boolean;
};

const RagChartModule = ({ onDelete, isPreview = false }: RagChartModuleProps) => {
  const [widgetTitle, setWidgetTitle] = useState("Performance Trend");
  const [showWidget, setShowWidget] = useState(false);
  const [data, setData] = useState<RagDataPoint[]>(sampleData);
  const [thresholds, setThresholds] = useState<RagThresholds>(defaultThresholds);

  return (
    <div className="flex gap-3 h-full w-full">
      <div className="flex-1 sticky top-5 h-full min-0">
        <RagChart
          widgetTitle={widgetTitle}
          data={data}
          thresholds={thresholds}
          onToggleWidget={() => !isPreview && setShowWidget(!showWidget)}
          onDelete={onDelete}
          isPreview={isPreview}
        />
      </div>
      {!isPreview && showWidget && (
        <RagConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
          data={data}
          setData={setData}
          thresholds={thresholds}
          setThresholds={setThresholds}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
};

export default RagChartModule;
