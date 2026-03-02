/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Sparklines,
  SparklinesLine,
  SparklinesSpots,
  SparklinesReferenceLine,
} from "react-sparklines";
import BaseChartContainer from "./CompletedCharts/Common/BaseChartContainer";
import {
  BaseChartProps,
  LegendValue,
} from "./CompletedCharts/Common/chartTypes";
import {
  parseCommonChartData,
  generateHeatmapChartData,
} from "./CompletedCharts/Common/chartUtils";

export default function SparkLinesChart(props: BaseChartProps) {
  const getTierLegends = (tier: any): LegendValue[] => {
    return (
      tier.widgets?.map((w: any) => ({
        label: w.legendName || w.label,
        color: w.color || "#13A490",
        field: (w.legendName || w.label)?.toLowerCase().replace(/\s+/g, ""),
      })) || []
    );
  };

  const parseTierData = (xAxis: any, legends: LegendValue[], title: string) => {
    return parseCommonChartData(xAxis, legends, title);
  };

  const renderChildChart = (tier: any, childProps: any) => (
    <SparkLinesChart {...childProps} key={tier.id} />
  );

  return (
    <BaseChartContainer
      {...props}
      category="SPARKLINE"
      excelType="sparklineChart"
      generatorFunc={generateHeatmapChartData}
      getTierLegends={getTierLegends}
      parseTierData={parseTierData}
      renderChildChart={renderChildChart}
    >
      {({ chartData, effectiveLegendValues }) => (
        <div className="w-full h-[400px] flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
          {effectiveLegendValues.map((legend) => {
            // Extract numbers for this legend field across all data points
            const dataPoints = chartData.map((d) => Number(d[legend.field]) || 0);

            return (
              <div 
                key={legend.field} 
                className="flex-1 flex flex-col min-h-[140px] bg-gray-50/40 rounded-xl p-4 border border-gray-100/60 transition-all hover:bg-gray-50/60 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: legend.color }}
                    />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.1em]">
                      {legend.label}
                    </span>
                  </div>
                  {dataPoints.length > 0 && (
                    <div className="flex flex-col items-end">
                       <span className="text-[9px] font-bold text-gray-300 uppercase leading-none mb-1">Latest Point</span>
                       <span className="text-base font-mono font-black tracking-tight" style={{ color: legend.color }}>
                         {dataPoints[dataPoints.length - 1]}
                       </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 w-full relative min-h-0">
                  <Sparklines data={dataPoints} margin={5} height={60}>
                    <SparklinesLine
                      color={legend.color}
                      style={{ 
                        strokeWidth: 3, 
                        stroke: legend.color,
                        fill: `${legend.color}10`,
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round'
                      }}
                    />
                    <SparklinesSpots size={4} />
                    <SparklinesReferenceLine 
                      type="avg" 
                      style={{ stroke: '#94a3b8', strokeDasharray: '6, 4', opacity: 0.6 }} 
                    />
                  </Sparklines>
                </div>
              </div>
            );
          })}
          {chartData.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              No trend data available
            </div>
          )}
        </div>
      )}
    </BaseChartContainer>
  );
}
