/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Trash2 } from "lucide-react";

interface RadarDataPoint {
  metric: string;
  thisMonth: number;
  previousMonth: number;
}

interface RadarChartProps {
  onDelete?: () => void;
  onCopy?: (data: any) => void;
}

export default function RadarCharts({ onDelete, onCopy }: RadarChartProps) {
  const [data] = useState<RadarDataPoint[]>([
    { metric: "Bounce Rate", thisMonth: 0.65, previousMonth: 0.55 },
    { metric: "ROI", thisMonth: 0.65, previousMonth: 0.75 },
    {
      metric: "Pages per Session",
      thisMonth: 0.65,
      previousMonth: 0.7,
    },
    {
      metric: "Conversion Rate",
      thisMonth: 0.95,
      previousMonth: 0.85,
    },
    {
      metric: "Average Session Duration",
      thisMonth: 0.65,
      previousMonth: 0.6,
    },
  ]);

  const handleCopy = () => {
    if (onCopy) {
      onCopy(data);
    } else {
      navigator.clipboard.writeText(JSON.stringify(data));
    }
  };

  const handleDelete = () => {
    if (onDelete) onDelete();
  };

  const [centerMetric] = useState({
    label: "Average Session Duration",
    value: "180ms",
  });

  return (
    <Card className="w-full max-w-md border border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Radar Chart
          </CardTitle>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Copy className="w-5 h-5 text-gray-600 " />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
            <span className="text-sm text-gray-600">This Month</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-600">Previous Month</span>
          </div>
        </div>

        <div className="relative">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 1]}
                tick={{ fill: "#6b7280", fontSize: 10 }}
                tickCount={5}
              />
              <Radar
                name="Previous Month"
                dataKey="previousMonth"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.2}
              />
              <Radar
                name="This Month"
                dataKey="thisMonth"
                stroke="#14b8a6"
                fill="#14b8a6"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="text-xs text-gray-500">{centerMetric.label}</div>
            <div className="text-lg font-semibold text-gray-800">
              {centerMetric.value}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
