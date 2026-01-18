import { useState } from "react";
import DecompositionTreeChart, {
  TreeDataNode,
} from "@/common/Charts/DecompositionTreeChart";
import TreeConfiguration from "./TreeConfiguration";

const generateSampleTree = (): TreeDataNode => ({
  id: "root",
  name: "Total Sales",
  value: 1000000,
  color: "#8b5cf6",
  children: [
    {
      id: "region-na",
      name: "North America",
      value: 600000,
      color: "#3b82f6",
      children: [
        { id: "usa", name: "USA", value: 450000, color: "#10b981" },
        { id: "canada", name: "Canada", value: 150000, color: "#06b6d4" },
      ],
    },
    {
      id: "region-eu",
      name: "Europe",
      value: 300000,
      color: "#f59e0b",
      children: [
        { id: "uk", name: "UK", value: 120000, color: "#ef4444" },
        { id: "germany", name: "Germany", value: 100000, color: "#ec4899" },
        { id: "france", name: "France", value: 80000, color: "#8b5cf6" },
      ],
    },
    {
      id: "region-asia",
      name: "Asia",
      value: 100000,
      color: "#14b8a6",
    },
  ],
});

const DecompositionTreeModule = ({ onDelete }: { onDelete?: () => void }) => {
  const [widgetTitle, setWidgetTitle] = useState("Sales Decomposition");
  const [showWidget, setShowWidget] = useState(false);
  const [treeData, setTreeData] = useState<TreeDataNode>(generateSampleTree());

  return (
    <div className="flex gap-3">
      <div className="w-full sticky top-5 h-full">
        <DecompositionTreeChart
          widgetTitle={widgetTitle}
          data={treeData}
          onToggleWidget={() => setShowWidget(!showWidget)}
          onDelete={onDelete}
          onDataChange={setTreeData}
        />
      </div>
      {showWidget && (
        <TreeConfiguration
          widgetTitle={widgetTitle}
          setWidgetTitle={setWidgetTitle}
          treeData={treeData}
          onTreeDataChange={setTreeData}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
};

export default DecompositionTreeModule;
