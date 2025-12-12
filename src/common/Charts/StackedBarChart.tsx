import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Copy, Trash2 } from "lucide-react";

interface ChartData {
  name: string;
  onTime: number;
  absent: number;
  late: number;
}

const initialData: ChartData[] = [
  { name: "Sunday", onTime: 45, absent: 15, late: 15 },
  { name: "Monday", onTime: 65, absent: 15, late: 10 },
  { name: "Tuesday", onTime: 40, absent: 30, late: 25 },
  { name: "Wednesday", onTime: 20, absent: 55, late: 20 },
  { name: "Thursday", onTime: 60, absent: 20, late: 15 },
  { name: "Friday", onTime: 40, absent: 25, late: 30 },
  { name: "Saturday", onTime: 60, absent: 15, late: 20 },
];

export default function StackedBarChart() {
  const [data, setData] = useState<ChartData[]>(initialData);

  const totalEmployees = data.reduce(
    (sum, item) => sum + item.onTime + item.absent + item.late,
    0
  );

  const handleCopy = () => {
    const chartData = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(chartData);
  };

  const handleReset = () => {
    setData(initialData);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = data.onTime + data.absent + data.late;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">
            {data.name}
          </p>
          <p className="text-indigo-600 text-sm">
            On time: {data.onTime}
          </p>
          <p className="text-cyan-600 text-sm">
            Absent: {data.absent}
          </p>
          <p className="text-teal-600 text-sm">Late: {data.late}</p>
          <p className="font-semibold text-gray-800 mt-2 text-sm border-t pt-1">
            Total: {total}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Stacked Bar Chart
          </h2>
          <div className="flex gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <span className="text-sm text-gray-600">On time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-500"></div>
              <span className="text-sm text-gray-600">Late</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Total {totalEmployees} employee
            </p>
          </div>
          <div className="flex gap-2 border-l pl-4">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-50 rounded transition-colors border border-gray-200"
              title="Copy chart data"
            >
              <Copy size={18} className="text-gray-600" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-gray-50 rounded transition-colors border border-gray-200"
              title="Reset to default"
            >
              <Trash2 size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 13 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 13 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />
          <Bar
            dataKey="onTime"
            stackId="a"
            fill="#6366f1"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="absent"
            stackId="a"
            fill="#06b6d4"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="late"
            stackId="a"
            fill="#14b8a6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
