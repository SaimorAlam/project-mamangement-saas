/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PieChart as RechartsPieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Cell as RechartsCell } from "recharts";

// Common Imports
import { BaseChartProps, LegendValue } from "../Common/chartTypes";
import BaseChartContainer from "../Common/BaseChartContainer";

// Specific Import
import { parsePieChartData } from "@/utils/parsePieChartData";

/* ---------- HELPERS ---------- */

const getRandomValue = (min = 10, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generatePieSampleData = (
    _xAxis: string[],
    legends: LegendValue[],
) => {
    return legends
        .filter((l) => l.label)
        .map((l) => ({
            name: l.label,
            value: getRandomValue(),
            color: l.color,
        }));
};

/* ---------- COMPONENT ---------- */

export default function PieChartWidget(props: BaseChartProps) {
  const getTierLegends = (tier: any) => {
      return (
          tier?.pieChart?.widgets ||
          tier?.widgets ||
          []
      ).map((w: any) => ({
          label: w.legendName || w.label,
          field: (w.legendName || w.label)
              ?.toLowerCase()
              .replace(/\s+/g, ""),
          color: w.color,
      }));
  };

  const parseTierDataWrapper = (xAxis: any, legends: LegendValue[]) => {
      const data = parsePieChartData(xAxis, legends);
      return { labels: data.map(d => d.name), data };
  };

  return (
    <BaseChartContainer
      {...props}
      category="PIE"
      excelType="pie"
      generatorFunc={generatePieSampleData}
      getTierLegends={getTierLegends}
      parseTierData={parseTierDataWrapper}
      renderChildChart={(tier, childProps) => (
        <PieChartWidget {...childProps} key={tier.id} />
      )}
    >
      {({ chartData }) => (
        <div className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ payload }) => `${payload.name}: ${payload.value}`}
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                minAngle={15}
                stroke="none"
              >
                {chartData.map((entry: any, index: number) => (
                  <RechartsCell
                    key={index}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      )}
    </BaseChartContainer>
  );
}
