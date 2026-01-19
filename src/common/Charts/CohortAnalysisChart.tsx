/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, LineChart as LineIcon } from "lucide-react";
import { downloadCSVForModuleOne } from "@/utils/DownlaodChartCSV";
import ChartCardWrapper from "./components/ChartCardWrapper";

/*     TYPES     */

type LegendValue = {
  label: string;
  field: string;
  color: string;
};

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[]; // Periods (e.g., Month 1, Month 2...)
  legendValues?: LegendValue[]; // Cohorts (e.g., Jan Batch, Feb Batch...)
  numOfLegendDataSet?: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  chartType?: "line" | "bar";
  isPreview?: boolean;
};

/*     COMPONENT     */

export default function CohortAnalysisChart({
  widgetTitle = "Cohort Survival Analysis",
  xAxisValues = ["Month 0", "Month 1", "Month 2", "Month 3", "Month 4"],
  legendValues = [
    { label: "Q1 Cohort", field: "q1", color: "#6366f1" },
    { label: "Q2 Cohort", field: "q2", color: "#10b981" },
    { label: "Q3 Cohort", field: "q3", color: "#f59e0b" },
  ],
  onToggleWidget,
  onDelete,
  chartType: initialType = "line",
  isPreview = false,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [type, setType] = useState<"line" | "bar">(initialType);


  /*   DATA GENERATION (Simulation)   */
  const chartData = useMemo(() => {
    return xAxisValues.map((period, pIdx) => {
      const entry: any = { name: period };
      legendValues.forEach((cohort) => {
        // Survival decay simulation: Starts at 100%, drops over time
        const decay = Math.max(0, 100 - (pIdx * (10 + Math.random() * 15)));
        entry[cohort.field] = Math.round(decay);
      });
      return entry;
    });
  }, [xAxisValues, legendValues]);

  /*   ACTIONS   */
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
  };

  const handleDownload = () => {
    setIsDownloading(true);
    downloadCSVForModuleOne(widgetTitle, xAxisValues, legendValues);
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
      customHeaderContent={
        <div className="flex gap-4">
           <button 
              onClick={() => setType("line")}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${type === 'line' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
           >
              <LineIcon size={14} /> Line
           </button>
           <button 
              onClick={() => setType("bar")}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${type === 'bar' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
           >
              <BarChart3 size={14} /> Bar
           </button>
        </div>
      }
      footer={
        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
            <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Avg. Retention</p>
                <p className="text-xl font-semibold text-blue-600">74.2%</p>
            </div>
            <div className="text-center border-x border-gray-100 px-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Churn Rate</p>
                <p className="text-xl font-semibold text-red-500">25.8%</p>
            </div>
            <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">LTV Forecast</p>
                <p className="text-xl font-semibold text-green-600">$1,240</p>
            </div>
        </div>
      }
    >
      {/* CHART */}
      <div className="h-[350px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          {type === "line" ? (
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              {legendValues.map((l) => (
                <Line
                  key={l.field}
                  type="monotone"
                  dataKey={l.field}
                  name={l.label}
                  stroke={l.color}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} iconType="rect" />
              {legendValues.map((l) => (
                <Bar
                  key={l.field}
                  dataKey={l.field}
                  name={l.label}
                  fill={l.color}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </ChartCardWrapper>
  );
}
