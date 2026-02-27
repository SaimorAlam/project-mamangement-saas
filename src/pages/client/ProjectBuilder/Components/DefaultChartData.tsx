/* eslint-disable @typescript-eslint/no-explicit-any */
import StackedBarChart from "@/common/Charts/CompletedCharts/StackedBarChart/StackedBarChart";
import { ChartData } from "@/common/Charts/CompletedCharts/StackedBarChart/StackedBarChart";
import HorizontalBarChart, {
  parseHorizontalBarData,
} from "@/common/Charts/CompletedCharts/HorizontalBarChart/HorizontalBarChart";
import LineChart from "@/common/Charts/CompletedCharts/LineChart/LineChart";
import { parseLineChartData } from "@/utils/parseLineChartData";
import HeatmapChartNew from "@/common/Charts/HeatmapChartNew";
import PieChartWidget from "@/common/Charts/CompletedCharts/PieChart/PieChart";
import ColumnBarChart from "@/common/Charts/ColumnBarChart";
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
import { chartTypes } from "@/utils/ChartCategory";
import { parsePieChartData } from "@/utils/parsePieChartData";

const parseXAxisData = (
  xAxis: any[][] | string,
  legendValues: any[],
  widgetTitle: string,
) => {
  let parsedXAxis: any = xAxis;

  if (typeof xAxis === "string") {
    try {
      parsedXAxis = JSON.parse(xAxis);
    } catch (error) {
      console.error("Error parsing xAxis JSON:", error);
      parsedXAxis = [];
    }
  }

  // Handle case where API returns { labels: [...] }
  if (
    parsedXAxis &&
    !Array.isArray(parsedXAxis) &&
    typeof parsedXAxis === "object"
  ) {
    if ("labels" in parsedXAxis) {
      parsedXAxis = parsedXAxis.labels;
    }
  }

  if (!parsedXAxis || !Array.isArray(parsedXAxis) || parsedXAxis.length === 0) {
    return { labels: [], data: {} as { [key: string]: ChartData[] } };
  }

  // Smart header detection: a header row has legend labels (strings) in data columns,
  // whereas data rows have numbers (0 by default in creation mode).
  const hasHeader =
    parsedXAxis.length > 0 &&
    Array.isArray(parsedXAxis[0]) &&
    parsedXAxis[0].length > 1 &&
    typeof parsedXAxis[0][1] === "string";

  const dataRows = hasHeader ? parsedXAxis.slice(1) : parsedXAxis;
  const labels = dataRows.map((row) => String(row[0] || ""));

  // Transform data: first element is the label, subsequent elements are dataset values
  const chartData: ChartData[] = dataRows.map((row) => {
    const dataPoint: ChartData = { name: String(row[0] || "") };

    // Map each legend to its corresponding column value (starting from index 1)
    legendValues.forEach((legend, index) => {
      const columnIndex = index + 1;
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
      {projectsChartsData?.map((item: any) => {
        const categoryKey = item.category?.toUpperCase();
        const chartProperty = chartTypes[categoryKey];

        // Normalize chart data between standard and program builder formats
        // Program builder format nests under 'chartData', standard uses dynamic keys via chartTypes
        const chartData =
          item.chartData || (chartProperty ? item[chartProperty] : null);

        // Standard format has xAxis string/array at root.
        // Program builder format has it in valueDetection.matching
        const xAxisData = item.valueDetection?.matching || item.xAxis;

        // API field normalization (Program Builder uses 'firstFiledDataset', 'lastFiledDAtaset')
        const firstField =
          chartData?.firstFiledDataset ?? chartData?.firstFieldDataset;
        const lastField =
          chartData?.lastFiledDAtaset ?? chartData?.lastFieldDataset;
        const numDatasets = chartData?.numberOfDataset;

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
            xAxisData,
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
                numOfLegendDataSet={numDatasets}
                startingRange={firstField}
                endingRange={lastField}
                chartId={item?.id}
                projectId={item?.projectId}
                allUploadedData={data}
              />
            </div>
          );
        }
        if (categoryKey === "HORIZONTAL_BAR") {
          const legendValues = (chartData?.widgets || item?.widgets || []).map(
            (w: any) => ({
              label: w.legendName || w.label,
              color: w.color,
              field: (w.legendName || w.label)
                ?.toLowerCase()
                .replace(/\s+/g, ""),
            }),
          );

          const { labels, data } = parseHorizontalBarData(
            xAxisData,
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
                startingRange={firstField}
                endingRange={lastField}
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
            xAxisData,
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
                numOfLegendDataSet={numDatasets}
                startingRange={firstField}
                endingRange={lastField}
                chartId={item?.id}
                projectId={item?.projectId}
                allUploadedData={data}
              />
            </div>
          );
        }
        if (categoryKey === "HEATMAP") {
          const heatmapConfig = item?.heatmap || chartData;
          const numDatasets = heatmapConfig?.numberOfDataset || 1;
          const firstField = heatmapConfig?.firstFieldDataset || 0;
          const lastField = heatmapConfig?.lastFieldDataset || 100;

          const legendValues =
            (heatmapConfig?.widgets || [])?.map((w: any) => ({
              label: w.legendName || w.label,
              color: w.color,
              field: (w.legendName || w.label)
                ?.toLowerCase()
                .replace(/\s+/g, ""),
            })) || [];

          const { labels, data } = parseXAxisData(
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <HeatmapChartNew
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={numDatasets}
                startingRange={firstField}
                endingRange={lastField}
                chartId={item?.id}
                projectId={item?.projectId}
                allUploadedData={data}
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

          const pieData = parsePieChartData(xAxisData, legendValues);

          return (
            <div key={item.id} className="w-full">
              <PieChartWidget
                widgetTitle={item?.title}
                legendValues={legendValues}
                numOfLegendDataSet={numDatasets}
                chartId={item?.id}
                allUploadedData={pieData}
                projectId={item?.projectId}
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
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <ColumnBarChart
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={numDatasets}
                startingRange={firstField}
                endingRange={lastField}
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
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <RadarChartNew
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={numDatasets}
                startingRange={firstField}
                endingRange={lastField}
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

          const { labels, data } = parseXAxisData(
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <AreaChart
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={numDatasets}
                startingRange={firstField}
                endingRange={lastField}
                chartId={item?.id}
                projectId={item?.projectId}
                allUploadedData={data}
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
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <ParetoChart
                widgetTitle={item?.title}
                xAxisValues={labels}
                startingRange={firstField}
                endingRange={lastField}
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
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <HistogramChart
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                startingRange={firstField}
                endingRange={lastField}
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
                startingRange={firstField}
                endingRange={lastField}
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
                startingRange={firstField}
                endingRange={lastField}
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
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <FunnelChart
                widgetTitle={item?.title}
                xAxisValues={labels}
                startingRange={firstField}
                endingRange={lastField}
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
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <WaterfallChart
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                startingRange={firstField}
                endingRange={lastField}
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
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <HorizontalStackedBarChart
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={numDatasets}
                startingRange={firstField}
                endingRange={lastField}
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
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <ComboChart
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={numDatasets}
                startingRange={firstField}
                endingRange={lastField}
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
            xAxisData,
            legendValues,
            item?.title,
          );

          return (
            <div key={item.id} className="w-full">
              <CandleChart
                widgetTitle={item?.title}
                xAxisValues={labels}
                legendValues={legendValues}
                numOfLegendDataSet={numDatasets}
                startingRange={firstField}
                endingRange={lastField}
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
