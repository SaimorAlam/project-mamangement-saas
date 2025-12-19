import { LegendValue } from "@/components/client/ProjectBuilder/WidgetForChartModuleOne";
import { Copy, Trash2, Download } from "lucide-react";

type Props = {
  widgetTitle?: string;
  legendValues?: LegendValue[];
};

const generateId = () =>
  crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

export default function HorizontalBarChartNew({
  widgetTitle = "My CSV",
  legendValues = [],
}: Props) {
  // Placeholder value for visual width
  const MAX_VALUE = 100;

  const data = legendValues
    .filter((l) => l.label)
    .map((l) => ({
      label: l.label,
      value: Math.floor(Math.random() * MAX_VALUE),
      color: "#6F78F9",
    }));

  const totalUsage = data.reduce((sum, d) => sum + d.value, 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const handleDelete = () => {
    console.log("Reset handled by parent widget");
  };

  // CSV export (widget rule)
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
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">{widgetTitle}</h2>
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

      {/* Legend + Total */}
      <div className="flex justify-between mb-6 text-sm xl:text-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className=" text-gray-600">Usage Rate</span>
        </div>
        <div className=" text-gray-600">
          Total usage <span className="font-semibold">{totalUsage}</span>k
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-4">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-20 text-right text-sm text-gray-600">
              {item.label}
            </div>

            <div className="flex-1 flex items-center gap-3 h-10 rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-500"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                }}
              />
            <div className="w-10 text-sm font-medium">{item.value}k</div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
