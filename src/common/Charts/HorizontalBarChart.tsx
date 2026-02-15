/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { generateChartData } from "@/utils";
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
  numOfLegendDataSet = 1,
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
    if (legendValues.length > 0 && legendValues.some((l) => l.label !== "")) {
      return legendValues.map((l) => ({
        ...l,
        field: l.field || l.label.toLowerCase().replace(/\s+/g, ""),
      }));
    }
    return [{ label: "Sample", field: "field1", color: "#6366f1" }];
  }, [legendValues]);

  const effectiveXAxisValues = useMemo(() => {
    const validValues = xAxisValues.filter((v) => v !== "");
    if (validValues.length > 0) {
      return validValues;
    }
    return ["Category A", "Category B", "Category C"];
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

    if (dataToUse && dataToUse.length > 0) {
      return { chartData: dataToUse, isSampleData: false };
    }

    const hasConfig =
      xAxisValues.length > 0 &&
      xAxisValues.some((v) => v !== "") &&
      legendValues.length > 0 &&
      legendValues.some((l) => l.label !== "");

    if (hasConfig) {
      return {
        chartData: generateChartData(
          xAxisValues.filter((v) => v !== ""),
          effectiveLegendValues,
          numOfLegendDataSet,
          safeStartingRange,
          safeEndingRange,
        ),
        isSampleData: true,
      };
    }

    return {
      chartData: generateChartData(
        effectiveXAxisValues,
        effectiveLegendValues,
        1,
        0,
        100,
      ),
      isSampleData: true,
    };
  }, [
    xAxisValues,
    legendValues,
    numOfLegendDataSet,
    safeStartingRange,
    safeEndingRange,
    widgetTitle,
    localUploadedData,
    allUploadedData,
    effectiveXAxisValues,
    effectiveLegendValues,
  ]);

  const barData = useMemo(() => {
    if (!chartData.length || !effectiveLegendValues.length) return [];
    const firstLegend = effectiveLegendValues[0];
    return chartData.map((row) => ({
      label: row.name,
      value: Number(row[firstLegend.field] || 0),
    }));
  }, [chartData, effectiveLegendValues]);

  const totalValue = useMemo(() => {
    return barData.reduce((sum, item) => sum + item.value, 0);
  }, [barData]);

  const maxValue = useMemo(() => {
    const maxInBars = Math.max(...barData.map((b) => b.value), 0);
    return Math.max(maxInBars, safeEndingRange, 1);
  }, [barData, safeEndingRange]);

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
      category: "HORIZONTAL_BAR",
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

  const generateScaleTicks = () => {
    const tickCount = 6;
    const step = Math.ceil(maxValue / (tickCount - 1));
    return Array.from({ length: tickCount }, (_, i) => i * (step || 1));
  };

  const scaleTicks = generateScaleTicks();

  /*   RENDER   */

  if (isLoading) {
    return <div>Loading tiers...</div>;
  }

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle={`${isSampleData ? "(Sample Data) " : ""}${
          effectiveLegendValues.length > 0 ? effectiveLegendValues[0].label : "Distribution"
        }`}
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
                    .getElementById(`upload-input-horizontal-${chartId || widgetTitle}`)
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
          <div className="text-sm text-gray-600">
            Total <span className="font-semibold text-gray-900">{totalValue}</span>
          </div>
        }
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
          {barData.length > 0 ? (
            <>
              <div className="space-y-4 mb-6">
                {barData.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-right text-sm text-gray-600 truncate">
                      {item.label}
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                        <div
                          className="h-full rounded-lg transition-all duration-500 ease-out"
                          style={{
                            width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                            backgroundColor:
                              effectiveLegendValues.length > 0
                                ? effectiveLegendValues[0].color
                                : "#6366f1",
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-700">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative ml-28 mr-16 h-8">
                <div className="absolute inset-x-0 top-0 flex justify-between text-[10px] text-gray-400">
                  {scaleTicks.map((tick) => (
                    <div key={tick} className="relative flex flex-col items-center">
                      <div className="w-px h-1.5 bg-gray-300" />
                      <div className="mt-1">{tick}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">
              No data available. Please configure the widget.
            </div>
          )}

          {tierLevel === 0 && (
            <input
              id={`upload-input-horizontal-${chartId || widgetTitle}`}
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
            {childTiers?.map((tier: any) => {
              const tierLegends = (
                tier?.horizontalBarChart?.widgets ||
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
                  numOfLegendDataSet={tierLegends.length}
                  startingRange={startingRange}
                  endingRange={endingRange}
                  tierLevel={tierLevel + 1}
                  chartId={tier.id}
                  allUploadedData={data}
                  isPreview={isPreview}
                  projectId={tier.projectId || projectId}
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
