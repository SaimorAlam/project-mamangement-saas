import { useState, useEffect } from "react";
import ProjectConfiguration, {
  LegendValue,
} from "../../../../common/Charts/CompletedCharts/Widgets/WidgetForChartModuleOne";
import ProgressRing from "@/common/Charts/ProgressRing";
import { useAppDispatch } from "@/hooks/useRedux";
import { setWidgetConfig } from "@/store/Slices/ChartSlice/ChartSlice";

const ProgressRingModule = ({
  onDelete,
  isPreview = false,
}: {
  onDelete?: () => void;
  isPreview?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [widgetTitle, setWidgetTitle] = useState("Activity Progress");
  const [showWidget, setShowWidget] = useState(false); // Widget hidden by default

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(3);

  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "", field: "", color: "#13A490" },
    { label: "", field: "", color: "#35B6EE" },
    { label: "", field: "", color: "#6F78F9" },
  ]);

  // Progress Ring doesn't use X-axis values or Y-axis ranges, but we need placeholders for ProjectConfiguration
  const [numOfXAxisDataSet] = useState<number>(0);
  const [xAxisValues] = useState<string[]>([]);
  const [startingRange] = useState<number>(0);
  const [endingRange] = useState<number>(100);

  useEffect(() => {
    dispatch(
      setWidgetConfig({
        id: "progress-ring",
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
      <div className="flex-1 min-w-0 h-full sticky top-5">
        <ProgressRing
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
        <ProjectConfiguration
          widgedName="Progress Ring"
          widgetTitle={widgetTitle}
          widgetCategory="PROGRESS_RING"
          setWidgetTitle={setWidgetTitle}
          numOfXAxisDataSet={numOfXAxisDataSet}
          handleSetNumOfXAxisDataSet={() => {}}
          xAxisValues={xAxisValues}
          handleXAxisValueChange={() => {}}
          numOfLegendDataSet={numOfLegendDataSet}
          setNumOfLegendDataSet={setNumOfLegendDataSet}
          legendValues={legendValues}
          setLegendValues={setLegendValues}
          startingRange={startingRange}
          setStartingRange={() => {}}
          endingRange={endingRange}
          setEndingRange={() => {}}
          onClose={handleCloseWidget}
        />
      )}
    </div>
  );
};

export default ProgressRingModule;
