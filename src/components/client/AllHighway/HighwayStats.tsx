import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";

const HighwayStats = () => {
  const stats = [
    {
      title: "Total Project",
      value: 56,
      growth: "+5%",
      growth_type: "up",
      description: "12 Overdue",
      link_text: "View all projeect",
      icon: "FolderIcon",
      icon_bg_color: "#059669",
    },
    {
      title: "Assigned Stuff",
      value: 75,
      growth: "+5%",
      growth_type: "up",
      description: "25 score growth",
      link_text: "View all",
      icon: "Users",
      icon_bg_color: "#4881FF",
    },
    {
      title: "Program Completion",
      value: 15,
      growth: "+1.1%",
      growth_type: "up",
      description: "5 new clients joined",
      link_text: "View all",
      icon: "Chart",
      icon_bg_color: "#059669",
    },
    {
      title: "Overdue",
      value: "7.8%",
      growth: "",
      growth_type: "down",
      description: "50 Clients left",
      link_text: "View all",
      icon: "SubmissionOverdue",
      icon_bg_color: "#DC2626",
    },
  ];

  return (
    <div className="grid grid-cols- sm:grid-cols-2 lg:grid-cols-4 gap-6 cursor-pointer">
      {stats.map((item, index) => (
        <DashboardPanelStatsCard key={index} item={item} />
      ))}
    </div>
  );
};

export default HighwayStats;
