/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";

import {
  AnimationModule,
  ContextMenuModule,
  CrosshairModule,
  HistogramSeriesModule,
  LegendModule,
  ModuleRegistry,
  NumberAxisModule,
} from "ag-charts-enterprise";

// ✅ register once (safe even if called multiple times)
ModuleRegistry.registerModules([
  AnimationModule,
  CrosshairModule,
  HistogramSeriesModule,
  LegendModule,
  NumberAxisModule,
  ContextMenuModule,
]);

/*       TYPES       */

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

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[];
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  startingRange: number;
  endingRange: number;
  chartHeight?: number; // NEW
  strokeWidth?: number; // NEW
  dataPointsPerSeries?: number; // NEW
  fillOpacity?: number; // NEW
  binCount?: number; // NEW
  onToggleWidget?: () => void;
  tierLevel?: number;
  chartId?: string;
};

/*       HELPER FUNCTIONS       */

// Deterministic hash function for consistent values
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Deterministic pseudo-random number generator
const deterministicRandom = (
  seed: number,
  min: number,
  max: number
): number => {
  // Simple deterministic pseudo-random based on seed
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return Math.floor(random * (max - min + 1)) + min;
};

const generateHistogramDataForLegend = (
  startingRange: number,
  endingRange: number,
  dataPointsPerSeries: number,
  legendIndex: number = 0
) => {
  // Generate deterministic data points for histogram
  const dataPoints: { value: number; series: string }[] = [];

  for (let i = 0; i < dataPointsPerSeries; i++) {
    // Create a unique seed for each data point
    const seed = simpleHash(
      `${legendIndex}-${i}-${startingRange}-${endingRange}`
    );

    // Use deterministic random based on seed with slight variation per legend
    const variation = legendIndex * 10;
    const baseValue = deterministicRandom(
      seed,
      startingRange,
      endingRange
    );
    const value = Math.max(
      startingRange,
      Math.min(endingRange, baseValue + variation)
    );
    dataPoints.push({ value, series: `series_${legendIndex}` });
  }

  return dataPoints;
};

const generateCombinedHistogramData = (
  startingRange: number,
  endingRange: number,
  legendCount: number,
  dataPointsPerSeries: number
) => {
  // Generate combined data for all legends
  const allData: { value: number; series: string }[] = [];

  for (let i = 0; i < legendCount; i++) {
    const seriesData = generateHistogramDataForLegend(
      startingRange,
      endingRange,
      dataPointsPerSeries,
      i
    );
    allData.push(...seriesData);
  }

  return allData;
};

const generateId = () =>
  crypto.randomUUID?.() ??
  Math.random().toString(36).substring(2, 10);

/*       COMPONENT       */

export default function HistogramChart({
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  chartHeight = 400, // NEW DEFAULT
  strokeWidth = 2, // NEW DEFAULT
  dataPointsPerSeries = 50, // NEW DEFAULT
  fillOpacity = 0.7, // NEW DEFAULT
  binCount = 10, // NEW DEFAULT
  onToggleWidget,
  tierLevel = 0,
  chartId = "root",
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  // Tier management states
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA   */
  const histogramData = useMemo(() => {
    return generateCombinedHistogramData(
      startingRange,
      endingRange,
      legendValues.length || 1,
      dataPointsPerSeries
    );
  }, [
    startingRange,
    endingRange,
    legendValues.length,
    dataPointsPerSeries,
  ]);

  /*   AG CHARTS OPTIONS   */
  const chartOptions = useMemo((): AgChartOptions | null => {
    if (!histogramData.length) return null;

    // Create multiple series if we have multiple legends
    const series = legendValues.map((legend, index) => ({
      type: "histogram" as const,
      xKey: "value",
      yKey: "value",
      xName: legend.label || `Series ${index + 1}`,
      fill: legend.color || "#8D79F6",
      stroke: legend.color || "#8D79F6",
      fillOpacity: fillOpacity - index * 0.1, // Slight opacity variation for overlapping histograms
      strokeWidth: strokeWidth,
      title: legend.label || `Series ${index + 1}`,
      data: histogramData.filter(
        (item) => item.series === `series_${index}`
      ),
    }));

    // If no legends configured, use default
    if (series.length === 0) {
      series.push({
        type: "histogram",
        xKey: "value",
        yKey: "value",
        xName: "Value",
        fill: "#8D79F6",
        stroke: "#8D79F6",
        fillOpacity: fillOpacity,
        strokeWidth: strokeWidth,
        title: "Histogram",
        data: histogramData,
      });
    }

    // Calculate bin interval based on bin count
    const range = endingRange - startingRange;
    const binInterval = range / binCount;

    return {
      data: legendValues.length > 1 ? [] : histogramData,
      series,
      axes: [
        {
          type: "number",
          position: "bottom",
          title: {
            text: xAxisValues[0] || "Value Range",
            enabled: xAxisValues[0]?.trim().length > 0,
          },
          interval: {
            step: binInterval,
          },
          label: {
            formatter: (params: any) => {
              return params.value;
            },
          },
        },
        {
          type: "number",
          position: "left",
          title: {
            text: "Frequency",
            enabled: true,
          },
        },
      ],
      legend: {
        enabled:
          legendValues.length > 1 ||
          legendValues[0]?.label?.trim().length > 0,
        position: "right",
        item: {
          marker: {
            shape: "square",
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    } as unknown as AgChartOptions;
  }, [
    histogramData,
    legendValues,
    xAxisValues,
    startingRange,
    endingRange,
    fillOpacity,
    strokeWidth,
    binCount,
  ]);

  const hasValidLegendData =
    legendValues.some((l) => l.field.trim() !== "") ||
    legendValues.length === 0;
  const hasValidData = histogramData.length > 0 && hasValidLegendData;

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(
      JSON.stringify(histogramData, null, 2)
    );
  };

  const handleDownload = () => {
    const csvId = generateId();

    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFiledDataset: startingRange,
      lastFiledDAtaset: endingRange,
      showWidgets: legendValues.map((l) => ({
        legend_name: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "HISTOGRAM",
      xAxis: JSON.stringify({
        labels: xAxisValues,
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({
        chartHeight: chartHeight,
        strokeWidth: strokeWidth,
        dataPointsPerSeries: dataPointsPerSeries,
        fillOpacity: fillOpacity,
        binCount: binCount,
      }),
    };
    setIsDownloading(true);

    // For CSV export - include series if multiple legends
    const header = legendValues.length > 1 ? "Series,Value" : "Value";
    const rows = histogramData.map((item) =>
      legendValues.length > 1
        ? `${item.series || "default"},${item.value}`
        : `${item.value}`
    );
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widgetTitle}-${csvId}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    // Also save to backend
    DownloadAndSaveCSVforModuleOneWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      xAxisValues,
      legendValues
    );

    setIsDownloading(false);
  };

  const handleWidgetClick = () => {
    if (onToggleWidget) {
      onToggleWidget();
    }
    setShowPopover(false);
  };

  const handleAddTierClick = () => {
    setShowAddTierModal(true);
    setShowPopover(false);
  };

  const handleSaveTier = (tierName: string) => {
    const newTier: TierChart = {
      id: `${chartId}-tier-${Date.now()}`,
      name: tierName,
      xAxisValues: xAxisValues,
      legendValues: legendValues,
      children: [],
    };
    setChildTiers([...childTiers, newTier]);
    setShowAddTierModal(false);
  };

  const handleChartClick = () => {
    if (childTiers.length > 0) {
      setShowChildrenModal(true);
    }
  };

  /*   RENDER   */

  return (
    <>
      <div
        className={`w-full bg-white border border-gray-200 rounded-lg p-6 ${
          childTiers.length > 0
            ? "cursor-pointer hover:shadow-lg transition-shadow"
            : ""
        }`}
        onClick={handleChartClick}
      >
        {/* Header */}
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">{widgetTitle}</h2>
            {legendValues.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3">
                {legendValues.map(
                  (legend, index) =>
                    legend.label && (
                      <div
                        key={index}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: legend.color }}
                        />
                        <span className="text-sm">
                          {legend.label}
                        </span>
                      </div>
                    )
                )}
              </div>
            )}
          </div>

          <div
            className="flex items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 border-l pl-4 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPopover(!showPopover);
                }}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <BsThreeDots size={18} />
              </button>

              {showPopover && (
                <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-48 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                      setShowPopover(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <Copy size={18} />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                      setShowPopover(false);
                    }}
                    disabled={isDownloading}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPopover(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left text-red-600"
                  >
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>

                  {onToggleWidget && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWidgetClick();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                    >
                      <MdOutlineWidgets size={18} />
                      <span>Widget</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddTierClick();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <GoPlus size={18} />
                    <span>Add Tier</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Histogram Chart */}
        {chartOptions && hasValidData ? (
          <div style={{ height: `${chartHeight}px` }}>
            <AgCharts options={chartOptions} />
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            No data available. Please configure legends and ensure
            field names are provided.
          </div>
        )}

        {/* Configuration Info */}
        <div className="mt-4 text-sm text-gray-500">
          <p>
            Data Range: {startingRange} - {endingRange} | Legends:{" "}
            {legendValues.length} | X-Axis:{" "}
            {xAxisValues[0] || "Not set"} | Bins: {binCount}
          </p>
        </div>

        {/* Indicator if chart has children */}
        {childTiers.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} child tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Add Tier Modal */}
      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        onSave={handleSaveTier}
        parentChartName={widgetTitle}
      />

      {/* Children Grid Modal */}
      {showChildrenModal && (
        <TierChartModal
          isOpen={showChildrenModal}
          onClose={() => setShowChildrenModal(false)}
          tierLevel={tierLevel + 1}
          title={widgetTitle}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {childTiers.map((tier) => (
              <HistogramChart
                key={tier.id}
                widgetTitle={tier.name}
                xAxisValues={tier.xAxisValues}
                legendValues={tier.legendValues}
                numOfLegendDataSet={tier.legendValues.length}
                startingRange={startingRange}
                endingRange={endingRange}
                chartHeight={chartHeight}
                strokeWidth={strokeWidth}
                dataPointsPerSeries={dataPointsPerSeries}
                fillOpacity={fillOpacity}
                binCount={binCount}
                tierLevel={tierLevel + 1}
                chartId={tier.id}
              />
            ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
