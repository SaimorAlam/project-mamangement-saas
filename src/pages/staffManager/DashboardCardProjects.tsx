/* eslint-disable @typescript-eslint/no-explicit-any */
import SkeletonLoading from "@/common/Skeleton/SkeletonLoading";
import StaffManagerProjectCard, {
  StaffEmployeeProject,
} from "@/components/staffManager/StaffManagerProjectCard";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

// this is dynamic router component
const DashboardCardProjects = () => {
  const { status } = useParams();
  const managerId = useSelector((state: any) => state.auth.user?.userId);
  const { data, isLoading, error } = useGetAllProjectsQuery({
    managerId,
    status: status ? status : "ALL",
  });

  if (isLoading) {
    return (
      <>
        <h4 className="mb-3 text-gray-900 text-xl font-semibold">
          All Program & Project
        </h4>
        <SkeletonLoading count={3} height="h-66" />
      </>
    );
  }
  if (error) {
    return (
      <>
        <h4 className="mb-3 text-gray-900 text-center text-xl font-semibold">
          Something went wrong
        </h4>
        <Link to="/staff-manager-panel" className="btn btn-primary">
          Go back
        </Link>
      </>
    );
  }

  const projects = data?.data?.projects?.data || [];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-5">
      {projects?.map((projectData: StaffEmployeeProject) => {
        return (
          <>
            <h4 className="mb-3 text-gray-900 text-xl font-semibold">
              All Program & Project
            </h4>
            <div key={projectData.id}>
              <StaffManagerProjectCard project={projectData} />
            </div>
          </>
        );
      })}
    </div>
  );
};

export default DashboardCardProjects;
