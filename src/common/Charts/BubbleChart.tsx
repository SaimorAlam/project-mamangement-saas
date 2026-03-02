/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";

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
  minBubbleSize?: number;
  maxBubbleSize?: number;
  opacity?: number;
  chartHeight?: number;
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

const generateBubbleData = (
  xAxisValues: string[],
  yrange: { min: number; max: number },
  minBubbleSize: number,
  maxBubbleSize: number,
  legendIndex: number,
) => {
  const series = [];
  for (let i = 0; i < xAxisValues.length; i++) {
    const xValue = xAxisValues[i];
    const x = !isNaN(Number(xValue)) ? Number(xValue) : i + 1;
    const seed = simpleHash(`${xValue}-${i}-${legendIndex}`);
    const y = deterministicRandom(seed + 1, yrange.min, yrange.max);
    const z = deterministicRandom(seed + 2, minBubbleSize, maxBubbleSize);
    series.push([x, y, z]);
  }
  return series;
};

// const generateId = () =>
//   crypto.randomUUID?.() ??
//   Math.random().toString(36).substring(2, 10);

/*       COMPONENT       */

export default function BubbleChart({
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  minBubbleSize = 15,
  maxBubbleSize = 75,
  opacity = 0.8,
  chartHeight = 350,
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

  /*   APEX CHART STATE   */
  const chartData: any = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) {
      return { series: [], options: {} };
    }

    const yrange = { min: startingRange, max: endingRange };

    const series = legendValues
      .filter((l) => l.label)
      .map((l, legendIndex) => ({
        name: l.label,
        data: generateBubbleData(
          xAxisValues,
          yrange,
          minBubbleSize,
          maxBubbleSize,
          legendIndex,
        ),
      }));

    const colors = legendValues.filter((l) => l.label).map((l) => l.color);

    return {
      series,
      options: {
        chart: {
          type: "bubble" as const,
          height: chartHeight,
          toolbar: { show: false },
        },
        dataLabels: {
          enabled: false,
        },
        fill: {
          opacity: opacity,
        },
        xaxis: {
          type: "numeric",
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          min: startingRange,
          max: endingRange,
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
        legend: {
          show: false,
        },
        colors: colors,
      },
    };
  }, [
    xAxisValues,
    legendValues,
    startingRange,
    endingRange,
    minBubbleSize,
    maxBubbleSize,
    opacity,
    chartHeight,
  ]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData.series, null, 2));
  };

  const handleDownload = () => {
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
      category: "BUBBLE",
      xAxis: JSON.stringify({
        labels: xAxisValues,
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({
        min: minBubbleSize,
        max: maxBubbleSize,
        opacity: opacity,
        chartHeight: chartHeight,
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
        subtitle="Bubble Distribution Analysis"
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
          ) : undefined
        }
      >
        <div className="relative">
          {chartData.series.length > 0 ? (
            <Chart
              options={chartData.options}
              series={chartData.series}
              type="bubble"
              height={chartHeight}
            />
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">
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
              <BubbleChart
                key={tier.id}
                widgetTitle={tier.name}
                xAxisValues={tier.xAxisValues}
                legendValues={tier.legendValues}
                numOfLegendDataSet={tier.legendValues.length}
                startingRange={startingRange}
                endingRange={endingRange}
                minBubbleSize={minBubbleSize}
                maxBubbleSize={maxBubbleSize}
                opacity={opacity}
                chartHeight={chartHeight}
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
