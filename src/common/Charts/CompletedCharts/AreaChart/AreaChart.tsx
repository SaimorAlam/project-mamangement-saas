/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { generateAreaChartData } from "@/utils/clientPannelHelpers/programBuilderHelpers";

// Common Imports
import { BaseChartProps } from "../Common/chartTypes";
import {
  parseCommonChartData,
} from "../Common/chartUtils";
import BaseChartContainer from "../Common/BaseChartContainer";

/**
 * Parse xAxis for Area Chart
 */
export const parseAreaChartData = (
  xAxis: any[][] | string | { labels: any[][] },
  legendValues: any[],
  widgetTitle: string,
) => {
  return parseCommonChartData(xAxis, legendValues, widgetTitle);
};

/*      COMPONENT      */

export default function AreaChartWidget(props: BaseChartProps) {
  const getTierLegends = (tier: any) => {
    return (tier?.areaChart?.widgets || tier?.widgets || []).map((w: any) => ({
      label: w.legendName || w.label,
      field: (w.legendName || w.label)?.toLowerCase().replace(/\s+/g, ""),
      color: w.color,
    }));
  };

  return (
    <BaseChartContainer
      {...props}
      category="AREA"
      excelType="areaChart"
      generatorFunc={generateAreaChartData}
      getTierLegends={getTierLegends}
      parseTierData={parseAreaChartData}
      renderChildChart={(tier, childProps) => (
        <AreaChartWidget {...childProps} key={tier.id} />
      )}
    >
      {({ chartData, safeStartingRange, safeEndingRange, effectiveLegendValues }) => (
        <div className="h-[400px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ReAreaChart data={chartData}>
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
              />

              {effectiveLegendValues.map((l) => (
                <Area
                  key={l.field}
                  type="monotone"
                  dataKey={l.field}
                  stroke={l.color}
                  fill={l.color}
                  fillOpacity={0.3}
                />
              ))}
              <Legend verticalAlign="bottom" height={36} />
            </ReAreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </BaseChartContainer>
  );
}
