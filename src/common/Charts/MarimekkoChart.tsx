/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";

import {
  AnimationModule,
  CrosshairModule,
  ModuleRegistry,
  NumberAxisModule,
  CategoryAxisModule,
  BarSeriesModule,
} from "ag-charts-enterprise";

// Register modules
ModuleRegistry.registerModules([
  AnimationModule,
  CrosshairModule,
  BarSeriesModule,
  NumberAxisModule,
  CategoryAxisModule,
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
  onDelete?: () => void;
  isPreview?: boolean;
};

const generateId = () =>
  crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

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
  chartId = "root",
  onDelete,
  isPreview = false,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  /*   DATA GENERATION   */
  const chartData = useMemo(() => {
    // Generate data where each xValue (category) has values for each legend (series)
    return xAxisValues.map((category) => {
      const item: any = { category };
      legendValues.forEach((legend, index) => {
        // Generate random value for demo
        item[legend.field] = Math.floor(Math.random() * 50) + 10 + index * 5;
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
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const csvId = generateId();

    // Simple CSV export
    const header = ["Category", ...legendValues.map((l) => l.label)].join(",");
    const rows = chartData.map((item) =>
      [item.category, ...legendValues.map(() => "")].join(","),
    );
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widgetTitle}-${csvId}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setIsDownloading(false);
  };

  return (
    <ChartCardWrapper
      title={widgetTitle}
      chartId={chartId}
      menuActions={{
        onCopy: handleCopy,
        onDownload: handleDownload,
        onDelete: onDelete,
        onToggleWidget: onToggleWidget,
      }}
      isDownloading={isDownloading}
      isPreview={isPreview}
    >
      <div style={{ height: `${chartHeight}px` }}>
        <AgCharts options={chartOptions} />
      </div>
    </ChartCardWrapper>
  );
}
