/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell as RechartsCell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Common Imports
import { BaseChartProps, LegendValue } from "../Common/chartTypes";
import { getEffectiveLegendValues } from "../Common/chartUtils";
import BaseChartContainer from "../Common/BaseChartContainer";

// Specific parser
import { parsePieChartData, PieData } from "@/utils/parsePieChartData";

/* ---------- HELPERS ---------- */

const PIE_COLORS = [
  "#13A490", "#35B6EE", "#6F78F9", "#F26419", "#F6AE2D",
  "#862BB0", "#D72638", "#3F88C5", "#44BBA4", "#FF9505",
];

const getRandomValue = (min = 10, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates sample pie data from legend values (for preview / creation mode).
 * Shape: { name, value, color }[]
 */
const generatePieSampleData = (
  _xAxis: string[],
  legends: LegendValue[],
): any[] => {
  return legends
    .filter((l) => l.label)
    .map((l, i) => ({
      name: l.label,
      value: getRandomValue(),
      color: l.color || PIE_COLORS[i % PIE_COLORS.length],
    }));
};

/**
 * Resolves the actual pie data to render.
 *
 * Priority:
 *  1. Uploaded API data (already parsed as PieData[])
 *  2. Sample data from configured legends
 *  3. Default fallback sample data
 */
const resolvePieData = (
  allUploadedData: any,
  xAxisRaw: any,
  legendValues: LegendValue[],
  widgetTitle: string,
): { pieData: PieData[]; isSampleData: boolean } => {
  // --- Priority 1: API uploaded data from allUploadedData keyed by sheet name ---
  if (allUploadedData) {
    // allUploadedData may be a keyed object { [sheetName]: PieData[] }
    // or a raw PieData[] array (when passed directly from parseTierDataWrapper)
    if (Array.isArray(allUploadedData) && allUploadedData.length > 0) {
      return { pieData: allUploadedData as PieData[], isSampleData: false };
    }

    const safeName = (widgetTitle || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim().substring(0, 31);
    const keyed = allUploadedData[safeName];
    if (Array.isArray(keyed) && keyed.length > 0) {
      return { pieData: keyed as PieData[], isSampleData: false };
    }

    // Try parsing from raw xAxis if allUploadedData is a nested structure
    if (xAxisRaw) {
      const parsed = parsePieChartData(xAxisRaw, legendValues);
      if (parsed.length > 0) {
        return { pieData: parsed, isSampleData: false };
      }
    }
  }

  // --- Priority 2: Sample data from configured legends ---
  const effectiveLegends = getEffectiveLegendValues(legendValues);
  if (effectiveLegends.some((l) => l.label)) {
    return {
      pieData: generatePieSampleData([], effectiveLegends),
      isSampleData: true,
    };
  }

  // --- Priority 3: Default fallback ---
  return {
    pieData: generatePieSampleData([], [
      { label: "Category A", field: "categorya", color: PIE_COLORS[0] },
      { label: "Category B", field: "categoryb", color: PIE_COLORS[1] },
      { label: "Category C", field: "categoryc", color: PIE_COLORS[2] },
    ]),
    isSampleData: true,
  };
};

/* ---------- COMPONENT ---------- */

export default function PieChartWidget(props: BaseChartProps) {
  const {
    legendValues = [],
    xAxisValues = [],
    allUploadedData,
    widgetTitle = "Chart",
  } = props;

  const getTierLegends = (tier: any): LegendValue[] => {
    // 1. Check for standard widgets metadata
    const baseLegends = (tier?.pieChart?.widgets || tier?.widgets || []).map(
      (w: any) => ({
        label: w.legendName || w.label,
        field: (w.legendName || w.label)?.toLowerCase().replace(/\s+/g, ""),
        color: w.color,
      }),
    );

    if (baseLegends.length > 0) return baseLegends;

    // 2. Fallback: Parse from Row 0 of xAxis if metadata is missing
    let xAxis = tier?.xAxis;
    if (typeof xAxis === "string") {
      try {
        xAxis = JSON.parse(xAxis);
      } catch {
        /* ignore */
      }
    }

    if (Array.isArray(xAxis) && xAxis.length > 0 && Array.isArray(xAxis[0])) {
      const header = xAxis[0];
      // Expecting standard format: ["Label", "Legend1", "Legend2", ...]
      if (header.length > 1) {
        return header.slice(1).map((lbl: string, idx: number) => ({
          label: lbl,
          field: String(lbl || `slice${idx}`)
            .toLowerCase()
            .replace(/\s+/g, ""),
          color: PIE_COLORS[idx % PIE_COLORS.length],
        }));
      }
    }

    return [];
  };

  /**
   * For Pie chart tiers: parse xAxis → PieData[] and return as keyed object
   * so BaseChartContainer can pass it correctly as allUploadedData.
   */
  const parseTierDataWrapper = (xAxis: any, legends: LegendValue[], title: string) => {
    const pieData = parsePieChartData(xAxis, legends);
    const safeName = (title || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim().substring(0, 31);
    return {
      labels: pieData.map((d) => d.name),
      data: { [safeName]: pieData },
    };
  };

  /**
   * Generator func adapter — BaseChartContainer calls this for sample data
   * but Pie resolves its own data; this is a no-op placeholder that satisfies
   * the required interface.
   */
  const pieSampleGenerator = (
    xAxis: string[],
    legends: LegendValue[],
  ): any[] => generatePieSampleData(xAxis, legends);

  return (
    <BaseChartContainer
      {...props}
      category="PIE"
      excelType="pie"
      generatorFunc={pieSampleGenerator}
      getTierLegends={getTierLegends}
      parseTierData={parseTierDataWrapper}
      renderChildChart={(tier, childProps) => (
        <PieChartWidget {...childProps} key={tier.id} />
      )}
    >
      {({ isSampleData }) => {
        // Pie resolves its own data shape — bypasses BaseChartContainer's
        // ChartData[] (which is wrong for Pie) using direct resolution logic.
        const { pieData } = resolvePieData(
          allUploadedData,
          xAxisValues,
          legendValues,
          widgetTitle,
        );

        return (
          <div className="h-[400px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={4}
                  dataKey="value"
                  minAngle={15}
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <RechartsCell
                      key={`cell-${index}`}
                      fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} (${(
                      (value /
                        Math.max(
                          pieData.reduce((s, d) => s + d.value, 0),
                          1,
                        )) *
                      100
                    ).toFixed(1)}%)`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                      {isSampleData ? `${value} (sample)` : value}
                    </span>
                  )}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        );
      }}
    </BaseChartContainer>
  );
}
