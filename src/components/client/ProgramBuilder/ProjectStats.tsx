import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";

interface ProjectStatsProps {
  activeWidget: string;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({
  activeWidget,
}) => {
  const stats = [
    {
      title: "Total Project",
      value: 56,
      growth: "+5%",
      growth_type: "up",
      description: "24 programs running this month",
      link_text: "View all",
      icon: "FolderIcon",
      icon_bg_color: "#059669",
    },
    {
      title: "Live Project",
      value: 36,
      growth: "+2%",
      growth_type: "up",
      description: "150 new users joined",
      link_text: "View all",
      icon: "LiveProject",
      icon_bg_color: "#7C3AED",
    },
    {
      title: "Project in draft",
      value: 15,
      growth: "+1.1%",
      growth_type: "up",
      description: "5 new clients joined",
      link_text: "View all",
      icon: "ProjectInDraft",
      icon_bg_color: "#2563EB",
    },
    {
      title: "Pending Review",
      value: 75,
      growth: "+5%",
      growth_type: "up",
      description: "25 score growth",
      link_text: "View all",
      icon: "PendingReview",
      icon_bg_color: "#059669",
    },
    {
      title: "Submission Overdue",
      value: "7.8%",
      growth: "",
      growth_type: "down",
      description: "50 Clients left",
      link_text: "View all",
      icon: "SubmissionOverdue",
      icon_bg_color: "#DC2626",
    },
  ];

  const visibleStats =
    activeWidget === "KPI widget"
      ? stats
      : stats.filter((item) => item.title !== "Submission Overdue");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 cursor-pointer">
      {visibleStats.map((item, index) => (
        <DashboardPanelStatsCard key={index} item={item} />
      ))}
    </div>
  );
};

export default ProjectStats;
