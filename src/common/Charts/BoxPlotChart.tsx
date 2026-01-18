/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";

import {
  AnimationModule,
  ContextMenuModule,
  CrosshairModule,
  LegendModule,
  ModuleRegistry,
  NumberAxisModule,
  CategoryAxisModule,
  BoxPlotSeriesModule,
} from "ag-charts-enterprise";

// Register modules
ModuleRegistry.registerModules([
  AnimationModule,
  CrosshairModule,
  BoxPlotSeriesModule,
  LegendModule,
  NumberAxisModule,
  CategoryAxisModule,
  ContextMenuModule,
]);

/*       TYPES       */

type BoxPlotData = {
  x: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
};

type Props = {
  widgetTitle?: string;
  data?: BoxPlotData[];
  chartHeight?: number;
  onToggleWidget?: () => void;
  chartId?: string;
};

const generateId = () =>
  crypto.randomUUID?.() ??
  Math.random().toString(36).substring(2, 10);

/*       COMPONENT       */

export default function BoxPlotChart({
  widgetTitle = "Box & Whisker Plot",
  data = [
    { x: "Group A", min: 10, q1: 20, median: 35, q3: 50, max: 70, outliers: [5, 85] },
    { x: "Group B", min: 15, q1: 25, median: 40, q3: 55, max: 75, outliers: [8, 90] },
    { x: "Group C", min: 5, q1: 15, median: 30, q3: 45, max: 60, outliers: [2, 70] },
  ],
  chartHeight = 400,
  onToggleWidget,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  /*   AG CHARTS OPTIONS   */
  const chartOptions = useMemo((): AgChartOptions => {
    return {
      data: data,
      title: {
        text: widgetTitle,
        enabled: false,
      },
      series: [
        {
          type: "box-plot",
          xKey: "x",
          minKey: "min",
          q1Key: "q1",
          medianKey: "median",
          q3Key: "q3",
          maxKey: "max",
          outliersKey: "outliers",
          fill: "#8D79F6",
          stroke: "#4F46E5",
          strokeWidth: 2,
          fillOpacity: 0.7,
          whisker: {
            stroke: "#4F46E5",
            lineDash: [2, 2],
          },
          cap: {
            length: 0.5,
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Categories" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Values" },
        },
      ],
    } as unknown as AgChartOptions;
  }, [data, widgetTitle]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setShowPopover(false);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const csvId = generateId();
    
    // Simple CSV export template (Headers + X-axis column)
    const header = ["Category", "Min", "Q1", "Median", "Q3", "Max", "Outliers"].join(",");
    const rows = data.map(item => [item.x, "", "", "", "", "", ""].join(","));
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widgetTitle}-${csvId}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setIsDownloading(false);
    setShowPopover(false);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">{widgetTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">
             Distribution: Median, Quartiles, Outliers
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative border-l pl-4">
            <button
              onClick={() => setShowPopover(!showPopover)}
              className="p-2 border rounded hover:bg-gray-50"
            >
              <BsThreeDots size={18} />
            </button>

            {showPopover && (
              <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg p-2 z-10">
                <button
                  onClick={handleCopy}
                  className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                >
                  <Copy size={18} /> Copy Data
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded"
                >
                  <Download size={18} /> Download CSV Template
                </button>

                <button className="w-full flex gap-3 px-3 py-2 hover:bg-gray-50 rounded text-red-600">
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: `${chartHeight}px` }}>
        <AgCharts key={data.length} options={chartOptions} />
      </div>
    </div>
  );
}
