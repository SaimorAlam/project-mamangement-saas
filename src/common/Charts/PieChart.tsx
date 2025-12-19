import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import { Copy, Trash2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LegendValue } from "@/components/client/ProjectBuilder/WidgetForChartModuleOne";

interface PieChartWidgetProps {
  title: string;
  legendValues: LegendValue[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const getRandomValue = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateId = () =>
  crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

export default function PieChartWidget({
  title,
  legendValues,
}: PieChartWidgetProps) {
const isAllLegendFieldEmpty = legendValues.filter((l)=> l.field!=="") 

  const data: ChartData[] = legendValues
    .filter((l) => l.label)
    .map((l) => ({
      name: l.label,
      value: getRandomValue(10, 100),
      color: l.color,
    }));

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data));
  };

  const handleDelete = () => {
    console.log("Delete Pie Chart");
  };

  // CSV EXPORT (ID ONLY IN FILE NAME)
  const handleExportCSV = () => {
    const csvId = generateId();

    const header = "Label,Value";
    const rows = legendValues
      .filter((l) => l.label)
      .map((l) => `${l.label},`);

    const csvContent = [header, ...rows].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${title}-${csvId}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const payload = props.payload as { name: string; value: number };
    return `${payload.name}: ${payload.value}%`;
  };

  return (
    <Card className="w-full  bg-white p-6 shadow-sm border border-gray-200 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Export CSV"
          >
            <Download size={18} className="text-gray-600" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Copy"
          >
            <Copy size={18} className="text-gray-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-gray-100 rounded-md"
            title="Delete"
          >
            <Trash2 size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-8 mb-6 flex-wrap">
        {data.map((item) => (
          <div key={item.name} className="flex items-baseline gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <p className="text-sm font-medium text-gray-700">{item.name}</p>
              <p className="text-md font-semibold text-gray-900">
                {item.value}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={500}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={"90%"}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </RechartsPieChart>
      </ResponsiveContainer>
      {isAllLegendFieldEmpty.length===0 && (
        <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">No data selected. Please input legend value for visual.</div>
      )}
    </Card>
  );
}
