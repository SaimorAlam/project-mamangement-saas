/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Parse xAxis data from LINE chart API response
 * Format: [["day", "line1", "line2"], ["Jan", 10, 20], ["Feb", 15, 25], ...]
 * Returns: { labels: ["Jan", "Feb", ...], data: { [sheetName]: [...] } }
 */

export type LineChartData = {
  name: string;
  [key: string]: number | string;
};

export const parseLineChartData = (
  xAxis: any[][] | string | { labels: any[][] },
  legendValues: any[],
  widgetTitle: string,
) => {
  let parsedXAxis: any = xAxis;

  // Parse JSON string if needed
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
    typeof parsedXAxis === "object" &&
    "labels" in parsedXAxis
  ) {
    parsedXAxis = parsedXAxis.labels;
  }

  if (!parsedXAxis || !Array.isArray(parsedXAxis) || parsedXAxis.length === 0) {
    return { labels: [], data: {} as { [key: string]: LineChartData[] } };
  }

  // First row is the header
  const headers = parsedXAxis[0];
  if (!Array.isArray(headers) || headers.length === 0) {
    return { labels: [], data: {} as { [key: string]: LineChartData[] } };
  }

  // Extract labels from the first column of data rows (skip header)
  const labels = parsedXAxis.slice(1).map((row: any) => String(row[0] || ""));

  // Transform data into the format expected by LineChart
  const chartData: LineChartData[] = parsedXAxis.slice(1).map((row: any) => {
    const dataPoint: LineChartData = { name: String(row[0] || "") };

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
