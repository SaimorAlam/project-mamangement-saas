/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import BoxContainer from "@/common/BoxContainer";
import { useGetTopOverdueProjectsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import { Loader2 as Loader } from "lucide-react";

const ApexBarChart = () => {
  const [chartData, setChartData] = useState<any>({
    series: [],
    options: {},
  });

  const { data, isLoading, error } = useGetTopOverdueProjectsQuery({});

  useEffect(() => {
    if (!data?.data || data.data.length === 0) return;

    const categories = data.data.map((item: any) => item.projectName);
    const values = data.data.map((item: any) => item.overdueDays);

    const colors = data.data.map((item: any) => {
      if (item.priority === "High") return "#DA4352";
      if (item.priority === "Medium") return "#FF974B";
      if (item.priority === "Low") return "#F5B31A";
      return "#888";
    });

    setChartData({
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
  }, [data]);

  if (isLoading) {
    return (
      <BoxContainer>
        <Loader className="animate-spin" />
      </BoxContainer>
    );
  }

  if (error) {
    return (
      <BoxContainer>
        <div className="text-gray-400">
          Failed to load overdue projects
        </div>
      </BoxContainer>
    );
  }

  return (
    <BoxContainer>
      <h2 className="text-2xl font-semibold mb-4">
        Top Overdue Projects
      </h2>

      {chartData.series.length > 0 && (
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      )}
    </BoxContainer>
  );
};

export default ApexBarChart;
