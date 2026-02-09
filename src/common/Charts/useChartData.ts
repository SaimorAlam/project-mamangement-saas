/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/hooks/useRedux";
import { useGetChartByIdQuery } from "@/store/Api/ChartApi/ChartApi";
// import { useLazyGetProjectTreeQuery } from "@/store/Api/NodeApi/NodeApi";
// import { useMemo, useEffect, useState } from "react";

const useChartData = ({
  // newData,
  // isCreationMode,
  chartId,
  // xAxisValues,
  // legendValues,
  // numOfLegendDataSet,
  // startingRange,
  // endingRange,
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
  // const [childTiers, setChildTiers] = useState<any[]>([]);
  const { projectId } = useAppSelector((state) => state.chartSlice);
  // const [getProjectTree, { data: childNodes }] = useLazyGetProjectTreeQuery();
  const { data } = useGetChartByIdQuery(chartId, { skip: !chartId });
  // useEffect(() => {
  //   const hasData = newData && newData.length > 0;
  //   // Only fetch if we are not in creation mode, not a specific sub-chart, and don't have existing data
  //   if (!isCreationMode && !chartId && !hasData) {
  //     getProjectTree(projectId);
  //   }
  // }, [projectId, newData, isCreationMode, chartId]);

  console.log(chartId, "From Get Chart Id");
  console.log(data, "From Get Chart Data");
  console.log(projectId, "From Get Chart Project Id");

  // const projectTreeData = useMemo(() => {
  //   const processData = (items: any[]): any[] =>
  //     items?.map((item: any) => ({
  //       ...item,
  //       id: item.id,
  //       name: item.taskName,
  //       xAxisValues,
  //       legendValues,
  //       numOfLegendDataSet,
  //       startingRange,
  //       endingRange,
  //       children:
  //         item.children && item.children.length > 0
  //           ? processData(item.children)
  //           : [],
  //     }));

  //   return data?.data ? processData(data.data) : [];
  // }, [
  //   data,
  //   xAxisValues,
  //   legendValues,
  //   numOfLegendDataSet,
  //   startingRange,
  //   endingRange,
  // ]);

  // const findNodeById = (nodes: any[], id: string): any => {
  //   for (const node of nodes) {
  //     if (node.id === id) return node;
  //     if (node.children?.length > 0) {
  //       const found = findNodeById(node.children, id);
  //       if (found) return found;
  //     }
  //   }
  //   return null;
  // };

  // useEffect(() => {
  //   let nextTiers: any[] = [];
  //   if (newData && newData.length >= 0) {
  //     nextTiers = newData;
  //   } else if (isCreationMode) {
  //     nextTiers = [];
  //   } else if (chartId) {
  //     const node = findNodeById(projectTreeData, chartId);
  //     nextTiers = node?.children || [];
  //   } else {
  //     nextTiers = projectTreeData;
  //   }

  //   // Shallow check to avoid unnecessary re-renders
  //   setChildTiers((current) => {
  //     if (current.length === 0 && nextTiers.length === 0) return current;
  //     if (current === nextTiers) return current;
  //     return nextTiers;
  //   });
  // }, [data, newData, projectTreeData, isCreationMode, chartId]);

  // // const refetch = () => {
  // //   if (projectId) {
  // //     getProjectTree(projectId);
  // //   }
  // // };

  return {
    childTiers: [],
    // refetch,
  };
};

export default useChartData;
