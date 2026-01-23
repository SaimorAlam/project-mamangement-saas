/* eslint-disable @typescript-eslint/no-explicit-any */

// Helper function to format dates
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const calculateDuration = (start?: string, end?: string) => {
  if (!start || !end) return "N/A";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays} Days` : "0 Days";
};

const formatCurrency = (value: string | number) => {
  const num = Number(value);
  if (isNaN(num)) return "N/A";
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
  return `$${num}`;
};

interface ProjectInfoProps {
  projectData?: any;
  isLoading?: boolean;
}

const ClientProjectInfo = ({ projectData, isLoading }: ProjectInfoProps) => {
  if (isLoading) return <ClientProjectInfo.Skeleton />;

  const infoItems = [
    { label: "Start Date", value: formatDate(projectData?.project?.startDate) },
    {
      label: "Contract Duration",
      value: calculateDuration(
        projectData?.project?.startDate,
        projectData?.project?.deadline,
      ),
    },
    {
      label: "Completion Date",
      value: formatDate(projectData?.project?.deadline),
    },
    {
      label: "Contract Value",
      value: formatCurrency(projectData?.project?.budget),
    },
    {
      label: "Progress",
      value: `${projectData?.project?.progress || 0}% Completed`,
    },
    { label: "Duration Difference", value: "0 days Delay/Early" },
    { label: "Workload", value: "0 Task Overdue" },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-xl font-semibold mb-6">Project Information</h2>
      <div className="space-y-0.5">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between py-4 px-4 ${
              index % 2 === 0 ? "bg-[#F4F7FE]" : "bg-transparent"
            } rounded-lg`}
          >
            <span className="text-base font-medium text-[#4B5563]">
              {item.label}
            </span>
            <span className="text-base font-semibold text-[#1B2559]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

ClientProjectInfo.Skeleton = () => {
  return (
    <div className="w-[450px] bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-8"></div>
      <div className="space-y-2">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg"
          >
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientProjectInfo;
