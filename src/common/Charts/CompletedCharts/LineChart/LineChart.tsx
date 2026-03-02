/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { generateLineChartData } from "@/utils/clientPannelHelpers/programBuilderHelpers";

// Common Imports
import { BaseChartProps } from "../Common/chartTypes";
import {
  parseCommonChartData,
} from "../Common/chartUtils";
import BaseChartContainer from "../Common/BaseChartContainer";

/**
 * Parse xAxis 2D array format from API for Line/Multi-Axis
 */
export const parseLineChartData = (
  xAxis: any[][] | string | { labels: any[][] },
  legendValues: any[],
  widgetTitle: string,
) => {
  return parseCommonChartData(xAxis, legendValues, widgetTitle);
};

/*      COMPONENT      */

export default function MultiAxisLineChart(props: BaseChartProps) {
  const getTierLegends = (tier: any) => {
    return (
      tier?.multiAxisChart?.widgets || tier?.lineChart?.widgets || tier?.widgets || []
    ).map((w: any) => ({
      label: w.legendName || w.label,
      field: (w.legendName || w.label)?.toLowerCase().replace(/\s+/g, ""),
      color: w.color,
    }));
  };

  return (
    <BaseChartContainer
      {...props}
      category="LINE"
      excelType="lineChart"
      generatorFunc={generateLineChartData}
      getTierLegends={getTierLegends}
      parseTierData={parseLineChartData}
      renderChildChart={(tier, childProps) => (
        <MultiAxisLineChart {...childProps} key={tier.id} />
      )}
    >
      {({ chartData, safeStartingRange, safeEndingRange, effectiveLegendValues }) => (
        <div className="h-[400px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData}>
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
                yAxisId="left"
                domain={[safeStartingRange, safeEndingRange]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
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
              />

              {effectiveLegendValues.map((l, index) => (
                <Line
                  key={l.field}
                  yAxisId={index % 2 === 0 ? "left" : "right"}
                  type="monotone"
                  dataKey={l.field}
                  stroke={l.color}
                  strokeWidth={2}
                  dot={{ r: 4, fill: l.color, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              ))}
              <Legend verticalAlign="bottom" height={36}/>
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      )}
    </BaseChartContainer>
  );
}
