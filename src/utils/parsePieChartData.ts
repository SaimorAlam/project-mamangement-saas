/* eslint-disable @typescript-eslint/no-explicit-any */

export type PieData = {
  name: string;
  value: number;
  color: string;
};

export const parsePieChartData = (
  xAxis: any[][] | string,
  legendValues: any[]
): PieData[] => {
  let parsedXAxis = xAxis;

  if (typeof xAxis === "string") {
    try {
      if (xAxis.startsWith("{")) {
        // Handle case where it might be an object instead of array
        const obj = JSON.parse(xAxis);
        // If it's the {labels: [], values: []} format sometimes used in the codebase
        if (obj.labels && obj.values) {
           return obj.labels.map((label: string, index: number) => ({
             name: label,
             value: Number(obj.values[index]) || 0,
             color: legendValues[index]?.color || "#000000"
           }));
        }
      }
      parsedXAxis = JSON.parse(xAxis);
    } catch (error) {
      console.error("Error parsing Pie xAxis JSON:", error);
      return [];
    }
  }

  if (!parsedXAxis || !Array.isArray(parsedXAxis) || parsedXAxis.length < 2) {
    return [];
  }

  // Expecting format: [["Legend", "Value"], ["Slice A", 10], ["Slice B", 20]]
  // or the standard [["Label", "Legend1", "Legend2"], ["Row1", 10, 20]]
  
  const headers = parsedXAxis[0];
  
  // Case 1: ["Legend", "Value"] format (Module Two)
  if (headers[0] === "Legend" && headers[1] === "Value") {
    return parsedXAxis.slice(1).map((row, index) => {
      // Find the legend color for this slice name
      const legendMatch = legendValues.find(l => l.label === row[0]);
      return {
        name: String(row[0] || ""),
        value: Number(row[1]) || 0,
        color: legendMatch?.color || legendValues[index]?.color || "#000000"
      };
    });
  }

  // Case 2: Standard Multi-series format (Module One)
  // We take the first row of data (index 1) and map its columns to legends
  const firstDataRow = parsedXAxis[1];
  if (firstDataRow && firstDataRow.length > 1) {
    return legendValues.map((legend, index) => ({
      name: legend.label,
      value: Number(firstDataRow[index + 1]) || 0,
      color: legend.color
    }));
  }

  return [];
};
