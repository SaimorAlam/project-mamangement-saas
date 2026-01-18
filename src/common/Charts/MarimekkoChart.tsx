/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
// import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
// import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";

import {
  AnimationModule,
  // ContextMenuModule,
  CrosshairModule,
  // LegendModule,
  ModuleRegistry,
  NumberAxisModule,
  CategoryAxisModule,
  BarSeriesModule,
} from "ag-charts-enterprise";
// import { MarimekkoSeriesModule } from "ag-charts-enterprise";

// Register modules
ModuleRegistry.registerModules([
  AnimationModule,
  CrosshairModule,
  // MarimekkoSeriesModule,
  BarSeriesModule,
  // LegendModule,
  NumberAxisModule,
  CategoryAxisModule,
  // ContextMenuModule,
]);

/*       TYPES       */

type LegendValue = {
  label: string;
  field: string;
  color: string;
};

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[]; // Categories (e.g., Segments)
  legendValues?: LegendValue[]; // Series (e.g., Regions)
  numOfLegendDataSet?: number;
  chartHeight?: number;
  onToggleWidget?: () => void;
  chartId?: string;
};

const generateId = () =>
  crypto.randomUUID?.() ??
  Math.random().toString(36).substring(2, 10);

/*       COMPONENT       */

export default function MarimekkoChart({
  widgetTitle = "Marimekko Chart",
  xAxisValues = ["Segment A", "Segment B", "Segment C"],
  legendValues = [
    { label: "Product 1", field: "p1", color: "#8D79F6" },
    { label: "Product 2", field: "p2", color: "#4F46E5" },
  ],
  chartHeight = 400,
  onToggleWidget,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  // const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA GENERATION   */
  const chartData = useMemo(() => {
    // Generate data where each xValue (category) has values for each legend (series)
    return xAxisValues.map((category) => {
      const item: any = { category };
      legendValues.forEach((legend, index) => {
        // Generate random value for demo
        item[legend.field] = Math.floor(Math.random() * 50) + 10 + (index * 5); 
      });
      return item;
    });
  }, [xAxisValues, legendValues]);

  /*   AG CHARTS OPTIONS   */
  const chartOptions = useMemo((): AgChartOptions => {
    return {
      data: chartData,
      title: {
        text: widgetTitle,
        enabled: false,
      },
      series: legendValues.map((legend) => ({
        type: "bar",
        stacked: true,
        xKey: "category",
        yKey: legend.field,
        yName: legend.label,
        fill: legend.color,
        stroke: legend.color,
        strokeWidth: 1,
        fillOpacity: 0.8,
        label: {
          enabled: true,
          color: "white",
        },
      })),
      axes: [
        {
          type: "category",
          position: "bottom",
          title: { text: "Segments" },
        },
        {
          type: "number",
          position: "left",
          title: { text: "Value / Share" },
        },
      ],
      legend: {
        position: "right",
      },
    } as unknown as AgChartOptions;
  }, [chartData, legendValues, widgetTitle]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
    setShowPopover(false);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const csvId = generateId();
    
    // Simple CSV export
    const header = ["Category", ...legendValues.map(l => l.label)].join(",");
    const rows = chartData.map(item => 
      [item.category, ...legendValues.map(() => "")].join(",")
    );
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widgetTitle}-${csvId}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    // Save metadata if needed (simplified for this task)
    // DownloadAndSaveCSVforModuleOneWidget(...) 

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
             Variable width stacked bars (Marimekko placeholder)
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
                  <Download size={18} /> Download CSV
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
        <AgCharts options={chartOptions} />
      </div>
    </div>
  );
}
