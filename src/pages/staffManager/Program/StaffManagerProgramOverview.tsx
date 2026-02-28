import { useParams } from "react-router-dom";
import { useGetProgramByIdQuery, useGetProjectsByProgramIdQuery } from "@/store/Api/ProgramApi/ProgramApi";
import StaffManagerAllProject from "./StaffManagerAllProject";
import ProjectLocationsMap from "@/components/staffManager/Projects/ProjectLocationsMap";
import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";
import SideManager from "@/components/staffManager/Projects/SideManager";

const StaffManagerProgramOverview = () => {
    const { programId } = useParams();
    const { data: program } = useGetProgramByIdQuery(programId);

    const { data } = useGetProjectsByProgramIdQuery({
        programId,
    });


    const projects = data?.data?.data || [];

    const totalProjects = projects.length;

    const overdueProjects = projects.filter(
        (project: any) => project.status === "OVERDUE"
    ).length;

    const completedProjects = projects.filter(
        (project: any) => project.status === "COMPLETED"
    ).length;
    console.log("completed projects", completedProjects);


    const totalAssignedStaff = projects.reduce(
        (acc: number, project: any) =>
            acc + (project.projectEmployees?.length || 0),
        0
    );

    const programCompletionPercent =
        totalProjects > 0
            ? Math.round((completedProjects / totalProjects) * 100)
            : 0;

    const stats = [
        {
            title: "Total Project",
            value: totalProjects,
            growth: "",
            growth_type: "up",
            description: `${overdueProjects} Overdue`,
            icon: "FolderIcon",
            icon_bg_color: "#059669",
        },
        {
            title: "Assigned Staff",
            value: totalAssignedStaff + 1,
            growth: "",
            growth_type: "up",
            description: "Total assigned employees",
            icon: "Users",
            icon_bg_color: "#4881FF",
        },
        {
            title: "Program Completion",
            value: `${programCompletionPercent}%`,
            growth: "",
            growth_type: "up",
            description: `${completedProjects} Completed`,
            icon: "Chart",
            icon_bg_color: "#059669",
        },
        {
            title: "Overdue",
            value: overdueProjects,
            growth: "",
            growth_type: "down",
            description: "Projects past deadline",
            icon: "SubmissionOverdue",
            icon_bg_color: "#DC2626",
        },
    ];
    return (
        <div className="">
            <h1 className="text-2xl font-semibold my-6">
                {program?.data?.programName}
            </h1>
            <div>
                <div className="grid grid-cols- sm:grid-cols-2 lg:grid-cols-4 gap-6 cursor-pointer">
                    {stats.map((item, index) => (
                        <DashboardPanelStatsCard key={index} item={item} />
                    ))}
                </div>
                <div className="flex items-baseline gap-6">
                    <StaffManagerAllProject title="All Project" programId={programId as string} />
                    {/* <ProgramManager managerId={managerId || program?.data?.managerId} /> */}
                    <SideManager programId={programId} />
                </div>
                <div className="z-0!">
                    <ProjectLocationsMap allFilteredProjects={program?.data || []} />
                </div>
            </div>
        </div>
    );
};

export default StaffManagerProgramOverview;
