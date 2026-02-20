import { useState, useEffect } from "react";
import { LegendValue } from "@/common/Charts/CompletedCharts/Widgets/WidgetForChartModuleOne";
import ScatterChart from "@/common/Charts/ScatterChart";
import WidgetForChartModuleTwo from "@/common/Charts/CompletedCharts/Widgets/WidgetForChartModuleTwo";
import { useAppDispatch } from "@/hooks/useRedux";
import { setWidgetConfig } from "@/store/Slices/ChartSlice/ChartSlice";

const ScatterChartModule = ({
  onDelete,
  isPreview = false,
}: {
  onDelete?: () => void;
  isPreview?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [widgetTitle, setWidgetTitle] = useState("3D Scatter Chart");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(2);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#8884d8" },
    { label: "", field: "", color: "#82ca9d" },
  ]);

  const [startingRange, setStartingRange] = useState<number>(100);
  const [endingRange, setEndingRange] = useState<number>(400);

  useEffect(() => {
    dispatch(
      setWidgetConfig({
        id: "scatter-chart",
        config: {
          widgetTitle,
          legendValues,
          numOfLegendDataSet,
          startingRange,
          endingRange,
        },
      }),
    );
  }, [
    widgetTitle,
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
    dispatch,
  ]);

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
      <div className="flex-1 min-w-0 sticky top-5 h-full">
        <ScatterChart
          widgetTitle={widgetTitle}
          legendValues={legendValues}
          numOfLegendDataSet={numOfLegendDataSet}
          startingRange={startingRange}
          endingRange={endingRange}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
          isPreview={isPreview}
        />
      </div>
      {!isPreview && showWidget && (
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
