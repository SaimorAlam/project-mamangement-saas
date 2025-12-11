import AllProgramProject from "@/components/client/Overview/AllProgramProject";
import UpcomingDeadline from "@/components/client/Overview/UpcomingDeadline";
import ActivityLog from "@/components/client/Overview/ActivityLog";
import ApexDonutChart from "@/common/Charts/ApexDonutChart";
import LatestSubmission from "@/components/client/Overview/LatestSubmission";
import ApexBarChart from "@/common/Charts/ApexBarChart";
import ApexColumnChart from "@/common/Charts/ApexColumnChart";
import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";

const clientData = [
  {
    title: "Total Program",
    value: 56,
    growth: "+5%",
    growth_type: "up",
    description: "24 program Running this month",
    link_text: "View all",
    icon: "FolderIcon",
    icon_bg_color: "#069576",
  },
  {
    title: "Total Project",
    value: 156,
    growth: "+5%",
    growth_type: "up",
    description: "24 project Running this month",
    link_text: "View all",
    icon: "FolderIcon",
    icon_bg_color: "#069576",
  },
  {
    title: "Live Project",
    value: 36,
    growth: "+2%",
    growth_type: "up",
    description: "150 New user joined",
    link_text: "View all",
    icon: "LiveProject",
    icon_bg_color: "#756CF5",
  },
  {
    title: "Project in draft",
    value: 15,
    growth: "+1.1%",
    growth_type: "up",
    description: "5 new clients joined",
    link_text: "View all",
    icon: "ProjectInDraft",
    icon_bg_color: "#4881FF",
  },
  {
    title: "Pending Review",
    value: 75,
    growth: "+5%",
    growth_type: "up",
    description: "25 score growth",
    link_text: "View all",
    icon: "PendingReview",
    icon_bg_color: "#069576",
  },
  {
    title: "Submission Overdue",
    value: "7.8%",
    growth: null,
    growth_type: "down",
    description: "50 Clients left",
    link_text: "View all",
    icon: "SubmissionOverdue",
    icon_bg_color: "#DA4352",
  },
];

export default function ClientWorks() {
  return (
    <div className="">
      {/* Icon and Home */}

      <div className="grid grid-cols-4 gap-6 my-6">
        {clientData.map((item) => (
          <DashboardPanelStatsCard key={item.title} item={item} />
        ))}
      </div>

      <div className="py-4">
        <AllProgramProject />
      </div>

      <div className="grid grid-cols-3 gap-8 ">
        <div className="space-y-8 col-span-2">
          <div className="flex items-center justify-center gap-8">
            <ApexBarChart />
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
}
