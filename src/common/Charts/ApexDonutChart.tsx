import Chart from "react-apexcharts";

interface ChartDataProps {
  chartData: {
    chartOptions: any;
    series: any;
  };
}

const ApexDonutChart = ({ chartData }: ChartDataProps) => {
  return (
    <Chart
      options={chartData.chartOptions}
      series={chartData.series}
      type="donut"
      height={280}
    />
  );
};

export default ApexDonutChart;
