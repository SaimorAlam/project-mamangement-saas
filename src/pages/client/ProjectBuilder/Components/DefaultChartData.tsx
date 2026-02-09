/* eslint-disable @typescript-eslint/no-explicit-any */
import StackedBarChart from "@/common/Charts/StackedBarChart";

const DefaultChartData = ({ projectsChartsData }: any) => {
  return (
    <div className="flex flex-wrap gap-6">
      {projectsChartsData
        ?.filter((item: any) => item.parentId === null)
        .map((item: any) => {
          if (item.category === "Bar" || item.category === "BAR") {
            return (
              <div key={item.id} className="w-full">
                <StackedBarChart
                  widgetTitle={item?.title}
                  xAxisValues={item?.xAxis?.labels || []}
                  legendValues={
                    item?.barChart?.widgets?.map((w: any) => ({
                      label: w.legendName,
                      color: w.color,
                      field: w.legendName.toLowerCase().replace(/\s+/g, ""),
                    })) || []
                  }
                  widgets={item?.barChart?.widgets}
                  numOfLegendDataSet={item?.barChart?.numberOfDataset}
                  startingRange={item?.barChart?.firstFiledDataset}
                  endingRange={item?.barChart?.lastFiledDAtaset}
                  chartId={item?.id}
                  projectId={item?.projectId}
                />
              </div>
            );
          }
        })}
    </div>
  );
};

export default DefaultChartData;
