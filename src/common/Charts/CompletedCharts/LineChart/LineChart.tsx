/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { generateLineChartData } from "@/utils/clientPannelHelpers/programBuilderHelpers";
import AddTierModal from "../../../Modal/AddTierModal";
import TierChartModal from "../../../Modal/TierChartModal";
import ChartCardWrapper from "../../components/ChartCardWrapper";
import {
  useLazyFindChildrenValueQuery,
  useLazyGetAllTheLeafChartQuery,
} from "@/store/Api/ChartApi/ChartApi";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  setChildPayload,
  setGroupTitle,
} from "@/store/Slices/ChartSlice/ChartSlice";
import { parseLineChartData } from "@/utils/parseLineChartData";
import { chartTypes } from "@/utils/ChartCategory";

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
  numOfLegendDataSet?: number;
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  isPreview?: boolean;
  projectId?: string;
  allUploadedData?: { [key: string]: ChartData[] };
  breadcrumbPath?: BreadcrumbItem[];
  onNavigate?: (level: number) => void;
  widgets?: any[];
  isCreationMode?: boolean;
};

/*       COMPONENT       */

export default function MultiAxisLineChart({
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 3,
  startingRange,
  endingRange,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId = "root",
  isPreview = false,
  projectId,
  allUploadedData,
  isCreationMode = false,
  breadcrumbPath = [],
  onNavigate,
}: Props) {
  const [showLineOnly, setShowLineOnly] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // API hooks
  const [findChildrenValue, { data, isLoading }] =
    useLazyFindChildrenValueQuery();
  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();

  const dispatch = useAppDispatch();
  const groupTitle = useAppSelector((state) => state.chartSlice.groupTitle);
  const childTiers = data?.data;

  // Modals
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  // Fetch children
  useEffect(() => {
    if (chartId && chartId !== "root") {
      findChildrenValue(chartId);
    }
  }, [chartId, findChildrenValue]);

  /*   EFFECTIVE CONFIGURATIONS   */

  const effectiveLegendValues = useMemo(() => {
    // Filter to ensure we only process legends that actually have a label
    const validLegends = legendValues.filter(
      (l) => l.label && l.label.trim() !== "",
    );

    if (validLegends.length > 0) {
      return validLegends.map((l) => ({
        ...l,
        field: l.field || l.label.toLowerCase().replace(/\s+/g, ""),
      }));
    }

    // Fallback to sample data if no valid legends are found
    return [
      { label: "Sample A", field: "field1", color: "#13A490" },
      { label: "Sample B", field: "field2", color: "#35B6EE" },
      { label: "Sample C", field: "field3", color: "#6f78f9" },
    ];
  }, [legendValues]);

  const effectiveXAxisValues = useMemo(() => {
    const validValues = xAxisValues.filter((v) => v !== "");
    if (validValues.length > 0) {
      return validValues;
    }
    return ["Jan", "Feb", "Mar", "Apr", "May"];
  }, [xAxisValues]);

  const { safeStartingRange, safeEndingRange } = useMemo(() => {
    let start = Number(startingRange);
    let end = Number(endingRange);
    if (start === end) {
      start = 0;
      end = 100;
    }
    return { safeStartingRange: start, safeEndingRange: end };
  }, [startingRange, endingRange]);

  /*   DATA MAPPING   */

  const { chartData, isSampleData } = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet")
      .replace(/[:/?*[\]\\]/g, " ")
      .trim()
      .substring(0, 31);

    const dataToUse = allUploadedData?.[sheetName];

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
      legendValues.length > 0 &&
      legendValues.some((l) => l.label !== "");

    // Priority 2: Sample Data based on Config
    if (hasConfig) {
      return {
        chartData: generateLineChartData(
          xAxisValues.filter((v) => v !== ""),
          effectiveLegendValues,
          safeStartingRange,
          safeEndingRange,
        ),
        isSampleData: true,
      };
    }

    // Priority 3: Default Sample Data (Generic fallback)
    return {
      chartData: generateLineChartData(
        effectiveXAxisValues,
        effectiveLegendValues,
        0,
        100,
      ),
      isSampleData: true,
    };
  }, [
    xAxisValues,
    legendValues,
    safeStartingRange,
    safeEndingRange,
    widgetTitle,
    effectiveXAxisValues,
    effectiveLegendValues,
    allUploadedData,
  ]);

  /*   NAVIGATION & BREADCRUMBS   */

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

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
    toast.success("JSON copied to clipboard");
  };

  const handleDownload = async (title: string) => {
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }
    setIsDownloading(true);
    try {
      const res = await getAllTheLeafChart(projectId).unwrap();
      const leafCharts = res?.data?.find(
        (item: any) => item.grouptitle === title,
      );

      if (!leafCharts || !leafCharts.charts?.length) {
        // Fallback: download just this chart if no tier group found
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

      const getUniqueSheetName = (name: string, id: string) => {
        const safeName = (name || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim();
        const fullName = `${safeName}_${id}`;
        let finalName =
          fullName.length > 31 ? fullName.substring(0, 31) : fullName;
        let counter = 1;
        while (usedNames.has(finalName.toLowerCase())) {
          const suffix = `_${counter}`;
          finalName = fullName.substring(0, 31 - suffix.length) + suffix;
          counter++;
        }
        usedNames.add(finalName.toLowerCase());
        return finalName;
      };

      leafCharts.charts.forEach((node: any) => {
        ids.push(node.id);
        // Get xAxis from node project metadata or fallback
        let xAxisItems: string[] = [];
        try {
          const parsed =
            typeof node.xAxis === "string"
              ? JSON.parse(node.xAxis)
              : node.xAxis;
          if (Array.isArray(parsed) && parsed.length > 0) {
            // All rows are data rows — no header to skip
            xAxisItems = parsed.map((row: any) => String(row[0]));
          } else if (parsed?.labels) {
            xAxisItems = parsed.labels;
          }
        } catch {
          /* ignore */
        }

        if (!xAxisItems.length) xAxisItems = effectiveXAxisValues;

        // Get legends
        const nodeWidgets = node.widgets || node.lineChart?.widgets || [];
        const legends =
          nodeWidgets.length > 0
            ? nodeWidgets.map((w: any) => ({ label: w.legendName || w.label }))
            : effectiveLegendValues;

        const headers = ["Label", ...legends.map((l: any) => l.label)];
        const rows = xAxisItems.map((label) => [
          label,
          ...Array(legends.length).fill(""),
        ]);
        const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const sheetName = getUniqueSheetName(
          node.title || node.name || "Tier",
          node.id,
        );
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      });

      XLSX.writeFile(wb, `${widgetTitle}_ID_${ids.join("_")}.xlsx`);
      toast.success("Excel template downloaded");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download Excel");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddTierClick = (title: string) => {
    if (tierLevel === 0) dispatch(setGroupTitle(title));

    const childPayload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: safeStartingRange,
      lastFieldDataset: safeEndingRange,
      widgets: legendValues.map((l) => ({
        legendName: l.label,
        color: l.color,
      })),
      title: "",
      status: "ACTIVE",
      category: "LINE",
      xAxis: JSON.stringify([
        // ["Label", ...legendValues.map((l) => l.label)],
        ...effectiveXAxisValues.map((label) => [
          label,
          ...Array(legendValues.length).fill(0),
        ]),
      ]),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
      projectId,
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
      if (tierLevel === 0) dispatch(setGroupTitle(widgetTitle));
    }
  };

  /*   TOOLTIP & UI   */

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
        subtitle={`${isSampleData ? "(Sample Data)" : "Line Distribution Assessment"}`}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload:
            tierLevel === 0 ? () => handleDownload(widgetTitle) : undefined,
          onDelete: onDelete,
          onAddTier: !isCreationMode
            ? () => handleAddTierClick(widgetTitle)
            : undefined,
          onToggleWidget: onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        customHeaderContent={
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowLineOnly(!showLineOnly);
            }}
            className={`text-xs px-2 py-1 rounded-md transition-all ${
              showLineOnly
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            Line Only {showLineOnly ? "✓" : ""}
          </button>
        }
        footer={
          childTiers?.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers?.length} child tier
              {childTiers?.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <div className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="name"
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                dy={10}
              />
              <YAxis
                domain={[safeStartingRange, safeEndingRange]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                dx={-10}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
              />

              {effectiveLegendValues.map((l) => (
                <Line
                  key={l.field}
                  name={l.label}
                  type="monotone"
                  dataKey={l.field}
                  stroke={l.color}
                  dot={
                    !showLineOnly
                      ? {
                          r: 5,
                          fill: l.color,
                          stroke: l.color,
                          strokeWidth: 2,
                        }
                      : false
                  }
                  activeDot={{
                    r: 7,
                    fill: l.color,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                  strokeWidth={3}
                  connectNulls
                  opacity={
                    hoveredLine === null || hoveredLine === l.field ? 1 : 0.2
                  }
                  onMouseEnter={() => setHoveredLine(l.field)}
                  onMouseLeave={() => setHoveredLine(null)}
                  animationDuration={1500}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* Bottom Legend Alignment */}
          {chartData.length > 0 && (
            <div className="flex justify-center flex-wrap gap-6 mt-6 pb-2 border-t border-gray-50 pt-4">
              {effectiveLegendValues.map((l) => (
                <div key={l.field} className="flex items-center gap-2">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-1 rounded-full"
                      style={{ backgroundColor: l.color }}
                    />
                    <div
                      className="w-2.5 h-2.5 rounded-full -ml-1 border-2 border-white box-content shadow-sm"
                      style={{ backgroundColor: l.color }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
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

              const { labels, data } = parseLineChartData(
                tier.xAxis,
                tierLegends,
                tier.title,
              );

              return (
                <MultiAxisLineChart
                  key={tier?.id}
                  widgetTitle={tier?.title || tier?.name || "Untitled Tier"}
                  xAxisValues={labels}
                  legendValues={tierLegends}
                  numOfLegendDataSet={tierLegends.length}
                  startingRange={startingRange}
                  endingRange={endingRange}
                  tierLevel={tierLevel + 1}
                  chartId={tier?.id}
                  allUploadedData={data}
                  isPreview={isPreview}
                  projectId={tier?.projectId || projectId}
                  breadcrumbPath={currentBreadcrumbs}
                  onNavigate={handleChildNavigate}
                />
              );
            })}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
