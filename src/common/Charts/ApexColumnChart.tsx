import { ApexOptions } from "apexcharts";
import { useState } from "react";
import Chart from "react-apexcharts";
import BoxContainer from "@/common/BoxContainer";
interface ApexColumnChartState {
  series: {
    name: string;
    data: number[];
  }[];
  options: ApexOptions;
}
const ApexColumnChart = () => {
  const [state] = useState<ApexColumnChartState>({
    series: [
      {
        name: "Completion Time",
        data: [30, 60, 58, 149, 98, 118, 200, 152, 78, 120],
      },
      {
        name: "Saved Time",
        data: [16, 0, 0, 7, 98, 0, 0, 44, 78, 0],
      },
      {
        name: "Overdue Time",
        data: [0, 16, 58, 0, 0, 118, 36, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        type: "bar" as const,
        height: 350,
        stacked: true,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4, // rounded corners
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
          columnWidth: "50%", // slimmer columns
        },
      },
      dataLabels: {
        enabled: false, // hide inside labels for cleaner look
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Project Name",
          "Project Name",
          "Project Name",
          "Project Name",
          "Project Name",
          "Project Name",
          "Project Name",
          "Project Name",
          "Project Name",
          "Project Name",
        ],
        labels: {
          style: {
            fontSize: "13px",
            fontWeight: 500,
          },
        },
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
        position: "top",
        horizontalAlign: "left",
        markers: { shape: "circle" },
        fontSize: "13px",
        fontWeight: 500,
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical", // 'vertical' or 'horizontal'
          shadeIntensity: 0.4,
          gradientToColors: ["#B09FFF"], // End color
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100], // 0% → start, 100% → end
        },
      },
      colors: ["#8D79F6", "#169E7B", "#DA4352"], // Start color
      tooltip: {
        y: {
          formatter: (val: number) => `${val} units`,
        },
      },
    },
  });

  return (
    <BoxContainer>
      <h2 className="text-2xl font-semibold mb-4">Project Timeline</h2>
      <Chart
        options={state.options}
        series={state.series}
        type="bar"
        height={350}
      />
    </BoxContainer>
  );
};

export default ApexColumnChart;
