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

const RagChartModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Performance Trend");
  const [showWidget, setShowWidget] = useState(false);
  const [data, setData] = useState<RagDataPoint[]>(sampleData);
  const [thresholds, setThresholds] = useState<RagThresholds>(defaultThresholds);

  return (
    <div className="flex gap-3">
      <div className="w-full sticky top-5 h-full">
        <RagChart
          widgetTitle={widgetTitle}
          data={data}
          thresholds={thresholds}
          onToggleWidget={() => setShowWidget(!showWidget)}
          onDelete={onDelete}
        />
      </div>
      {showWidget && (
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
