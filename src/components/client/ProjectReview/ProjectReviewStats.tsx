import ClientPanelStatsCard from "@/common/ClientPanelStatsCard";

const ProjectReviewStats = () => {
  const stats = [
    {
      title: "Approved",
      value: 75,
      growth: "+5%",
      growth_type: "up",
      description: "25 score growth",
      link_text: "View all",
      icon: "Check",
      icon_bg_color: "#059669",
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
      title: "Returned",
      value: 15,
      growth: "+1.1%",
      growth_type: "up",
      description: "5 new clients joined",
      link_text: "View all",
      icon: "ProjectInDraft",
      icon_bg_color: "#4881FF",
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
        <ClientPanelStatsCard key={index} item={item} />
      ))}
    </div>
  );
};

export default ProjectReviewStats;
