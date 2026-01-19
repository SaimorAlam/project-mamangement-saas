import { useState, useEffect } from "react";
import DecompositionTreeChart, {
  TreeDataNode,
} from "@/common/Charts/DecompositionTreeChart";
import TreeConfiguration from "./TreeConfiguration";
import { useAppDispatch } from "@/hooks/useRedux";
import { setWidgetConfig } from "@/store/Slices/ChartSlice/ChartSlice";

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

const DecompositionTreeModule = ({
  onDelete,
  isPreview = false,
}: {
  onDelete?: () => void;
  isPreview?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [widgetTitle, setWidgetTitle] = useState("Sales Decomposition");
  const [showWidget, setShowWidget] = useState(false);
  const [treeData, setTreeData] = useState<TreeDataNode>(generateSampleTree());

  useEffect(() => {
    dispatch(
      setWidgetConfig({
        id: "decomposition-tree",
        config: {
          widgetTitle,
          treeData,
        },
      }),
    );
  }, [widgetTitle, treeData, dispatch]);

  return (
    <div className="flex gap-3">
      <div className="flex-1 sticky top-5 h-full min-w-0">
        <DecompositionTreeChart
          widgetTitle={widgetTitle}
          data={treeData}
          onToggleWidget={() => setShowWidget(!showWidget)}
          onDelete={onDelete}
          onDataChange={setTreeData}
          isPreview={isPreview}
        />
      </div>
      {!isPreview && showWidget && (
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
