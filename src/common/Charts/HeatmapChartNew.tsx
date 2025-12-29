"use client";

import { useMemo, useState, MouseEvent } from "react";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { LegendValue } from "@/components/client/ProjectBuilder/WidgetForChartModuleOne";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";

/* ---------- TYPES ---------- */

interface TooltipData {
  row: string;
  column: string;
  value: number;
  x: number;
  y: number;
}

type Props = {
  widgetTitle: string;
  xAxisValues: string[];
  legendValues: LegendValue[];
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
};

/* ---------- COMPONENT ---------- */

export default function HeatmapChartNew({
  widgetTitle,
  xAxisValues,
  legendValues,
  startingRange,
  endingRange,
  onToggleWidget,
}: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /* ---------- DATA (STABLE) ---------- */
  const heatmapData = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];

    return legendValues
      .filter((l) => l.label)
      .map((legend) => ({
        label: legend.label,
        values: xAxisValues.map(() => startingRange),
      }));
  }, [legendValues, xAxisValues, startingRange]);

  /* ---------- COLOR SCALE ---------- */
  const getColor = (value: number) => {
    const percent =
      (value - startingRange) / (endingRange - startingRange || 1);

    if (percent < 0.33) return "bg-[#CCE3DE]";
    if (percent < 0.66) return "bg-[#A4C3B2]";
    return "bg-[#6B9080]";
  };

  /* ---------- ACTIONS ---------- */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(heatmapData, null, 2));
    setShowPopover(false);
  };

  const handleDownload = () => {
    const payload = {
      numberOfDataset: legendValues.length,
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
    setShowPopover(false);
  };

  /* ---------- TOOLTIP ---------- */

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

  /* ---------- RENDER ---------- */

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6 relative">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{widgetTitle} sdfsfr</h2>

          <div className="flex gap-6 mt-3">
            {legendValues.map((l) =>
              l.label ? (
                <div key={l.field} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-sm">{l.label}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={() => setShowPopover(!showPopover)}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <BsThreeDots size={18} /> dfgsedter
          </button>

          {showPopover && (
            <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-48 z-10">
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded"
              >
                <Copy size={18} />
                Copy
              </button>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded"
              >
                <Download size={18} />
                Download
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-red-600">
                <Trash2 size={18} />
                Delete
              </button>

              {onToggleWidget && (
                <button
                  onClick={onToggleWidget}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                >
                  <MdOutlineWidgets size={18} />
                  Widget
                </button>
              )}

              <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded">
                <GoPlus size={18} />
                Add Tier
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {heatmapData.map((row, rowIndex) => (
            <div key={rowIndex} className="flex mb-3">
              <div className="w-36 text-sm text-gray-700 pr-4 text-right">
                {row.label}
              </div>

              {row.values.map((value, colIndex) => (
                <div
                  key={colIndex}
                  className={`w-28 h-24 mx-1 rounded cursor-pointer transition hover:ring-2 hover:ring-teal-400 ${getColor(
                    value
                  )}`}
                  onMouseEnter={(e) =>
                    handleHover(
                      row.label,
                      xAxisValues[colIndex],
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
                className="w-28 mx-1 text-sm text-center break-words text-gray-600"
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
            top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="font-semibold">{tooltip.row}</div>
          <div className="text-gray-300">{tooltip.column}</div>
          <div className="font-bold text-teal-300">{tooltip.value}</div>
        </div>
      )}

      {!xAxisValues.length && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No data selected. Please fill inputs to render heatmap.
        </div>
      )}
    </div>
  );
}
