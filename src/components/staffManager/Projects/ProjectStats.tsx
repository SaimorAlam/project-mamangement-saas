import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";

const ProjectStats = () => {
  const stats = [
    {
      title: "Total Projects",
      value: 85,
      growth: "",
      growth_type: "up",
      description: "",
      link_text: "",
      icon: "FolderIcon",
      icon_bg_color: "#5500f1",
    },
    {
      title: "Assigned Stuff",
      value: 3,
      growth: "",
      growth_type: "",
      description: "",
      link_text: "",
      icon: "SubmissionOverdue",
      icon_bg_color: "#4881FF",
    },
    {
      title: "Program Completion",
      value: 14,
      growth: "",
      growth_type: "",
      description: "",
      link_text: "",
      icon: "Check",
      icon_bg_color: "#00FF00",
    },
    {
      title: "Pending Review",
      value: 13,
      growth: "",
      growth_type: "",
      description: "",
      icon: "PendingReview",
      icon_bg_color: "#aeb100",
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
