import { useState } from "react";

import GaugeChart from "@/common/Charts/GaugeChart";
import GaugeChartConfiguration from "../chartConfigurations/GaugeChartConfiguration";

export type LegendValue = {
  label: string;
  field: string;
  color: string;
};

const GaugeChartModule = () => {
  const [widgetTitle, setWidgetTitle] = useState("My-CSV");
  const [showWidget, setShowWidget] = useState(false); // Widget hidden by default

  const [numOfLegendDataSet, setNumOfLegendDataSet] =
    useState<number>(3);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#8D79F6" },
    { label: "", field: "", color: "#169E7B" },
    { label: "", field: "", color: "#DA4352" },
  ]);

  // Gauge chart uses ranges for the gauge value
  const [startingRange, setStartingRange] = useState<number>(0); // min gauge value
  const [endingRange, setEndingRange] = useState<number>(100); // max gauge value

  // Toggle widget visibility
  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };

  return (
    <div className="flex gap-3">
      <GaugeChart
        widgetTitle={widgetTitle}
        legendValues={legendValues}
        numOfLegendDataSet={numOfLegendDataSet}
        startingRange={startingRange}
        endingRange={endingRange}
        onToggleWidget={handleToggleWidget}
      />
      {showWidget && (
        <GaugeChartConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
          numOfLegendDataSet={numOfLegendDataSet}
          setNumOfLegendDataSet={setNumOfLegendDataSet}
          legendValues={legendValues}
          setLegendValues={setLegendValues}
          startingRange={startingRange}
          setStartingRange={setStartingRange}
          endingRange={endingRange}
          setEndingRange={setEndingRange}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
};

export default GaugeChartModule;
