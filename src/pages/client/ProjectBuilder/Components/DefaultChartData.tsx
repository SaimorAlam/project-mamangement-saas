/* eslint-disable @typescript-eslint/no-explicit-any */
import StackedBarChart from "@/common/Charts/StackedBarChart";

const DefaultChartData = ({ projectsChartsData }: any) => {
  return (
    <div className="flex flex-wrap gap-6">
      {projectsChartsData?.map((item: any) => {
        if (item.category === "Bar" || item.category === "BAR") {
          return (
            <div key={item.id} className="w-full">
              <StackedBarChart
                widgetTitle={item.title}
                xAxisValues={item.xAxis?.labels || []}
                legendValues={
                  item.barChart?.widgets?.map((w: any) => ({
                    label: w.legendName,
                    color: w.color,
                    field: w.legendName.toLowerCase().replace(/\s+/g, ""),
                  })) || []
                }
                numOfLegendDataSet={item.numberOfDataset}
                startingRange={item.firstFiledDataset}
                endingRange={item.lastFiledDAtaset}
                // chartId={item.id}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

export default DefaultChartData;
