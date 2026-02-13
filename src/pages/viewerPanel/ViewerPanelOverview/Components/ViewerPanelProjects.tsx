import CostOverview from "@/common/Charts/CostOverview";
import PhasePlan from "@/common/Charts/PhasePlan";
import ProgressChart from "@/common/Charts/Progress";
import ProgressRing from "@/common/Charts/ProgressRingTest";
import ProjectCostChart from "@/common/Charts/ProjectCost";
import ProjectInformation from "@/common/Charts/ProjectInfo";
import EmployeeWorkloadChart from "@/common/Charts/WorkLoad";
import ViewerPanelSkeleton from "@/common/Skeleton/ViewerPanelSkeleton";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { useLocation } from "react-router-dom";
const ViewerPanelProjects = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const { data, isLoading } = useGetProjectByIdQuery(id, {
    skip: !id,
  });
  const projectData = data?.data?.project;

  return (
    <div className="">
      {!id ? (
        <div className="text-center text-6xl font-semibold text-gray-200 grid place-content-center h-[60vh]">
          No Project Found
        </div>
      ) : isLoading ? (
        <ViewerPanelSkeleton />
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-6 relative">
            <div className="h-full">
              <ProjectInformation projectData={projectData} />
            </div>
            <div className="h-full">
              <ProgressRing />
            </div>
            <div className="h-full md:col-span-2 xl:col-span-1">
              <EmployeeWorkloadChart />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ProgressChart />
            <ProjectCostChart />
          </div>
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <CostOverview />
              <PhasePlan />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <img src="man.png" alt="Not Found" className="max-w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};
export default ViewerPanelProjects;
