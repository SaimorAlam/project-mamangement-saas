/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import BoxContainer from "@/common/BoxContainer";
import { useGetOverdueQuery } from "@/store/Api/ClientDashboardApi/ClientDashboardApi";

const ProjectOverdueBarChart = () => {
  const { data, isLoading } = useGetOverdueQuery({});
  const [chartData, setChartData] = useState<any>({
    series: [],
    options: {},
  });

  useEffect(() => {
    if (!data?.data?.projects) return;

    // Map API data
    const projects = data.data.projects;
    const categories = projects.map((p: any) => p.name);
    const values = projects.map((p: any) => Number(p.overdueDays));

    const colors = projects.map((p: any) => {
      if (p.overdueDays > 90) return "#DA4352"; // Critical
      if (p.overdueDays > 30) return "#FF974B"; // Medium
      return "#F5B31A"; // Low
    });

    setChartData({
      series: [{ data: values }],

      options: {
        chart: {
          type: "bar" as const,
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
          style: { colors: ["#FFF"], fontSize: "13px", fontWeight: "500" },
          textAnchor: "start",
          offsetX: 0,
        },
        xaxis: {
          categories,
          labels: { style: { fontSize: "13px" } },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: "13px",
              fontWeight: 500,
            },
          },
        },
        legend: {
          show: true,
          markers: {
            shape: "circle",
            fillColors: ["#F5B31A", "#FF974B", "#DA4352"],
          },
          position: "top",
          horizontalAlign: "left",
          customLegendItems: ["Low", "Medium", "Critical"],
        },
        tooltip: {
          y: {
            formatter: (val: number) => `${val} days overdue`,
          },
        },
      },
    });
  }, [data]);

  return (
    <BoxContainer>
      <h2 className="text-2xl font-semibold mb-4">Top Overdue Projects</h2>

      {isLoading || chartData.series.length === 0 ? (
        <div className="w-full h-[350px] bg-gray-100 animate-pulse rounded-md" />
      ) : (
        <div className="">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
          />
        </div>
      )}
    </BoxContainer>
  );
};

export default ProjectOverdueBarChart;
