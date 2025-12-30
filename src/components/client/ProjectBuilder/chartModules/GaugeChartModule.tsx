import { useState } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../WidgetForChartModuleOne";
import GaugeChart from "@/common/Charts/GaugeChart";

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
  const [numOfXAxisDataSet] = useState<number>(0);
  const [xAxisValues] = useState<string[]>([]);
  const [startingRange, setStartingRange] = useState<number>(0); // min gauge value
  const [endingRange, setEndingRange] = useState<number>(100); // max gauge value

  // Dummy handler for X-axis (not used in gauge chart)
  const handleSetNumOfXAxisDataSet = () => {
    // Not used for gauge chart
  };

  const handleXAxisValueChange = () => {
    // Not used for gauge chart
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
      <GaugeChart
        widgetTitle={widgetTitle}
        legendValues={legendValues}
        numOfLegendDataSet={numOfLegendDataSet}
        startingRange={startingRange}
        endingRange={endingRange}
        onToggleWidget={handleToggleWidget}
      />
      {showWidget && (
        <ProjectConfiguration
          widgedName="Gauge Chart"
          widgetTitle={widgetTitle}
          widgetCategory="GAUGE"
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

export default GaugeChartModule;
