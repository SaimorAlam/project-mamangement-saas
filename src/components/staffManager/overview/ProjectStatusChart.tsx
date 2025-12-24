import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DropdownSelect from "@/common/DropdownSelect";
import { useGetSubmissionStatusQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import ApexDonutChart from "@/common/Charts/ApexDonutChart";
import Chart from "react-apexcharts";

import { useMemo, useState } from "react";

export interface ProjectStatus {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const STATUS_COLOR_MAP: Record<string, string> = {
  submitted: "#8B5CF6",
  live: "#10B981",
  returned: "#F59E0B",
  overdue: "#EF4444",
};

const STATUS_LABEL_MAP: Record<string, string> = {
  submitted: "Submitted",
  live: "Live",
  returned: "Returned",
  overdue: "Overdue",
};

export default function ProjectStatusChart() {
  const [, setSortBy] = useState("");

  const { data: submissionData, isLoading: submissionLoading } =
    useGetSubmissionStatusQuery({});

  const submissionChartData = useMemo(() => {
    if (!submissionData?.data) {
      return {
        total: 0,
        statuses: [],
      };
    }

    const { total, counts, percentages } = submissionData.data;

    const statuses: ProjectStatus[] = Object.keys(counts).map(
      (key) => ({
        name: STATUS_LABEL_MAP[key],
        value: counts[key as keyof typeof counts],
        percentage: percentages[key as keyof typeof percentages],
        color: STATUS_COLOR_MAP[key],
      })
    );

    return {
      total,
      statuses,
    };
  }, [submissionData]);

  const chartOptions = {
    chart: {
      type: "donut" as const,
      height: 280,
      toolbar: { show: false },
    },
    colors: submissionChartData.statuses.map(
      (status) => status.color
    ),
    labels: submissionChartData.statuses.map((status) => status.name),
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1f2937",
              formatter: () => submissionChartData.total.toString(),
            },
            total: {
              show: true,
              label: "Total Project",
              fontSize: "14px",
              color: "#6b7280",
              formatter: () => submissionChartData.total.toString(),
            },
          },
        },
      },
    },
    stroke: {
      width: 5,
      color: ["#fff"],
    },
    tooltip: {
      y: {
        formatter: (
          value: number,
          { seriesIndex }: { seriesIndex: number }
        ) => {
          const status = submissionChartData.statuses[seriesIndex];
          return `${value} (${status?.percentage ?? 0}%)`;
        },
      },
    },
  };

  const series = submissionChartData.statuses.map(
    (status) => status.value
  );

  const dropdownItem = [
    { value: "this-week", title: "This Week" },
    { value: "this-month", title: "This Month" },
    { value: "this-quarter", title: "This Quarter" },
    { value: "this-year", title: "This Year" },
  ];

  const handleChange = (e: string) => {
    setSortBy(e);
  };

  return (
    <Card className="w-full border-[#E2E8F0] shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-7">
        <h4 className="font-semibold">Project Status</h4>
        <DropdownSelect
          placeholderText="Sort By"
          dropdownItem={dropdownItem}
          onChange={handleChange}
        />
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {submissionChartData.statuses.map((status, index) => (
              <div
                key={index}
                className="flex items-center space-x-2"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: status.color,
                  }}
                />
                <span className="text-muted-foreground">
                  {status.name}
                </span>
                <span className="font-medium ml-auto">
                  {status.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="relative">
            {!submissionLoading && (
              <Chart
                options={chartOptions}
                series={series}
                type="donut"
                height={280}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
