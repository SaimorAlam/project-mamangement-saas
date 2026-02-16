/* eslint-disable @typescript-eslint/no-explicit-any */
import StackedBarChart from "@/common/Charts/StackedBarChart";
import { ChartData } from "@/common/Charts/StackedBarChart";
import HorizontalBarChart, {
  parseHorizontalBarData,
} from "@/common/Charts/HorizontalBarChart";
import LineChart from "@/common/Charts/LineChart";
import { parseLineChartData } from "@/utils/parseLineChartData";

/**
 * Parse xAxis 2D array format from API
 * Format: [["day", "absent", "late", "ontime"], ["Sunday", 1, 2, 50], ...]
 * Returns: { labels: ["Sunday", "Monday", ...], data: {...} }
 */
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
          if (item.category === "Bar" || item.category === "BAR") {
            const legendValues =
              (item?.barChart?.widgets || item?.widgets)?.map((w: any) => ({
                label: w.legendName,
                color: w.color,
                // field: w.legendName.toLowerCase().replace(/\s+/g, ""),
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
                  widgets={item?.barChart?.widgets}
                  numOfLegendDataSet={item?.barChart?.numberOfDataset}
                  startingRange={item?.barChart?.firstFieldDataset}
                  endingRange={item?.barChart?.lastFieldDAtaset}
                  chartId={item?.id}
                  projectId={item?.projectId}
                  allUploadedData={data}
                />
              </div>
            );
          }
          if (item.category === "HORIZONTAL_BAR") {
            const legendValues = (
              item?.horizontalBarChart?.widgets ||
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
                  widgets={item?.horizontalBarChart?.widgets}
                  numOfLegendDataSet={item?.horizontalBarChart?.numberOfDataset}
                  startingRange={item?.horizontalBarChart?.firstFieldDataset}
                  endingRange={item?.horizontalBarChart?.lastFieldDAtaset}
                  chartId={item?.id}
                  projectId={item?.projectId}
                  allUploadedData={data}
                />
              </div>
            );
          }
          if (item.category === "Line" || item.category === "LINE") {
            const legendValues = (item?.lineChart?.widgets || item?.widgets)?.map(
              (w: any) => ({
                label: w.legendName || w.label,
                color: w.color,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
              }),
            ) || [];

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
                  widgets={item?.lineChart?.widgets}
                  numOfLegendDataSet={item?.lineChart?.numberOfDataset}
                  startingRange={item?.lineChart?.firstFieldDataset}
                  endingRange={item?.lineChart?.lastFieldDAtaset}
                  chartId={item?.id}
                  projectId={item?.projectId}
                  allUploadedData={data}
                />
              </div>
            );
          }
        })}
    </div>
  );
};

export default DefaultChartData;
