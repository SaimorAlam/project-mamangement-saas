// import GanttChartNew from "@/common/Charts/GanttChart/GanttChartNew";
import React from "react";
// import SvarGanttChart from "@/common/Charts/SvarGanttChart";
import GanttChart from "@/common/Charts/GanttChart/GanttChart";
// import BasicInit from "@/common/Charts/GanttChart/BasicGanttChart";

const GanttTab: React.FC = () => {
  return (
    <div className="w-full">
      {/* <SvarGanttChart /> */}
      {/* <BasicInit /> */}
      <GanttChart />
      {/* <GanttChartNew /> */}
    </div>
  );
};

export default GanttTab;
