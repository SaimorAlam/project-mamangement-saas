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

/*    TYPES    */

type LegendItem = {
  label: string;
  field: string;
  color: string;
};

type ChartSchema = {
  chartType: "stacked_bar";
  title: string;
  xAxis: string[];
  legend: LegendItem[];
};

type WidgetConfig = {
  chartSchema: ChartSchema;
};

type ChartData = {
  name: string;
  [key: string]: number | string;
};

/*    WIDGET CONFIG    */

const widgetConfig: WidgetConfig = {
  chartSchema: {
    chartType: "stacked_bar",
    title: "Employee Attandence",
    xAxis: ["Sunday", "Monday", "Tuesday","Friday", "Wednesday", "Sat"],
    legend: [
      { label: "On Time", field: "onTime", color: "#6366f1" },
      { label: "Absent", field: "absent", color: "#06b6d4" },
      { label: "Late", field: "late", color: "#89c1a0" },
      { label: "Present", field: "present", color: "#89FFa0" },
    ],
  },
};

/*    HELPERS    */

const getRandomValue = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateChartData = (
  xAxis: string[],
  legend: LegendItem[]
): ChartData[] => {
  return xAxis.map((label) => {
    const item: ChartData = { name: label };

    legend.forEach((l) => {
      item[l.field] = getRandomValue();
    });

    return item;
  });
};

/*    COMPONENT    */

export default function StackedBarChart() {
  const { xAxis, legend } = widgetConfig.chartSchema;

  const initialData = useMemo(
    () => generateChartData(xAxis, legend),
    [xAxis, legend]
  );

  const [data, setData] = useState<ChartData[]>(initialData);

  /*    TOTAL    */

  const totalEmployees = useMemo(() => {
    return data.reduce((sum, row) => {
      return (
        sum +
        legend.reduce(
          (inner, l) => inner + Number(row[l.field]),
          0
        )
      );
    }, 0);
  }, [data, legend]);

  /*    ACTIONS    */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const handleReset = () => {
    setData(generateChartData(xAxis, legend));
  };


//   const widgetConfig: WidgetConfig = {
//   chartSchema: {
//     chartType: "stacked_bar",
//     xAxis: ["Sunday", "Monday", "Tuesday","Friday", "Wednesday"],
//     legend: [
//       { label: "On Time", field: "onTime", color: "#6366f1" },
//       { label: "Absent", field: "absent", color: "#06b6d4" },
//       { label: "Late", field: "late", color: "#89c1a0" },
//     ],
//   },
// };

  /* NEW: CSV DOWNLOAD HANDLER */
  // const csvTemplate = "Day,On Time,Absent,Late\nSunday,,,\nMonday,,,\nTuesday,,,";
const csvTemplate = (() => {
  const { legend, xAxis } = widgetConfig.chartSchema;

  // Header row
  const header =
    ["Day", ...legend.map((l) => l.label)].join(",");

  // Data rows
  const rows = xAxis.map(
    (day) => `${day}${",".repeat(legend.length)}`
  );

  return [header, ...rows].join("\n");
})();

  const handleDownloadCSV = () => {
    const blob = new Blob([csvTemplate], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${widgetConfig.chartSchema.title}-template.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  /*    TOOLTIP    */

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const row = payload[0].payload;
    const total = legend.reduce(
      (sum, l) => sum + Number(row[l.field]),
      0
    );

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">{row.name}</p>

        {legend.map((l) => (
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
          <h2 className="text-xl font-semibold">Stacked Bar Chart</h2>

          <div className="flex gap-6 mt-3">
            {legend.map((l) => (
              <div key={l.field} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: l.color }}
                />
                <span className="text-sm">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">
            Total {totalEmployees} employee
          </p>

          <div className="flex gap-2 border-l pl-4">
            <button
              onClick={handleCopy}
              className="p-2 border rounded hover:bg-gray-50"
              title="Copy data"
            >
              <Copy size={18} />
            </button>

            {/*NEW BUTTON */}
            <button
              onClick={handleDownloadCSV}
              className="p-2 border rounded hover:bg-gray-50"
              title="Download CSV template"
            >
              <Download size={18} />
            </button>

            <button
              onClick={handleReset}
              className="p-2 border rounded hover:bg-gray-50"
              title="Reset data"
            >
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

          {legend.map((l, i) => (
            <Bar
              key={l.field}
              dataKey={l.field}
              stackId="a"
              fill={l.color}
              radius={i === legend.length - 1 ? [4, 4, 0, 0] : 0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
