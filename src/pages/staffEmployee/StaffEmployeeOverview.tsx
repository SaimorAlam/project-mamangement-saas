import AllProgramProject from "@/components/staffEmployee/AllProgramProject";
import UpcomingDeadline from "@/components/staffEmployee/Overview/UpcomingDeadline";
import LatestSubmission from "@/components/staffEmployee/Overview/LatestSubmissions";
import { useGetEmployeeDashboardStatsQuery } from "@/store/Api/EmployeeApi/EmployeeApi";
import DashboardStatsCard from "@/components/staffEmployee/DashboardStatsCard";
import BoxContainer from "./../../common/BoxContainer";
import OverDueChart from "@/components/staffEmployee/Overview/OverdueChart";
import ProjectStatusChart from "@/components/staffEmployee/ProjectStatusChart";
import ContentLoader from "react-content-loader";

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

  return (
    <div className="">
      {/* Icon and Home */}

      <div className="grid grid-cols-4 gap-6 my-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <ContentLoader
                height="300"
                width="300"
                viewBox="0 0 265 230"
                key={index}
              >
                <rect
                  x="15"
                  y="50"
                  rx="2"
                  ry="2"
                  width="350"
                  height="150"
                />
                <rect
                  x="15"
                  y="230"
                  rx="2"
                  ry="2"
                  width="170"
                  height="20"
                />
                <rect
                  x="60"
                  y="230"
                  rx="2"
                  ry="2"
                  width="170"
                  height="20"
                />
              </ContentLoader>
            ))
          : processedDashboardData.map((item) => (
              <DashboardStatsCard key={item.title} item={item} />
            ))}
      </div>

      <div className="py-4">
        <AllProgramProject />
      </div>

      <div className="grid grid-cols-3 gap-8 ">
        <div className="space-y-8 col-span-2">
          <div className="flex items-start justify-center gap-8">
            <div className="flex items-start justify-center gap-8">
              <BoxContainer>
                <h2 className="text-2xl font-semibold mb-4">
                  Top Overdue Projects
                </h2>
                <OverDueChart />
              </BoxContainer>
            </div>
            <ProjectStatusChart />
          </div>
          <LatestSubmission />
        </div>
        <div className="space-y-8">
          <UpcomingDeadline />
        </div>
      </div>
    </div>
  );
};
export default StaffEmployeeOverview;
