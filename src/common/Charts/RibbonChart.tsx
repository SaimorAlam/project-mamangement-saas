import React, { useMemo, useState } from "react";
import { ResponsiveContainer } from "recharts";
import { BsThreeDots } from "react-icons/bs";
import { Copy, Download, Trash2 } from "lucide-react";
import { MdOutlineWidgets } from "react-icons/md";

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
}

const RibbonChart: React.FC<RibbonChartProps> = ({
  widgetTitle,
  categories,
  series,
  onToggleWidget,
  onDelete,
  className,
}) => {
  const [showPopover, setShowPopover] = useState(false);
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);

  // Processing data for rendering
  // We need to calculate the layout:
  // 1. For each category, sort series by value (descending) to determine stack order.
  // 2. Calculate y-positions (top and bottom) for each series in each category.
  // 3. Generate SVG paths for ribbons connecting Category N to Category N+1.

  const chartData = useMemo(() => {
    // 1. Map data to a structure allowing easy rank calculation
    const categoryData = categories.map((cat, catIndex) => {
      // Get values for this category
      const currentValues = series.map((s) => ({
        ...s,
        value: s.data[catIndex] || 0,
      }));

      // Sort by value descending to determine stack order
      // Power BI Ribbon charts sort by value so highest is on top
      const sorted = [...currentValues].sort((a, b) => b.value - a.value);

      // Calculate Y positions (stacked)
      // We'll normalize to a 0-1 range or 0-100% relative to max total? 
      // Usually Ribbon charts show absolute values, so the height varies.
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
    height: number
  ) => {
    // Distribute categories evenly
    const effectiveWidth = width - padding.left - padding.right;
    const effectiveHeight = height - padding.top - padding.bottom;
    
    const xStep = effectiveWidth / Math.max(categories.length - 1, 1);
    const x = padding.left + (categories.length > 1 ? catIndex * xStep : effectiveWidth / 2);
    
    // Invert Y because SVG y=0 is top
    const scaleY = effectiveHeight / chartData.maxTotal;
    const y = height - padding.bottom - (yValue * scaleY);
    
    return { x, y };
  };

  const handleCopy = () => {
    const exportData = {
        categories,
        series: series.map(s => ({ name: s.name, data: s.data }))
    };
    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
  };

  const handleDownload = () => {
    const headers = ["Series", ...categories];
    // Create empty cells for data points, preserving structure
    const rows = series.map(s => `${s.name},${s.data.map(() => "").join(",")}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${widgetTitle.replace(/\s+/g, "_")}_ribbon_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`w-full bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white ${className}`}
      onClick={() => {
        // if (onToggleWidget) onToggleWidget();
      }}
    >
      {/* Header */}
      <div className="flex justify-between mb-2">
        <div>
          <h2 className="text-xl font-semibold">{widgetTitle}</h2>
        </div>

        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
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
              <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-48 z-20">
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

      {/* Ribbon Visualization */}
      <div className="h-[400px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          {/* We use a custom component wrapper to get width/height from ResponsiveContainer */}
          <ChartRenderer 
            data={chartData} 
            categories={categories}
            series={series}
            barWidth={barWidth}
            padding={padding}
            getCoordinates={getCoordinates}
            hoveredSeries={hoveredSeries}
            setHoveredSeries={setHoveredSeries}
          />
        </ResponsiveContainer>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {series.map((s) => (
          <div 
            key={s.id} 
            className={`flex items-center gap-2 cursor-pointer transition-opacity ${hoveredSeries && hoveredSeries !== s.id ? 'opacity-30' : 'opacity-100'}`}
            onMouseEnter={() => setHoveredSeries(s.id)}
            onMouseLeave={() => setHoveredSeries(null)}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="text-sm text-gray-600 font-medium">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inner component to access dimensions provided by ResponsiveContainer
// Note: ResponsiveContainer clones its child and passes width/height props.
const ChartRenderer = ({ 
  width, 
  height, 
  data, 
  series,
  barWidth,
  padding,
  getCoordinates,
  hoveredSeries,
  setHoveredSeries
}: any) => {
    if (!width || !height) return null;

    const { categoryData, maxTotal } = data;

    // Generate Layout
    // We render:
    // 1. Grid/Axes
    // 2. Ribbons (behind bars)
    // 3. Bars

    // Helper to generate bezier path between two columns
    const generateRibbonPath = (
        x1: number, y1Start: number, y1End: number, // Right side of Col 1
        x2: number, y2Start: number, y2End: number  // Left side of Col 2
    ) => {
        // Control points for smooth S-curve
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
            {/* Grid Lines (Horizontal) */}
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

            {/* Render Ribbons First (Behind Bars) */}
            {categoryData.map((cat: any, i: number) => {
                if (i === categoryData.length - 1) return null; // No ribbon after last col
                const nextCat = categoryData[i + 1];

                // Coordinates
                // For Col i, we need the RIGHT edge X
                const col1Center = getCoordinates(i, 0, width, height).x;
                // Ribbon connects center to center approx or edge to edge? Power BI ribbons connects edges.
                // Actually, let's treat the columns has having width.
                // Since our getCoordinates returns CENTER of column...
                const x1 = Math.round(col1Center + barWidth / 2); // Right edge of Col 1
                
                // For Col i+1, we need LEFT edge X
                const col2Center = getCoordinates(i + 1, 0, width, height).x;
                const x2 = Math.round(col2Center - barWidth / 2); // Left edge of Col 2

                // For each series, find its start/end Y in both columns
                return series.map((s: any) => {
                    const node1 = cat.nodes.find((n: any) => n.id === s.id);
                    const node2 = nextCat.nodes.find((n: any) => n.id === s.id);

                    if (!node1 || !node2) return null;

                    // Convert data Y values to SVG Y coordinates
                    // Node Y values are bottom-up (0 is bottom).
                    // In SVG, we map value to Y.
                    // Important: node.yStart is the bottom of the segment, node.yEnd is top.
                    // In SVG coords, yEnd (higher value) maps to lower pixel Y (top of screen).
                    
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
                            fillOpacity={isHovered ? 0.8 : (isAnyHovered ? 0.1 : 0.4)}
                            stroke={isHovered ? "rgba(255,255,255,0.5)" : "none"}
                            strokeWidth={1}
                            className="transition-all duration-300 ease-in-out cursor-pointer"
                            onMouseEnter={() => setHoveredSeries(s.id)}
                            onMouseLeave={() => setHoveredSeries(null)}
                        >
                            <title>{`${s.name}\n${cat.category} -> ${nextCat.category}`}</title>
                        </path>
                    );
                });
            })}

            {/* Render Bars (Columns) */}
            {categoryData.map((cat: any, i: number) => {
                const centerX = getCoordinates(i, 0, width, height).x;
                const leftX = centerX - barWidth / 2;

                return (
                    <g key={`col-${i}`}>
                        {/* X-axis Label */}
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

                        {/* Bar Segments */}
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
                                    height={Math.max(h, 0)} // Prevent negative height
                                    fill={node.color}
                                    fillOpacity={isHovered || !isAnyHovered ? 1 : 0.3}
                                    className="transition-opacity duration-300"
                                    onMouseEnter={() => setHoveredSeries(node.id)}
                                    onMouseLeave={() => setHoveredSeries(null)}
                                >
                                    <title>{`${node.name}: ${node.value}`}</title>
                                </rect>
                            );
                        })}
                    </g>
                );
            })}
        </svg>
    );
};

export default RibbonChart;
