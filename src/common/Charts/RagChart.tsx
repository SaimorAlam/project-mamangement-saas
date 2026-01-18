import React, { useState } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";

export type RagDataPoint = {
  name: string;
  value: number;
};

export type RagThresholds = {
  poor: number;
  average: number;
  good: number; // typically the upper bound of "average" or just a max value for the chart domain
};

interface RagChartProps {
  widgetTitle: string;
  data: RagDataPoint[];
  thresholds: RagThresholds;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  className?: string;
}

const RagChart: React.FC<RagChartProps> = ({
  widgetTitle,
  data,
  thresholds,
  onToggleWidget,
  onDelete,
  className,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  // Calculate max domain to ensure the top zone is visible even if data is low
  const maxValue = Math.max(
    ...data.map((d) => d.value),
    thresholds.good,
    100 // Default minimum height if everything is 0
  );

  // Extend domain slightly above max value for better visuals
  const yAxisMax = Math.ceil(maxValue * 1.1);

  // Custom Dot to match image style (spherical look)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <svg
        x={cx - 6}
        y={cy - 6}
        width={12}
        height={12}
        fill="white"
        viewBox="0 0 12 12"
      >
        <circle cx="6" cy="6" r="6" fill="url(#dotGradient)" stroke="#666" strokeWidth="1" />
        <defs>
          <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#ccc" />
          </radialGradient>
        </defs>
      </svg>
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const handleDownload = () => {
    // Simple CSV download implementation for RAG data
    // In a real scenario, this might use the provided utility if adapted
    const headers = ["Name,Value"];
    const rows = data.map(d => `${d.name},`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${widgetTitle.replace(/\s+/g, "_")}_rag_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`w-full bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow ${className}`}
      onClick={() => {
        // Optional: Open config on chart click like LineChart?
        // if (onToggleWidget) onToggleWidget();
      }}
    >
      <div className="flex justify-between mb-6">
        <div>
           <h2 className="text-xl font-semibold">{widgetTitle}</h2>
        </div>

        <div
          className="flex items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-2 border-l pl-4 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPopover(!showPopover);
              }}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50 bg-white"
            >
              <BsThreeDots size={18} />
            </button>

            {showPopover && (
              <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-48 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                    setShowPopover(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                >
                  <Copy size={18} />
                  <span>Copy</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                    setShowPopover(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDelete) onDelete();
                    setShowPopover(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left text-red-600"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>

                {onToggleWidget && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWidget();
                      setShowPopover(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <MdOutlineWidgets size={18} />
                    <span>Widget</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <filter id="blurFilter" x="-50%" y="-50%" width="200%" height="200%">
                 <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
              </filter>
              <linearGradient id="ragGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ff7875" />
                <stop offset={`${(thresholds.poor / yAxisMax) * 100}%`} stopColor="#ff7875" />
                <stop offset={`${(thresholds.average / yAxisMax) * 100}%`} stopColor="#ffd666" />
                <stop offset="100%" stopColor="#95de64" />
              </linearGradient>
            </defs>
{/* Background Gradient Rect with Blur - Moved to top to be behind grid/axes */}
            <ReferenceArea
              y1={0}
              y2={yAxisMax}
              fill="url(#ragGradient)"
              fillOpacity={0.8}
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(1,1,1,0.5)" />
            <XAxis
              dataKey="name"
              stroke="#666"
              tick={{ fill: "#666", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
              dy={10}
              height={45}
            />
            <YAxis
              hide={false}
              domain={[0, yAxisMax]}
              tick={{ fill: "#666", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
              dx={-10}
              width={45}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />

            {/* Labels on top */}
             <ReferenceArea y1={thresholds.average} y2={yAxisMax} fill="none" label={{ value: "Good", position: "insideTopLeft", fill: "#135200", fontSize: 13, fontWeight: "bold", dy: 10, dx: 10 }} />
             <ReferenceArea y1={thresholds.poor} y2={thresholds.average} fill="none" label={{ value: "Average", position: "insideTopLeft", fill: "#8c6114", fontSize: 13, fontWeight: "bold", dy: 10, dx: 10 }} />
             <ReferenceArea y1={0} y2={thresholds.poor} fill="none" label={{ value: "Poor", position: "insideTopLeft", fill: "#5c0011", fontSize: 13, fontWeight: "bold", dy: 10, dx: 10 }} />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#000"
              strokeWidth={3}
              dot={<CustomDot />}
              activeDot={{ r: 8, fill: "#000", stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RagChart;
