/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import BoxContainer from "@/common/BoxContainer";

const ApexBarChart = () => {
  const [chartData, setChartData] = useState<any>({
    series: [],
    options: {},
  });

  // ✅ simulate dynamic data loading (you can replace with API or JSON file)
  useEffect(() => {
    const fetchData = async () => {
      const data = [
        {
          name: "Customer Feedback Report",
          value: 37,
          level: "Critical",
        },
        {
          name: "Sales Forecast Revision",
          value: 33,
          level: "Critical",
        },
        { name: "Product Launch Plan", value: 27, level: "Critical" },
        {
          name: "Marketing Budget Review",
          value: 23,
          level: "Medium",
        },
        { name: "Website Redesign", value: 18, level: "Low" },
      ];

      // map categories + values
      const categories = data.map((item) => item.name);
      const values = data.map((item) => item.value);

      // color coding by level
      const colors = data.map((item) => {
        if (item.level === "Critical") return "#DA4352";
        if (item.level === "Medium") return "#FF974B";
        if (item.level === "Low") return "#F5B31A";
        return "#888";
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
              distributed: true, // ✅ different colors per bar
            },
          },
          colors,
          dataLabels: {
            enabled: true,
            formatter: (val: number) => `${val}d`, // ✅ show "d"
            style: {
              colors: ["#FFF"],
              fontSize: "13px",
              fontWeight: "500",
            },
            textAnchor: "start",
            offsetX: 0,
          },
          xaxis: {
            categories,
            labels: {
              style: { fontSize: "13px" },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "13px",
                fontWeight: 500,
                white_space: "normal",
                text_wrap: "wrap",
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
    };

    fetchData();
  }, []);

  return (
    <BoxContainer>
      <h2 className="text-2xl font-semibold mb-4">Top Overdue: 25 Project</h2>
      {chartData.series.length > 0 && (
        <Chart
          className=""
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
