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
  | "pie"
  | "sparklineChart";

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
  _title: string,
  projectId: string,
  getAllTheLeafChart: any,
  widgetTitle: string,
  effectiveXAxisValues: string[],
  effectiveLegendValues: LegendValue[],
  numOfLegendDataSet: number = 3,
  setIsDownloading: (loading: boolean) => void,
  chartType: ChartExcelType = "areaChart",
  chartId?: string,
) => {
  if (!projectId) {
    toast.error("Project ID is missing");
    return;
  }
  setIsDownloading(true);
  try {
    const res = await getAllTheLeafChart(projectId).unwrap();
    const allGroups: any[] = res?.data || [];

    // 1. Find the group that likely belongs to this root chart.
    // We check if any chart in the group points to our root chartId as parent,
    // or if the root chart itself is in the group.
    const targetGroup = allGroups.find((g: any) =>
      g.charts?.some((c: any) => c.id === chartId || c.parentId === chartId)
    );

    let targets: any[] = [];
    if (targetGroup) {
      // Collect all descendants in this group. 
      // Since 'Only level children' is often flattened, we take all children of the root.
      targets = targetGroup.charts.filter(
        (c: any) => c.parentId === chartId || c.id === chartId
      );

      // If we found the root or its children but there are deeper levels, 
      // the API usually includes them in the same group.
      // If we still have no targets, or if the user specifically wanted 'leafs',
      // we can take all charts in the group as they usually represent the full leaf set for that group.
      if (targets.length === 0) {
        targets = targetGroup.charts;
      }
    }

    // 2. Fallback: If no group matched via ID, try matching by the group title as a last resort
    if (targets.length === 0) {
      const g = allGroups.find((item: any) => item.grouptitle === _title);
      if (g) targets = g.charts || [];
    }

    if (targets.length === 0) {
      // Still nothing found — download a blank template for the current chart
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

    targets.forEach((node: any) => {
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
            // Row 0 is ALWAYS the header — skip it unconditionally
            xAxisItems = rawData
              .slice(1)
              .map((row: any) => String(row[0] || ""))
              .filter((val) => val.trim() !== "");
          } else {
            // Simple flat array — skip the first element (header)
            xAxisItems = rawData
              .slice(1)
              .map((v: any) => String(v || ""))
              .filter((val) => val.trim() !== "");
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
