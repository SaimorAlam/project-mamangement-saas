import React, { useState } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../WidgetForChartModuleOne";
import CandleChart from "@/common/Charts/CandleChart";

type CandleChartModuleProps = {
  onDelete?: () => void;
  isPreview?: boolean;
};

const CandleChartModule = ({ onDelete, isPreview = false }: CandleChartModuleProps) => {
  const [widgetTitle, setWidgetTitle] = useState("My-CSV");
  const [showWidget, setShowWidget] = useState(false); // Widget hidden by default

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] =
    useState<number>(1);
  const [xAxisValues, setXAxisValues] = useState<string[]>([]);

  const [numOfLegendDataSet, setNumOfLegendDataSet] =
    useState<number>(3);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#8D79F6" },
    { label: "", field: "", color: "#169E7B" },
    { label: "", field: "", color: "#DA4352" },
  ]);
  const [startingRange, setStartingRange] = useState<number>(6500); //for y axis
  const [endingRange, setEndingRange] = useState<number>(6700); // for y axis

  const minXaxisField = 5;
  const maxXaxisField = 30;
  const handleSetNumOfXAxisDataSet = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setNumOfXAxisDataSet(5);
    } else if (value >= minXaxisField && value <= maxXaxisField) {
      setNumOfXAxisDataSet(value);
    } else {
      setNumOfXAxisDataSet(5);
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
    if (!isPreview) {
      setShowWidget(!showWidget);
    }
  };

  // Close widget (for X button)
  const handleCloseWidget = () => {
    setShowWidget(false);
  };


  return (
    <div className="flex gap-3 h-full w-full">
      <div className="flex-1 h-full sticky top-5">
        <CandleChart
          widgetTitle={widgetTitle}
          xAxisValues={xAxisValues}
          legendValues={legendValues}
          numOfLegendDataSet={numOfLegendDataSet}
          startingRange={startingRange}
          endingRange={endingRange}
          onToggleWidget={handleToggleWidget}
          isPreview={isPreview}
          onDelete={onDelete}
        />
      </div>
      {!isPreview && showWidget && (
        <ProjectConfiguration
          widgedName="Candlestick Chart"
          widgetTitle={widgetTitle}
          widgetCategory="CANDLESTICK"
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

export default CandleChartModule;
