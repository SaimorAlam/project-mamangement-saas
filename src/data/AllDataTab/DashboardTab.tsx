import ProgressChart from "@/components/client/common/Charts/Progress";
import ProjectCostChart from "@/components/client/common/Charts/ProjectCost";
import ProjectInformation from "@/components/client/common/Charts/ProjectInfo";
import EmployeeWorkloadChart from "@/components/client/common/Charts/WorkLoad";
import TaskStatusChart from "@/components/client/common/Charts/ProgressRing";

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
