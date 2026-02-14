/* eslint-disable @typescript-eslint/no-explicit-any */
import StackedBarChart from "@/common/Charts/StackedBarChart";
import { ChartData } from "@/common/Charts/StackedBarChart";

/**
 * Parse xAxis 2D array format from API
 * Format: [["day", "absent", "late", "ontime"], ["Sunday", 1, 2, 50], ...]
 * Returns: { labels: ["Sunday", "Monday", ...], data: {...} }
 */
const parseXAxisData = (xAxis: any[][], legendValues: any[], widgetTitle: string) => {
  if (!xAxis || !Array.isArray(xAxis) || xAxis.length === 0) {
    return { labels: [], data: {} as { [key: string]: ChartData[] } };
  }

  // First row is the header
  const headers = xAxis[0];
  if (!Array.isArray(headers) || headers.length === 0) {
    return { labels: [], data: {} as { [key: string]: ChartData[] } };
  }

  // Extract labels from the first column of data rows (skip header)
  const labels = xAxis.slice(1).map((row) => String(row[0] || ""));

  // Transform data into the format expected by StackedBarChart
  const chartData: ChartData[] = xAxis.slice(1).map((row) => {
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
              item?.barChart?.widgets?.map((w: any) => ({
                label: w.legendName,
                color: w.color,
                field: w.legendName.toLowerCase().replace(/\s+/g, ""),
              })) || [];

            const { labels, data } = parseXAxisData(item?.xAxis, legendValues, item?.title);

            return (
              <div key={item.id} className="w-full">
                <StackedBarChart
                  widgetTitle={item?.title}
                  xAxisValues={labels}
                  legendValues={legendValues}
                  widgets={item?.barChart?.widgets}
                  numOfLegendDataSet={item?.barChart?.numberOfDataset}
                  startingRange={item?.barChart?.firstFiledDataset}
                  endingRange={item?.barChart?.lastFiledDAtaset}
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
