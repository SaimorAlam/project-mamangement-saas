import DashboardPanelStatsCard from "@/common/DashboardPanelStatsCard";
import SkeletonLoading from "@/common/Skeleton/SkeletonLoading";
import { useGetProjectPageStateCartsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";

const ProjectStats = () => {
  const stats = [
    {
      title: "Total Projects",
      value: 85,
      growth: "",
      growth_type: "up",
      description: "",
      link: "/staff-manager-panel/projects/",
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
      link: "/staff-manager-panel/projects",
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
      link: "/staff-manager-panel/projects/status/COMPLETED",
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
      link: "/staff-manager-panel/projects/status/PENDING",
      link_text: "",
      icon: "PendingReview",
      icon_bg_color: "#aeb100",
    },
  ];

  const {
    data: staffData,
    isLoading,
    error,
  } = useGetProjectPageStateCartsQuery("");

  const dashboardData = staffData?.data;

  if (isLoading) return <SkeletonLoading count={4} height="h-44" />;

  if (error) return <div>Error during Fetching data</div>;

  const apiKeys = [
    "totalProjects",
    "assignedStaff",
    "programCompletion",
    "pendingReviews",
  ] as const;

  const processedDashboardData = stats.map((item, index) => ({
    ...item,
    value: dashboardData?.[apiKeys[index]] ?? item.value,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 cursor-pointer">
      {processedDashboardData.map((item, index) => (
        <DashboardPanelStatsCard key={index} item={item} />
      ))}
    </div>
  );
};

export default ProjectStats;
