/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";
import { useGetStaffEmpStateCartsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import OverDueChart from "./../../components/staffManager/overview/OverDueChart";
import ProjectStatusChart from "./../../components/staffManager/overview/ProjectStatusChart";
import SmUpcomingDeadline from "@/components/staffManager/overview/SmUpcomingDeadline";
import LatestSubmission from "@/components/staffManager/overview/LatestSubmission";
import AllProgramProject from "@/components/staffManager/overview/AllProgramProject";
import SkeletonLoading from "@/common/Skeleton/SkeletonLoading";
import { Card, CardHeader } from "@/components/ui/card";
// import ActivityLog from "@/components/staffManager/overview/ActivityLog";

const clientData = [
  {
    title: "Total Assigned Project",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "Since last month",
    link_text: "View all",
    link: "/staff-manager-panel/projects",
    icon: "FolderIcon",
    icon_bg_color: "#069576",
  },
  {
    title: "Submitted for Review",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "Awaiting for approval",
    link_text: "View all",
    link: "/staff-manager-panel/projects/status/PENDING",
    icon: "FolderIcon",
    icon_bg_color: "#069576",
  },
  {
    title: "Returned for Edit",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "0 new clients joined",
    link_text: "View all",
    link: "/staff-manager-panel/projects/status/PROBLEM",
    icon: "LiveProject",
    icon_bg_color: "#756CF5",
  },
  {
    title: "In live",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "Active and published",
    link_text: "View all",
    link: "/staff-manager-panel/projects/status/LIVE",
    icon: "ProjectInDraft",
    icon_bg_color: "#4881FF",
  },
  {
    title: "Submission Overdue",
    value: 0,
    growth: null,
    growth_type: "down",
    description: "Project data have not submitted",
    link_text: "View all",
    link: "/staff-manager-panel/projects/status/OVERDUE",
    icon: "SubmissionOverdue",
    icon_bg_color: "#DA4352",
  },
];

const StaffManagerOverview = () => {
  const { data: staffData, isLoading: staffLoading } =
    useGetStaffEmpStateCartsQuery("");

  const dashboardData = staffData?.data;

  // if (staffError) return <div>Error during Fetching data</div>;

  const processedDashboardData = clientData.map((item, index) => {
    const apiKeys = [
      "totalAssignedProject",
      "submittedForReview",
      "returnedForEdit",
      "liveProjects",
      "overdueProjects",
    ];

    const apiData = dashboardData?.[apiKeys[index]];

    return {
      ...item,
      value: apiData?.count ?? 0,
      growth: apiData?.growth ?? 0,
    };
  });

  return (
    <div className="mb-4">
      {staffLoading ? (
        <SkeletonLoading count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 my-6">
          {processedDashboardData.map((item) => (
            <DashboardPanelStatsCard key={item.title} item={item} />
          ))}
        </div>
      )}

      <div className="py-4">
        <AllProgramProject />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-4">
        <div className="space-y-8 col-span-2">
          <div className="flex justify-center gap-3">
            <Card className="w-full border-[#E2E8F0] shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-7">
                <h2 className="text-xl font-semibold my-2">
                  Top Overdue Projects
                </h2>
              </CardHeader>
              <OverDueChart />
            </Card>

            <ProjectStatusChart />
          </div>
        </div>
        <div className="space-y-8 mb-8">
          <SmUpcomingDeadline />
          {/* <ActivityLog /> */}
        </div>
      </div>
      <LatestSubmission />
    </div>
  );
};
export default StaffManagerOverview;
