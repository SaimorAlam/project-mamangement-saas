import React, { useState } from "react";
import ProjectConfiguration, {
    LegendValue,
} from "../WidgetForChartModuleOne";
import DecompositionTreeChart from "@/common/Charts/DecompositionTreeChart";

const DecompositionTreeModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Sales Decomposition");
  const [showWidget, setShowWidget] = useState(false);

  // For now, simpler ProjectConfiguration doesn't support deep tree editing.
  // We will expose basic title editing and perhaps generic fields that we can ignore or map to root.
  // Ideally, a new TreeConfiguration component is needed, but we reuse existing for consistency.

  const [numOfXAxisDataSet, setNumOfXAxisDataSet] = useState<number>(1);
  const [xAxisValues, setXAxisValues] = useState<string[]>(["Root Value"]);

  const [numOfLegendDataSet, setNumOfLegendDataSet] = useState<number>(1);
  const [legendValues, setLegendValues] = useState<LegendValue[]>([
    { label: "Total", field: "total", color: "#13A490" },
  ]);

  const [startingRange, setStartingRange] = useState<number>(0);
  const [endingRange, setEndingRange] = useState<number>(100);

  // We won't use x/y axis logic for the tree visually, but we keep state to satisfy component props
  const handleSetNumOfXAxisDataSet = (e: React.ChangeEvent<HTMLInputElement>) => {
      // no-op or simple state update
      setNumOfXAxisDataSet(Number(e.target.value));
  };
  const handleXAxisValueChange = (i: number, v: string) => {
      // update root name maybe?
      const newV = [...xAxisValues];
      newV[i] = v;
      setXAxisValues(newV);
  };


  return (
    <div className="flex gap-3">
      <DecompositionTreeChart
        widgetTitle={widgetTitle}
        onToggleWidget={() => setShowWidget(!showWidget)}
        onDelete={onDelete}
        // Passing dummy data or controlled data would happen here
        // For this demo, the chart generates its own sample data unless passed
      />
      {showWidget && (
        <ProjectConfiguration
          widgedName="Decomposition Tree"
          widgetTitle={widgetTitle}
          widgetCategory="TREE"
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

export default DecompositionTreeModule;
