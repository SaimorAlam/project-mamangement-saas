import React, { useMemo, useState } from "react";
import { Copy, Trash2 } from "lucide-react";
import { LegendValue } from "@/components/client/ProjectBuilder/ProjectConfiguration";
import { generateAreaChartData } from "@/utils";

/*    TYPES    */

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
};

/*    COMPONENT    */

const AreaChart: React.FC<Props> = ({
  widgetTitle = "Area Chart",
  xAxisValues = [],
  legendValues = [],
  startingRange,
  endingRange,
}) => {
  const [showLineOnly, setShowLineOnly] = useState(false);

  /*    CHART DATA (KEY FIX)    */
  const data: ChartData[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];
    return generateAreaChartData(
      xAxisValues,
      legendValues,
      startingRange,
      endingRange
    );
  }, [xAxisValues, legendValues, startingRange, endingRange]);

  /*    SVG DIMENSIONS    */
  const chartWidth = 700;
  const chartHeight = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  /*    SCALE HELPERS    */
  const scaleX = (index: number) =>
    (index / (data.length - 1 || 1)) * innerWidth;

  const scaleY = (value: number) =>
    innerHeight -
    ((value - startingRange) / (endingRange - startingRange)) * innerHeight;

  /*    PATH GENERATOR    */
  const createPath = (field: string) => {
    const points = data.map((d, i) => ({
      x: scaleX(i),
      y: scaleY(Number(d[field])),
    }));

    const linePath = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    const areaPath = [
      ...points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`),
      `L ${points[points.length - 1]?.x ?? 0} ${innerHeight}`,
      `L 0 ${innerHeight}`,
      "Z",
    ].join(" ");

    return { linePath, areaPath };
  };

  /*    ACTIONS    */
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  const handleDelete = () => {
    console.log("Delete chart");
  };

  /*    Y TICKS    */
  const yTicks = useMemo(() => {
    const step = Math.ceil((endingRange - startingRange) / 7);
    return Array.from({ length: 8 }, (_, i) => startingRange + i * step);
  }, [startingRange, endingRange]);

  /*    RENDER    */

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">{widgetTitle}</h2>

          <div className="flex gap-6 mt-3">
            {legendValues.map(l =>
              l.label ? (
                <div key={l.field} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: l.color }}
                  />
                  <span className="text-sm">{l.label}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        <div>
          <div className="flex gap-4 mb-2">
            <button onClick={handleCopy}>
              <Copy size={18} />
            </button>
            <button onClick={handleDelete}>
              <Trash2 size={18} />
            </button>
          </div>

          <button
            onClick={() => setShowLineOnly(!showLineOnly)}
            className="text-xs text-blue-600"
          >
            {showLineOnly ? "Show Area" : "Show Line Only"}
          </button>
        </div>
      </div>

      {/* Chart */}
      {data.length ? (
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Y Grid */}
            {yTicks.map(tick => {
              const y = scaleY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={0}
                    y1={y}
                    x2={innerWidth}
                    y2={y}
                    stroke="#f3f4f6"
                  />
                  <text
                    x={-10}
                    y={y}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="text-xs fill-gray-400"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Areas */}
            {!showLineOnly &&
              legendValues.map(l => {
                const { areaPath } = createPath(l.field);
                return (
                  <path
                    key={l.field}
                    d={areaPath}
                    fill={l.color}
                    fillOpacity="0.3"
                  />
                );
              })}

            {/* Lines */}
            {legendValues.map(l => {
              const { linePath } = createPath(l.field);
              return (
                <path
                  key={l.field}
                  d={linePath}
                  fill="none"
                  stroke={l.color}
                  strokeWidth="2"
                />
              );
            })}

            {/* X Labels */}
            {data.map((d, i) => (
              <text
                key={i}
                x={scaleX(i)}
                y={innerHeight + 25}
                textAnchor="middle"
                className="text-xs fill-gray-400"
              >
                {d.name}
              </text>
            ))}
          </g>
        </svg>
      ) : (
        <div className="h-60 flex items-center justify-center text-gray-400">
          No data available. Please fill inputs in the widget to display chart and download csv.
        </div>
      )}
    </div>
  );
};

export default AreaChart;
