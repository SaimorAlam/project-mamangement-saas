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
} from "@/common/Charts/CompletedCharts/StackedBarChart/StackedBarChart";
import MultiAxisLineChart from "@/common/Charts/CompletedCharts/LineChart/LineChart";
import { parseLineChartData } from "@/utils/parseLineChartData";
import HorizontalBarChart, {
  parseHorizontalBarData,
} from "@/common/Charts/CompletedCharts/HorizontalBarChart/HorizontalBarChart";
import { chartTypes } from "@/utils/ChartCategory";
import HeatmapChartNew, {
  parseHeatmapChartData,
} from "@/common/Charts/CompletedCharts/HeatMap/HeatmapChartNew";
import PieChartWidget from "@/common/Charts/CompletedCharts/PieChart/PieChart";
import ColumnBarChart from "@/common/Charts/CompletedCharts/ColumnChart/ColumnBarChart";
import RadarChartNew from "@/common/Charts/RadarChartNew";
import DoughnutChart from "@/common/Charts/DoughnutChart";
import AreaChart from "@/common/Charts/CompletedCharts/AreaChart/AreaChart";
import ParetoChart from "@/common/Charts/ParetoChart";
import HistogramChart from "@/common/Charts/HistogramChart";
import ScatterChart from "@/common/Charts/ScatterChart";
import GaugeChart from "@/common/Charts/GaugeChart";
import FunnelChart from "@/common/Charts/FunnelChart";
import WaterfallChart from "@/common/Charts/WaterfallChart";
import HorizontalStackedBarChart from "@/common/Charts/HorizontalStackedBarChart";
import ComboChart from "@/common/Charts/ComboChart";
import CandleChart from "@/common/Charts/CandleChart";

import SplineAreaChart from "@/common/Charts/CompletedCharts/SplineAreaChart/SplineAreaChart";
import SparkLinesChart from "@/common/Charts/SparkLinesChart";

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
        ?.filter((chart: any) => !!chartTypes[chart.category])
        .map((item: any) => {
          const categoryKey = item.category?.toUpperCase();
          const chartProperty = chartTypes[categoryKey];
          const chartData = chartProperty ? item[chartProperty] : null;

          if (categoryKey === "LINE") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels, data } = parseLineChartData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <MultiAxisLineChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={
                  chartData?.numberOfDataset || legendValues.length
                }
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                projectId={projectId}
                allUploadedData={data}
                tierLevel={0}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "HORIZONTAL_BAR") {
            const legendValues = (
              chartData?.widgets ||
              item?.widgets ||
              []
            ).map((w: any) => ({
              label: w.legendName || w.label,
              color: w.color,
              field: (w.legendName || w.label)
                ?.toLowerCase()
                .replace(/\s+/g, ""),
            }));

            const { labels, data } = parseHorizontalBarData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <HorizontalBarChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                projectId={projectId}
                allUploadedData={data}
                tierLevel={0}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "BAR") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels, data } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <StackedBarChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                widgets={chartData?.widgets}
                numOfLegendDataSet={chartData?.numberOfDataset}
                startingRange={chartData?.firstFieldDataset}
                endingRange={chartData?.lastFieldDataset}
                chartId={item?.id}
                projectId={projectId}
                allUploadedData={data}
                tierLevel={0}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "HEATMAP") {
            const heatmapConfig = item?.heatmap || chartData;
            const legendValues =
              (heatmapConfig?.widgets || [])?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels, data } = parseHeatmapChartData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <HeatmapChartNew
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={heatmapConfig?.numberOfDataset}
                startingRange={heatmapConfig?.firstFieldDataset}
                endingRange={heatmapConfig?.lastFieldDataset}
                chartId={item?.id}
                projectId={projectId}
                allUploadedData={data}
                tierLevel={0}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "PIE") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { data } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <PieChartWidget
                key={item.id}
                widgetTitle={item?.title}
                legendValues={legendValues}
                numOfLegendDataSet={chartData?.numberOfDataset}
                chartId={item?.id}
                allUploadedData={data}
                projectId={item?.projectId}
                tierLevel={0}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "COLUMN") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <ColumnBarChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={chartData?.numberOfDataset}
                startingRange={chartData?.firstFieldDataset}
                endingRange={chartData?.lastFieldDataset}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "RADAR") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <RadarChartNew
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={chartData?.numberOfDataset}
                startingRange={chartData?.firstFieldDataset}
                endingRange={chartData?.lastFieldDataset}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "DOUGHNUT") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                name: w.legendName || w.label,
                color: w.color,
                value: 0,
                count: 0,
              })) || [];

            return (
              <DoughnutChart
                key={item.id}
                title={item?.title}
                data={legendValues}
                centerLabel="Total"
              />
            );
          }

          if (categoryKey === "AREA") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <AreaChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={
                  chartData?.numberOfDataset || legendValues.length
                }
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "PARETO") {
            const { labels } = parseXAxisData(item?.xAxis, [], item?.title);

            return (
              <ParetoChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "HISTOGRAM") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <HistogramChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "SCATTER") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            return (
              <ScatterChart
                key={item.id}
                widgetTitle={item?.title}
                legendValues={legendValues}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "GAUGE") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            return (
              <GaugeChart
                key={item.id}
                widgetTitle={item?.title}
                legendValues={legendValues}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "FUNNEL") {
            const { labels } = parseXAxisData(item?.xAxis, [], item?.title);

            return (
              <FunnelChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "WATERFALL") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <WaterfallChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "STACK_BAR_HORIZONTAL") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <HorizontalStackedBarChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={
                  chartData?.numberOfDataset || legendValues.length
                }
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "MIXED") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <ComboChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={
                  chartData?.numberOfDataset || legendValues.length
                }
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "CANDLESTICK") {
            const { labels } = parseXAxisData(item?.xAxis, [], item?.title);

            return (
              <CandleChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                numOfLegendDataSet={chartData?.numberOfDataset || 1}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "SPLINE") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels, data } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <SplineAreaChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                projectId={projectId}
                allUploadedData={data}
                isPreview={true}
              />
            );
          }

          if (categoryKey === "SPARKLINE") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              })) || [];

            const { labels, data } = parseXAxisData(
              item?.xAxis,
              legendValues,
              item?.title,
            );

            return (
              <SparkLinesChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
                projectId={projectId}
                allUploadedData={data}
                isPreview={true}
              />
            );
          }

          return null;
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

    const remainingItems = chartComponents.slice(1);
    const rows = [];
    let i = 0;

    while (i < remainingItems.length) {
      const itemsLeft = remainingItems.length - i;
      // Alternate between 2 and 3 columns (Row 0: 2, Row 1: 3, Row 2: 2...)
      let capacity: number = rows.length % 2 === 0 ? 2 : 3;

      // Special logic to avoid leaving a single item on the last row
      if (itemsLeft === 4) {
        capacity = 2; // Split 4 into 2 + 2 instead of 3 + 1
      } else if (itemsLeft === 3) {
        capacity = 3; // Take all 3 at once instead of 2 + 1
      } else if (itemsLeft < capacity) {
        capacity = itemsLeft;
      }

      const chunk = remainingItems.slice(i, i + capacity);
      rows.push({
        cols: capacity,
        items: chunk,
        key: `row-${rows.length}`,
      });
      i += chunk.length;
    }

    return rows;
  }, [chartComponents]);

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ClientProjectInfo projectData={data?.data} isLoading={isLoading} />
        <div className="col-span-2 h-full">
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
            className={`grid grid-cols-1 gap-6 mt-6 ${
              row.cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {row.items}
          </div>
        ))}
    </div>
  );
};

export default DashboardTab;
