import AllProgramProject from "@/components/client/Overview/AllProgramProject";
import UpcomingDeadline from "@/components/client/Overview/UpcomingDeadline";
import ActivityLog from "@/components/client/Overview/ActivityLog";
import ApexDonutChart from "@/common/Charts/ApexDonutChart";
import LatestSubmission from "@/components/client/Overview/LatestSubmission";
import ApexBarChart from "@/common/Charts/ApexBarChart";
import ApexColumnChart from "@/common/Charts/ApexColumnChart";
import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";
import {
  useGetStaffEmpStateCartsQuery,
  useGetSubmissionStatusQuery,
  useGetTopOverdueProjectsQuery,
} from "@/store/Api/staffManagerApi/StaffManagerApi";
import { useEffect, useMemo, useState } from "react";
import BoxContainer from "@/common/BoxContainer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DropdownSelect from "@/common/DropdownSelect";

const clientData = [
  {
    title: "Total Assigned Project",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "",
    link_text: "View all",
    icon: "FolderIcon",
    icon_bg_color: "#069576",
  },
  {
    title: "Submitted for Review",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "",
    link_text: "View all",
    icon: "FolderIcon",
    icon_bg_color: "#069576",
  },
  {
    title: "Returned for Edit",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "",
    link_text: "View all",
    icon: "LiveProject",
    icon_bg_color: "#756CF5",
  },
  {
    title: "In live",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "",
    link_text: "View all",
    icon: "ProjectInDraft",
    icon_bg_color: "#4881FF",
  },
  {
    title: "Submission Overdue",
    value: 0,
    growth: null,
    growth_type: "down",
    description: "",
    link_text: "View all",
    icon: "SubmissionOverdue",
    icon_bg_color: "#DA4352",
  },
];

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

const StaffManagerOverview = () => {
  const [overDueChartData, setOverDueChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: any;
  }>({
    series: [],
    options: {},
  });
  const [, setSortBy] = useState("");

  const {
    data: staffData,
    isLoading: staffLoading,
    error: staffError,
  } = useGetStaffEmpStateCartsQuery("");

  const {
    data: overdueData,
    isLoading: overdueLoading,
    error: overdueError,
  } = useGetTopOverdueProjectsQuery({});

  const { data: submissionData, isLoading: submissionLoading } =
    useGetSubmissionStatusQuery({});

  useEffect(() => {
    if (!overdueData?.data || overdueData.data.length === 0) return;

    const categories = overdueData.data.map(
      (item: any) => item.projectName
    );
    const values = overdueData.data.map(
      (item: any) => item.overdueDays
    );
    const colors = overdueData.data.map((item: any) => {
      if (item.priority === "High") return "#DA4352";
      if (item.priority === "Medium") return "#FF974B";
      if (item.priority === "Low") return "#F5B31A";
      return "#888";
    });

    setOverDueChartData({
      series: [
        {
          name: "Overdue Days",
          data: values,
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 4,
            borderRadiusApplication: "end",
            distributed: true,
          },
        },
        colors,
        dataLabels: {
          enabled: true,
          formatter: (val: number) => `${val}d`,
          style: {
            colors: ["#FFF"],
            fontSize: "13px",
            fontWeight: "500",
          },
        },
        xaxis: {
          categories,
        },
        legend: {
          show: true,
          position: "top",
          horizontalAlign: "left",
          customLegendItems: ["Low", "Medium", "High"],
          markers: {
            fillColors: ["#F5B31A", "#FF974B", "#DA4352"],
          },
        },
        tooltip: {
          y: {
            formatter: (val: number) => `${val} days overdue`,
          },
        },
      },
    });
  }, [overdueData]);

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

  const dashboardData = staffData?.data;

  if (staffLoading || overdueLoading) return <div>Fetching data</div>;
  if (staffError || overdueError)
    return <div>Error during Fetching data</div>;

  const processedDashboardData = clientData.map((item, index) => {
    const apiKeys = [
      "totalAssignedProject",
      "submittedForReview",
      "returnedForEdit",
      "liveProjects",
      "overdueProjects",
    ];

    const apiData = dashboardData?.[apiKeys[index]];

    return {
      ...item,
      value: apiData?.count ?? 0,
      growth: apiData?.growth ?? 0,
    };
  });

  return (
    <div>
      <div className="grid grid-cols-4 gap-6 my-6">
        {processedDashboardData.map((item) => (
          <DashboardPanelStatsCard key={item.title} item={item} />
        ))}
      </div>

      <div className="py-4">
        <AllProgramProject />
      </div>

      <div className="grid grid-cols-3 gap-8 ">
        <div className="space-y-8 col-span-2">
          <div className="flex items-center justify-center gap-8">
            <BoxContainer>
              <h2 className="text-2xl font-semibold mb-4">
                Top Overdue Projects
              </h2>

              {overDueChartData.series.length > 0 && (
                <ApexBarChart {...overDueChartData} />
              )}
            </BoxContainer>

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
                    {submissionChartData.statuses.map(
                      (status, index) => (
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
                      )
                    )}
                  </div>

                  {/* Chart */}
                  <div className="relative">
                    {!submissionLoading && <ApexDonutChart chartData={{ chartOptions, series }} />}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <LatestSubmission />
          <ApexColumnChart />
        </div>
        <div className="space-y-8">
          <UpcomingDeadline />
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};
export default StaffManagerOverview;
