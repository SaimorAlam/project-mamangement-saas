// import GanttChartNew from "@/common/Charts/GanttChart/GanttChartNew";
// import SvarGanttChart from "@/common/Charts/SvarGanttChart";
import GanttChart from "@/common/Charts/GanttChart/GanttChart";
// import BasicInit from "@/common/Charts/GanttChart/BasicGanttChart";

// import GanttChart from "@/common/Charts/GanttChart/ModifiedGanttChart";
// import { tasks, links } from "@/common/Charts/GanttChart/demoData";

const GanttTab = () => {
  return (
    <div className="w-full h-full">
      {/* <SvarGanttChart /> */}
      {/* <BasicInit /> */}
      <GanttChart />
      {/* <GanttChartNew /> */}
      {/* <ModifiedGanttChart /> */}
      <div className="h-[70vh] w-full">
        {/* <GanttChart tasks={tasks} links={links} /> */}
      </div>
    </div>
  );
};

export default GanttTab;
