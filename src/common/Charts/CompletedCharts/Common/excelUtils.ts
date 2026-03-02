/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { LegendValue } from "./chartTypes";
import { sanitizeSheetName, extractLegendsFromXAxis } from "./chartUtils";

export type ChartExcelType =
  | "barChart"
  | "areaChart"
  | "splineChart"
  | "lineChart"
  | "horizontalBarChart"
  | "heatmap"
  | "pie";

export const getUniqueSheetName = (
  usedNames: Set<string>,
  name: string,
  id: string,
) => {
  const safeName = sanitizeSheetName(name, 31);
  const fullName = `${safeName}_${id}`;
  let finalName = fullName.length > 31 ? fullName.substring(0, 31) : fullName;

  let counter = 1;

  while (usedNames.has(finalName.toLowerCase())) {
    const suffix = `_${counter}`;
    const base = fullName.substring(0, 31 - suffix.length);
    finalName = base + suffix;
    counter++;
  }

  usedNames.add(finalName.toLowerCase());
  return finalName;
};

export const downloadChartDataAsExcel = async (
  title: string,
  projectId: string,
  getAllTheLeafChart: any,
  widgetTitle: string,
  effectiveXAxisValues: string[],
  effectiveLegendValues: LegendValue[],
  numOfLegendDataSet: number = 3,
  setIsDownloading: (loading: boolean) => void,
  chartType: ChartExcelType = "areaChart",
) => {
  if (!projectId) {
    toast.error("Project ID is missing");
    return;
  }
  setIsDownloading(true);
  try {
    const res = await getAllTheLeafChart(projectId).unwrap();
    const leafCharts =
      res?.data?.find((item: any) => item.grouptitle === title) || [];
      
    if (!leafCharts.charts || leafCharts.charts.length === 0) {
      // Fallback simple download
      const wb = XLSX.utils.book_new();
      const headers = ["Label", ...effectiveLegendValues.map((l) => l.label)];
      const rows = effectiveXAxisValues.map((label) => [
        label,
        ...Array(effectiveLegendValues.length).fill(""),
      ]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      XLSX.utils.book_append_sheet(wb, ws, widgetTitle.substring(0, 31));
      XLSX.writeFile(wb, `${widgetTitle}_template.xlsx`);
      toast.info("Downloaded current chart template");
      return;
    }

    const wb = XLSX.utils.book_new();
    const ids: string[] = [];
    const usedNames = new Set<string>();

    leafCharts?.charts?.forEach((node: any) => {
      ids.push(node.id);
      let xAxisItems: string[] = [];
      try {
        const parsedXAxis =
          typeof node.xAxis === "string" ? JSON.parse(node.xAxis) : node.xAxis;

        // Normalize to raw array (direct or nested in {labels: [...]})
        const rawData =
          parsedXAxis && !Array.isArray(parsedXAxis) && parsedXAxis.labels
            ? parsedXAxis.labels
            : parsedXAxis;

        if (Array.isArray(rawData) && rawData.length > 0) {
          if (Array.isArray(rawData[0])) {
            // Smart header detection - check if first cell of the first row is "Label"
            const hasHeader = String(rawData[0][0] || "").toLowerCase() === "label";
            const dataSlice = hasHeader ? rawData.slice(1) : rawData;

            xAxisItems = dataSlice
              .map((row: any) => String(row[0] || ""))
              .filter((val) => val.trim().toLowerCase() !== "label" && val.trim() !== "");
          } else {
            // Simple flat array
            xAxisItems = rawData
              .map((v: any) => String(v || ""))
              .filter((val) => val.trim().toLowerCase() !== "label" && val.trim() !== "");
          }
        }
      } catch (err) {
        console.warn("Failed to parse node xAxis", err);
      }

      if (!xAxisItems.length) xAxisItems = effectiveXAxisValues;

      let legends = node.legendValues || [];
      const nodeWidgets = node.widgets || node[chartType]?.widgets;
      
      if (!legends.length && nodeWidgets?.length > 0) {
        legends = nodeWidgets.map((w: any) => ({
          label: w.legendName || w.label || "Legend",
          field: (w.legendName || w.label || "field")
            .toLowerCase()
            .replace(/\s+/g, ""),
          color: w.color || "#000000",
        }));
      } else if (!legends.length) {
        const implicitLabels = extractLegendsFromXAxis(node.xAxis);
        if (implicitLabels.length > 0) {
            legends = implicitLabels.map(lbl => ({
                label: lbl, field: lbl, color: "#000000"
            }));
        }
      }

      if (!legends.length) legends = effectiveLegendValues;

      const headers = ["Label", ...legends.map((l: any) => l.label)];
      const maxFill = Math.max(numOfLegendDataSet, legends.length);
      const rows = xAxisItems.map((label: string) => [
        label,
        ...Array(maxFill).fill(" "),
      ]);
      
      const data = [headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(data);
      const sheetName = getUniqueSheetName(usedNames, node.title || node.name || "Tier", node.id);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    const filename = `${widgetTitle}_ID_${ids.join("_")}.xlsx`;
    XLSX.writeFile(wb, filename);
    toast.success("Excel downloaded successfully");
  } catch (error) {
    console.error("Excel download failed", error);
    toast.error("Failed to download Excel");
  } finally {
    setIsDownloading(false);
  }
};
