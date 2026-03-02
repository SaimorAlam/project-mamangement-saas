/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { AgCharts } from "ag-charts-react";
import type { AgChartOptions } from "ag-charts-community";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";

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
  onDelete?: () => void;
  isPreview?: boolean;
};

const generateId = () =>
  crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

/*       COMPONENT       */

export default function BoxPlotChart({
  widgetTitle = "Box & Whisker Plot",
  data = [
    {
      x: "Group A",
      min: 10,
      q1: 20,
      median: 35,
      q3: 50,
      max: 70,
      outliers: [5, 85],
    },
    {
      x: "Group B",
      min: 15,
      q1: 25,
      median: 40,
      q3: 55,
      max: 75,
      outliers: [8, 90],
    },
    {
      x: "Group C",
      min: 5,
      q1: 15,
      median: 30,
      q3: 45,
      max: 60,
      outliers: [2, 70],
    },
  ],
  chartHeight = 400,
  onToggleWidget,
  chartId = "root",
  onDelete,
  isPreview = false,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

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
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const csvId = generateId();

    // Simple CSV export template (Headers + X-axis column)
    const header = [
      "Category",
      "Min",
      "Q1",
      "Median",
      "Q3",
      "Max",
      "Outliers",
    ].join(",");
    const rows = data.map((item) => [item.x, "", "", "", "", "", ""].join(","));
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
        <AgCharts key={data.length} options={chartOptions} />
      </div>
    </ChartCardWrapper>
  );
}
