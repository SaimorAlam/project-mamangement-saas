/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";

import {
  AnimationModule,
  // ContextMenuModule,
  CrosshairModule,
  HistogramSeriesModule,
  // LegendModule,
  ModuleRegistry,
  NumberAxisModule,
} from "ag-charts-enterprise";

// ✅ register once (safe even if called multiple times)
ModuleRegistry.registerModules([
  AnimationModule,
  CrosshairModule,
  HistogramSeriesModule,
  // LegendModule,
  NumberAxisModule,
  // ContextMenuModule,
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
  chartHeight?: number;
  strokeWidth?: number;
  dataPointsPerSeries?: number;
  fillOpacity?: number;
  binCount?: number;
  onToggleWidget?: () => void;
  tierLevel?: number;
  chartId?: string;
  onDelete?: () => void;
  isPreview?: boolean;
};

/*       HELPER FUNCTIONS       */

const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const deterministicRandom = (
  seed: number,
  min: number,
  max: number,
): number => {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return Math.floor(random * (max - min + 1)) + min;
};

const generateHistogramDataForLegend = (
  startingRange: number,
  endingRange: number,
  dataPointsPerSeries: number,
  legendIndex: number = 0,
) => {
  const dataPoints: { value: number; series: string }[] = [];
  for (let i = 0; i < dataPointsPerSeries; i++) {
    const seed = simpleHash(
      `${legendIndex}-${i}-${startingRange}-${endingRange}`,
    );
    const variation = legendIndex * 10;
    const baseValue = deterministicRandom(seed, startingRange, endingRange);
    const value = Math.max(
      startingRange,
      Math.min(endingRange, baseValue + variation),
    );
    dataPoints.push({ value, series: `series_${legendIndex}` });
  }
  return dataPoints;
};

const generateCombinedHistogramData = (
  startingRange: number,
  endingRange: number,
  legendCount: number,
  dataPointsPerSeries: number,
) => {
  const allData: { value: number; series: string }[] = [];
  for (let i = 0; i < legendCount; i++) {
    const seriesData = generateHistogramDataForLegend(
      startingRange,
      endingRange,
      dataPointsPerSeries,
      i,
    );
    allData.push(...seriesData);
  }
  return allData;
};

// const generateId = () =>
//   crypto.randomUUID?.() ??
//   Math.random().toString(36).substring(2, 10);

/*       COMPONENT       */

export default function HistogramChart({
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  chartHeight = 400,
  strokeWidth = 2,
  dataPointsPerSeries = 50,
  fillOpacity = 0.7,
  binCount = 10,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId = "root",
  isPreview = false,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

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
      dataPointsPerSeries,
    );
  }, [startingRange, endingRange, legendValues.length, dataPointsPerSeries]);

  /*   AG CHARTS OPTIONS   */
  const chartOptions = useMemo((): AgChartOptions | null => {
    if (!histogramData.length) return null;

    const series = legendValues.map((legend, index) => ({
      type: "histogram" as const,
      xKey: "value",
      yKey: "value",
      xName: legend.label || `Series ${index + 1}`,
      fill: legend.color || "#8D79F6",
      stroke: legend.color || "#8D79F6",
      fillOpacity: fillOpacity - index * 0.1,
      strokeWidth: strokeWidth,
      title: legend.label || `Series ${index + 1}`,
      data: histogramData.filter((item) => item.series === `series_${index}`),
    }));

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
          legendValues.length > 1 || legendValues[0]?.label?.trim().length > 0,
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
    navigator.clipboard.writeText(JSON.stringify(histogramData, null, 2));
  };

  const handleDownload = () => {
    // const csvId = generateId();

    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: startingRange,
      lastFieldDataset: endingRange,
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

    DownloadAndSaveCSVforModuleOneWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      xAxisValues,
      legendValues,
    );

    setIsDownloading(false);
  };

  const handleAddTierClick = () => {
    setShowAddTierModal(true);
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
      <ChartCardWrapper
        title={widgetTitle}
        subtitle="Frequency Distribution"
        chartId={chartId}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload: handleDownload,
          onDelete: onDelete,
          onAddTier: handleAddTierClick,
          onToggleWidget: onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        customHeaderContent={
          <div className="flex gap-4">
            {legendValues.slice(0, 3).map((l, index) =>
              l.label ? (
                <div key={index} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-xs text-gray-500 font-medium">
                    {l.label}
                  </span>
                </div>
              ) : null,
            )}
            {legendValues.length > 3 && (
              <span className="text-xs text-gray-400">
                +{legendValues.length - 3} more
              </span>
            )}
          </div>
        }
        footer={
          childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} child tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          ) : (
            <div className="text-xs text-gray-500">
              Data points: {dataPointsPerSeries} | Bins: {binCount}
            </div>
          )
        }
      >
        <div className="relative">
          {chartOptions && hasValidData ? (
            <div style={{ height: `${chartHeight}px` }}>
              <AgCharts options={chartOptions} />
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">
              No data available. Please configure the widget.
            </div>
          )}
        </div>
      </ChartCardWrapper>

      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        onSave={handleSaveTier}
        parentChartName={widgetTitle}
      />

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
                isPreview={isPreview}
                onDelete={onDelete}
              />
            ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
