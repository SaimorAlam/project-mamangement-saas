import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";

const ProjectStats = () => {
  const stats = [
    {
      title: "Total Assigned",
      value: 85,
      growth: "",
      growth_type: "up",
      description: "",
      link_text: "",
      icon: "FolderIcon",
      icon_bg_color: "#059669",
    },
    {
      title: "Awaiting Review",
      value: 3,
      growth: "",
      growth_type: "",
      description: "",
      link_text: "",
      icon: "SubmissionOverdue",
      icon_bg_color: "#4881FF",
    },
    {
      title: "Under Review",
      value: 14,
      growth: "",
      growth_type: "",
      description: "",
      link_text: "",
      icon: "PendingReview",
      icon_bg_color: "#059669",
    },
    {
      title: "Live",
      value: 13,
      growth: "",
      growth_type: "",
      description: "",
      icon: "LiveProject",
      icon_bg_color: "#DC2626",
    },
    {
      title: "Completed Projects",
      value: 243,
      growth: "",
      growth_type: "",
      description: "",
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

export default ProjectStats;
