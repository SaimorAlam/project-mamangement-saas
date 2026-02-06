/* eslint-disable @typescript-eslint/no-explicit-any */
import SkeletonLoading from "@/common/Skeleton/SkeletonLoading";
import StaffManagerProjectCard, {
    StaffEmployeeProject,
} from "@/components/staffManager/StaffManagerProjectCard";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

// this is dynamic router component
const DashboardCardProjects = () => {
    const { status } = useParams();
    const employeeId = useSelector((state: any) => state.auth.user?.userId);
    const { data, isLoading, error } = useGetAllProjectsQuery({
        employeeId,
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
                <Link to="/staff-employee-panel" className="btn btn-primary">
                    Go back
                </Link>
            </>
        );
    }

    const projects = data?.data?.projects?.data || [];
    if (projects.length === 0) {
        return (
            <>
                <h4 className="mb-3 text-gray-900 text-xl font-semibold">
                    All Program & Project
                </h4>
                <div className="p-10 bg-gray-50 rounded-lg">
                    <p className="text-center text-gray-500">No projects found</p>
                </div>
                <Link
                    to="/staff-employee-panel"
                    className="border p-3 rounded-lg border-gray-300 mt-5 inline-block"
                >
                    Go Back
                </Link>
            </>
        );
    }
    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <h4 className="mb-3 text-gray-900 text-xl font-semibold">
                    All Program & Project
                </h4>
                <Link
                    to="/staff-employee-panel/projects"
                    className="flex items-center gap-2 text-primary border border-gray-300 rounded-lg px-4 py-2"
                >
                    <ChevronLeft />
                    Go back
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-5">
                {projects?.map((projectData: StaffEmployeeProject) => {
                    return (
                        <div key={projectData.id}>
                            <StaffManagerProjectCard project={projectData} />
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default DashboardCardProjects;
