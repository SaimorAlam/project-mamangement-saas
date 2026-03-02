/* eslint-disable @typescript-eslint/no-explicit-any */
import StackedBarChart from "@/common/Charts/CompletedCharts/StackedBarChart/StackedBarChart";
import HorizontalBarChart from "@/common/Charts/CompletedCharts/HorizontalBarChart/HorizontalBarChart";
import LineChart from "@/common/Charts/CompletedCharts/LineChart/LineChart";
import HeatmapChartNew from "@/common/Charts/CompletedCharts/HeatMap/HeatmapChartNew";
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
import { chartTypes } from "@/utils/ChartCategory";

import SplineAreaChart from "@/common/Charts/CompletedCharts/SplineAreaChart/SplineAreaChart";
import SparkLinesChart from "@/common/Charts/SparkLinesChart";

import {
  parseCommonChartData,
  getEffectiveLegendValues,
  getSafeRanges,
} from "@/common/Charts/CompletedCharts/Common/chartUtils";

/**
 * Checks if a row is a header row.
 * A header row has all columns from index 1 onward as non-numeric strings
 * (i.e. legend names like "Site 1", "Site 2") rather than numeric data values.
 */
const isXAxisHeaderRow = (row: any[]): boolean => {
  if (!Array.isArray(row) || row.length < 2) return false;
  const dataCols = row.slice(1);
  return dataCols.every(
    (v) => typeof v === "string" && v.trim() !== "" && isNaN(Number(v)),
  );
};

/**
 * Extracts potential legend labels from the first row of xAxis data if it looks like a header.
 * Handles "label", "labels", and descriptive headers (like chart/category names).
 */
const extractLegendsFromXAxis = (xAxisData: any) => {
  if (!xAxisData) return [];
  try {
    const parsed =
      typeof xAxisData === "string" ? JSON.parse(xAxisData) : xAxisData;
    const dataArr = Array.isArray(parsed) ? parsed : parsed?.labels || [];
    if (
      dataArr.length > 0 &&
      Array.isArray(dataArr[0]) &&
      dataArr[0].length > 1 &&
      (typeof dataArr[0][1] === "string" || isXAxisHeaderRow(dataArr[0]))
    ) {
      // Header detected — return all columns after the first
      return dataArr[0].slice(1);
    }
  } catch {
    /* ignore */
  }
  return [];
};

const DefaultChartData = ({ projectsChartsData }: any) => {
  return (
    <div className="flex flex-wrap gap-6">
      {projectsChartsData?.map((item: any) => {
        const categoryKey = item.category?.toUpperCase();
        const chartProperty = chartTypes[categoryKey];

        // Normalize chart data between standard and program builder formats
        const chartData =
          item.chartData || (chartProperty ? item[chartProperty] : null);

        // Standard format has xAxis string/array at root.
        const xAxisData = item.valueDetection?.matching || item.xAxis;

        // API field normalization
        const firstField =
          chartData?.firstFiledDataset ?? chartData?.firstFieldDataset ?? 0;
        const lastField =
          chartData?.lastFiledDAtaset ?? chartData?.lastFieldDataset ?? 100;
        const numDatasets = chartData?.numberOfDataset || 1;

        // Process ranges
        const { safeStartingRange, safeEndingRange } = getSafeRanges(
          firstField,
          lastField,
        );

        // Standard legend processing
        const rawLegendValues =
          (chartData?.widgets || item?.widgets)?.map((w: any) => ({
            label: w.legendName || w.label,
            color: w.color,
            field: (w.legendName || w.label)?.toLowerCase().replace(/\s+/g, ""),
          })) || [];

        let legendValues = getEffectiveLegendValues(rawLegendValues);

        // Special fallback for AREA/SPLINE if no widgets/legends defined
        if (
          legendValues.length === 0 &&
          (categoryKey === "AREA" || categoryKey === "SPLINE")
        ) {
          const extracted = extractLegendsFromXAxis(xAxisData);
          if (extracted.length > 0) {
            legendValues = extracted.map((label: string) => ({
              label,
              color: categoryKey === "AREA" ? "#13A490" : "#3b82f6",
              field: label.toLowerCase().replace(/\s+/g, ""),
            }));
          }
        }

        // Special case for PARETO which usually has a fixed legend "Pareto"
        if (categoryKey === "PARETO" && legendValues.length === 0) {
          legendValues = getEffectiveLegendValues([
            { label: "Pareto", field: "pareto", color: "#4F81BC" },
          ]);
        }

        // Generic data parsing
        // parseCommonChartData handles header rows automatically.
        const { labels, data } = parseCommonChartData(
          xAxisData,
          legendValues,
          item?.title,
        );

        const commonProps = {
          widgetTitle: item?.title,
          xAxisValues: labels,
          legendValues: legendValues,
          startingRange: safeStartingRange,
          endingRange: safeEndingRange,
          chartId: item?.id,
          allUploadedData: data,
          projectId: item?.projectId,
          numOfLegendDataSet: numDatasets,
        };

        const renderChart = () => {
          switch (categoryKey) {
            case "BAR":
              return (
                <StackedBarChart {...commonProps} widgets={chartData?.widgets} />
              );
            case "HORIZONTAL_BAR":
              return (
                <HorizontalBarChart
                  {...commonProps}
                  widgets={chartData?.widgets}
                />
              );
            case "LINE":
              return <LineChart {...commonProps} widgets={chartData?.widgets} />;
            case "HEATMAP":
              return <HeatmapChartNew {...commonProps} />;
            case "PIE":
              return <PieChartWidget {...commonProps} />;
            case "COLUMN":
              return <ColumnBarChart {...commonProps} />;
            case "RADAR":
              return <RadarChartNew {...commonProps} />;
            case "DOUGHNUT":
              return (
                <DoughnutChart
                  title={item?.title}
                  data={legendValues.map((l: any) => ({
                    name: l.label,
                    color: l.color,
                    value: 0,
                    count: 0,
                  }))}
                  centerLabel="Total"
                  allUploadedData={data}
                />
              );
            case "AREA":
              return <AreaChart {...commonProps} />;
            case "SPLINE":
              return <SplineAreaChart {...commonProps} />;
            case "PARETO":
              return <ParetoChart {...commonProps} />;
            case "HISTOGRAM":
              return <HistogramChart {...commonProps} />;
            case "SCATTER":
              return <ScatterChart {...commonProps} />;
            case "SOLID_GAUGE":
            case "GAUGE":
              return <GaugeChart {...commonProps} />;
            case "FUNNEL":
              return <FunnelChart {...commonProps} />;
            case "WATERFALL":
              return <WaterfallChart {...commonProps} />;
            case "STACKED_BAR_HORIZONTAL":
            case "STACK_BAR_HORIZONTAL":
              return <HorizontalStackedBarChart {...commonProps} />;
            case "MIXED":
            case "COMBO":
              return <ComboChart {...commonProps} />;
            case "CANDLESTICK":
              return <CandleChart {...commonProps} />;
            case "SPARKLINE":
              return <SparkLinesChart {...commonProps} />;
            default:
              return null;
          }
        };

        const chartElement = renderChart();
        if (!chartElement) return null;

        return (
          <div key={item.id} className="w-full">
            {chartElement}
          </div>
        );
      })}
    </div>
  );
};

export default DefaultChartData;
