/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { generateChartData } from "@/utils/clientPannelHelpers/programBuilderHelpers";

// Common Imports
import { BaseChartProps } from "../Common/chartTypes";
import {
  parseCommonChartData,
  extractLegendsFromXAxis,
} from "../Common/chartUtils";
import BaseChartContainer from "../Common/BaseChartContainer";

/**
 * Parse xAxis 2D array format from API for Horizontal Bar
 */
export const parseHorizontalBarData = (
  xAxis: any[][] | string | { labels: any[][] },
  legendValues: any[],
  widgetTitle: string,
) => {
  return parseCommonChartData(xAxis, legendValues, widgetTitle);
};

/*       COMPONENT       */

export default function HorizontalBarChart(props: BaseChartProps) {
  const getTierLegends = (tier: any) => {
    const widgets =
      tier?.widgets ||
      tier?.barChart?.widgets ||
      tier?.multiAxisChart?.widgets ||
      tier?.horizontalBarChart?.widgets ||
      tier?.areaChart?.widgets ||
      [];

    if (widgets.length > 0) {
      return widgets.map((w: any) => ({
        label: w.legendName || w.label || "Legend",
        field: (w.legendName || w.label || "field")
          .toLowerCase()
          .replace(/\s+/g, ""),
        color: w.color || "#000000",
      }));
    }

    // Fallback if no widgets/metadata
    const derived = extractLegendsFromXAxis(tier.xAxis);
    return derived.map((lbl, idx) => ({
      label: lbl,
      field: lbl.toLowerCase().replace(/\s+/g, ""),
      color: ["#13A490", "#35B6EE", "#6F78F9", "#F26419"][idx % 4],
    }));
  };

  return (
    <BaseChartContainer
      {...props}
      category="HORIZONTAL_BAR"
      excelType="horizontalBarChart"
      generatorFunc={(xAxis, legends, numOfLegendDataSet, start, end) =>
        generateChartData(xAxis, legends as any, numOfLegendDataSet, start, end)
      }
      getTierLegends={getTierLegends}
      parseTierData={parseHorizontalBarData}
      renderChildChart={(tier, childProps) => (
        <HorizontalBarChart {...childProps} key={tier.id} />
      )}
    >
      {({ chartData, safeStartingRange, safeEndingRange, effectiveLegendValues }) => (
        <div className="relative">
          <ResponsiveContainer
            width="100%"
            height={Math.max(400, chartData.length * 50)}
          >
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="0"
                horizontal={false}
                stroke="#e5e7eb"
              />
              <XAxis
                type="number"
                domain={[safeStartingRange, safeEndingRange]}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                width={20}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white/95 backdrop-blur-sm p-3 border border-gray-100 rounded-xl shadow-xl">
                      <p className="font-bold text-gray-700 mb-2 border-b border-gray-50 pb-1">
                        {label}
                      </p>
                      <div className="space-y-1.5">
                        {payload.map((entry: any, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs font-medium text-gray-600 min-w-[60px]">
                              {entry.name}:
                            </span>
                            <span className="text-xs font-bold text-gray-900 ml-auto">
                              {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }}
                cursor={{ fill: "#f3f4f6", opacity: 0.4 }}
              />

              {effectiveLegendValues.map((l) => (
                <Bar
                  key={l.field}
                  name={l.label}
                  dataKey={l.field}
                  stackId="a"
                  fill={l.color}
                  radius={[0, 4, 4, 0]}
                  barSize={32}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </BaseChartContainer>
  );
}
