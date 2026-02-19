import ChartSkeleton from "@/common/Skeleton/ChartSkeleton";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import ProgressChart from "@/common/Charts/Progress";
import ProjectCostChart from "@/common/Charts/ProjectCost";

import EmployeeWorkloadChart from "@/common/Charts/WorkLoad";
import TaskStatusChart from "@/common/Charts/ProgressRingTest";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";
import ClientProjectInfo from "../ClientProjectInfo";
import { useGetRootChartQuery } from "@/store/Api/ChartApi/ChartApi";
import StackedBarChart, {
  parseXAxisData,
} from "@/common/Charts/StackedBarChart";
import MultiAxisLineChart from "@/common/Charts/LineChart";
import { parseLineChartData } from "@/utils/parseLineChartData";
import HorizontalBarChart, {
  parseHorizontalBarData,
} from "@/common/Charts/HorizontalBarChart";
import { chartTypes } from "@/utils/ChartCategory";

const DashboardTab = () => {
  const { projectId } = useParams();
  const { data, isLoading } = useGetProjectByIdQuery(projectId as string);
  const { data: rootChartData, isLoading: rootChartLoading } =
    useGetRootChartQuery(projectId as string);

  const hasData = rootChartData?.data && rootChartData.data.length > 0;

  const chartComponents = useMemo(() => {
    if (rootChartLoading) return [];

    if (hasData) {
      return rootChartData?.data
        ?.filter(
          (chart: any) =>
            chart.category === "BAR" ||
            chart.category === "LINE" ||
            chart.category === "HORIZONTAL_BAR",
        )
        .map((chart: any) => {
          const category = chartTypes[chart.category];
          if (chart.category === "LINE") {
            // Handle LINE charts
            const widgets = chart?.[category]?.widgets || [];
            const legendValues = widgets.map((w: any) => ({
              label: w.legendName,
              field: w.legendName?.toLowerCase().replace(/\s+/g, ""),
              color: w.color,
            }));

            const { labels, data } = parseLineChartData(
              chart.xAxis,
              legendValues,
              chart.title,
            );

            return (
              <MultiAxisLineChart
                key={chart.id}
                widgetTitle={chart.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={legendValues.length}
                startingRange={chart[category]?.firstFieldDataset || 0}
                endingRange={chart[category]?.lastFieldDataset || 100}
                chartId={chart.id}
                projectId={projectId}
                allUploadedData={data}
                tierLevel={0}
                isPreview={true}
              />
            );
          }

          if (chart.category === "HORIZONTAL_BAR") {
            const widgets = chart?.[category]?.widgets || chart?.widgets || [];
            const legendValues = widgets.map((w: any) => ({
              label: w.legendName || w.label,
              field: (w.legendName || w.label)
                ?.toLowerCase()
                .replace(/\s+/g, ""),
              color: w.color,
            }));

            const { labels, data } = parseHorizontalBarData(
              chart.xAxis,
              legendValues,
              chart.title,
            );

            return (
              <HorizontalBarChart
                key={chart.id}
                widgetTitle={chart.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={legendValues.length}
                startingRange={chart[category]?.firstFieldDataset || 0}
                endingRange={chart[category]?.lastFieldDataset || 100}
                chartId={chart.id}
                projectId={projectId}
                allUploadedData={data}
                tierLevel={0}
                isPreview={true}
              />
            );
          }

          // Handle BAR charts
          const widgets = chart?.[category]?.widgets || [];
          const legendValues = widgets.map((w: any) => ({
            label: w.legendName,
            field: w.legendName?.toLowerCase().replace(/\s+/g, ""),
            color: w.color,
          }));

          const { labels, data } = parseXAxisData(
            chart.xAxis,
            legendValues,
            chart.title,
          );

          return (
            <StackedBarChart
              key={chart.id}
              widgetTitle={chart.title}
              xAxisValues={labels}
              legendValues={legendValues}
              numOfLegendDataSet={legendValues.length}
              startingRange={chart[category]?.firstFieldDataset || 0}
              endingRange={chart[category]?.lastFieldDataset || 100}
              chartId={chart.id}
              projectId={projectId}
              allUploadedData={data}
              tierLevel={0}
              isPreview={true}
            />
          );
        });
    }

    // Default placeholders when no data
    return [
      <TaskStatusChart key="task-status" />,
      <EmployeeWorkloadChart key="employee-workload" />,
      <ProgressChart key="progress" />,
      <ProjectCostChart key="project-cost" />,
    ];
  }, [rootChartData, rootChartLoading, hasData, projectId]);

  const chartRows = useMemo(() => {
    if (!chartComponents || chartComponents.length <= 1) return [];

    const remaining = chartComponents.slice(1);
    const rows = [];
    let i = 0;

    while (i < remaining.length) {
      // Randomly decide between 2 or 3 columns
      // 50% chance for each
      const cols = Math.random() > 0.5 ? 3 : 2;
      const bucketSize = cols;

      rows.push({
        cols,
        items: remaining.slice(i, i + bucketSize),
        key: `row-${rows.length}`,
      });

      i += bucketSize;
    }

    return rows;
  }, [chartComponents]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ClientProjectInfo projectData={data?.data} isLoading={isLoading} />
        <div className="col-span-2">
          {rootChartLoading ? <ChartSkeleton /> : <>{chartComponents[0]}</>}
        </div>
      </div>

      {rootChartLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      )}

      {!rootChartLoading &&
        chartRows.map((row) => (
          <div
            key={row.key}
            className={`grid grid-cols-1 md:${
              row.cols === 2 ? "grid-cols-2" : "grid-cols-3"
            } gap-6 mt-6`}
          >
            {row.items}
          </div>
        ))}
    </div>
  );
};

export default DashboardTab;
