import React, { useState, useEffect } from "react";
import HistogramChart from "@/common/Charts/HistogramChart";
import HistogramChartConfiguration, {
  LegendValue,
} from "../chartConfigurations/HistogramChartConfiguration";

const HistogramChartModule = () => {
  const [widgetTitle, setWidgetTitle] = useState("My-CSV");
  const [showWidget, setShowWidget] = useState(false); // Widget hidden by default

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(1);
  const [xAxisValues, setXAxisValues] = useState<string[]>([]);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(1);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#8D79F6" },
  ]);

  const [startingRange, setStartingRange] = useState<number>(0);
  const [endingRange, setEndingRange] = useState<number>(100);

  const minXaxisField = 1;
  const maxXaxisField = 10;
  const maxLegendCount = 5;

  // Initialize xAxisValues based on numOfXAxisDataSet
  useEffect(() => {
    const currentLength = xAxisValues.length;
    if (currentLength < numOfXAxisDataSet) {
      // Add empty values if needed
      const updated = [...xAxisValues];
      while (updated.length < numOfXAxisDataSet) {
        updated.push("");
      }
      setXAxisValues(updated);
    } else if (currentLength > numOfXAxisDataSet) {
      // Remove extra values
      setXAxisValues(xAxisValues.slice(0, numOfXAxisDataSet));
    }
  }, [numOfXAxisDataSet]);

  // Initialize legendValues based on numOfLegendDataSet
  useEffect(() => {
    const currentLength = legendValues.length;
    if (currentLength < numOfLegendDataSet) {
      // Add default legends if needed
      const updated = [...legendValues];
      const colors = [
        "#8D79F6", "#4F46E5", "#0EA5E9", "#10B981", "#F59E0B"
      ];
      
      while (updated.length < numOfLegendDataSet) {
        const index = updated.length;
        updated.push({
          label: `Legend ${index + 1}`,
          field: `field_${index + 1}`,
          color: colors[index % colors.length]
        });
      }
      setLegendValues(updated);
    } else if (currentLength > numOfLegendDataSet) {
      // Remove extra legends
      setLegendValues(legendValues.slice(0, numOfLegendDataSet));
    }
  }, [numOfLegendDataSet]);

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
  };

  const handleXAxisValueChange = (index: number, value: string) => {
    setXAxisValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // Handle legend count change from configuration component
  const handleLegendCountChange = (count: number) => {
    if (count >= 1 && count <= maxLegendCount) {
      setNumOfLegendDataSet(count);
    }
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
    <div className="flex gap-3">
      <HistogramChart
        widgetTitle={widgetTitle}
        xAxisValues={xAxisValues}
        legendValues={legendValues}
        numOfLegendDataSet={numOfLegendDataSet}
        startingRange={startingRange}
        endingRange={endingRange}
        onToggleWidget={handleToggleWidget}
      />
      {showWidget && (
        <HistogramChartConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
          numOfXAxisDataSet={numOfXAxisDataSet}
          handleSetNumOfXAxisDataSet={handleSetNumOfXAxisDataSet}
          xAxisValues={xAxisValues}
          handleXAxisValueChange={handleXAxisValueChange}
          numOfLegendDataSet={numOfLegendDataSet}
          setNumOfLegendDataSet={handleLegendCountChange}
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

export default HistogramChartModule;