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
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";

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
  isPreview?: boolean;
}

const RagChart: React.FC<RagChartProps> = ({
  widgetTitle,
  data,
  thresholds,
  onToggleWidget,
  onDelete,
  className,
  isPreview = false,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Calculate max domain to ensure the top zone is visible even if data is low
  const maxValue = Math.max(
    ...data.map((d) => d.value),
    thresholds.good,
    100, // Default minimum height if everything is 0
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
        <circle
          cx="6"
          cy="6"
          r="6"
          fill="url(#dotGradient)"
          stroke="#666"
          strokeWidth="1"
        />
        <defs>
          <radialGradient
            id="dotGradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
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
    setIsDownloading(true);
    const headers = ["Name,Value"];
    const rows = data.map((d) => `${d.name},${d.value}`);
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `RAG_Chart_${widgetTitle.replace(/\s+/g, "_")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownloading(false);
  };

  return (
    <ChartCardWrapper
      title={widgetTitle}
      menuActions={{
        onCopy: handleCopy,
        onDownload: handleDownload,
        onDelete: onDelete,
        onToggleWidget: onToggleWidget,
      }}
      isDownloading={isDownloading}
      isPreview={isPreview}
      className={className}
    >
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <filter
                id="blurFilter"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
              </filter>
              <linearGradient id="ragGradient" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ff7875" />
                <stop
                  offset={`${(thresholds.poor / yAxisMax) * 100}%`}
                  stopColor="#ff7875"
                />
                <stop
                  offset={`${(thresholds.average / yAxisMax) * 100}%`}
                  stopColor="#ffd666"
                />
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
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(1,1,1,0.5)"
            />
            <XAxis
              dataKey="name"
              stroke="#666"
              tick={{ fill: "#666", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
              dy={10}
              height={45}
            />
            <YAxis
              hide={false}
              domain={[0, yAxisMax]}
              tick={{ fill: "#666", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
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
            <ReferenceArea
              y1={thresholds.average}
              y2={yAxisMax}
              fill="none"
              label={{
                value: "Good",
                position: "insideTopLeft",
                fill: "#135200",
                fontSize: 13,
                fontWeight: "bold",
                dy: 10,
                dx: 10,
              }}
            />
            <ReferenceArea
              y1={thresholds.poor}
              y2={thresholds.average}
              fill="none"
              label={{
                value: "Average",
                position: "insideTopLeft",
                fill: "#8c6114",
                fontSize: 13,
                fontWeight: "bold",
                dy: 10,
                dx: 10,
              }}
            />
            <ReferenceArea
              y1={0}
              y2={thresholds.poor}
              fill="none"
              label={{
                value: "Poor",
                position: "insideTopLeft",
                fill: "#5c0011",
                fontSize: 13,
                fontWeight: "bold",
                dy: 10,
                dx: 10,
              }}
            />

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
    </ChartCardWrapper>
  );
};

export default RagChart;
