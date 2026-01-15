/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Sparklines,
  SparklinesLine,
  SparklinesSpots,
  SparklinesReferenceLine,
} from "react-sparklines";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import { downloadCSVForModuleOne } from "@/utils/DownlaodChartCSV";

/* ---------- TYPES ---------- */

export type TierChart = {
  id: string;
  name: string;
  xAxisValues: string[];
  children: TierChart[];
};
type LegendValue = {
  label: string;
  field: string;
  color: string;
};

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[];
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  tierLevel?: number;
  chartId?: string;
  onDelete?: () => void;
  legendValues?: LegendValue[];
};

/* ---------- COMPONENT ---------- */

export default function SparkLinesChart({
  widgetTitle = "Trend Analysis",
  xAxisValues = [],
  startingRange,
  endingRange,
  onToggleWidget,
  tierLevel = 0,
  legendValues,
  chartId = "root",
  onDelete,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  /* ---------- DATA ---------- */

  const generateData = useMemo(
    () => () => {
      if (!xAxisValues.length) return [];
      // Randomize slightly for sparklines effect
      return xAxisValues.map(
        () =>
          Math.floor(Math.random() * (endingRange - startingRange + 1)) +
          startingRange
      );
    },
    [xAxisValues, startingRange, endingRange]
  );

  /* ---------- SERIES ---------- */

  // For Sparklines, we usually show just one line or multiple small lines.
  // We'll map legendValues to multiple Sparklines or just one composite if single.
  // Let's support multiple lines for now.

  const series = useMemo(() => {
    if (legendValues?.length) {
      return legendValues.map((legend, index) => ({
        name: legend.label,
        color: legend.color,
        data: generateData(index),
      }));
    }
    return [
      {
        name: widgetTitle,
        color: "#13A490",
        data: generateData(0),
      },
    ];
  }, [legendValues, widgetTitle, generateData]);

  /* ---------- ACTIONS ---------- */

  const handleCopy = () => {
    const dataToCopy = series[0]?.data || [];
    const copyData = xAxisValues.map((label, index) => ({
      label,
      value: dataToCopy[index],
    }));
    navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
    setShowPopover(false);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    downloadCSVForModuleOne(
      widgetTitle,
      xAxisValues,
      legendValues && legendValues.length > 0
        ? legendValues
        : [{ label: widgetTitle }]
    );
    setShowPopover(false);
    setIsDownloading(false);
  };

  const handleAddTier = (tierName: string) => {
    setChildTiers((prev) => [
      ...prev,
      {
        id: `${chartId}-tier-${Date.now()}`,
        name: tierName,
        xAxisValues,
        children: [],
      },
    ]);
    setShowAddTierModal(false);
  };

  const handleChartClick = () => {
    if (childTiers.length > 0) {
      setShowChildrenModal(true);
    }
  };

  /* ---------- RENDER ---------- */

  return (
    <>
      <div
        className={`w-full bg-white border border-gray-200 rounded-lg p-6 ${
          childTiers.length
            ? "cursor-pointer hover:shadow-lg transition-shadow"
            : ""
        }`}
        onClick={handleChartClick}
      >
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">{widgetTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {xAxisValues.length} points
            </p>
          </div>

          <div
            className="flex items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative border-l pl-4">
              <button
                className="p-2 border rounded hover:bg-gray-50"
                onClick={() => setShowPopover(!showPopover)}
              >
                <BsThreeDots size={18} />
              </button>

              {showPopover && (
                <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg p-2 z-10">
                  <button
                    onClick={handleCopy}
                    className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                  >
                    <Copy size={18} /> Copy
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                  >
                    <Download size={18} /> Download
                  </button>

                  <button
                    onClick={() => {
                      if (onDelete) onDelete();
                      setShowPopover(false);
                    }}
                    className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded text-red-600"
                  >
                    <Trash2 size={18} /> Delete
                  </button>

                  {onToggleWidget && (
                    <button
                      onClick={() => {
                        onToggleWidget();
                        setShowPopover(false);
                      }}
                      className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                    >
                      <MdOutlineWidgets size={18} /> Widget
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowAddTierModal(true);
                      setShowPopover(false);
                    }}
                    className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                  >
                    <GoPlus size={18} /> Add Tier
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {xAxisValues?.length ? (
          <div className="w-full h-[350px] flex flex-col justify-center space-y-4">
            {series.map((s, i) => (
              <div key={i} className="flex-1">
                {series.length > 1 && (
                  <p className="text-xs text-gray-500 mb-1">{s.name}</p>
                )}
                <Sparklines data={s.data} height={20}>
                  <SparklinesLine
                    color={s.color}
                    style={{ strokeWidth: 2, fill: s.color }}
                  />
                  <SparklinesSpots />
                  <SparklinesReferenceLine type="avg" />
                </Sparklines>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-400">
            No data available
          </div>
        )}

        {childTiers.length > 0 && (
          <p className="mt-4 text-center text-sm text-blue-600 font-medium">
            Click chart to view {childTiers.length} tier
            {childTiers.length > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        onSave={handleAddTier}
        parentChartName={widgetTitle}
      />

      {showChildrenModal && (
        <TierChartModal
          isOpen={showChildrenModal}
          onClose={() => setShowChildrenModal(false)}
          tierLevel={tierLevel + 1}
          title={widgetTitle}
        >
          {/* Recursive rendering omitted for simplicity unless user asks, reusing placeholder */}
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-center text-gray-500">
              Tier view for Sparklines
            </p>
          </div>
        </TierChartModal>
      )}
    </>
  );
}
