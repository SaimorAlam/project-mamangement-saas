import AllProgramProject from "@/components/client/Overview/AllProgramProject";
import UpcomingDeadline from "@/components/client/Overview/UpcomingDeadline";
import ActivityLog from "@/components/staffEmployee/ActivityLog";
import ApexDonutChart from "@/common/Charts/ApexDonutChart";
import LatestSubmission from "@/components/client/Overview/LatestSubmission";
import ApexBarChart from "@/common/Charts/ApexBarChart";
import ApexColumnChart from "@/common/Charts/ApexColumnChart";
import { useGetEmployeeDashboardStatsQuery } from "@/store/Api/EmployeeApi/EmployeeApi";
import DashboardStatsCard from "@/components/staffEmployee/DashboardStatsCard";
import { Loader2 as Loader } from "lucide-react";
import BoxContainer from './../../common/BoxContainer';
import OverDueChart from "@/components/staffEmployee/Overview/OverdueChart";

const iconMap: { [key: string]: string } = {
  totalAssignedProject: "FolderIcon",
  submittedForReview: "FolderIcon",
  returnedForEdit: "LiveProject",
  liveProjects: "ProjectInDraft",
  overdueProjects: "SubmissionOverdue",
};

const StaffEmployeeOverview = () => {
  const { data, isLoading } = useGetEmployeeDashboardStatsQuery({});

  const dashboardData = data?.data || {};

  const processedDashboardData = Object.keys(dashboardData).map(
    (key: string) => {
      const dataObj = (
        dashboardData as {
          [key: string]: { count: number; growth: number };
        }
      )[key];

      return {
        title: key,
        value: dataObj.count,
        growth: dataObj.growth,
        growth_type: dataObj.growth > 0 ? "up" : "down",
        link_text: "View all",
        icon: iconMap[key] || "FolderIcon",
        icon_bg_color:
          key === "overdueProjects" ? "#DA4352" : "#069576",
      };
    }
  );

  if (isLoading) {
    return <Loader className="animate-spin" />;
  }

  return (
    <div className="">
      {/* Icon and Home */}

      <div className="grid grid-cols-4 gap-6 my-6">
        {processedDashboardData.map((item) => (
          <DashboardStatsCard key={item.title} item={item} />
        ))}
      </div>

      <div className="py-4">
        <AllProgramProject />
      </div>

      <div className="grid grid-cols-3 gap-8 ">
        <div className="space-y-8 col-span-2">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center justify-center gap-8">
              <BoxContainer>
                <h2 className="text-2xl font-semibold mb-4">
                  Top Overdue Projects
                </h2>
                <OverDueChart />
              </BoxContainer>

              {/* <ProjectStatusChart /> */}
            </div>
            <ApexDonutChart />
          </div>
          <LatestSubmission />
          <ApexColumnChart />
        </div>
        <div className="space-y-8">
          <UpcomingDeadline />
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};
export default StaffEmployeeOverview;
