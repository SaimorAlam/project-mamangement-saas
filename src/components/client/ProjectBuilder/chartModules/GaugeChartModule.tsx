import { useState } from "react";

import GaugeChart from "@/common/Charts/GaugeChart";
import GaugeChartConfiguration from "../chartConfigurations/GaugeChartConfiguration";

export type LegendValue = {
  label: string;
  field: string;
  color: string;
};

const GaugeChartModule = ({ onDelete }: { onDelete?: () => void }) => {
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
  
  // NEW STATE FOR GAUGE CHART CONFIGURATION
  const [gaugeValue, setGaugeValue] = useState<number>(50);
  const [chartHeight, setChartHeight] = useState<number>(300);
  const [startAngle, setStartAngle] = useState<number>(-90);
  const [endAngle, setEndAngle] = useState<number>(90);
  const [trackColor, setTrackColor] = useState<string>("#e7e7e7");
  const [strokeWidth, setStrokeWidth] = useState<string>("97%");
  const [fontSize, setFontSize] = useState<number>(22);
  const [shadeIntensity, setShadeIntensity] = useState<number>(0.4);

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
        // PASS ALL NEW PROPS
        gaugeValue={gaugeValue}
        chartHeight={chartHeight}
        startAngle={startAngle}
        endAngle={endAngle}
        trackColor={trackColor}
        strokeWidth={strokeWidth}
        fontSize={fontSize}
        shadeIntensity={shadeIntensity}
        onToggleWidget={handleToggleWidget}
        onDelete={onDelete}
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
          // PASS ALL NEW PROPS
          gaugeValue={gaugeValue}
          setGaugeValue={setGaugeValue}
          chartHeight={chartHeight}
          setChartHeight={setChartHeight}
          startAngle={startAngle}
          setStartAngle={setStartAngle}
          endAngle={endAngle}
          setEndAngle={setEndAngle}
          trackColor={trackColor}
          setTrackColor={setTrackColor}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          fontSize={fontSize}
          setFontSize={setFontSize}
          shadeIntensity={shadeIntensity}
          setShadeIntensity={setShadeIntensity}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
};

export default GaugeChartModule;