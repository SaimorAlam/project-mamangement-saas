/* eslint-disable @typescript-eslint/no-explicit-any */
import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { useGetStaffEmployeeTopOverDueQuery } from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";
import { Spinner } from "@/components/ui/spinner";

const OverDueChart = () => {
  // Initialize with default structure to ensure chart renders
  const [overDueChartData, setOverDueChartData] = useState<{
    series: { name: string; data: number[] }[];
    options: any;
  }>({
    series: [],
    options: {},
  });

  const {
    data: overdueData,
    isLoading: overdueLoading,
    error: overdueError,
  } = useGetStaffEmployeeTopOverDueQuery({});

  const overDueDataList = overdueData?.data?.projects || [];

  useEffect(() => {
    if (!overDueDataList || overDueDataList.length === 0) {
      // Reset to empty state if no data
      setOverDueChartData((prev) => ({
        ...prev,
        series: [{ name: "Overdue Days", data: [] }],
        options: {
          ...prev.options,
          xaxis: { categories: [] },
          colors: [],
        },
      }));
      return;
    }

    const categories = overDueDataList.map(
      (item: any) => item.name || "Unnamed Project"
    );

    const values = overDueDataList.map(
      (item: any) => item.overdueDays
    );

    const colors = overDueDataList.map((item: any) => {
      const priority = item.priority?.toLowerCase() || "";
      if (priority === "high") return "#DA4352";
      if (priority === "medium") return "#FF974B";
      if (priority === "low") return "#F5B31A";
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
        colors: colors,
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
          categories: categories,
          labels: {
            style: {
              colors: "#666",
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          labels: {
            style: {
              colors: "#666",
              fontSize: "12px",
              fontWeight: 500,
            },
          },
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
        grid: {
          borderColor: "#f1f1f1",
        },
      },
    });
  }, [overDueDataList]);

  const getErrorMessage = (err: any) => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;
    if (err?.data?.message) return err.data.message;
    if (err?.error) return err.error;
    try {
      return JSON.stringify(err);
    } catch (e) {
      return "An error occurred while fetching overdue projects";
    }
  };

  // Check if we have valid data to display
  const hasChartData =
    overDueChartData.series?.[0]?.data?.length > 0 &&
    overDueChartData.options?.xaxis?.categories?.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      {overdueLoading && (
        <div className="flex items-center justify-center h-40">
          <Spinner />
        </div>
      )}

      {overdueError && (
        <div className="text-center text-sm text-red-600 py-6">
          {getErrorMessage(overdueError)}
        </div>
      )}

      {!overdueLoading && !overdueError && !hasChartData && (
        <div className="text-center text-sm text-gray-500 py-6">
          No overdue data to display
        </div>
      )}

      {!overdueLoading &&
        !overdueError &&
        (!overDueChartData.series ||
          overDueChartData.series.length === 0 ||
          overDueChartData.series[0].data.length === 0) && (
          <div className="text-center text-sm text-gray-500 py-6">
            Yet no overdue projects.
          </div>
        )}

      {!overdueLoading &&
        !overdueError &&
        overDueChartData.series &&
        overDueChartData.series.length > 0 && (
          <Chart
            options={overDueChartData.options}
            series={overDueChartData.series}
            type="bar"
            height={350}
          />
        )}
    </div>
  );
};

export default OverDueChart;
