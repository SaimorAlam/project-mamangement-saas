import React, { useState } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../WidgetForChartModuleOne";
import HorizontalStackedBarChart from "@/common/Charts/HorizontalStackedBarChart";

const HorizontalStackedBarChartModule = ({ onDelete }: { onDelete?: () => void }) => {
    console.log("page mounted");
    
  const [widgetTitle, setWidgetTitle] = useState("Horizontal Stacked Bar");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(1);
  const [xAxisValues, setXAxisValues] = useState<string[]>([]);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(5);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#008FFB" },
    { label: "", field: "", color: "#00E396" },
    { label: "", field: "", color: "#FEB019" },
    { label: "", field: "", color: "#FF4560" },
    { label: "", field: "", color: "#775DD0" },
  ]);

  const [startingRange, setStartingRange] = useState<number>(0);
  const [endingRange, setEndingRange] = useState<number>(100);

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
      while (updated.length < value) {
        updated.push("");
      }
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

  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };

  const handleCloseWidget = () => {
    setShowWidget(false);
  };

  return (
    <div className="flex gap-3">
      <HorizontalStackedBarChart
        widgetTitle={widgetTitle}
        xAxisValues={xAxisValues}
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
          widgedName="Horizontal Stacked Bar"
          widgetTitle={widgetTitle}
          widgetCategory="HORIZONTAL_BAR"
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

export default HorizontalStackedBarChartModule;