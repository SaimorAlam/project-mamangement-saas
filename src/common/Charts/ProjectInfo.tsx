/* eslint-disable @typescript-eslint/no-explicit-any */

// Helper function to format dates
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

interface ProjectInfo {
  label: string;
  value: string | number;
}

const ProjectInformation = ({ projectData }: { projectData?: any }) => {
  const projectDataInfo: ProjectInfo[] = [
    { label: "Project Name", value: projectData?.name },
    { label: "Status", value: projectData?.status },
    { label: "Priority", value: projectData?.priority },
    { label: "Start Date", value: formatDate(projectData?.startDate) },
    { label: "Deadline", value: formatDate(projectData?.deadline) },
    {
      label: "Estimated Completion",
      value: formatDate(projectData?.estimatedCompletedDate),
    },
    {
      label: "Project Complete Date",
      value: formatDate(projectData?.projectCompleteDate),
    },
    { label: "Progress", value: `${projectData?.progress}%` },
    { label: "Budget", value: projectData?.budget || "N/A" },
    { label: "Current Rate", value: projectData?.currentRate || "N/A" },
    {
      label: "Location",
      value: `Lat: ${projectData?.latitude}, Lng: ${projectData?.longitude}`,
    },
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Project Information
        </h2>

        {/* Information List */}
        <div className="space-y-4">
          {projectDataInfo.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-700">
                {item.label}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectInformation;
