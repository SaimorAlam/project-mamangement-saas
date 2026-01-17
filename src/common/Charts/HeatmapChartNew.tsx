/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState, MouseEvent } from "react";
import { Copy, Download, Trash2 } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";

import { LegendValue } from "@/components/client/ProjectBuilder/WidgetForChartModuleOne";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";

import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";

/*    TYPES    */

interface HeatmapRow {
  label: string;
  values: number[];
}

interface TooltipData {
  row: string;
  column: string;
  value: number;
  x: number;
  y: number;
}

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
  startingRange: number;
  endingRange: number;
  numOfLegendDataSet?: number;
  onToggleWidget?: () => void;
  tierLevel?: number;
  chartId?: string;
};

/*    COMPONENT    */

export default function HeatmapChartNew({
  widgetTitle = "Heatmap Chart",
  xAxisValues = [],
  legendValues = [],
  startingRange,
  endingRange,
  numOfLegendDataSet = 1,
  onToggleWidget,
  tierLevel = 0,
  chartId = "root",
}: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  /*     Tier States     */
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*    DATA    */

  const heatmapData: HeatmapRow[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];

    return legendValues
      .filter((l) => l.label)
      .map((legend) => ({
        label: legend.label,
        values: xAxisValues
          .filter(Boolean)
          .map(
            () =>
              Math.floor(Math.random() * (endingRange - startingRange + 1)) +
              startingRange
          ),
      }));
  }, [legendValues, xAxisValues, startingRange, endingRange]);

  /*    HELPERS    */

  const getColor = (value: number) => {
    const percent =
      (value - startingRange) / (endingRange - startingRange || 1);

    if (percent < 0.25) return "bg-[#CCE3DE]";
    if (percent < 0.5) return "bg-[#A4C3B2]";
    if (percent < 0.75) return "bg-[#6B9080]";
    return "bg-[#3A5A40]";
  };

  const handleHover = (
    row: string,
    column: string,
    value: number,
    e: MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      row,
      column,
      value,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  /*    ACTIONS    */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(heatmapData, null, 2));
    setShowPopover(false);
  };

  const handleDownload = () => {
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
      category: "HEATMAP",
      xAxis: JSON.stringify({
        labels: xAxisValues,
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
    };
    setIsDownloading(true);

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

  /*    RENDER    */

  return (
    <>
      <div
        className={`w-full bg-white border border-gray-200 rounded-lg p-6 relative ${
          childTiers.length > 0 ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
        }`}
        onClick={handleChartClick}
      >
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">{widgetTitle}</h2>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
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

        {/* Range Legend */}
        <div className="w-full flex items-center justify-between gap-4 mb-6">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Range:
          </span>
          <div className="flex items-center justify-end gap-2">
            {[
              {
                color: "bg-[#CCE3DE]",
                range: `${startingRange}-${Math.floor(endingRange / 3)}`,
              },
              {
                color: "bg-[#A4C3B2]",
                range: `${Math.floor(endingRange / 3) + 1}-${Math.floor(
                  (endingRange * 2) / 3
                )}`,
              },
              {
                color: "bg-[#6B9080]",
                range: `${Math.floor((endingRange * 2) / 3) + 1}-${endingRange}`,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-6 h-6 rounded ${item.color}`} />
                <span className="text-sm text-gray-600">{item.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="overflow-x-auto">
          <div className="inline-block">
            {heatmapData.map((row, rIdx) => (
              <div key={rIdx} className="flex mb-3">
                <div className="w-36 pr-3 text-right text-sm text-gray-700 break-words">
                  {row.label}
                </div>

                {row.values.map((value, cIdx) => (
                  <div
                    key={cIdx}
                    className={`w-28 h-20 rounded mx-1 cursor-pointer transition hover:ring-2 hover:ring-teal-400 ${getColor(
                      value
                    )}`}
                    onMouseEnter={(e) =>
                      handleHover(row.label, xAxisValues[cIdx], value, e)
                    }
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}

            {/* X Axis */}
            <div className="flex mt-2">
              <div className="w-36" />
              {xAxisValues.map((x, i) => (
                <div
                  key={i}
                  className="w-28 text-sm text-center break-words text-gray-600 mx-1"
                >
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 bg-gray-900 text-white text-xs rounded px-3 py-2"
            style={{
              left: tooltip.x,
              top: tooltip.y - 10,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="font-semibold">{tooltip.row}</div>
            <div className="text-gray-300">{tooltip.column}</div>
            <div className="font-bold text-teal-300">{tooltip.value}</div>
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
              <HeatmapChartNew
                key={tier.id}
                widgetTitle={tier.name}
                xAxisValues={tier.xAxisValues}
                legendValues={tier.legendValues}
                numOfLegendDataSet={tier.legendValues.length}
                startingRange={startingRange}
                endingRange={endingRange}
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