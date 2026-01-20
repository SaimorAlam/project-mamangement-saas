/* eslint-disable @typescript-eslint/no-explicit-any */
import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";
import { useGetStaffEmpStateCartsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import BoxContainer from "@/common/BoxContainer";
import OverDueChart from "./../../components/staffManager/overview/OverDueChart";
import ProjectStatusChart from './../../components/staffManager/overview/ProjectStatusChart';
import { FaSpinner } from "react-icons/fa";
import SmUpcomingDeadline from "@/components/staffManager/overview/SmUpcomingDeadline";
import LatestSubmission from "@/components/staffManager/overview/LatestSubmission";
import AllProgramProject from "@/components/staffManager/overview/AllProgramProject";
// import ActivityLog from "@/components/staffManager/overview/ActivityLog";

const clientData = [
  {
    title: "Total Assigned Project",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "",
    link_text: "View all",
    icon: "FolderIcon",
    icon_bg_color: "#069576",
  },
  {
    title: "Submitted for Review",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "",
    link_text: "View all",
    icon: "FolderIcon",
    icon_bg_color: "#069576",
  },
  {
    title: "Returned for Edit",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "",
    link_text: "View all",
    icon: "LiveProject",
    icon_bg_color: "#756CF5",
  },
  {
    title: "In live",
    value: 0,
    growth: 0,
    growth_type: "up",
    description: "",
    link_text: "View all",
    icon: "ProjectInDraft",
    icon_bg_color: "#4881FF",
  },
  {
    title: "Submission Overdue",
    value: 0,
    growth: null,
    growth_type: "down",
    description: "",
    link_text: "View all",
    icon: "SubmissionOverdue",
    icon_bg_color: "#DA4352",
  },
];

const StaffManagerOverview = () => {
  const {
    data: staffData,
    isLoading: staffLoading,
  } = useGetStaffEmpStateCartsQuery("");

  const dashboardData = staffData?.data;

  if (staffLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
            <FaSpinner className="animate-spin" size={24} />
          </div>
  );
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
    <div>
      <div className="grid grid-cols-4 gap-6 my-6">
        {processedDashboardData.map((item) => (
          <DashboardPanelStatsCard key={item.title} item={item} />
        ))}
      </div>

      <div className="py-4">
        <AllProgramProject />
      </div>

      <div className="grid grid-cols-3 gap-8 mb-4">
        <div className="space-y-8 col-span-2">
          <div className="flex justify-center gap-3">
            <BoxContainer>
              <h2 className="text-xl font-semibold my-2">
                Top Overdue Projects
              </h2>
              <OverDueChart />
            </BoxContainer>

            <ProjectStatusChart />
          </div>
          <LatestSubmission /> 
        </div>
        <div className="space-y-8 mb-8">
          <SmUpcomingDeadline />
          {/* <ActivityLog /> */}
        </div>
      </div>
    </div>
  );
};
export default StaffManagerOverview;
