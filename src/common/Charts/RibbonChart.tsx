/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { ResponsiveContainer } from "recharts";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";

// Data types
export interface RibbonSeries {
  id: string;
  name: string;
  color: string;
  data: number[]; // Values corresponding to categories
}

export interface RibbonChartProps {
  widgetTitle: string;
  categories: string[];
  series: RibbonSeries[];
  onToggleWidget?: () => void;
  onDelete?: () => void;
  className?: string;
  isPreview?: boolean;
}

const RibbonChart: React.FC<RibbonChartProps> = ({
  widgetTitle,
  categories,
  series,
  onToggleWidget,
  onDelete,
  className,
  isPreview = false,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    active: boolean;
    x: number;
    y: number;
    content: string;
    color: string;
    category?: string;
  }>({ active: false, x: 0, y: 0, content: "", color: "" });

  // Processing data for rendering
  const chartData = useMemo(() => {
    // 1. Map data to a structure allowing easy rank calculation
    const categoryData = categories.map((cat, catIndex) => {
      // Get values for this category
      const currentValues = series.map((s) => ({
        ...s,
        value: s.data[catIndex] || 0,
      }));

      // Sort by value descending to determine stack order
      const sorted = [...currentValues].sort((a, b) => b.value - a.value);

      // Calculate Y positions (stacked)
      let currentY = 0;
      const nodes = sorted.map((s) => {
        const height = s.value;
        const yStart = currentY;
        const yEnd = currentY + height;
        currentY += height;
        return {
          id: s.id,
          name: s.name,
          color: s.color,
          value: s.value,
          yStart,
          yEnd,
          height,
        };
      });

      return {
        category: cat,
        total: currentY,
        nodes, // Sorted nodes for this category
      };
    });

    // Calculate global max for Y-axis scaling
    const maxTotal = Math.max(...categoryData.map((c) => c.total), 1);

    return { categoryData, maxTotal };
  }, [categories, series]);

  // Dimensions
  const padding = { top: 40, right: 30, bottom: 40, left: 50 };
  const barWidth = 40; // Fixed width for the "columns"

  // Helper to get coordinates
  const getCoordinates = (
    catIndex: number,
    yValue: number,
    width: number,
    height: number,
  ) => {
    const labelSpacing = 15; // Extra space after Y labels
    const effectiveWidth =
      width - padding.left - padding.right - barWidth - labelSpacing;
    const effectiveHeight = height - padding.top - padding.bottom;

    const xStep = effectiveWidth / Math.max(categories.length - 1, 1);
    const x =
      padding.left +
      labelSpacing +
      barWidth / 2 +
      (categories.length > 1 ? catIndex * xStep : effectiveWidth / 2);

    // Invert Y because SVG y=0 is top
    const scaleY = effectiveHeight / chartData.maxTotal;
    const y = height - padding.bottom - yValue * scaleY;

    return { x, y };
  };

  const handleCopy = () => {
    const exportData = {
      categories,
      series: series.map((s) => ({ name: s.name, data: s.data })),
    };
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const headers = ["Series", ...categories];
    const rows = series.map(
      (s) => `${s.name},${s.data.map((v) => v).join(",")}`,
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `Ribbon_Chart_${widgetTitle.replace(/\s+/g, "_")}.csv`,
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
      <div className="h-[400px] w-full relative group">
        <ResponsiveContainer width="100%" height="100%">
          <ChartRenderer
            data={chartData}
            categories={categories}
            series={series}
            barWidth={barWidth}
            padding={padding}
            getCoordinates={getCoordinates}
            hoveredSeries={hoveredSeries}
            setHoveredSeries={setHoveredSeries}
            setTooltip={setTooltip}
          />
        </ResponsiveContainer>

        {tooltip.active && (
          <div
            className="absolute pointer-events-none bg-white border border-gray-200 rounded shadow-md p-2 z-50 transition-all duration-75 text-xs whitespace-nowrap"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 40,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tooltip.color }}
              />
              <span className="font-bold text-gray-800">{tooltip.content}</span>
            </div>
            {tooltip.category && (
              <div className="text-gray-500">{tooltip.category}</div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {series.map((s) => (
          <div
            key={s.id}
            className={`flex items-center gap-2 cursor-pointer transition-opacity ${hoveredSeries && hoveredSeries !== s.id ? "opacity-30" : "opacity-100"}`}
            onMouseEnter={() => setHoveredSeries(s.id)}
            onMouseLeave={() => setHoveredSeries(null)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-sm text-gray-600 font-medium">{s.name}</span>
          </div>
        ))}
      </div>
    </ChartCardWrapper>
  );
};

// Inner component to access dimensions provided by ResponsiveContainer
const ChartRenderer = ({
  width,
  height,
  data,
  series,
  barWidth,
  padding,
  getCoordinates,
  hoveredSeries,
  setHoveredSeries,
  setTooltip,
}: any) => {
  if (!width || !height) return null;

  const { categoryData, maxTotal } = data;

  const generateRibbonPath = (
    x1: number,
    y1Start: number,
    y1End: number,
    x2: number,
    y2Start: number,
    y2End: number,
  ) => {
    const cp1x = x1 + (x2 - x1) * 0.5;
    const cp2x = x2 - (x2 - x1) * 0.5;

    return `
            M ${x1} ${y1Start}
            C ${cp1x} ${y1Start}, ${cp2x} ${y2Start}, ${x2} ${y2Start}
            L ${x2} ${y2End}
            C ${cp2x} ${y2End}, ${cp1x} ${y1End}, ${x1} ${y1End}
            Z
        `;
  };

  return (
    <svg width={width} height={height} className="overflow-visible">
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
        const val = maxTotal * tick;
        const y = getCoordinates(0, val, width, height).y;
        return (
          <g key={tick}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <text
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              fontSize={10}
              fill="#6b7280"
            >
              {Math.round(val)}
            </text>
          </g>
        );
      })}

      {categoryData.map((cat: any, i: number) => {
        if (i === categoryData.length - 1) return null;
        const nextCat = categoryData[i + 1];

        const col1Center = getCoordinates(i, 0, width, height).x;
        const x1 = Math.round(col1Center + barWidth / 2);

        const col2Center = getCoordinates(i + 1, 0, width, height).x;
        const x2 = Math.round(col2Center - barWidth / 2);

        return series.map((s: any) => {
          const node1 = cat.nodes.find((n: any) => n.id === s.id);
          const node2 = nextCat.nodes.find((n: any) => n.id === s.id);

          if (!node1 || !node2) return null;

          const y1Top = getCoordinates(i, node1.yEnd, width, height).y;
          const y1Bottom = getCoordinates(i, node1.yStart, width, height).y;

          const y2Top = getCoordinates(i + 1, node2.yEnd, width, height).y;
          const y2Bottom = getCoordinates(i + 1, node2.yStart, width, height).y;

          const isHovered = hoveredSeries === s.id;
          const isAnyHovered = hoveredSeries !== null;

          return (
            <path
              key={`ribbon-${i}-${s.id}`}
              d={generateRibbonPath(x1, y1Top, y1Bottom, x2, y2Top, y2Bottom)}
              fill={s.color}
              fillOpacity={isHovered ? 0.8 : isAnyHovered ? 0.1 : 0.4}
              stroke={isHovered ? "rgba(255,255,255,0.5)" : "none"}
              strokeWidth={1}
              className="transition-all duration-300 ease-in-out cursor-pointer"
              onMouseEnter={() => setHoveredSeries(s.id)}
              onMouseLeave={() => {
                setHoveredSeries(null);
                setTooltip((prev: any) => ({ ...prev, active: false }));
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget
                  .closest("svg")
                  ?.getBoundingClientRect();
                if (rect) {
                  setTooltip({
                    active: true,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    content: s.name,
                    color: s.color,
                    category: `${cat.category} → ${nextCat.category}`,
                  });
                }
              }}
            />
          );
        });
      })}

      {categoryData.map((cat: any, i: number) => {
        const centerX = getCoordinates(i, 0, width, height).x;
        const leftX = centerX - barWidth / 2;

        return (
          <g key={`col-${i}`}>
            <text
              x={centerX}
              y={height - 10}
              textAnchor="middle"
              fontSize={12}
              fill="#4b5563"
              fontWeight="500"
            >
              {cat.category}
            </text>

            {cat.nodes.map((node: any) => {
              const yTop = getCoordinates(i, node.yEnd, width, height).y;
              const yBottom = getCoordinates(i, node.yStart, width, height).y;
              const h = Math.abs(yBottom - yTop);

              const isHovered = hoveredSeries === node.id;
              const isAnyHovered = hoveredSeries !== null;

              return (
                <rect
                  key={node.id}
                  x={leftX}
                  y={yTop}
                  width={barWidth}
                  height={Math.max(h, 0)}
                  fill={node.color}
                  fillOpacity={isHovered || !isAnyHovered ? 1 : 0.3}
                  className="transition-opacity duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredSeries(node.id)}
                  onMouseLeave={() => {
                    setHoveredSeries(null);
                    setTooltip((prev: any) => ({ ...prev, active: false }));
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget
                      .closest("svg")
                      ?.getBoundingClientRect();
                    if (rect) {
                      setTooltip({
                        active: true,
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        content: `${node.name}: ${node.value}`,
                        color: node.color,
                        category: cat.category,
                      });
                    }
                  }}
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

export default RibbonChart;
