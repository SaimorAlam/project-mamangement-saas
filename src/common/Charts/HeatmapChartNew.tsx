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

export default function HeatmapChart({
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
  const [activeTier, setActiveTier] = useState<TierChart | null>(null);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*    DATA    */

  const heatmapData: HeatmapRow[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];

    return legendValues
      .filter((l) => l.label)
      .map((legend, rIdx) => ({
        label: legend.label,
        values: xAxisValues
          .filter(Boolean)
          .map(
            (_, cIdx) =>
              ((rIdx + cIdx) % (endingRange - startingRange + 1)) +
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
      category: "BAR",
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

  const handleAddTier = () => {
    setShowAddTierModal(true);
    setShowPopover(false);
  };

  const handleSaveTier = (tierName: string) => {
    const newTier: TierChart = {
      id: `${chartId}-tier-${Date.now()}`,
      name: tierName,
      xAxisValues,
      legendValues,
      children: [],
    };

    setChildTiers((prev) => [...prev, newTier]);
    setActiveTier(newTier);
    setShowAddTierModal(false);
  };

  /*    RENDER    */

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-lg p-6 relative">
        {/* Tier indicator */}
        {tierLevel > 0 && (
          <div className="mb-3 text-sm text-gray-500">
            {"→ ".repeat(tierLevel)} Tier Level {tierLevel}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">{widgetTitle}</h2>

          <div className="relative">
            <button
              onClick={() => setShowPopover(!showPopover)}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <BsThreeDots size={18} />
            </button>

            {showPopover && (
              <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-2 w-48 z-10">
                <MenuItem icon={<Copy />} label="Copy" onClick={handleCopy} />
                <MenuItem
                  icon={<Download />}
                  label="Download"
                  onClick={handleDownload}
                  disabled={isDownloading}
                />
                <MenuItem icon={<Trash2 />} label="Delete" danger />
                {onToggleWidget && (
                  <MenuItem
                    icon={<MdOutlineWidgets />}
                    label="Widget"
                    onClick={onToggleWidget}
                  />
                )}
                <MenuItem
                  icon={<GoPlus />}
                  label="Add Tier"
                  onClick={handleAddTier}
                />
              </div>
            )}
          </div>
        </div>
        <div className="w-full flex items-center justify-between gap-4 mb-18">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2"> Range:
                </span>
                <div className="flex items-center justify-end gap-2">
                    {[
                        { color: "bg-[#CCE3DE]", range: `${startingRange}-${Math.floor(endingRange / 3)}` },
                        { color: "bg-[#A4C3B2]", range: `${Math.floor(endingRange / 3) + 1}-${Math.floor(endingRange * 2 / 3)}` },
                        { color: "bg-[#6B9080]", range: `${Math.floor(endingRange * 2 / 3) + 1}-${endingRange}` }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1">
                            <div className={`w-6 h-6 rounded ${item.color}`} />
                            <span className="text-sm text-gray-600"> {item.range} </span>
                        </div>))}
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
                      handleHover(
                        row.label,
                        xAxisValues[cIdx],
                        value,
                        e
                      )
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

        {/* Child tiers */}
        {childTiers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Child Tiers:
            </h3>
            <div className="flex flex-wrap gap-2">
              {childTiers.map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setActiveTier(tier)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                >
                  {tier.name}
                </button>
              ))}
            </div>
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

      {/* Tier Chart Modal */}
      {activeTier && (
        <TierChartModal
          isOpen
          onClose={() => setActiveTier(null)}
          tierLevel={tierLevel + 1}
        >
          <HeatmapChart
            widgetTitle={activeTier.name}
            xAxisValues={activeTier.xAxisValues}
            legendValues={activeTier.legendValues}
            startingRange={startingRange}
            endingRange={endingRange}
            tierLevel={tierLevel + 1}
            chartId={activeTier.id}
          />
        </TierChartModal>
      )}
    </>
  );
}

/*    MENU ITEM    */

function MenuItem({
  icon,
  label,
  onClick,
  disabled,
  danger,
}: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left hover:bg-gray-50 ${
        danger ? "text-red-600" : ""
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
