import React, { useState, useEffect } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../../../../common/Charts/CompletedCharts/Widgets/WidgetForChartModuleOne";
import LogarithmicChart from "@/common/Charts/LogarithmicChart";
import { useAppDispatch } from "@/hooks/useRedux";
import { setWidgetConfig } from "@/store/Slices/ChartSlice/ChartSlice";

const LogarithmicChartModule = ({
  onDelete,
  isPreview = false,
}: {
  onDelete?: () => void;
  isPreview?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [widgetTitle, setWidgetTitle] = useState("Logarithmic Analysis");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(3);
  const [xAxisValues, setXAxisValues] = useState<string[]>([
    "Jan",
    "Feb",
    "Mar",
  ]);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(2);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "Growth", field: "growth", color: "#13A490" },
    { label: "Revenue", field: "revenue", color: "#35B6EE" },
  ]);
  const [startingRange, setStartingRange] = useState<number>(10);
  const [endingRange, setEndingRange] = useState<number>(10000);

  useEffect(() => {
    dispatch(
      setWidgetConfig({
        id: "logarithmic-chart",
        config: {
          widgetTitle,
          xAxisValues,
          legendValues,
          startingRange,
          endingRange,
        },
      }),
    );
  }, [
    widgetTitle,
    xAxisValues,
    legendValues,
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

  return (
    <div className="flex gap-3">
      <LogarithmicChart
        widgetTitle={widgetTitle}
        xAxisValues={xAxisValues}
        legendValues={legendValues}
        startingRange={startingRange}
        endingRange={endingRange}
        onToggleWidget={() => setShowWidget(!showWidget)}
        onDelete={onDelete}
        isPreview={isPreview}
      />
      {!isPreview && showWidget && (
        <ProjectConfiguration
          widgedName="Logarithmic Chart"
          widgetTitle={widgetTitle}
          widgetCategory="v"
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
        />
      )}
    </div>
  );
};

export default LogarithmicChartModule;
