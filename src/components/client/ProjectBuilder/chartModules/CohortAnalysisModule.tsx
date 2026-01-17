import { useState, useEffect } from "react";
import CohortAnalysisChart from "@/common/Charts/CohortAnalysisChart";
import CohortAnalysisConfiguration, { LegendValue } from "../chartConfigurations/CohortAnalysisConfiguration";

const CohortAnalysisModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Retention Cohort Survival");
  const [showWidget, setShowWidget] = useState(false);

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(5);
  const [xAxisValues, setXAxisValues] = useState<string[]>(["Month 0", "Month 1", "Month 2", "Month 3", "Month 4"]);
  
  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(3);
  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "Q1 Signup", field: "q1", color: "#6366f1" },
    { label: "Q2 Signup", field: "q2", color: "#10b981" },
    { label: "Q3 Signup", field: "q3", color: "#f59e0b" },
  ]);

  // Sync xAxisValues when numOfXAxisDataSet changes
  useEffect(() => {
     setXAxisValues(prev => {
        const next = [...prev];
        while(next.length < numOfXAxisDataSet) {
            next.push(`Month ${next.length}`);
        }
        return next.slice(0, numOfXAxisDataSet);
     });
  }, [numOfXAxisDataSet]);

  const handleXAxisValueChange = (index: number, value: string) => {
    setXAxisValues((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleToggleWidget = () => {
    setShowWidget(!showWidget);
  };

  return (
    <div className="flex gap-3">
      <CohortAnalysisChart
        widgetTitle={widgetTitle}
        xAxisValues={xAxisValues}
        legendValues={legendValues}
        numOfLegendDataSet={numOfLegendDataSet}
        onToggleWidget={handleToggleWidget}
        onDelete={onDelete}
      />
      {showWidget && (
        <CohortAnalysisConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
          xAxisValues={xAxisValues}
          handleXAxisValueChange={handleXAxisValueChange}
          numOfXAxisDataSet={numOfXAxisDataSet}
          setNumOfXAxisDataSet={setNumOfXAxisDataSet}
          numOfLegendDataSet={numOfLegendDataSet}
          setNumOfLegendDataSet={setNumOfLegendDataSet}
          legendValues={legendValues}
          setLegendValues={setLegendValues}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
};

export default CohortAnalysisModule;
