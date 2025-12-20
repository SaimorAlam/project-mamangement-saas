import { useMemo, useState } from "react";
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
import { generateChartData } from "@/utils";
import { LegendValue } from "@/components/client/ProjectBuilder/WidgetForChartModuleOne";

/*    == TYPES    == */

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

/*    == COMPONENT    == */

export default function StackedBarChart({
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  /*   DATA   */
  const data: ChartData[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];
    return generateChartData(
      xAxisValues,
      legendValues,
      numOfLegendDataSet,
      startingRange,
      endingRange
    );
  }, [xAxisValues, legendValues, numOfLegendDataSet, startingRange, endingRange]);

  /*   TOTAL   */
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

  /*   CSV HELPERS   */

  const buildCsvTemplate = () => {
    const header = ["X-Axis", ...legendValues.map(l => l.label)].join(",");

    const rows = xAxisValues.map(
      label => `${label}${",".repeat(legendValues.length)}`
    );

    return [header, ...rows].join("\n");
  };

  const downloadCsvFile = (csv: string, fileName: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  };

  /*   API + DOWNLOAD   */

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const payload = {
        numberOfDataset: numOfLegendDataSet,
        firstFiledDataset: startingRange,
        lastFiledDAtaset: endingRange,
        showWidgets: legendValues.map(l => ({
          legend_name: l.label,
          color: l.color,
        })),
        title: widgetTitle,
        status: "ACTIVE",
        category: "AREA",
        xAxis: JSON.stringify({
          labels: xAxisValues,
          values: [],
        }),
        yAxis: JSON.stringify({}),
        zAxis: JSON.stringify({}),
      };

      const response = await fetch("/api/v1/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("payload is : ",payload);
      console.log("error is : ",response);
      
      if (!response.ok) throw new Error("API failed");

      const result = await response.json();
      const uniqueId = result.id; // backend generated id

      const csvTemplate = buildCsvTemplate();
      downloadCsvFile(csvTemplate, `${widgetTitle}_${uniqueId}.csv`);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download CSV");
    } finally {
      setIsDownloading(false);
    }
  };

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  /*   TOOLTIP   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">{row.name}</p>
        {legendValues.map(l => (
          <p key={l.field} style={{ color: l.color }} className="text-sm">
            {l.label}: {row[l.field]}
          </p>
        ))}
      </div>
    );
  };

  /*   RENDER   */

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
            Total {totalEmployees}
          </p>

          <div className="flex gap-2 border-l pl-4">
            <button
              onClick={handleCopy}
              className="p-2 border rounded hover:bg-gray-50"
            >
              <Copy size={18} />
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-2 border rounded hover:bg-gray-50"
            >
              <Download size={18} />
            </button>

            <button className="p-2 border rounded hover:bg-gray-50 text-red-600">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis domain={[startingRange, endingRange]} />
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
