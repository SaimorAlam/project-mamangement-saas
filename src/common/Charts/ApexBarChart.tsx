/* eslint-disable @typescript-eslint/no-explicit-any */
import Chart from "react-apexcharts";

const ApexBarChart = (chartData: {
  series: { name: string; data: number[] }[];
  options: any;
}) => {
  return (
    <Chart
      options={chartData.options}
      series={chartData.series}
      type="bar"
      height={350}
    />
  );
};

export default ApexBarChart;
