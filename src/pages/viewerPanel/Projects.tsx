import CostOverview from "@/components/Charts/CostOverview";
import PhasePlan from "@/components/Charts/PhasePlan";
import ProgressChart from "@/components/Charts/Progress";
import TaskStatusChart from "@/components/Charts/ProgressRing";
import ProjectCostChart from "@/components/Charts/ProjectCost";
import ProjectInformation from "@/components/Charts/ProjectInfo";
import EmployeeWorkloadChart from "@/components/Charts/WorkLoad";

const Projects = () => {
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
      <div>
        <div className="flex gap-6 mt-6">
          <CostOverview />
          <PhasePlan />
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <img src="man.png" alt="Not Found" />
      </div>
    </div>
  );
};
export default Projects;
