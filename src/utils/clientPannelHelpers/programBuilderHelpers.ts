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

const getRandomValue = (min = 0, max = 100) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateChartData = (
  xAxis: string[],
  legend: LegendValue[],
  min: number = 0,
  max: number = 100,
): ChartData[] => {
  return xAxis.map((label) => {
    const item: ChartData = { name: label };

    legend.forEach((l) => {
      item[l.field] = getRandomValue(min, max);
    });

    return item;
  });
};