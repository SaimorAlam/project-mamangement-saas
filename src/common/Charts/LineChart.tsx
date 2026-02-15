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
import { generateLineChartData } from "@/utils";
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
import { parseLineChartData } from "@/utils/parseLineChartData";

/*       TYPES       */

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

type LegendValue = {
  label: string;
  field: string;
  color: string;
};

export type TierChart = {
  id: string;
  name: string;
  xAxisValues: string[];
  legendValues: LegendValue[];
  children: TierChart[];
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
  const [localUploadedData, setLocalUploadedData] = useState<
    { [key: string]: ChartData[] } | undefined
  >(allUploadedData);

  // API hooks for tier management
  const [findChildrenValue, { data, isLoading }] =
    useLazyFindChildrenValueQuery();
  const [getAllTheLeafChart] = useLazyGetAllTheLeafChartQuery();
  
  const dispatch = useAppDispatch();
  const groupTitle = useAppSelector((state) => state.chartSlice.groupTitle);
  const childTiers = data?.data;

  // Tier management states
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  // Fetch children when chartId changes
  useEffect(() => {
    if (chartId && chartId !== "root") {
      findChildrenValue(chartId);
    }
  }, [chartId, findChildrenValue]);

  /*   EFFECTIVE DATA FOR RENDERING   */

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
    if (validValues.length > 0) {
      return validValues;
    }
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

    const dataToUse =
      localUploadedData?.[sheetName] || allUploadedData?.[sheetName];

    // Priority 1: Real Uploaded Data
    if (dataToUse && dataToUse.length > 0) {
      return { chartData: dataToUse, isSampleData: false };
    }

    const hasConfig =
      xAxisValues.length > 0 &&
      xAxisValues.some((v) => v !== "") &&
      effectiveLegendValues.length > 0 &&
      effectiveLegendValues.some((l) => l.label !== "");

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

        if (!xAxis.length) {
          xAxis = effectiveXAxisValues;
        }

        let legends = node.legendValues || [];
        const nodeWidgets = node.widgets || node.lineChart?.widgets;
        if (!legends.length && nodeWidgets) {
          legends = nodeWidgets.map((w: any) => ({
            label: w.legendName || w.label || "Legend",
            field: (w.legendName || w.label || "field")
              .toLowerCase()
              .replace(/\s+/g, ""),
            color: w.color || "#000000",
          }));
        }

        if (!legends.length) {
          legends = effectiveLegendValues;
        }

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
  };

  const handleAddTierClick = (title: string) => {
    if (tierLevel === 0) {
      dispatch(setGroupTitle(title));
    }
    const childPayload = {
      numberOfDataset: numOfLegendDataSet,
      firstFiledDataset: safeStartingRange,
      lastFiledDAtaset: safeEndingRange,
      widgets: legendValues.map((l) => ({
        legendName: l.label,
        color: l.color,
      })),
      title: "",
      status: "ACTIVE",
      category: "LINE",
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
      grouptitle: groupTitle,
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
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">
          {payload[0].payload.name}
        </p>
        {effectiveLegendValues.map((l) => (
          <p
            key={l.field}
            style={{ color: l.color }}
            className="text-sm"
          >
            {l.label}: {payload[0].payload[l.field]}
          </p>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading child tiers...</div>;
  }

  /*   RENDER   */

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle={`Multi-Axis Distribution ${isSampleData ? "(Sample Data)" : ""}`}
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
                    .getElementById(`upload-input-line-${chartId || widgetTitle}`)
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
        customHeaderContent={
          <div className="flex gap-4 items-center">
            <div className="flex gap-3">
              {effectiveLegendValues.slice(0, 3).map((l) =>
                l.label ? (
                  <div key={l.field} className="flex items-center gap-1.5">
                    <div className="w-3 h-1 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-xs text-gray-500">{l.label}</span>
                  </div>
                ) : null
              )}
              {effectiveLegendValues.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{effectiveLegendValues.length - 3} more
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLineOnly(!showLineOnly);
              }}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                showLineOnly 
                  ? "bg-blue-50 text-blue-600 border border-blue-100" 
                  : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
              }`}
            >
              Line Only {showLineOnly ? "✓" : ""}
            </button>
          </div>
        }
        footer={
          childTiers?.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers?.length} child tier{childTiers?.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <div className="relative">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <YAxis 
                  domain={[safeStartingRange, safeEndingRange]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <Tooltip content={<CustomTooltip />} />

                {effectiveLegendValues.map((l) => (
                  <Line
                    key={l.field}
                    type="monotone"
                    dataKey={l.field}
                    stroke={l.color}
                    dot={!showLineOnly}
                    strokeWidth={2}
                    opacity={
                      hoveredLine === null || hoveredLine === l.field
                        ? 1
                        : 0.3
                    }
                    onMouseEnter={() => setHoveredLine(l.field)}
                    onMouseLeave={() => setHoveredLine(null)}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">
               No data available. Please configure the chart.
            </div>
          )}

          {tierLevel === 0 && (
            <input
              id={`upload-input-line-${chartId || widgetTitle}`}
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
              childTiers?.map((tier: any) => {
                const tierLegends = (tier?.lineChart?.widgets || tier?.widgets || []).map(
                  (w: any) => ({
                    label: w.legendName || w.label,
                    field: (w.legendName || w.label)?.toLowerCase().replace(/\s+/g, ""),
                    color: w.color,
                  }),
                );

                const { labels, data } = parseLineChartData(
                  tier.xAxis,
                  tierLegends,
                  tier.title,
                );

                return (
                  <MultiAxisLineChart
                    key={tier?.id}
                    widgetTitle={
                      tier?.title ||
                      tier?.name ||
                      tier?.taskName ||
                      "Untitled Tier"
                    }
                    xAxisValues={labels}
                    legendValues={tierLegends}
                    numOfLegendDataSet={tierLegends.length}
                    startingRange={startingRange}
                    endingRange={endingRange}
                    tierLevel={tierLevel + 1}
                    chartId={tier?.id}
                    allUploadedData={data}
                    isPreview={isPreview}
                    widgets={tier?.widgets}
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
