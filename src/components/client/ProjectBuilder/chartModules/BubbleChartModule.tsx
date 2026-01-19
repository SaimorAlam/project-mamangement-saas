import React, { useState, useEffect } from "react";
import BubbleChartConfigurationWidget, {
  LegendValue,
} from "../chartConfigurations/BubbleChartConfigurationWidget";
import BubbleChart from "@/common/Charts/BubbleChart";
import { useAppDispatch } from "@/hooks/useRedux";
import { setWidgetConfig } from "@/store/Slices/ChartSlice/ChartSlice";

const BubbleChartModule = ({
  onDelete,
  isPreview = false,
}: {
  onDelete?: () => void;
  isPreview?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [widgetTitle, setWidgetTitle] = useState("Bubble Chart");
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
  const [startingRange, setStartingRange] = useState<number>(10); //for y axis
  const [endingRange, setEndingRange] = useState<number>(70); // for y axis

  // NEW STATE FOR BUBBLE CHART CONFIGURATION
  const [minBubbleSize, setMinBubbleSize] = useState<number>(15);
  const [maxBubbleSize, setMaxBubbleSize] = useState<number>(75);
  const [opacity, setOpacity] = useState<number>(0.8);
  const [chartHeight, setChartHeight] = useState<number>(350);

  const minXaxisField = 1;
  const maxXaxisField = 20;

  useEffect(() => {
    dispatch(
      setWidgetConfig({
        id: "bubble-chart",
        config: {
          widgetTitle,
          xAxisValues,
          legendValues,
          numOfLegendDataSet,
          startingRange,
          endingRange,
          minBubbleSize,
          maxBubbleSize,
          opacity,
          chartHeight,
        },
      }),
    );
  }, [
    widgetTitle,
    xAxisValues,
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
    minBubbleSize,
    maxBubbleSize,
    opacity,
    chartHeight,
    dispatch,
  ]);

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
    if (!isPreview) {
      setShowWidget(!showWidget);
    }
  };

  const handleCloseWidget = () => {
    setShowWidget(false);
  };

  return (
    <div className="flex gap-3 h-full w-full">
      <div className="flex-1 min-w-0 h-full sticky top-5">
        <BubbleChart
          widgetTitle={widgetTitle}
          xAxisValues={xAxisValues}
          legendValues={legendValues}
          numOfLegendDataSet={numOfLegendDataSet}
          startingRange={startingRange}
          endingRange={endingRange}
          minBubbleSize={minBubbleSize}
          maxBubbleSize={maxBubbleSize}
          opacity={opacity}
          chartHeight={chartHeight}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
          isPreview={isPreview}
        />
      </div>
      {!isPreview && showWidget && (
        <div className="shrink-0 sticky top-5">
            <BubbleChartConfigurationWidget
              widgedName="Bubble Chart"
              widgetTitle={widgetTitle}
              widgetCategory="BUBBLE"
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
              minBubbleSize={minBubbleSize}
              setMinBubbleSize={setMinBubbleSize}
              maxBubbleSize={maxBubbleSize}
              setMaxBubbleSize={setMaxBubbleSize}
              opacity={opacity}
              setOpacity={setOpacity}
              chartHeight={chartHeight}
              setChartHeight={setChartHeight}
              onClose={handleCloseWidget}
            />
        </div>
      )}
    </div>
  );
};

export default BubbleChartModule;
