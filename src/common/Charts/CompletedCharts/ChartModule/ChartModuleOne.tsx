// this module i created for Stacked Bar Chart, Line Chart and Area Chart
// means this this a common widget which will work for these 3 charts
import React, { useState, useEffect } from "react";
import { LegendValue } from "../Widgets/WidgetForChartModuleOne";
import StackedBarChart from "@/common/Charts/CompletedCharts/StackedBarChart/StackedBarChart";
import AreaChart from "@/common/Charts/CompletedCharts/AreaChart/AreaChart";
import MultiAxisLineChart from "@/common/Charts/CompletedCharts/LineChart/LineChart";
import WidgetForChartModuleOne from "../Widgets/WidgetForChartModuleOne";
import HeatmapChartNew from "@/common/Charts/HeatmapChartNew";
import SplineAreaChart from "@/common/Charts/SplineAreaChart";
import { useAppDispatch } from "@/hooks/useRedux";
import { setWidgetConfig } from "@/store/Slices/ChartSlice/ChartSlice";

const ChartModuleOne = ({
  chartName,
  onDelete,
  isPreview = false,
}: {
  chartName: string;
  onDelete?: () => void;
  isPreview?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [widgetTitle, setWidgetTitle] = useState("My-CSV");
  const [showWidget, setShowWidget] = useState(false);
  const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(1);
  const [xAxisValues, setXAxisValues] = useState<string[]>([]);
  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(3);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#13A490" },
    { label: "", field: "", color: "#35B6EE" },
    { label: "", field: "#", color: "#6F78F9" },
  ]);
  const [startingRange, setStartingRange] = useState<number>(0); //for y axis
  const [endingRange, setEndingRange] = useState<number>(100); // for y axis

  useEffect(() => {
    dispatch(
      setWidgetConfig({
        id: chartName,
        config: {
          widgetTitle,
          xAxisValues,
          legendValues,
          numOfLegendDataSet,
          startingRange,
          endingRange,
        },
      }),
    );
  }, [
    chartName,
    widgetTitle,
    xAxisValues,
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
    dispatch,
  ]);

  const minXaxisField = 1;
  const maxXaxisField = 7;
  const handleSetNumOfXAxisDataSet = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setNumOfXAxisDataSet(1);
    } else if (value >= minXaxisField && value <= maxXaxisField) {
      setNumOfXAxisDataSet(value);
    } else {
      setNumOfXAxisDataSet(1);
      alert(
        `Please enter a number between ${minXaxisField} and ${maxXaxisField}`,
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

  const handleToggleWidget = () => {
    if (isPreview) return;
    setShowWidget(!showWidget);
  };
  return (
    <div className="flex gap-3 h-full">
      <div className="flex-1 h-full sticky top-5">
        {(() => {
          if (chartName === "bar-chart" || chartName === "heat-map-chart") {
            // Some names might vary, but use common component
            if (chartName === "bar-chart") {
              return (
                <StackedBarChart
                  widgetTitle={widgetTitle}
                  xAxisValues={xAxisValues}
                  legendValues={legendValues}
                  numOfLegendDataSet={numOfLegendDataSet}
                  startingRange={startingRange}
                  endingRange={endingRange}
                  onDelete={onDelete}
                  isPreview={isPreview}
                  onToggleWidget={handleToggleWidget}
                  isCreationMode={true}
                />
              );
            }
            return (
              <HeatmapChartNew
                widgetTitle={widgetTitle}
                xAxisValues={xAxisValues}
                legendValues={legendValues}
                startingRange={startingRange}
                endingRange={endingRange}
                onToggleWidget={handleToggleWidget}
                onDelete={onDelete}
                isPreview={isPreview}
                isCreationMode={true}
              />
            );
          } else if (chartName === "area-chart") {
            return (
              <AreaChart
                widgetTitle={widgetTitle}
                xAxisValues={xAxisValues}
                legendValues={legendValues}
                startingRange={startingRange}
                endingRange={endingRange}
                onToggleWidget={handleToggleWidget}
                onDelete={onDelete}
                isPreview={isPreview}
                isCreationMode={true}
              />
            );
          } else if (chartName === "spline-area-chart") {
            return (
              <SplineAreaChart
                widgetTitle={widgetTitle}
                xAxisValues={xAxisValues}
                legendValues={legendValues}
                startingRange={startingRange}
                endingRange={endingRange}
                onToggleWidget={handleToggleWidget}
                onDelete={onDelete}
                isPreview={isPreview}
                isCreationMode={true}
              />
            );
          } else if (chartName === "line-chart") {
            return (
              <MultiAxisLineChart
                widgetTitle={widgetTitle}
                xAxisValues={xAxisValues}
                legendValues={legendValues}
                startingRange={startingRange}
                endingRange={endingRange}
                onDelete={onDelete}
                isPreview={isPreview}
                onToggleWidget={handleToggleWidget}
                isCreationMode={true}
              />
            );
          }
          return null;
        })()}
      </div>

      {!isPreview && showWidget && (
        <WidgetForChartModuleOne
          widgedName={
            chartName === "bar-chart"
              ? "Stacked Bar Chart"
              : chartName === "area-chart"
                ? "Area Chart"
                : chartName === "line-chart"
                  ? "Line Chart"
                  : chartName === "heat-map-chart"
                    ? "Heatmap Chart"
                    : ""
          }
          widgetTitle={widgetTitle}
          widgetCategory={
            chartName === "bar-chart"
              ? "BAR"
              : chartName === "area-chart"
                ? "AREA"
                : chartName === "line-chart"
                  ? "LINE"
                  : chartName === "heat-map-chart"
                    ? "HEATMAP"
                    : "BAR"
          }
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
          onClose={() => setShowWidget(false)}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default ChartModuleOne;
