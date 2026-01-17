/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/hooks/useRedux";
import { useLazyGetProjectTreeQuery } from "@/store/Api/NodeApi/NodeApi";
import { useMemo, useEffect, useState } from "react";


const useChartData = ({
  newData,
  isCreationMode,
  chartId,
  xAxisValues,
  legendValues,
  numOfLegendDataSet,
  startingRange,
  endingRange,
}: {
  newData?: any;
  isCreationMode?: boolean;
  chartId?: string;
  xAxisValues?: string[];
  legendValues?: { label: string; color: string }[];
  numOfLegendDataSet?: number;
  startingRange?: number;
  endingRange?: number;
}) => {
  const [childTiers, setChildTiers] = useState<any[]>([]);
  const { projectId } = useAppSelector((state) => state.chartSlice);
  const [getProjectTree, { data: childNodes }] = useLazyGetProjectTreeQuery();
  useEffect(() => {
    if (!isCreationMode && (!newData || newData.length === 0)) {
      getProjectTree(projectId);
    }
  }, [projectId, newData, isCreationMode]);

  const projectTreeData = useMemo(() => {
    const processData = (items: any[]): any[] =>
      items.map((item: any) => ({
        ...item,
        id: item.id,
        name: item.taskName,
        xAxisValues,
        legendValues,
        numOfLegendDataSet,
        startingRange,
        endingRange,
        children: item.children ? processData(item.children) : [],
      }));

    return childNodes?.data ? processData(childNodes.data) : [];
  }, [
    childNodes,
    xAxisValues,
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
  ]);

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

  const refetch = () => {
    if (projectId) {
        getProjectTree(projectId);
    }
  }

  return {
    childTiers,
    refetch
  };
};

export default useChartData;
