/* eslint-disable @typescript-eslint/no-explicit-any */
import StackedBarChart from "@/common/Charts/StackedBarChart";
import { ChartData } from "@/common/Charts/StackedBarChart";
import HorizontalBarChart, {
  parseHorizontalBarData,
} from "@/common/Charts/HorizontalBarChart";
import LineChart from "@/common/Charts/LineChart";
import { parseLineChartData } from "@/utils/parseLineChartData";
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
import { chartTypes } from "@/utils/ChartCategory";

const parseXAxisData = (
  xAxis: any[][] | string,
  legendValues: any[],
  widgetTitle: string,
) => {
  let parsedXAxis = xAxis;

  if (typeof xAxis === "string") {
    try {
      parsedXAxis = JSON.parse(xAxis);
    } catch (error) {
      console.error("Error parsing xAxis JSON:", error);
      parsedXAxis = [];
    }
  }

  if (!parsedXAxis || !Array.isArray(parsedXAxis) || parsedXAxis.length === 0) {
    return { labels: [], data: {} as { [key: string]: ChartData[] } };
  }

  // First row is the header
  const headers = parsedXAxis[0];
  if (!Array.isArray(headers) || headers.length === 0) {
    return { labels: [], data: {} as { [key: string]: ChartData[] } };
  }

  // Extract labels from the first column of data rows (skip header)
  const labels = parsedXAxis.slice(1).map((row) => String(row[0] || ""));

  // Transform data into the format expected by StackedBarChart
  const chartData: ChartData[] = parsedXAxis.slice(1).map((row) => {
    const dataPoint: ChartData = { name: String(row[0] || "") };

    // Map each legend to its corresponding column value
    legendValues.forEach((legend, index) => {
      const columnIndex = index + 1; // Skip first column (label)
      dataPoint[legend.field] = Number(row[columnIndex]) || 0;
    });

    return dataPoint;
  });

  // Create data object keyed by sheet name (sanitized widget title)
  const sheetName = (widgetTitle || "Sheet")
    .replace(/[:/?*[\]\\]/g, " ")
    .trim()
    .substring(0, 31);

  return { labels, data: { [sheetName]: chartData } };
};

const DefaultChartData = ({ projectsChartsData }: any) => {
  return (
    <div className="flex flex-wrap gap-6">
      {projectsChartsData
        ?.filter((item: any) => item.parentId === null)
        .map((item: any) => {
          const categoryKey = item.category?.toUpperCase();
          const chartProperty = chartTypes[categoryKey];
          const chartData = chartProperty ? item[chartProperty] : null;
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
              <div key={item.id} className="w-full">
                <StackedBarChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  widgets={chartData?.widgets}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                  projectId={item?.projectId}
                  allUploadedData={data}
                />
              </div>
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
              <div key={item.id} className="w-full">
                <HorizontalBarChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  widgets={chartData?.widgets}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                  projectId={item?.projectId}
                  allUploadedData={data}
                />
              </div>
            );
          }
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
              <div key={item.id} className="w-full">
                <LineChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  widgets={chartData?.widgets}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                  projectId={item?.projectId}
                  allUploadedData={data}
                />
              </div>
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
              <div key={item.id} className="w-full">
                <HeatmapChartNew
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
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

            return (
              <div key={item.id} className="w-full">
                <PieChartWidget
                  widgetTitle={item?.title}
                  legendValues={legendValues}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  chartId={item?.id}
                />
              </div>
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
              <div key={item.id} className="w-full">
                <ColumnBarChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
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
              <div key={item.id} className="w-full">
                <RadarChartNew
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
            );
          }
          if (categoryKey === "DOUGHNUT") {
            const legendValues =
              (chartData?.widgets || item?.widgets)?.map((w: any) => ({
                name: w.legendName || w.label,
                color: w.color,
                value: 0, // Placeholder
                count: 0,
              })) || [];

            return (
              <div key={item.id} className="w-full">
                <DoughnutChart
                  title={item?.title}
                  data={legendValues}
                  centerLabel="Total"
                />
              </div>
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
              <div key={item.id} className="w-full">
                <AreaChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
            );
          }
          if (categoryKey === "PARETO") {
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
              <div key={item.id} className="w-full">
                <ParetoChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
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
              <div key={item.id} className="w-full">
                <HistogramChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
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
              <div key={item.id} className="w-full">
                <ScatterChart
                  widgetTitle={item?.title}
                  legendValues={legendValues}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
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
              <div key={item.id} className="w-full">
                <GaugeChart
                  widgetTitle={item?.title}
                  legendValues={legendValues}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
            );
          }
          if (categoryKey === "FUNNEL") {
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
              <div key={item.id} className="w-full">
                <FunnelChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
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
              <div key={item.id} className="w-full">
                <WaterfallChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
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
              <div key={item.id} className="w-full">
                <HorizontalStackedBarChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
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
              <div key={item.id} className="w-full">
                <ComboChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
            );
          }
          if (categoryKey === "CANDLESTICK") {
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
              <div key={item.id} className="w-full">
                <CandleChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  numOfLegendDataSet={chartData?.numberOfDataset}
                  startingRange={chartData?.firstFieldDataset}
                  endingRange={chartData?.lastFieldDataset}
                  chartId={item?.id}
                />
              </div>
            );
          }
          return null;
        })}
    </div>
  );
};

export default DefaultChartData;
