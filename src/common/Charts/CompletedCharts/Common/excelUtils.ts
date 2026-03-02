/* eslint-disable @typescript-eslint/no-explicit-any */
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { LegendValue } from "./chartTypes";

export type ChartExcelType =
  | "barChart"
  | "areaChart"
  | "splineChart"
  | "lineChart"
  | "horizontalBarChart"
  | "heatmap"
  | "pie"
  | "sparklineChart";



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

    // 1. Find the group that belongs to this root chart.
    // Try matching via ID first (robust)
    let targetGroup = allGroups.find((g: any) =>
      g.charts?.some((c: any) => c.id === chartId || c.parentId === chartId)
    );

    // 2. Fallback: match by the group title if no group found by ID
    if (!targetGroup && _title) {
       targetGroup = allGroups.find((item: any) => item.grouptitle === _title);
    }

    let targets: any[] = [];
    if (targetGroup) {
      // Use all charts in the group as they represent the flattened leaf children for this root.
      targets = targetGroup.charts || [];
    }

    // 3. Last Resort Fallback: If still nothing found, download current template
    if (targets.length === 0) {
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

    const getUniqueSheetNameInside = (name: string, id: string) => {
      const safeName = (name || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim();
      const fullName = `${safeName}_${id}`;

      // Enforce Excel 31 character limit
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

    targets.forEach((node: any) => {
      ids.push(node.id);
      
      let xAxis: string[] = node.xAxisValues || [];
      if (!xAxis.length && node.xAxis) {
        try {
          const parsed = typeof node.xAxis === "string" ? JSON.parse(node.xAxis) : node.xAxis;

          if (Array.isArray(parsed)) {
            if (parsed.length > 0 && Array.isArray(parsed[0])) {
              // Smart header detection: a header row has legend labels (strings) in data columns.
              // We skip it because the download process manually adds a header row.
              const hasHeader = parsed[0].length > 1 && typeof parsed[0][1] === "string";
              xAxis = (hasHeader ? parsed.slice(1) : parsed).map((row: any) => row[0]);
            } else {
              xAxis = parsed;
            }
          } else {
            xAxis = parsed.labels || [];
          }
        } catch {
          // ignore
        }
      }

      // Fallback to current chart's xAxis if node has none
      const xAxisItems = xAxis.length > 0 ? xAxis : effectiveXAxisValues;

      let legends = node.legendValues || [];
      const nodeWidgets = node.widgets || node.barChart?.widgets || node[chartType]?.widgets;
      
      if (!legends.length && nodeWidgets) {
        legends = nodeWidgets.map((w: any) => ({
          label: w.legendName || w.label || "Legend",
          field: (w.legendName || w.label || "field")
            .toLowerCase()
            .replace(/\s+/g, ""),
          color: w.color || "#000000",
        }));
      }

      // Fallback to current chart's legends if node has none
      const finalLegends = legends.length > 0 ? legends : effectiveLegendValues;

      const headers = ["Label", ...finalLegends.map((l: any) => l.label)];
      const rows = xAxisItems.map((label: string) => [
        label,
        ...Array(numOfLegendDataSet).fill(" "),
      ]);
      const data = [headers, ...rows];
      const ws = XLSX.utils.aoa_to_sheet(data);
      const sheetName = getUniqueSheetNameInside(node.title || node.name || "Tier", node.id);
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
