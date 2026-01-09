import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import DropdownSelect from "@/common/DropdownSelect";

export interface ProjectStatus {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ProjectStatusData {
  totalProjects: number;
  statuses: ProjectStatus[];
}

const chartData = {
  totalProjects: 520,
  statuses: [
    {
      name: "In Progress",
      value: 338,
      percentage: 65,
      color: "#8B5CF6",
    },
    {
      name: "Completed",
      value: 73,
      percentage: 14,
      color: "#10B981",
    },
    {
      name: "Overdue",
      value: 68,
      percentage: 13,
      color: "#EF4444",
    },
    {
      name: "Not Started",
      value: 41,
      percentage: 8,
      color: "#9CA3AF",
    },
  ],
};

const ApexDonutChart = () => {
  const [data, setData] = useState<ProjectStatus[]>([]);
  const [sortBy, setSortBy] = useState("");
  useEffect(() => {
    if (chartData) {
      setData(chartData.statuses as ProjectStatus[]);
    }
  }, []);

  const chartOptions = {
    chart: {
      type: "donut" as const,
      height: 280,
      toolbar: {
        show: false,
      },
    },
    colors: data.map((status) => status.color),
    labels: data.map((status) => status.name),
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1f2937",
              formatter: () => chartData.totalProjects.toString(),
            },
            total: {
              show: true,
              label: "Total Project",
              fontSize: "14px",
              color: "#6b7280",
              formatter: () => chartData.totalProjects.toString(),
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
          return `${value} (${data[seriesIndex].percentage}%)`;
        },
      },
    },
  };

  const series = data.map((status) => status.value);
  const dropdownItem = [
    { value: "this-week", title: "This Week" },
    { value: "this-month", title: "This Month" },
    { value: "this-quarter", title: "This Quarter" },
    { value: "this-year", title: "This Year" },
  ];

  const handleChange = (e: string) => {
    setSortBy(e);
    console.log(sortBy);
  };
  return (
    <Card className="w-full border-[#E2E8F0] shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-7">
        <h4 className=" font-semibold">Project Status</h4>
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
            {data.map((status, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-muted-foreground">{status.name}</span>
                <span className="font-medium ml-auto">
                  {status.percentage}%
                </span>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="relative">
            <Chart
              options={chartOptions}
              series={series}
              type="donut"
              height={280}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApexDonutChart;
