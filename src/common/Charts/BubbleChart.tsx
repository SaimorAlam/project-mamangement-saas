/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";

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

const generateBubbleData = (
  xAxisValues: string[],
  yrange: { min: number; max: number },
  minBubbleSize: number,
  maxBubbleSize: number,
  legendIndex: number // Added to differentiate between legends
) => {
  const series = [];
  for (let i = 0; i < xAxisValues.length; i++) {
    // Try to parse X as number, otherwise use index
    const xValue = xAxisValues[i];
    const x = !isNaN(Number(xValue)) ? Number(xValue) : i + 1;

    // Create a unique seed for each data point
    const seed = simpleHash(`${xValue}-${i}-${legendIndex}`);

    // Use deterministic random based on seed
    const y = deterministicRandom(seed + 1, yrange.min, yrange.max);
    const z = deterministicRandom(
      seed + 2,
      minBubbleSize,
      maxBubbleSize
    );

    series.push([x, y, z]);
  }
  return series;
};

const generateId = () =>
  crypto.randomUUID?.() ??
  Math.random().toString(36).substring(2, 10);

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

  /*   APEX CHART STATE   */
  const chartData: any = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) {
      return { series: [], options: {} };
    }

    const yrange = { min: startingRange, max: endingRange };

    // Generate series for each legend
    const series = legendValues
      .filter((l) => l.label)
      .map((l, legendIndex) => ({
        name: l.label,
        data: generateBubbleData(
          xAxisValues,
          yrange,
          minBubbleSize,
          maxBubbleSize,
          legendIndex
        ),
      }));

    const colors = legendValues
      .filter((l) => l.label)
      .map((l) => l.color);

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
          position: "top",
          horizontalAlign: "left",
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
    navigator.clipboard.writeText(
      JSON.stringify(chartData.series, null, 2)
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

    // For CSV export
    const header = "Series,X,Y,Size";
    const rows: string[] = [];
    chartData.series.forEach((s: any) => {
      s.data.forEach((point: any) => {
        rows.push(`${s.name},${point[0]},${point[1]},${point[2]}`);
      });
    });
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

        {/* Bubble Chart */}
        {chartData.series.length > 0 ? (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bubble"
            height={chartHeight}
          />
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-400">
            No data available, Please fill the input field to generate
            the chart and then download the csv.
          </div>
        )}

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
                chartId={tier.id}
              />
            ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
