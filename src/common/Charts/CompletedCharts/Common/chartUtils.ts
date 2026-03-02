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
 * Parse xAxis 2D array format from API.
 * Format: [["Point1", 10, ...], ["Point2", 20, ...], ...]
 */
export const parseCommonChartData = (
  xAxis: any[][] | string | { labels: any[][] },
  legendValues: LegendValue[],
  widgetTitle: string,
  skipHeaderRow: boolean = true,
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

  // Normalize to raw array (direct or nested in {labels: [...]})
  const rawData =
    parsedXAxis && !Array.isArray(parsedXAxis) && parsedXAxis.labels
      ? parsedXAxis.labels
      : parsedXAxis;

  if (!Array.isArray(rawData) || rawData.length === 0) {
    return { labels: [], data: {} as { [key: string]: ChartData[] } };
  }

  // Smart header detection - check if first cell is "Label"
  const hasHeader =
    rawData.length > 0 &&
    Array.isArray(rawData[0]) &&
    String(rawData[0][0] || "").toLowerCase() === "label";

  const dataSlice = (hasHeader && skipHeaderRow) ? rawData.slice(1) : rawData;

  // Filter out any row that is strictly a header row or empty
  const filteredRows = dataSlice.filter((row: any) => {
    if (!Array.isArray(row) || row.length === 0) return false;
    const firstCol = String(row[0] || "").trim();
    return firstCol !== "" && firstCol.toLowerCase() !== "label";
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
 */
export const extractLegendsFromXAxis = (xAxisRaw: any): string[] => {
  try {
    const parsed = typeof xAxisRaw === "string" ? JSON.parse(xAxisRaw) : xAxisRaw;
    const dataArr = Array.isArray(parsed) ? parsed : parsed?.labels || [];
    if (dataArr.length > 0 && Array.isArray(dataArr[0]) && dataArr[0].length > 1 && String(dataArr[0][0]).toLowerCase() === "label") {
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
  const { data: parsedStructure } = parseCommonChartData(
    [],
    [],
    widgetTitle,
  );
  const sheetName = Object.keys(parsedStructure)[0];
  const dataToUse = allUploadedData?.[sheetName];

  // Priority 1: Real Uploaded Data (must have non-zero content)
  const hasRealData =
    dataToUse &&
    dataToUse.length > 0 &&
    dataToUse.some((row: any) =>
      effectiveLegendValues.some((l) => Number(row[l.field] || 0) > 0),
    );

  if (hasRealData) {
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

