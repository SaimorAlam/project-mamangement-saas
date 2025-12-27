import UpcomingDeadline from "@/components/client/Overview/UpcomingDeadline";
import ActivityLog from "@/components/client/Overview/ActivityLog";
// import LatestSubmission from "@/components/client/Overview/LatestSubmission";
import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";
import ProjectStatusDonutChart from "./Components/ProjectStatusDonutChart";
import ProjectTimelineColumnChart from "./Components/ProjectTimelineColumnChart";
import { useGetOverviewStackQuery } from "@/store/Api/ClientDashboardApi/ClientDashboardApi";
import DashboardPanelStatsCardSkeleton from "@/common/Skeleton/DashboardPanelStatsCardSkeleton";
import ProjectOverdueBarChart from "./Components/ProjectOverdueBarChart";
import LatestSubmission from "./Components/LatestSubmission/LatestSubmission";
import AllProgramProject from "./Components/AllProgramProjects/AllProgramProjects";

const ClientOverview = () => {
  const { data: overview, isLoading } = useGetOverviewStackQuery({});

  const totalProgram = overview?.data?.programs?.total;
  const programThisMonth = overview?.data.programs.thisMonth;
  const totalProject = overview?.data?.projects?.total;
  const projectThisMonth = overview?.data?.projects?.thisMonth;
  const liveProject = overview?.data?.liveProjects?.total;
  const liveProjectThisMonth = overview?.data?.liveProjects?.thisMonth;
  const draftProject = overview?.data?.draftProjects?.total;
  const draftProjectThisMonth = overview?.data?.draftProjects?.thisMonth;
  const pendingReview = overview?.data?.pendingReview?.total;
  const growth = overview?.data?.pendingReview?.growth;
  const submitOverdue = overview?.data?.submitOverdue?.total;
  const projectOverduePercentage =
    overview?.data?.submitOverdue?.projectOverduePercentage;
  const clientData = [
    {
      title: "Total Program",
      value: totalProgram,
      growth: "+5%",
      growth_type: "up",
      description: `${programThisMonth} program Running this month`,
      link_text: "View all",
      icon: "FolderIcon",
      icon_bg_color: "#069576",
    },
    {
      title: "Total Project",
      value: totalProject,
      growth: "+5%",
      growth_type: "up",
      description: `${projectThisMonth} project Running this month`,
      link_text: "View all",
      icon: "FolderIcon",
      icon_bg_color: "#069576",
    },
    {
      title: "Live Project",
      value: liveProject,
      growth: "+2%",
      growth_type: "up",
      description: `${liveProjectThisMonth} New user joined`,
      link_text: "View all",
      icon: "LiveProject",
      icon_bg_color: "#756CF5",
    },
    {
      title: "Project in draft",
      value: draftProject,
      growth: "+1.1%",
      growth_type: "up",
      description: `${draftProjectThisMonth} new clients joined`,
      link_text: "View all",
      icon: "ProjectInDraft",
      icon_bg_color: "#4881FF",
    },
    {
      title: "Pending Review",
      value: pendingReview,
      growth: growth,
      growth_type: "up",
      description: `${growth} score growth`,
      link_text: "View all",
      icon: "PendingReview",
      icon_bg_color: "#069576",
    },
    {
      title: "Submission Overdue",
      value: submitOverdue,
      growth: undefined,
      growth_type: "down",
      description: `${projectOverduePercentage}% of projects are overdue`,
      link_text: "View all",
      icon: "SubmissionOverdue",
      icon_bg_color: "#DA4352",
    },
  ];

  return (
    <div className="">
      {/* Icon and Home */}

      <div className="grid grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 my-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <DashboardPanelStatsCardSkeleton key={index} />
            ))
          : clientData.map((item) => (
              <DashboardPanelStatsCard key={item.title} item={item} />
            ))}
      </div>

      <div className="py-4">
        <AllProgramProject />
      </div>
      <div className="grid xl:grid-cols-3 w-full gap-8 ">
        <div className="space-y-8 xl:col-span-2">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center justify-center ">
            <ProjectOverdueBarChart />
            <div className="h-full!">
              <ProjectStatusDonutChart />
            </div>
          </div>
          <ProjectTimelineColumnChart />
        </div>
        <div className="space-y-8">
          <UpcomingDeadline />
          <ActivityLog />
        </div>
      </div>
      <div className="my-6">
        {" "}
        <LatestSubmission />
      </div>
    </div>
  );
};
export default ClientOverview;
