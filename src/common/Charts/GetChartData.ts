import { useAppSelector } from "@/hooks/useRedux";
import { useLazyGetProjectTreeQuery } from "@/store/Api/NodeApi/NodeApi";
import { useMemo, useEffect, useState } from "react";


const useChartData = ({
  newData,
  isCreationMode,
  chartId,
}: {
  newData?: any;
  isCreationMode?: boolean;
  chartId?: string;
}) => {
  const [childTiers, setChildTiers] = useState<any[]>([]);
  const { projectId } = useAppSelector((state) => state.chartSlice);
  const [getProjectTree, { data: childNodes }] = useLazyGetProjectTreeQuery();
  useEffect(() => {
    if (!isCreationMode && (!newData || newData.length === 0)) {
      getProjectTree(projectId);
    }
  }, [projectId, newData, isCreationMode]);
  console.log(childNodes, "childNodes");
  const projectTreeData = useMemo(
    () =>
      childNodes?.data?.map((item: any) => ({
        ...item,
        id: item.id,
        name: item.taskName,
        children: item.children,
      })) || [],
    [childNodes]
  );

  const findNodeById = (nodes: any[], id: string): any => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children?.length > 0) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    if (newData && newData?.length >= 0) {
      setChildTiers(newData);
    } else if (isCreationMode) {
      setChildTiers([]);
    } else if (chartId) {
      const node = findNodeById(projectTreeData, chartId);
      setChildTiers(node?.children || []);
    } else {
      setChildTiers(projectTreeData);
    }
  }, [childNodes, newData, projectTreeData, isCreationMode, chartId]);

  return {
    childTiers,
  };
};

export default useChartData;
