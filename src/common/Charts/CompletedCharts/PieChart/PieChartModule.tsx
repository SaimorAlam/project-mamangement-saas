import { useState, useEffect } from "react";
import PieChartConfiguration, {
  LegendValue,
} from "./PieChartConfiguration";
import PieChartWidget from "@/common/Charts/CompletedCharts/PieChart/PieChart";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setWidgetConfig } from "@/store/Slices/ChartSlice/ChartSlice";

const PieChartModule = ({
  onDelete,
  isPreview = false,
}: {
  onDelete?: () => void;
  isPreview?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const projectId = useAppSelector((state) => state.chartSlice.projectId);
  const [widgetTitle, setWidgetTitle] = useState("My-Pie-Chart");
  const [showWidget, setShowWidget] = useState(false); // Widget hidden by default

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(3);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "Category A", field: "categorya", color: "#13A490" },
    { label: "Category B", field: "categoryb", color: "#35B6EE" },
    { label: "Category C", field: "categoryc", color: "#6F78F9" },
  ]);

  useEffect(() => {
    dispatch(
      setWidgetConfig({
        id: "pie-chart",
        config: {
          widgetTitle,
          legendValues,
          numOfLegendDataSet,
        },
      }),
    );
  }, [widgetTitle, legendValues, numOfLegendDataSet, dispatch]);

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
        <PieChartWidget
          widgetTitle={widgetTitle}
          legendValues={legendValues}
          numOfLegendDataSet={numOfLegendDataSet}
          onToggleWidget={handleToggleWidget}
          onDelete={onDelete}
          isPreview={isPreview}
          projectId={projectId}
          isCreationMode={true}
        />
      </div>
      {!isPreview && showWidget && (
        <PieChartConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
          numOfLegendDataSet={numOfLegendDataSet}
          setNumOfLegendDataSet={setNumOfLegendDataSet}
          legendValues={legendValues}
          setLegendValues={setLegendValues}
          onClose={handleCloseWidget}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default PieChartModule;
