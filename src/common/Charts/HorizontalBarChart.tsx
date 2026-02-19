/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { generateChartData } from "@/utils/clientPannelHelpers/programBuilderHelpers";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./components/ChartCardWrapper";
import {
  useLazyFindChildrenValueQuery,
  useLazyGetAllTheLeafChartQuery,
} from "@/store/Api/ChartApi/ChartApi";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  setChildPayload,
  setGroupTitle,
} from "@/store/Slices/ChartSlice/ChartSlice";
import { chartTypes } from "@/utils/ChartCategory";

/**
 * Parse xAxis 2D array format from API for Horizontal Bar
 * Format: [["label", "value"], ["Point1", 10], ...]
 */
export const parseHorizontalBarData = (
  xAxis: any[][] | string | { labels: any[][] },
  legendValues: any[],
  widgetTitle: string,
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

  if (
    parsedXAxis &&
    !Array.isArray(parsedXAxis) &&
    typeof parsedXAxis === "object" &&
    "labels" in parsedXAxis
  ) {
    parsedXAxis = parsedXAxis.labels;
  }

  if (!parsedXAxis || !Array.isArray(parsedXAxis) || parsedXAxis.length === 0) {
    return { labels: [], data: {} as { [key: string]: ChartData[] } };
  }

  // Extract labels from the first column (skip header)
  const labels = parsedXAxis.slice(1).map((row: any) => String(row[0] || ""));

  // Transform data
  const chartData: ChartData[] = parsedXAxis.slice(1).map((row: any) => {
    const dataPoint: ChartData = { name: String(row[0] || "") };
    legendValues.forEach((legend, index) => {
      const columnIndex = index + 1;
      dataPoint[legend.field] = Number(row[columnIndex]) || 0;
    });
    return dataPoint;
  });

  const sheetName = (widgetTitle || "Sheet")
    .replace(/[:/?*[\]\\]/g, " ")
    .trim()
    .substring(0, 31);

  return { labels, data: { [sheetName]: chartData } };
};

/*       TYPES       */

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

export type LegendValue = {
  label: string;
  field: string;
  color: string;
};

export type BreadcrumbItem = {
  id: string;
  name: string;
  level: number;
};

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[];
  legendValues?: LegendValue[];
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  isPreview?: boolean;
  isCreationMode?: boolean;
  allUploadedData?: { [key: string]: ChartData[] };
  projectId?: string;
  breadcrumbPath?: BreadcrumbItem[];
  onNavigate?: (level: number) => void;
  widgets?: any[];
};

/*       COMPONENT       */

export default function HorizontalBarChart({
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  startingRange,
  endingRange,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId = "root",
  isPreview = false,
  isCreationMode = false,
  allUploadedData,
  projectId,
  breadcrumbPath = [],
  onNavigate,
}: Props) {
  const [localUploadedData, setLocalUploadedData] = useState<
    { [key: string]: ChartData[] } | undefined
  >(allUploadedData);

  const [isDownloading, setIsDownloading] = useState(false);
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [findChildrenValue, { data, isLoading }] =
    useLazyFindChildrenValueQuery();
  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();

  const dispatch = useAppDispatch();
  const groupTitle = useAppSelector((state) => state.chartSlice.groupTitle);
  const childTiers = data?.data;

  useEffect(() => {
    if (chartId && chartId !== "root") {
      findChildrenValue(chartId);
    }
  }, [chartId, findChildrenValue]);

  /*   EFFECTIVE DATA FOR RENDERING   */

  const effectiveLegendValues = useMemo(() => {
    const validLegends = legendValues.filter(
      (l) => l.label && l.label.trim() !== "",
    );

    if (validLegends.length > 0) {
      return validLegends.map((l) => ({
        ...l,
        field: l.field || l.label.toLowerCase().replace(/\s+/g, ""),
      }));
    }
    return [{ label: "Sample A", field: "field1", color: "#13A490" }];
  }, [legendValues]);

  const effectiveXAxisValues = useMemo(() => {
    const validValues = xAxisValues.filter((v) => v && v.trim() !== "");
    if (validValues.length > 0) {
      return validValues;
    }
    return ["Category A", "Category B", "Category C"];
  }, [xAxisValues]);

  const { safeStartingRange, safeEndingRange } = useMemo(() => {
    let start = Number(startingRange);
    let end = Number(endingRange);
    if (start === end) {
      start = 0;
      end = 1000; // Standardize range for horizontal bars
    }
    return { safeStartingRange: start, safeEndingRange: end };
  }, [startingRange, endingRange]);

  const { chartData, isSampleData } = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet")
      .replace(/[:/?*[\]\\]/g, " ")
      .trim()
      .substring(0, 31);

    const dataToUse =
      localUploadedData?.[sheetName] || allUploadedData?.[sheetName];

    // Priority 1: Real Uploaded Data (must have at least one non-zero value)
    const hasRealData =
      dataToUse &&
      dataToUse.length > 0 &&
      dataToUse.some((row) =>
        effectiveLegendValues.some((l) => Number(row[l.field] || 0) > 0),
      );

    if (hasRealData) {
      return { chartData: dataToUse as ChartData[], isSampleData: false };
    }

    const hasConfig =
      xAxisValues.length > 0 &&
      xAxisValues.some((v) => v !== "") &&
      effectiveLegendValues.length > 0;

    // Priority 2: Sample Data based on Config
    if (hasConfig) {
      return {
        chartData: generateChartData(
          xAxisValues.filter((v) => v && v.trim() !== ""),
          effectiveLegendValues,
          effectiveLegendValues.length,
          safeStartingRange,
          safeEndingRange,
        ),
        isSampleData: true,
      };
    }

    // Priority 3: Default Sample Data (Generic fallback)
    return {
      chartData: generateChartData(
        effectiveXAxisValues,
        effectiveLegendValues,
        effectiveLegendValues.length,
        0,
        100,
      ),
      isSampleData: true,
    };
  }, [
    xAxisValues,
    safeStartingRange,
    safeEndingRange,
    widgetTitle,
    localUploadedData,
    allUploadedData,
    effectiveXAxisValues,
    effectiveLegendValues,
  ]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
    toast.success("JSON copied to clipboard");
  };

  const currentBreadcrumbs = useMemo(() => {
    const base =
      breadcrumbPath.length === 0
        ? [{ id: "dashboard", name: "Dashboard", level: -1 }]
        : breadcrumbPath;
    return [
      ...base,
      { id: chartId || "root", name: widgetTitle, level: tierLevel },
    ];
  }, [breadcrumbPath, chartId, widgetTitle, tierLevel]);

  const handleChildNavigate = (targetLevel: number) => {
    if (targetLevel < tierLevel) {
      setShowChildrenModal(false);
      if (onNavigate) onNavigate(targetLevel);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const target = currentBreadcrumbs[index];
    if (index < currentBreadcrumbs.length - 1) {
      if (onNavigate) {
        onNavigate(target.level);
      }
      setShowChildrenModal(false);
    }
  };

  const handleDownload = async (title: string) => {
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }
    setIsDownloading(true);
    try {
      const res = await getAllTheLeafChart(projectId as string).unwrap();
      const leafCharts =
        res?.data?.find((item: any) => item.grouptitle === title) || [];
      if (leafCharts.charts?.length === 0) {
        toast.error("No data found to download");
        return;
      }

      const wb = XLSX.utils.book_new();
      const ids: string[] = [];
      const usedNames = new Set<string>();

      const getUniqueSheetName = (name: string, id: string) => {
        const safeName = (name || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim();
        const fullName = `${safeName}_${id}`;
        let finalName =
          fullName.length > 31 ? fullName.substring(0, 31) : fullName;

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

      leafCharts?.charts?.forEach((node: any) => {
        ids.push(node.id);
        let xAxis = node.xAxisValues || [];
        if (!xAxis.length && node.xAxis) {
          try {
            const parsed =
              typeof node.xAxis === "string"
                ? JSON.parse(node.xAxis)
                : node.xAxis;
            if (Array.isArray(parsed)) {
              if (parsed.length > 0 && Array.isArray(parsed[0])) {
                xAxis = parsed.slice(1).map((row: any) => row[0]);
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

        if (!xAxis.length) xAxis = effectiveXAxisValues;

        let legends = node.legendValues || [];
        const nodeWidgets = node.widgets || node.horizontalBarChart?.widgets;
        if (!legends.length && nodeWidgets) {
          legends = nodeWidgets.map((w: any) => ({
            label: w.legendName || w.label || "Legend",
            field: (w.legendName || w.label || "field")
              .toLowerCase()
              .replace(/\s+/g, ""),
            color: w.color || "#000000",
          }));
        }
        if (!legends.length) legends = effectiveLegendValues;

        const headers = ["Label", ...legends.map((l: any) => l.label)];
        const rows = xAxis.map((label: string) => [
          label,
          ...Array(legends.length).fill(" "),
        ]);
        const data = [headers, ...rows];
        const ws = XLSX.utils.aoa_to_sheet(data);
        const sheetName = getUniqueSheetName(
          node.title || node.name || "Tier",
          node.id,
        );
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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result as string;
        const wb = XLSX.read(bstr, { type: "binary" });
        const allData: { [key: string]: ChartData[] } = {};

        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          const rawData: any[] = XLSX.utils.sheet_to_json(ws);

          if (rawData.length > 0) {
            const processedData = rawData.map((row: any) => {
              const item: ChartData = { name: row["Label"] || "" };
              effectiveLegendValues.forEach((l) => {
                if (row[l.label] !== undefined) {
                  item[l.field] = Number(row[l.label]);
                } else if (row[l.field] !== undefined) {
                  item[l.field] = Number(row[l.field]);
                }
              });
              return item;
            });
            allData[sheetName] = processedData;
          }
        });

        setLocalUploadedData(allData);
        toast.success("Data uploaded successfully");
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Failed to parse Excel file");
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ""; // Reset file input
  };

  const handleAddTierClick = (title: string) => {
    if (tierLevel === 0) {
      dispatch(setGroupTitle(title));
    }
    const childPayload = {
      numberOfDataset: effectiveLegendValues.length,
      firstFieldDataset: safeStartingRange,
      lastFieldDataset: safeEndingRange,
      widgets: effectiveLegendValues.map((l) => ({
        legendName: l.label,
        color: l.color,
      })),
      title: "",
      status: "ACTIVE",
      category: "HORIZONTAL_BAR",
      xAxis: JSON.stringify([
        ["Label", ...effectiveLegendValues.map((l) => l.label)],
        ...effectiveXAxisValues.map((label) => [
          label,
          ...Array(effectiveLegendValues.length).fill(0),
        ]),
      ]),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
      projectId: projectId,
      parentId: chartId,
      rootchart: false,
      roottitle: widgetTitle,
      grouptitle: tierLevel === 0 ? title : groupTitle,
    };
    dispatch(setChildPayload(childPayload));
    setShowAddTierModal(true);
  };

  const handleChartClick = () => {
    if (childTiers?.length > 0) {
      setShowChildrenModal(true);
      if (tierLevel === 0) {
        dispatch(setGroupTitle(widgetTitle));
      }
    }
  };

  /*   TOOLTIP   */

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 border border-gray-100 rounded-xl shadow-xl">
        <p className="font-bold text-gray-700 mb-2 border-b border-gray-50 pb-1">
          {label}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs font-medium text-gray-600 min-w-[60px]">
                {entry.name}:
              </span>
              <span className="text-xs font-bold text-gray-900 ml-auto">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse">
        <div className="text-gray-400 text-sm font-medium">
          Loading child tiers...
        </div>
      </div>
    );
  }

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle={`${isSampleData ? "(Sample Data) " : "Stacked Distribution Assessment"}`}
        chartId={chartId}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload:
            tierLevel === 0 ? () => handleDownload(widgetTitle) : undefined,
          onUpload:
            tierLevel === 0
              ? () =>
                  document
                    .getElementById(`upload-horizontal-${chartId}`)
                    ?.click()
              : undefined,
          onDelete: onDelete,
          onAddTier: !isCreationMode
            ? () => handleAddTierClick(widgetTitle)
            : undefined,
          onToggleWidget: onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        footer={
          childTiers?.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} child tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <div className="relative">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={Math.max(400, chartData.length * 50)}>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="0"
                  horizontal={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  type="number"
                  domain={[safeStartingRange, safeEndingRange]}
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={{ stroke: "#e5e7eb" }}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  width={20}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#f3f4f6", opacity: 0.4 }}
                />

                {effectiveLegendValues.map((l) => (
                  <Bar
                    key={l.field}
                    name={l.label}
                    dataKey={l.field}
                    stackId="a"
                    fill={l.color}
                    radius={[0, 4, 4, 0]}
                    barSize={32}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex flex-col items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
              <span className="mb-2 text-2xl">📊</span>
              <p className="text-sm">
                No data available. Please configure the chart.
              </p>
            </div>
          )}

          {/* Legend Display */}
          {chartData.length > 0 && (
            <div className="flex justify-center flex-wrap gap-6 mt-6 pb-2 border-t border-gray-50 pt-4">
              {effectiveLegendValues.map((l) => (
                <div key={l.field} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-xs font-semibold text-gray-600">
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tierLevel === 0 && (
            <input
              id={`upload-horizontal-${chartId}`}
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleUpload}
            />
          )}
        </div>
      </ChartCardWrapper>

      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        chartId={chartId}
        parentChartName={tierLevel === 0 ? widgetTitle : groupTitle}
      />

      {showChildrenModal && (
        <TierChartModal
          isOpen={showChildrenModal}
          onClose={() => setShowChildrenModal(false)}
          tierLevel={tierLevel + 1}
          title={widgetTitle}
          breadcrumbs={currentBreadcrumbs}
          onBreadcrumbClick={handleBreadcrumbClick}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {childTiers?.map((tier: any) => {
              const category = chartTypes[tier.category];
              const tierLegends = (
                tier?.[category]?.widgets ||
                tier?.widgets ||
                []
              ).map((w: any) => ({
                label: w.legendName || w.label,
                field: (w.legendName || w.label)
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
                color: w.color,
              }));

              const { labels, data } = parseHorizontalBarData(
                tier.xAxis,
                tierLegends,
                tier.title,
              );

              return (
                <HorizontalBarChart
                  key={tier.id}
                  widgetTitle={tier.title || tier.name || "Untitled Tier"}
                  xAxisValues={labels}
                  legendValues={tierLegends}
                  startingRange={startingRange}
                  endingRange={endingRange}
                  tierLevel={tierLevel + 1}
                  chartId={tier.id}
                  allUploadedData={data}
                  isPreview={isPreview}
                  projectId={tier.projectId || projectId}
                  breadcrumbPath={currentBreadcrumbs}
                  onNavigate={handleChildNavigate}
                  onDelete={onDelete}
                />
              );
            })}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
