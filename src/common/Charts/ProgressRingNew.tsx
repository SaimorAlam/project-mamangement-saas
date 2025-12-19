import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Copy, Trash2, Download } from "lucide-react";
import { LegendValue } from "@/components/client/ProjectBuilder/WidgetForChartModuleOne";

type Props = {
  widgetTitle?: string;
  legendValues?: LegendValue[];
  startingRange?: number;
  endingRange?: number;
};

const generateId = () =>
  crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

const getRandomValue = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function ProgressRingNew({
  widgetTitle = "My CSV",
  legendValues = [],
}: Props) {
  const isAllLegendFieldEmpty = legendValues.filter((l)=> l.field!=="")  

  //  generate chart data from legend
  const data = legendValues
    .filter((l) => l.label)
    .map((l) => ({
      name: l.label,
      value: getRandomValue(5,100), // visual placeholder
      color: l.color,
    }));

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const handleDelete = () => {
    console.log(isAllLegendFieldEmpty);
    
    console.log("Reset handled by parent if needed");
  };

  //  CSV EXPORT (widget rules)
  const handleExportCSV = () => {
    const id = generateId();

    const header = "Label,Value";
    const rows = legendValues.map((l) => `${l.label},`);
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widgetTitle}-${id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 w-[75%] relative">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">{widgetTitle}</h2>
        <div className="flex gap-5">
          <button onClick={handleExportCSV} title="Export CSV">
            <Download size={18} />
          </button>
          <button onClick={handleCopy} title="Copy">
            <Copy size={18} />
          </button>
          <button onClick={handleDelete} title="Reset">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 justify-center mb-6">
        {legendValues.map(
          (l) =>
            l.label && (
              <div key={l.field} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: l.color }}
                />
                <span className="text-sm">{l.label}</span>
              </div>
            )
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius="40%" 
      outerRadius="99%"
            paddingAngle={1}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label */}
      {isAllLegendFieldEmpty.length!==0 ? (
        <div className="text-center mt-[-270px] pointer-events-none">
        <p className="text-sm text-gray-500">Total</p>
        <p className="text-3xl font-bold">{legendValues.length}</p>
      </div>
      ):(
        <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400">No data selected. Please input legend value for visual.</div>
      )}
      
    </div>
  );
}
