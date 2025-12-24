import CostOverview from "@/common/Charts/CostOverview";
import PhasePlan from "@/common/Charts/PhasePlan";
import ProgressChart from "@/common/Charts/Progress";
import ProgressRing from "@/common/Charts/ProgressRing";
import ProjectCostChart from "@/common/Charts/ProjectCost";
import ProjectInformation from "@/common/Charts/ProjectInfo";
import EmployeeWorkloadChart from "@/common/Charts/WorkLoad";
import ViewerPanelSkeleton from "@/common/Skeleton/ViewerPanelSkeleton";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { useLocation } from "react-router-dom";
const ViewerPanelProjects = () => {
  const location = useLocation();
  console.log(location);
  const { id } = location.state || {};

  const { data, isLoading } = useGetProjectByIdQuery(id, { skip: !id });
  const projectData = data?.data?.project;

  return (
    <div className="">
      {!id ? (
        <div className="text-center text-4xl font-semibold text-gray-200 grid place-content-center h-[calc(80vh-100px)]">
          No Project Found
        </div>
      ) : isLoading ? (
        <ViewerPanelSkeleton />
      ) : (
        <div>
          <div className="flex gap-6 items-stretch">
            <ProjectInformation projectData={projectData} />
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
      )}
    </div>
  );
};
export default ViewerPanelProjects;
