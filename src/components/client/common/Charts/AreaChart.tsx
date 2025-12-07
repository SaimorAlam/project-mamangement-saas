import React, { useState } from 'react';
import { Copy, Trash2 } from 'lucide-react';

interface DataPoint {
  month: string;
  goldex: number;
  oceanic: number;
}

const AreaChart: React.FC = () => {
  const [data] = useState<DataPoint[]>([
    { month: 'Jan', goldex: 750, oceanic: 1000 },
    { month: 'Feb', goldex: 1000, oceanic: 1200 },
    { month: 'Mar', goldex: 800, oceanic: 1150 },
    { month: 'Apr', goldex: 900, oceanic: 1250 },
    { month: 'May', goldex: 850, oceanic: 1300 },
    { month: 'Jun', goldex: 950, oceanic: 1350 },
    { month: 'Jul', goldex: 900, oceanic: 1400 },
    { month: 'Aug', goldex: 1100, oceanic: 1450 },
    { month: 'Sep', goldex: 1000, oceanic: 1500 },
    { month: 'Oct', goldex: 950, oceanic: 1550 },
    { month: 'Nov', goldex: 1050, oceanic: 1600 },
    { month: 'Dec', goldex: 1100, oceanic: 1650 }
  ]);

  const [showLineOnly, setShowLineOnly] = useState(false);

  const chartWidth = 700;
  const chartHeight = 250;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxValue = 1750;
  const minValue = 0;

  // Create path for area chart
  const createPath = (dataKey: 'goldex' | 'oceanic') => {
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * innerWidth;
      const y = innerHeight - ((d[dataKey] - minValue) / (maxValue - minValue)) * innerHeight;
      return { x, y };
    });

    // Line path
    const linePath = points.map((p, i) => 
      `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

    // Area path (fill to bottom)
    const areaPath = [
      ...points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`),
      `L ${points[points.length - 1].x} ${innerHeight}`,
      `L 0 ${innerHeight}`,
      'Z'
    ].join(' ');

    return { linePath, areaPath };
  };

  const goldexPaths = createPath('goldex');
  const oceanicPaths = createPath('oceanic');

  const yTicks = [0, 250, 500, 750, 1000, 1250, 1500, 1750];

  const handleCopy = () => {
    console.log('Copy chart');
  };

  const handleDelete = () => {
    console.log('Delete chart');
  };


  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col  gap-6">
          <h2 className="text-lg font-semibold text-gray-900">Area Chart</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-blue-400" />
              <span className="text-xs text-gray-600">Goldex Inc</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-emerald-400" />
              <span className="text-xs text-gray-600">Oceanic Airlines</span>
            </div>
          </div>
        </div>
        <div className="">
          
            <div className='flex items-center gap-4 mb-2'>
                <button
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Copy"
            >
            <Copy size={18} />
            </button>
             <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Delete"
                >
                <Trash2 size={18} />
            </button>
          </div>
          <button
            onClick={() => setShowLineOnly(!showLineOnly)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
          >
            {showLineOnly ? 'Show Area' : 'Show Line Only'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {/* Y-axis grid lines and labels */}
            {yTicks.map((tick) => {
              const y = innerHeight - ((tick - minValue) / (maxValue - minValue)) * innerHeight;
              return (
                <g key={tick}>
                  <line
                    x1={0}
                    y1={y}
                    x2={innerWidth}
                    y2={y}
                    stroke="#f3f4f6"
                    strokeWidth="1"
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

            {/* Area fills */}
            {!showLineOnly && (
              <>
                <path
                  d={oceanicPaths.areaPath}
                  fill="#6ee7b7"
                  fillOpacity="0.3"
                  className="transition-all duration-500"
                />
                <path
                  d={goldexPaths.areaPath}
                  fill="#93c5fd"
                  fillOpacity="0.4"
                  className="transition-all duration-500"
                />
              </>
            )}

            {/* Lines */}
            <path
              d={oceanicPaths.linePath}
              fill="none"
              stroke="#34d399"
              strokeWidth="2"
              className="transition-all duration-500"
            />
            <path
              d={goldexPaths.linePath}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="2"
              className="transition-all duration-500"
            />

            {/* X-axis labels */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * innerWidth;
              return (
                <text
                  key={i}
                  x={x}
                  y={innerHeight + 25}
                  textAnchor="middle"
                  className="text-xs fill-gray-400"
                >
                  {d.month}
                </text>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default AreaChart;