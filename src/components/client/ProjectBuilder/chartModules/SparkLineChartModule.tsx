import React, { useState, useEffect } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../WidgetForChartModuleOne";
import SparkLinesChart from "@/common/Charts/SparkLinesChart";
import { useAppDispatch } from "@/hooks/useRedux";
import { setWidgetConfig } from "@/store/Slices/ChartSlice/ChartSlice";

const SparkLineChartModule = ({
  onDelete,
  isPreview = false,
}: {
  onDelete?: () => void;
  isPreview?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [widgetTitle, setWidgetTitle] = useState("Sparkline Trend");
  const [showWidget, setShowWidget] = useState(false); // Widget hidden by default

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] =
    useState<number>(1);
  const [xAxisValues, setXAxisValues] = useState<string[]>([]);

  const [numOfLegendDataSet, setNumOfLegendDataSet] =
    useState<number>(1);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "Series 1", field: "", color: "#13A490" },
    { label: "Series 2", field: "", color: "#35B6EE" },
    { label: "Series 3", field: "", color: "#6F78F9" },
  ]);
  const [startingRange, setStartingRange] = useState<number>(0); 
  const [endingRange, setEndingRange] = useState<number>(100); 

  useEffect(() => {
    dispatch(
      setWidgetConfig({
        id: "sparklines-chart",
        config: {
          widgetTitle,
          xAxisValues,
          legendValues,
          startingRange,
          endingRange,
        },
      }),
    );
  }, [
    widgetTitle,
    xAxisValues,
    legendValues,
    startingRange,
    endingRange,
    dispatch,
  ]);

  const minXaxisField = 1;
  const maxXaxisField = 7;
  const handleSetNumOfXAxisDataSet = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setNumOfXAxisDataSet(1);
    } else if (value >= minXaxisField && value <= maxXaxisField) {
      setNumOfXAxisDataSet(value);
    } else {
      setNumOfXAxisDataSet(1);
      alert(
        `Please enter a number between ${minXaxisField} and ${maxXaxisField}`
      );
    }

    setXAxisValues((prev) => {
      const updated = [...prev];
      // Adding empty values if increased
      while (updated.length < value) {
        updated.push("");
      }
      // Removing extra values if decreased
      return updated.slice(0, value);
    });
  };

  const handleXAxisValueChange = (index: number, value: string) => {
    setXAxisValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
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
    <div className="flex gap-3 h-full">
      <div className="flex-1 h-full sticky top-5">
        <SparkLinesChart
          widgetTitle={widgetTitle}
          xAxisValues={xAxisValues}
          legendValues={legendValues}
          startingRange={startingRange}
          endingRange={endingRange}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
          isPreview={isPreview}
        />
      </div>
      {!isPreview && showWidget && (
        <ProjectConfiguration
          widgedName="Sparkline Chart"
          widgetTitle={widgetTitle}
          widgetCategory="v"
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

export default SparkLineChartModule;
