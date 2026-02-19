/* eslint-disable @typescript-eslint/no-explicit-any */

export type PieData = {
  name: string;
  value: number;
  color: string;
};

export const parsePieChartData = (
  xAxis: any[][] | string,
  legendValues: any[],
): PieData[] => {
  let parsedXAxis: any = xAxis;

  if (typeof xAxis === "string") {
    try {
      parsedXAxis = JSON.parse(xAxis);
    } catch (error) {
      console.error("Error parsing Pie xAxis JSON:", error);
      return [];
    }
  }

  // Handle case where API returns { labels: [...] } or { labels: { labels: [...] } }
  if (
    parsedXAxis &&
    !Array.isArray(parsedXAxis) &&
    typeof parsedXAxis === "object"
  ) {
    if ("labels" in parsedXAxis) {
      parsedXAxis = parsedXAxis.labels;
      // Handle double nesting if necessary
      if (
        parsedXAxis &&
        !Array.isArray(parsedXAxis) &&
        "labels" in parsedXAxis
      ) {
        parsedXAxis = parsedXAxis.labels;
      }
    }
  }

  if (!parsedXAxis || !Array.isArray(parsedXAxis) || parsedXAxis.length < 2) {
    return [];
  }

  // Expecting format: [["Label", "Value"], ["Slice A", 10], ["Slice B", 20]]
  // or standard format: [["Label", "Legend1", ...], ["Value", 10, ...]]

  const headers = parsedXAxis[0];
  const dataRows = parsedXAxis.slice(1);

  // Case 1: Simple 2-column format: [["Label", "Value"], ["Name1", 10]]
  // This is common for Pie charts
  if (headers.length === 2) {
    return dataRows.map((row, index) => {
      const name = String(row[0] || "");
      const value = Number(row[1]) || 0;
      const legendMatch = legendValues.find((l) => l.label === name);
      return {
        name,
        value,
        color: legendMatch?.color || legendValues[index]?.color || "#000000",
      };
    });
  }

  // Case 2: Standard Multi-series format (Stacked Bar style)
  // [["Label", "Legend1", "Legend2"], ["Row1", 10, 20]]
  // For Pie, we usually only care about the first data row's values mapped to legends
  const firstDataRow = dataRows[0];
  if (firstDataRow && firstDataRow.length > 1) {
    return legendValues.map((legend, index) => ({
      name: legend.label,
      value: Number(firstDataRow[index + 1]) || 0,
      color: legend.color,
    }));
  }

  return [];
};
