import React, { useState, useEffect } from "react";
import MarimekkoChart from "@/common/Charts/MarimekkoChart";
import MarimekkoChartConfiguration, {
  LegendValue,
} from "../chartConfigurations/MarimekkoChartConfiguration";

type MarimekkoChartModuleProps = {
  onDelete?: () => void;
  isPreview?: boolean;
};

const MarimekkoChartModule = ({ onDelete, isPreview = false }: MarimekkoChartModuleProps) => {
  const [widgetTitle, setWidgetTitle] = useState("Marimekko Chart");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(3);
  const [xAxisValues, setXAxisValues] = useState<string[]>(["APAC", "EMEA", "Americas"]);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(2);
  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "Product A", field: "p_a", color: "#8D79F6" },
    { label: "Product B", field: "p_b", color: "#10B981" },
  ]);

  const [chartHeight, setChartHeight] = useState<number>(400);

  // Initialize xAxisValues
  useEffect(() => {
    const currentLength = xAxisValues.length;
    if (currentLength < numOfXAxisDataSet) {
      const updated = [...xAxisValues];
      while (updated.length < numOfXAxisDataSet) {
        updated.push(`Category ${updated.length + 1}`);
      }
      setXAxisValues(updated);
    } else if (currentLength > numOfXAxisDataSet) {
      setXAxisValues(xAxisValues.slice(0, numOfXAxisDataSet));
    }
  }, [numOfXAxisDataSet, xAxisValues]);

  const handleSetNumOfXAxisDataSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setNumOfXAxisDataSet(value);
    }
  };

  const handleXAxisValueChange = (index: number, value: string) => {
    setXAxisValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleToggleWidget = () => {
    if (!isPreview) {
      setShowWidget((prev) => !prev);
    }
  };

  return (
    <div className="flex gap-3 h-full w-full">
      <div className="flex-1 h-full sticky top-5">
         <MarimekkoChart
            widgetTitle={widgetTitle}
            xAxisValues={xAxisValues}
            legendValues={legendValues}
            chartHeight={chartHeight}
            onToggleWidget={handleToggleWidget}
            isPreview={isPreview}
            onDelete={onDelete}
         />
      </div>
      
      {!isPreview && showWidget && (
        <MarimekkoChartConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
          numOfXAxisDataSet={numOfXAxisDataSet}
          handleSetNumOfXAxisDataSet={handleSetNumOfXAxisDataSet}
          xAxisValues={xAxisValues}
          handleXAxisValueChange={handleXAxisValueChange}
          numOfLegendDataSet={numOfLegendDataSet}
          setNumOfLegendDataSet={setNumOfLegendDataSet}
          legendValues={legendValues}
          setLegendValues={setLegendValues}
          chartHeight={chartHeight}
          setChartHeight={setChartHeight}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
};

export default MarimekkoChartModule;
