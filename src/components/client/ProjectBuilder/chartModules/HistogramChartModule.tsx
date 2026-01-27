import React, { useState, useEffect } from "react";
import HistogramChart from "@/common/Charts/HistogramChart";
import HistogramChartConfiguration, {
  LegendValue,
} from "../chartConfigurations/HistogramChartConfiguration";
import { useAppDispatch } from "@/hooks/useRedux";
import { setWidgetConfig } from "@/store/Slices/ChartSlice/ChartSlice";

const HistogramChartModule = ({
  onDelete,
  isPreview = false,
}: {
  onDelete?: () => void;
  isPreview?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [widgetTitle, setWidgetTitle] = useState("Histogram Analysis");
  const [showWidget, setShowWidget] = useState(false); // Widget hidden by default

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] =
    useState<number>(1);
  const [xAxisValues, setXAxisValues] = useState<string[]>([]);

  const [numOfLegendDataSet, setNumOfLegendDataSet] =
    useState<number>(1);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#8D79F6" },
  ]);

  const [startingRange, setStartingRange] = useState<number>(0);
  const [endingRange, setEndingRange] = useState<number>(100);

  // NEW STATE FOR HISTOGRAM CHART CONFIGURATION
  const [chartHeight, setChartHeight] = useState<number>(400);
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [dataPointsPerSeries, setDataPointsPerSeries] =
    useState<number>(50);
  const [fillOpacity, setFillOpacity] = useState<number>(0.7);
  const [binCount, setBinCount] = useState<number>(10);

  const minXaxisField = 1;
  const maxXaxisField = 10;

  useEffect(() => {
    dispatch(
      setWidgetConfig({
        id: "histogram-chart",
        config: {
          widgetTitle,
          xAxisValues,
          legendValues,
          numOfLegendDataSet,
          startingRange,
          endingRange,
          chartHeight,
          strokeWidth,
          dataPointsPerSeries,
          fillOpacity,
          binCount,
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
    chartHeight,
    strokeWidth,
    dataPointsPerSeries,
    fillOpacity,
    binCount,
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
        <HistogramChart
          widgetTitle={widgetTitle}
          xAxisValues={xAxisValues}
          legendValues={legendValues}
          numOfLegendDataSet={numOfLegendDataSet}
          startingRange={startingRange}
          endingRange={endingRange}
          chartHeight={chartHeight}
          strokeWidth={strokeWidth}
          dataPointsPerSeries={dataPointsPerSeries}
          fillOpacity={fillOpacity}
          binCount={binCount}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
          isPreview={isPreview}
        />
      </div>
      {!isPreview && showWidget && (
        <div className="shrink-0 sticky top-5">
            <HistogramChartConfiguration
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
              startingRange={startingRange}
              setStartingRange={setStartingRange}
              endingRange={endingRange}
              setEndingRange={setEndingRange}
              chartHeight={chartHeight}
              setChartHeight={setChartHeight}
              strokeWidth={strokeWidth}
              setStrokeWidth={setStrokeWidth}
              dataPointsPerSeries={dataPointsPerSeries}
              setDataPointsPerSeries={setDataPointsPerSeries}
              fillOpacity={fillOpacity}
              setFillOpacity={setFillOpacity}
              binCount={binCount}
              setBinCount={setBinCount}
              onClose={handleCloseWidget}
            />
        </div>
      )}
    </div>
  );
};

export default HistogramChartModule;
