/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChartData, LegendValue } from "./chartTypes";

export const DEFAULT_LEGEND_VALUES: LegendValue[] = [
  { label: "Sample A", field: "field1", color: "#13A490" },
  { label: "Sample B", field: "field2", color: "#35B6EE" },
  { label: "Sample C", field: "field3", color: "#6F78F9" },
];

export const DEFAULT_X_AXIS_VALUES = ["Jan", "Feb", "Mar", "Apr", "May"];

/**
 * Returns effective legend values, falling back to samples if invalid.
 */
export const getEffectiveLegendValues = (
  legendValues: LegendValue[],
  defaultLegends = DEFAULT_LEGEND_VALUES,
) => {
  const validLegends = legendValues?.filter(
    (l) => l.label && l.label.trim() !== "",
  );

  if (validLegends && validLegends.length > 0) {
    return validLegends.map((l) => ({
      ...l,
      field: l.field || l.label.toLowerCase().replace(/\s+/g, ""),
    }));
  }
  return defaultLegends;
};

/**
 * Returns effective X-Axis values, falling back to samples if invalid.
 */
export const getEffectiveXAxisValues = (
  xAxisValues: string[],
  defaultValues = DEFAULT_X_AXIS_VALUES,
) => {
  const validValues = xAxisValues?.filter((v) => v && v.trim() !== "");
  if (validValues && validValues.length > 0) {
    return validValues;
  }
  return defaultValues;
};

/**
 * Standardizes the starting and ending ranges.
 */
export const getSafeRanges = (
  startingRange: number | string,
  endingRange: number | string,
  defaultEnd = 100,
) => {
  let start = Number(startingRange) || 0;
  let end = Number(endingRange) || defaultEnd;
  if (start === end) {
    start = 0;
    end = defaultEnd;
  }
  return { safeStartingRange: start, safeEndingRange: end };
};

/**
 * Sanitizes the widget title to create a valid Excel sheet name.
 */
export const sanitizeSheetName = (
  title: string,
  maxLength = 31,
  defaultName = "Sheet",
) => {
  const safeName = (title || defaultName).replace(/[:/?*[\]\\]/g, " ").trim();
  return safeName.length > maxLength
    ? safeName.substring(0, maxLength)
    : safeName;
};

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
 * Parse xAxis 2D array format from API.
 * Format:
 *   Row 0 (header): ["Chart Title" | "Labels", "Legend 1", "Legend 2", ...]
 *   Row 1+  (data):  ["Jan", 10, 20, ...]  ← numeric values
 */
export const parseCommonChartData = (
  xAxis: any[][] | string | { labels: any[][] },
  legendValues: LegendValue[],
  widgetTitle: string,
) => {
  let parsedXAxis: any = xAxis;

  if (typeof xAxis === "string") {
    try {
      parsedXAxis = JSON.parse(xAxis);
    } catch {
      parsedXAxis = [];
    }
  }

  // Normalize to raw array (direct or nested in {labels: [...]})
  const rawData =
    parsedXAxis && !Array.isArray(parsedXAxis) && parsedXAxis.labels
      ? parsedXAxis.labels
      : parsedXAxis;

  if (!Array.isArray(rawData) || rawData.length === 0) {
    return { labels: [], data: {} as { [key: string]: ChartData[] } };
  }

  // Row 0 is ALWAYS the header (chart name / "Labels" / legend names).
  // Skip it unconditionally, then also drop any remaining blank rows.
  const filteredRows = rawData.slice(1).filter((row: any) => {
    if (!Array.isArray(row) || row.length === 0) return false;
    const firstCol = String(row[0] || "").trim();
    return firstCol !== "";
  });

  const labels = filteredRows.map((row: any) => String(row[0] || ""));

  const chartData: ChartData[] = filteredRows.map((row: any) => {
    const dataPoint: ChartData = { name: String(row[0] || "") };
    legendValues.forEach((legend, index) => {
      const columnIndex = index + 1;
      dataPoint[legend.field] = Number(row[columnIndex]) || 0;
    });
    return dataPoint;
  });

  const sheetName = sanitizeSheetName(widgetTitle);

  return { labels, data: { [sheetName]: chartData } };
};

/**
 * Generate random data for Heatmap (similar to generateChartData)
 */
export const generateHeatmapChartData = (
  xAxisValues: string[],
  legendValues: LegendValue[],
  _numOfLegendDataSet: number,
  startingRange: number,
  endingRange: number,
): ChartData[] => {
  return xAxisValues.map((xName) => {
    const item: any = { name: xName };
    legendValues.forEach((leg) => {
      const min = startingRange || 0;
      const max = endingRange || 100;
      item[leg.field] = Math.floor(Math.random() * (max - min + 1)) + min;
    });
    return item;
  });
};

/**
 * Tries to extract legend values from an unparsed xAxis JSON string or Array,
 * mainly used for finding implicit labels when no widgets exist.
 * Works with both "Label"/"Labels" headers and descriptive headers (like chart names).
 */
export const extractLegendsFromXAxis = (xAxisRaw: any): string[] => {
  try {
    const parsed =
      typeof xAxisRaw === "string" ? JSON.parse(xAxisRaw) : xAxisRaw;
    const dataArr = Array.isArray(parsed) ? parsed : parsed?.labels || [];
    if (
      dataArr.length > 0 &&
      Array.isArray(dataArr[0]) &&
      dataArr[0].length > 1 &&
      (String(dataArr[0][0]).toLowerCase() === "label" ||
        String(dataArr[0][0]).toLowerCase() === "labels" ||
        isXAxisHeaderRow(dataArr[0]))
    ) {
      return dataArr[0].slice(1).map((lbl: any) => String(lbl));
    }
  } catch {
    // ignore
  }
  return [];
};

/**
 * Centralized logic to resolve chart data between uploaded data, configured samples, or default samples.
 */
export const resolveChartData = (
  allUploadedData: any,
  parsedLabels: string[],
  effectiveXAxisValues: string[],
  effectiveLegendValues: LegendValue[],
  safeStartingRange: number,
  safeEndingRange: number,
  numOfLegendDataSet: number,
  widgetTitle: string,
  generatorFunc: (
    xAxis: string[],
    legends: LegendValue[],
    numOfLegendDataSet: number,
    start: number,
    end: number,
  ) => ChartData[],
) => {
  // Use sanitizeSheetName directly — calling parseCommonChartData([], ...) would
  // return an empty object, making Object.keys()[0] === undefined, which means
  // allUploadedData lookup would always fail.
  const sheetName = sanitizeSheetName(widgetTitle);
  let dataToUse = allUploadedData?.[sheetName];

  // Fallback: If allUploadedData is already the data array (bypass keyed lookup)
  if (!dataToUse && Array.isArray(allUploadedData) && allUploadedData.length > 0) {
    dataToUse = allUploadedData;
  }

  // Priority 1: Real Uploaded Data
  const hasUploadedData = Array.isArray(dataToUse) && dataToUse.length > 0;

  if (hasUploadedData) {
    return { chartData: dataToUse as ChartData[], isSampleData: false };
  }

  // Priority 2: Sample Data based on Configuration
  const hasConfig =
    parsedLabels.length > 0 &&
    parsedLabels.some((v) => v !== "") &&
    effectiveLegendValues.length > 0;

  if (hasConfig) {
    return {
      chartData: generatorFunc(
        parsedLabels.filter((v) => v && v.trim() !== ""),
        effectiveLegendValues,
        numOfLegendDataSet,
        safeStartingRange,
        safeEndingRange,
      ),
      isSampleData: true,
    };
  }

  // Priority 3: Default Sample Data
  return {
    chartData: generatorFunc(
      effectiveXAxisValues,
      effectiveLegendValues,
      numOfLegendDataSet,
      0,
      100,
    ),
    isSampleData: true,
  };
};
