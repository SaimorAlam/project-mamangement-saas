import { useState } from "react";
import RibbonChart, { RibbonSeries } from "@/common/Charts/RibbonChart";
import RibbonConfiguration from "./RibbonConfiguration";

const initialCategories = ["2022", "2023", "2024", "2025"];
const initialSeries: RibbonSeries[] = [
  { id: "s1", name: "Product A", color: "#8884d8", data: [400, 300, 500, 200] },
  { id: "s2", name: "Product B", color: "#82ca9d", data: [100, 400, 300, 600] },
  { id: "s3", name: "Product C", color: "#ffc658", data: [200, 150, 450, 300] },
];

const RibbonChartModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Sales Ranking by Year");
  const [showWidget, setShowWidget] = useState(false);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [series, setSeries] = useState<RibbonSeries[]>(initialSeries);

  return (
    <div className="flex gap-3">
      <div className="flex-1 sticky top-5 h-full min-w-0">
        <RibbonChart
          widgetTitle={widgetTitle}
          categories={categories}
          series={series}
          onToggleWidget={() => setShowWidget(!showWidget)}
          onDelete={onDelete}
        />
      </div>
      {showWidget && (
        <RibbonConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
          categories={categories}
          setCategories={setCategories}
          series={series}
          setSeries={setSeries}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
};

export default RibbonChartModule;
