import { useState } from "react";
import BoxPlotChart from "@/common/Charts/BoxPlotChart";
import BoxPlotChartConfiguration from "../chartConfigurations/BoxPlotChartConfiguration";

export type BoxPlotData = {
  x: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
};

const BoxPlotChartModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Box & Whisker Plot");
  const [showConfig, setShowConfig] = useState(false);
  const [chartHeight, setChartHeight] = useState<number>(400);

  // Manage chart data in state
  const [data, setData] = useState<BoxPlotData[]>([
    { x: "Group A", min: 10, q1: 20, median: 35, q3: 50, max: 70, outliers: [5, 85] },
    { x: "Group B", min: 15, q1: 25, median: 40, q3: 55, max: 75, outliers: [8, 90] },
    { x: "Group C", min: 5, q1: 15, median: 30, q3: 45, max: 60, outliers: [2, 70] },
  ]);

  return (
    <div className="flex gap-3 relative">
      <div className="flex-1 w-full relative">
         <BoxPlotChart
            widgetTitle={widgetTitle}
            data={data}
            chartHeight={chartHeight}
            onToggleWidget={() => setShowConfig(!showConfig)}
         />
         {onDelete && (
            <button 
                onClick={onDelete} 
                className="absolute top-6 right-16 p-2 text-gray-400 hover:text-red-500 z-10"
                title="Remove Widget"
            >
            </button>
         )}
      </div>
      
      {showConfig && (
        <BoxPlotChartConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
          chartHeight={chartHeight}
          setChartHeight={setChartHeight}
          data={data}
          setData={setData}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
};

export default BoxPlotChartModule;
