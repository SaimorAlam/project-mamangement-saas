import { useState } from "react";
import { LegendValue } from "../WidgetForChartModuleOne";
import ScatterChart from "@/common/Charts/ScatterChart";
import WidgetForChartModuleTwo from "../WidgetForChartModuleTwo";

const ScatterChartModule = () => {
  const [widgetTitle, setWidgetTitle] = useState("3D Scatter Chart");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(2);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#8884d8" },
    { label: "", field: "", color: "#82ca9d" },
  ]);

  const [startingRange, setStartingRange] = useState<number>(100);
  const [endingRange, setEndingRange] = useState<number>(400);

  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };

  const handleCloseWidget = () => {
    setShowWidget(false);
  };

  return (
    <div className="flex gap-3">
      <ScatterChart
        widgetTitle={widgetTitle}
        legendValues={legendValues}
        numOfLegendDataSet={numOfLegendDataSet}
        startingRange={startingRange}
        endingRange={endingRange}
        onToggleWidget={handleToggleWidget}
      />
      {showWidget && (
        <WidgetForChartModuleTwo
          widgedName="Scatter Chart"
          widgetTitle={widgetTitle}
          widgetCategory="SCATTER"
          setWidgetTitle={setWidgetTitle}
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

export default ScatterChartModule;