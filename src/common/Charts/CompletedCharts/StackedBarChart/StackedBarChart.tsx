/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // Legend,
} from "recharts";
import { generateChartData } from "@/utils/clientPannelHelpers/programBuilderHelpers";

// Common Imports
import { BaseChartProps } from "../Common/chartTypes";
import {
  parseCommonChartData,
} from "../Common/chartUtils";
import BaseChartContainer from "../Common/BaseChartContainer";

/**
 * Parse xAxis 2D array format from API for Stacked Bar
 */
export const parseXAxisData = (
  xAxis: any[][] | string | { labels: any[][] },
  legendValues: any[],
  widgetTitle: string,
) => {
  return parseCommonChartData(xAxis, legendValues, widgetTitle);
};

/*      COMPONENT      */

export default function StackedBarChart(props: BaseChartProps) {
  const getTierLegends = (tier: any) => {
      return (tier?.barChart?.widgets || tier?.widgets || []).map((w: any) => ({
          label: w.legendName || w.label,
          field: (w.legendName || w.label)?.toLowerCase().replace(/\s+/g, ""),
          color: w.color,
      }));
  };

  return (
    <BaseChartContainer
      {...props}
      category="BAR"
      excelType="barChart"
      generatorFunc={generateChartData}
      getTierLegends={getTierLegends}
      parseTierData={parseXAxisData}
      renderChildChart={(tier, childProps) => (
        <StackedBarChart {...childProps} key={tier.id} />
      )}
    >
      {({ chartData, safeStartingRange, safeEndingRange, effectiveLegendValues }) => (
        <div className="h-[400px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis
                domain={[safeStartingRange, safeEndingRange]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border rounded shadow-lg">
                      <p className="font-semibold mb-2">{row.name}</p>
                      {effectiveLegendValues.map((l) => (
                        <p key={l.field} style={{ color: l.color }} className="text-sm">
                          {l.label}: {row[l.field]}
                        </p>
                      ))}
                    </div>
                  );
                }}
                cursor={{ fill: "transparent" }}
              />

              {effectiveLegendValues.map((l, index) => (
                <Bar
                  key={l.field}
                  dataKey={l.field}
                  stackId="a"
                  fill={l.color}
                  radius={
                    index === effectiveLegendValues.length - 1
                      ? [4, 4, 0, 0]
                      : 0
                  }
                />
              ))}
              {/* <Legend verticalAlign="bottom" height={36} /> */}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </BaseChartContainer>
  );
}
