import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Copy, Trash2, Download } from "lucide-react";
import { LegendValue } from "@/components/client/ProjectBuilder/WidgetForChartModuleOne";
import { generateLineChartData } from "@/utils";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";

/*     TYPES     */

type ChartData = {
  name: string;
  [key: string]: number | string;
};

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[];
  legendValues?: LegendValue[];
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
};

/*     COMPONENT     */

export default function MultiAxisLineChart({
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  startingRange,
  endingRange,
  onToggleWidget,
}: Props) {
  const [showLineOnly, setShowLineOnly] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [showAddTierModal, setShowAddTierModal] = useState(false);

  /*      DERIVED DATA (KEY FIX)      */
  const data: ChartData[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];
    return generateLineChartData(
      xAxisValues,
      legendValues,
      startingRange,
      endingRange
    );
  }, [xAxisValues, legendValues, startingRange, endingRange]);

  /*      ACTIONS      */
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">
          {payload[0].payload.name}
        </p>
        {payload.map((p: any) => (
          <p
            key={p.dataKey}
            style={{ color: p.color }}
            className="text-sm"
          >
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  const handleWidgetClick = () => {
    if (onToggleWidget) {
      onToggleWidget();
    }
    setShowPopover(false);
  };

  const handleAddTierClick = () => {
    setShowAddTierModal(true);
    setShowPopover(false);
  };

  /*      RENDER      */
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 grow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{widgetTitle}</h2>
        <div className="flex gap-2 border-l pl-4 relative">
          <button
            onClick={() => setShowPopover(!showPopover)}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <BsThreeDots size={18} />
          </button>

          {showPopover && (
            <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-48 z-10">
              <button
                onClick={() => {
                  handleCopy();
                  setShowPopover(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
              >
                <Copy size={18} />
                <span>Copy</span>
              </button>

              <button
                onClick={() => {
                  // handleDownload();
                  setShowPopover(false);
                }}
                // disabled={isDownloading}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
              >
                <Download size={18} />
                <span>Download</span>
              </button>

              <button
                onClick={() => setShowPopover(false)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left text-red-600"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </button>

              {onToggleWidget && (
                <button
                  onClick={handleWidgetClick}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                >
                  <MdOutlineWidgets size={18} />
                  <span>Widget</span>
                </button>
              )}

              <button
                onClick={handleAddTierClick}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
              >
                <GoPlus size={18} />
                <span>Add Tier</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-between mb-6">
        <div className="flex gap-6 mt-3">
          {legendValues.map((l) =>
            l.label ? (
              <div key={l.field} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-1"
                    style={{ backgroundColor: l.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {l.label}
                  </span>
                </div>
              </div>
            ) : null
          )}
        </div>

        <button
          onClick={() => setShowLineOnly(!showLineOnly)}
          className="text-blue-500 text-sm"
        >
          Show Line Only {showLineOnly ? "✓" : ""}
        </button>
      </div>

      {/* Chart */}
      {data.length ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[startingRange, endingRange]} />
            <Tooltip content={<CustomTooltip />} />

            {legendValues.map((l) => (
              <Line
                key={l.field}
                type="monotone"
                dataKey={l.field}
                stroke={l.color}
                dot={!showLineOnly}
                strokeWidth={2}
                opacity={
                  hoveredLine === null || hoveredLine === l.field
                    ? 1
                    : 0.3
                }
                onMouseEnter={() => setHoveredLine(l.field)}
                onMouseLeave={() => setHoveredLine(null)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-96 flex items-center justify-center text-gray-400">
          No data available, Please fill the input field to generate
          the chart and then download the csv.
        </div>
      )}
    </div>
  );
}
