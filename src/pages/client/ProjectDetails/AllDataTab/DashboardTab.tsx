import ProgressChart from "@/common/Charts/Progress";
import ProjectCostChart from "@/common/Charts/ProjectCost";
import ProjectInformation from "@/common/Charts/ProjectInfo";
import EmployeeWorkloadChart from "@/common/Charts/WorkLoad";
import TaskStatusChart from "@/common/Charts/ProgressRing";

const DashboardTab = () => {
  return (
    <div>
      <div className="flex gap-6">
        <ProjectInformation />
        <TaskStatusChart />
        <EmployeeWorkloadChart />
      </div>
      <div className="flex gap-6 mt-6">
        <ProgressChart />
        <ProjectCostChart />
      </div>
      <div className="flex justify-end mt-6">
        <img src="/man.png" alt="Not Found" />
      </div>
    </div>
  );
};

export default DashboardTab;
