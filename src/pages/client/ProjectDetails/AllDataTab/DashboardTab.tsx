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
import HeatmapChartNew from "@/common/Charts/HeatmapChartNew";
import PieChartWidget from "@/common/Charts/PieChart";
import ColumnBarChart from "@/common/Charts/ColumnBarChart";
import RadarChartNew from "@/common/Charts/RadarChartNew";
import DoughnutChart from "@/common/Charts/DoughnutChart";
import AreaChart from "@/common/Charts/AreaChart";
import ParetoChart from "@/common/Charts/ParetoChart";
import HistogramChart from "@/common/Charts/HistogramChart";
import ScatterChart from "@/common/Charts/ScatterChart";
import GaugeChart from "@/common/Charts/GaugeChart";
import FunnelChart from "@/common/Charts/FunnelChart";
import WaterfallChart from "@/common/Charts/WaterfallChart";
import HorizontalStackedBarChart from "@/common/Charts/HorizontalStackedBarChart";
import ComboChart from "@/common/Charts/ComboChart";
import CandleChart from "@/common/Charts/CandleChart";
import { parsePieChartData } from "@/utils/parsePieChartData";

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
                numOfLegendDataSet={chartData?.numberOfDataset || legendValues.length}
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
              <HeatmapChartNew
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={chartData?.numberOfDataset}
                startingRange={chartData?.firstFieldDataset}
                endingRange={chartData?.lastFieldDataset}
                chartId={item?.id}
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

            const pieData = parsePieChartData(item?.xAxis, legendValues);

            return (
              <PieChartWidget
                key={item.id}
                widgetTitle={item?.title}
                legendValues={legendValues}
                numOfLegendDataSet={chartData?.numberOfDataset}
                chartId={item?.id}
                allUploadedData={pieData}
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
                numOfLegendDataSet={chartData?.numberOfDataset || legendValues.length}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
              />
            );
          }

          if (categoryKey === "PARETO") {
            const { labels } = parseXAxisData(
              item?.xAxis,
              [],
              item?.title,
            );

            return (
              <ParetoChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
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
              />
            );
          }

          if (categoryKey === "FUNNEL") {
            const { labels } = parseXAxisData(
              item?.xAxis,
              [],
              item?.title,
            );

            return (
              <FunnelChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
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
                numOfLegendDataSet={chartData?.numberOfDataset || legendValues.length}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
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
                numOfLegendDataSet={chartData?.numberOfDataset || legendValues.length}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
              />
            );
          }

          if (categoryKey === "CANDLESTICK") {
            const { labels } = parseXAxisData(
              item?.xAxis,
              [],
              item?.title,
            );

            return (
              <CandleChart
                key={item.id}
                widgetTitle={item?.title}
                xAxisValues={labels}
                numOfLegendDataSet={chartData?.numberOfDataset || 1}
                startingRange={chartData?.firstFieldDataset || 0}
                endingRange={chartData?.lastFieldDataset || 100}
                chartId={item?.id}
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
