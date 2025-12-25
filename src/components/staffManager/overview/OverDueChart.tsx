/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Chart from "react-apexcharts";
import { useState, useEffect } from "react";
import { useGetTopOverdueProjectsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import { Spinner } from "@/components/ui/spinner";

const OverDueChart = () => {
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
  } = useGetTopOverdueProjectsQuery({});

  useEffect(() => {
    if (!overdueData?.data || overdueData.data.length === 0) {
      setOverDueChartData({ series: [], options: {} });
      return;
    }

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
