import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Copy, Trash2, Download } from "lucide-react";
import { LegendValue } from "@/components/client/ProjectBuilder/ProjectConfiguration";
import { generateChartData } from "@/utils";

/*   TYPES   */

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[];
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  startingRange: number;
  endingRange: number;
};

/*   COMPONENT   */

export default function StackedBarChart({
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet,
  startingRange,
  endingRange,
}: Props) {
  /*    DERIVED DATA (KEY FIX)    */
  const data: ChartData[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];
    return generateChartData(xAxisValues, legendValues, numOfLegendDataSet, startingRange, endingRange);
  }, [xAxisValues, legendValues,startingRange,endingRange]);

  /*    TOTAL    */
  const totalEmployees = useMemo(() => {
    return data.reduce((sum, row) => {
      return (
        sum +
        legendValues.reduce(
          (inner, l) => inner + Number(row[l.field] || 0),
          0
        )
      );
    }, 0);
  }, [data, legendValues]);

  /*    ACTIONS    */
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const handleDownloadCSV = () => {
    if (!xAxisValues.length || !legendValues.length) return;

    const header = ["Day", ...legendValues.map(l => l.label)].join(",");
    const rows = xAxisValues.map(
      day => `${day}${",".repeat(legendValues.length)}`
    );

    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${widgetTitle}-template.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  /*    TOOLTIP    */
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const row = payload[0].payload;
    const total = legendValues.reduce(
      (sum, l) => sum + Number(row[l.field] || 0),
      0
    );

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">{row.name}</p>

        {legendValues.map(l => (
          <p key={l.field} style={{ color: l.color }} className="text-sm">
            {l.label}: {row[l.field]}
          </p>
        ))}

        <p className="font-semibold mt-2 border-t pt-1 text-sm">
          Total: {total}
        </p>
      </div>
    );
  };

  /*    RENDER    */
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{widgetTitle}</h2>

          <div className="flex gap-6 mt-3">
            {legendValues.map(l =>
              l.label ? (
                <div key={l.field} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-sm">{l.label}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            Total {totalEmployees} employee
          </p>

          <div className="flex gap-2 border-l pl-4">
            <button onClick={handleCopy} className="p-2 border rounded">
              <Copy size={18} />
            </button>

            <button onClick={handleDownloadCSV} className="p-2 border rounded">
              <Download size={18} />
            </button>

            <button className="p-2 border rounded text-red-600">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />

          {legendValues.map((l, i) => (
            <Bar
              key={l.field}
              dataKey={l.field}
              stackId="a"
              fill={l.color}
              radius={i === legendValues.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
