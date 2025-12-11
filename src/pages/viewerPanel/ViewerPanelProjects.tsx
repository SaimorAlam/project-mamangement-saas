import CostOverview from "@/common/Charts/CostOverview";
import PhasePlan from "@/common/Charts/PhasePlan";
import ProgressChart from "@/common/Charts/Progress";
import ProgressRing from "@/common/Charts/ProgressRing";
import ProjectCostChart from "@/common/Charts/ProjectCost";
import ProjectInformation from "@/common/Charts/ProjectInfo";
import EmployeeWorkloadChart from "@/common/Charts/WorkLoad";

const ViewerPanelProjects = () => {
  return (
    <div>
      <div className="flex gap-6">
        <ProjectInformation />
        <ProgressRing />
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
export default ViewerPanelProjects;
