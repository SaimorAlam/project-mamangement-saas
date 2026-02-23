/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { generateAreaChartData } from "@/utils";
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

/**
 * Parse xAxis 2D array format from API
 * Format: [["Project A", 0, 0], ["Project B", 0, 0], ...]
 * All rows are data rows — no header row in the new format.
 */
export const parseAreaChartData = (
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

  // Smart header detection: a header row has legend labels (strings) in data columns,
  // whereas data rows have numbers (0 by default in creation mode).
  const hasHeader =
    parsedXAxis.length > 0 &&
    Array.isArray(parsedXAxis[0]) &&
    parsedXAxis[0].length > 1 &&
    typeof parsedXAxis[0][1] === "string";

  const dataRows = hasHeader ? parsedXAxis.slice(1) : parsedXAxis;

  // Extract labels from the first column of every data row
  const labels = dataRows.map((row: any) => String(row[0] || ""));

  const chartData: ChartData[] = dataRows.map((row: any) => {
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

/*     TYPES     */

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

type LegendValue = {
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
  projectId?: string;
  isCreationMode?: boolean;
  allUploadedData?: { [key: string]: ChartData[] };
  isPreview?: boolean;
  breadcrumbPath?: BreadcrumbItem[];
  onNavigate?: (level: number) => void;
};

/*     COMPONENT     */

export default function AreaChart({
  widgetTitle = "Area Chart",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId,
  projectId,
  isCreationMode = false,
  allUploadedData,
  isPreview = false,
  breadcrumbPath = [],
  onNavigate,
}: Props) {
  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();
  const [findChildrenValue, { data, isLoading }] =
    useLazyFindChildrenValueQuery();

  const dispatch = useAppDispatch();
  const groupTitle = useAppSelector((state) => state.chartSlice.groupTitle);

  useEffect(() => {
    if (chartId) {
      findChildrenValue(chartId);
    }
  }, [chartId, findChildrenValue]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

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
      if (onNavigate) onNavigate(target.level);
      setShowChildrenModal(false);
    }
  };

  /*   EFFECTIVE DATA   */

  const effectiveLegendValues = useMemo(() => {
    if (legendValues.length > 0 && legendValues.some((l) => l.label !== "")) {
      return legendValues.map((l) => ({
        ...l,
        field: l.field || l.label.toLowerCase().replace(/\s+/g, ""),
      }));
    }
    return [
      { label: "Sample A", field: "field1", color: "#13A490" },
      { label: "Sample B", field: "field2", color: "#35B6EE" },
      { label: "Sample C", field: "field3", color: "#6F78F9" },
    ];
  }, [legendValues]);

  const effectiveXAxisValues = useMemo(() => {
    const validValues = xAxisValues.filter((v) => v !== "");
    if (validValues.length > 0) return validValues;
    return ["Jan", "Feb", "Mar", "Apr", "May"];
  }, [xAxisValues]);

  const { safeStartingRange, safeEndingRange } = useMemo(() => {
    let start = startingRange;
    let end = endingRange;
    if (start === end) {
      start = 0;
      end = 100;
    }
    return { safeStartingRange: start, safeEndingRange: end };
  }, [startingRange, endingRange]);

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
        chartData: generateAreaChartData(
          xAxisValues.filter((v) => v !== ""),
          effectiveLegendValues,
          safeStartingRange,
          safeEndingRange,
        ),
        isSampleData: true,
      };
    }

    // Priority 3: Fallback
    return {
      chartData: generateAreaChartData(
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

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
  };

  const handleDownload = async (title: string) => {
    if (!projectId) {
      toast.error("Project ID is missing");
      return;
    }
    setIsDownloading(true);
    try {
      const res = await getAllTheLeafChart(projectId).unwrap();
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
                // Smart header detection: a header row has legend labels (strings) in data columns.
                // We skip it because the download process manually adds a header row.
                const hasHeader =
                  parsed[0].length > 1 && typeof parsed[0][1] === "string";
                xAxis = (hasHeader ? parsed.slice(1) : parsed).map(
                  (row: any) => row[0],
                );
              } else {
                xAxis = parsed;
              }
            } else {
              xAxis = parsed.labels || [];
            }
          } catch {
            /* ignore */
          }
        }
        if (!xAxis.length) xAxis = effectiveXAxisValues;

        let legends = node.legendValues || [];
        const nodeWidgets = node.widgets || node.areaChart?.widgets;
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

  const handleAddTierClick = (title: string) => {
    if (tierLevel === 0) {
      dispatch(setGroupTitle(title));
    }
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
      category: "AREA",
      xAxis: JSON.stringify([
        ["Label", ...legendValues.map((l) => l.label)],
        ...xAxisValues.map((label) => [
          label,
          ...Array(numOfLegendDataSet).fill(0),
        ]),
      ]),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
      projectId: projectId,
      parentId: chartId,
      rootchart: false,
      roottitle: widgetTitle,
      grouptitle: tierLevel === 0 ? widgetTitle : groupTitle,
    };
    dispatch(setChildPayload(childPayload));
    setShowAddTierModal(true);
  };

  const handleChartClick = () => {
    if (data?.data && data.data.length > 0) {
      setShowChildrenModal(true);
      if (tierLevel === 0) {
        dispatch(setGroupTitle(widgetTitle));
      }
    }
  };

  /*   TOOLTIP   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">{row.name}</p>
        {effectiveLegendValues.map((l) => (
          <p key={l.field} style={{ color: l.color }} className="text-sm">
            {l.label}: {row[l.field]}
          </p>
        ))}
      </div>
    );
  };

  if (isLoading)
    return (
      <div className="h-[400px] flex items-center justify-center">
        Loading...
      </div>
    );

  const childTiers = data?.data;

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle={`Area performance view ${isSampleData ? "(Sample Data)" : ""}`}
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
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              {effectiveLegendValues.slice(0, 3).map(
                (l) =>
                  l.label && (
                    <div key={l.field} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: l.color }}
                      />
                      <span className="text-xs text-gray-500 font-medium">
                        {l.label}
                      </span>
                    </div>
                  ),
              )}
              {effectiveLegendValues.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{effectiveLegendValues.length - 3} more
                </span>
              )}
            </div>
          </div>
        }
        footer={
          childTiers && childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} child tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <div className="h-[400px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ReAreaChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[safeStartingRange, safeEndingRange]}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {effectiveLegendValues.map((l) => (
                <Area
                  key={l.field}
                  dataKey={l.field}
                  type="monotone"
                  stackId="1"
                  stroke={l.color}
                  fill={l.color}
                  fillOpacity={0.3}
                />
              ))}
            </ReAreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCardWrapper>

      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        chartId={chartId}
        parentChartName={groupTitle}
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
            {childTiers &&
              childTiers.map((tier: any) => {
                const tierLegends = (tier?.areaChart?.widgets || []).map(
                  (w: any) => ({
                    label: w.legendName,
                    field: w.legendName?.toLowerCase().replace(/\s+/g, ""),
                    color: w.color,
                  }),
                );

                const { labels, data: tierUploadedData } = parseAreaChartData(
                  tier.xAxis,
                  tierLegends,
                  tier.title,
                );

                return (
                  <AreaChart
                    key={tier.id}
                    widgetTitle={tier.title || tier.name || "Untitled Tier"}
                    xAxisValues={labels}
                    legendValues={tierLegends}
                    numOfLegendDataSet={tierLegends.length}
                    startingRange={startingRange}
                    endingRange={endingRange}
                    tierLevel={tierLevel + 1}
                    chartId={tier.id}
                    projectId={tier.projectId}
                    allUploadedData={tierUploadedData}
                    isPreview={isPreview}
                    onDelete={onDelete}
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
