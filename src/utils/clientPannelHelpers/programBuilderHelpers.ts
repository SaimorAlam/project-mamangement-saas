import { ChartData } from "@/common/Charts/StackedBarChart";
import { LegendValue } from "@/components/client/ProjectBuilder/ProjectConfiguration";

export const handleDownloadCSV = (csvTemplate : string, widgetTitle: string) => {
    const blob = new Blob([csvTemplate], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${widgetTitle}-template.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

const getRandomValue = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// generating stacked bar chart random data
export const generateChartData = (
  xAxis: string[],
  legend: LegendValue[],
  numOfLegendDataSet: number,
  min: number,
  max: number,
): ChartData[] => {
  return xAxis.map((label) => {
    const item: ChartData = { name: label };

    legend.forEach((l) => {
      const r =Math.floor(getRandomValue(min, max)/numOfLegendDataSet);
      console.log("numOfLegendDataSet: ", numOfLegendDataSet);
      console.log("Random number generated: ", r);
      
      item[l.field] = r;
    });

    return item;
  });
};

export const generateLineChartData = (
  xAxis: string[],
  legend: LegendValue[],
  min = 0,
  max = 100
) => {
  return xAxis.map(label => {
    const row: any = { name: label }

    legend.forEach(l => {
      row[l.field] =
        Math.floor(Math.random() * (max - min + 1)) + min
    })

    return row
  })
}
