/* eslint-disable @typescript-eslint/no-explicit-any */
import { DonutChartSkeleton } from "@/common/Skeleton/DonutChartSkeleton";
import { useGetStatusQuery } from "@/store/Api/ClientDashboardApi/ClientDashboardApi";
import { useMemo, useState } from "react";
import Chart from "react-apexcharts";

type Period = "week" | "month" | "quarter" | "year";

interface DonutItem {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

const PERIOD_OPTIONS: Period[] = ["week", "month", "quarter", "year"];

const STATUS_CONFIG = [
  { key: "inProgress", label: "In Progress", color: "#6366F1" },
  { key: "completed", label: "Completed", color: "#10B981" },
  { key: "overdue", label: "Overdue", color: "#EF4444" },
  { key: "notStarted", label: "Not Started", color: "#9CA3AF" },
] as const;

const ProjectStatusDonutChart = () => {
  const [period, setPeriod] = useState<Period>("month");
  const { data, isLoading } = useGetStatusQuery({ period });
  const response = data?.data;
  const donutData: DonutItem[] = useMemo(() => {
    return STATUS_CONFIG.map((cfg) => ({
      label: cfg.label,
      value: response?.stack[cfg.key]?.count ?? 0,
      percentage: response?.stack[cfg.key]?.percentage ?? 0,
      color: cfg.color,
    }));
  }, [response]);

  const series = donutData.map((d) => d.value);

  const options = {
    chart: {
      type: "donut" as const,
    },
    labels: donutData.map((d) => d.label),
    colors: donutData.map((d) => d.color),
    legend: { show: false },
    dataLabels: { enabled: false },
    stroke: {
      width: 4,
      colors: ["#ffffff"],
    },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: 700,
              formatter: () => response.data.totalProjects.toString(),
            },
            total: {
              show: true,
              label: "Total Projects",
              fontSize: "13px",
              formatter: () => response.data.totalProjects.toString(),
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number, ctx: any) =>
          `${val} (${donutData[ctx.seriesIndex]?.percentage}%)`,
      },
    },
  };

  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
  };

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <DonutChartSkeleton />
      ) : (
        <div className="rounded-xl w-full h-full grid border border-gray-200 bg-white p-5 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-2xl">Project Status</h3>

            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value as Period)}
              className="border rounded px-3 py-1 text-sm"
            >
              {PERIOD_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  This {p}
                </option>
              ))}
            </select>
          </div>

          {/* Chart */}
          <div className="place-self-center">
            <Chart
              options={options}
              series={series}
              type="donut"
              height={280}
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {donutData.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-gray-600">{item.label}</span>
                <span className="ml-auto font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStatusDonutChart;
