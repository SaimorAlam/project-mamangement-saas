import CostOverview from "@/common/Charts/CostOverview";
import PhasePlan from "@/common/Charts/PhasePlan";
import ProgressChart from "@/common/Charts/Progress";
import ProgressRing from "@/common/Charts/ProgressRingTest";
import ProjectCostChart from "@/common/Charts/ProjectCost";
import ProjectInformation from "@/common/Charts/ProjectInfo";
import EmployeeWorkloadChart from "@/common/Charts/WorkLoad";
import ViewerPanelSkeleton from "@/common/Skeleton/ViewerPanelSkeleton";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { useParams } from "react-router-dom";
const FavoriteProjects = () => {
  const { projectId } = useParams();
  const { data, isLoading } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });
  const projectData = data?.data?.project;

  return (
    <div className="">
      {!projectId ? (
        <div className="text-center text-6xl font-semibold text-gray-200 grid place-content-center h-[60vh]">
          No Project Found
        </div>
      ) : isLoading ? (
        <ViewerPanelSkeleton />
      ) : (
        <div>
          <div className="flex 2xl:flex-row flex-col gap-6 items-stretch">
            <div className="flex-1 2xl:min-h-[600px]">
              <ProjectInformation projectData={projectData} />
            </div>
            <div className="flex-1 2xl:min-h-[600px]">
              <ProgressRing />
            </div>
            <div className="flex-1 2xl:min-h-[600px]">
              <EmployeeWorkloadChart />
            </div>
          </div>
          <div className="flex xl:flex-row flex-col gap-6 mt-6">
            <ProgressChart />
            <ProjectCostChart />
          </div>
          <div className="flex xl:flex-row flex-col gap-6 mt-6">
            <div className="flex-1 2xl:min-h-[400px]">
              <CostOverview />
            </div>
            <div className="flex-1 2xl:min-h-[400px]">
              <PhasePlan />
            </div>
          </div>
          <div className="flex justify-end gap-6 mt-6">
            <img src="/man.png" className="" alt="Not Found" />
          </div>
        </div>
      )}
    </div>
  );
};
export default FavoriteProjects;
