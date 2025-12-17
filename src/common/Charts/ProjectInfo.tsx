import React from "react";

interface ProjectInfo {
  label: string;
  value: string;
}

const ProjectInformation: React.FC = () => {
  const projectData: ProjectInfo[] = [
    { label: "Start Date", value: "2 March 2025" },
    { label: "Contract Duration", value: "160 Days" },
    { label: "Completion Date", value: "9 August 2025" },
    { label: "Contract Value", value: "$200k" },
    { label: "Progress", value: "60% Completed" },
    { label: "Duration Difference", value: "5 days Delay/Early" },
    { label: "Workload", value: "3 Task Overdue" },
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full  p-6">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Project Information
        </h2>

        {/* Information List */}
        <div className="space-y-4">
          {projectData.map((item, index) => (
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
