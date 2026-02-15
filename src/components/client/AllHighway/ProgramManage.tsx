import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useGetUserByIdQuery } from "@/store/Api/UserApi/UserApi";

interface Tag {
  id: number;
  label: string;
  color: string;
}

interface Alert {
  id: number;
  type: "error" | "warning" | "info" | "success";
  title: string;
  description: string;
  time: string;
  by: string;
}

const ProgramManager = ({ managerId }: { managerId: string }) => {
  const { data, isLoading } = useGetUserByIdQuery(managerId, {
    skip: !managerId,
  });

  const [tags, setTags] = useState<Tag[]>([
    { id: 1, label: "Infrastructure", color: "blue" },
    { id: 2, label: "Highway", color: "green" },
    { id: 3, label: "Phase 2", color: "purple" },
    { id: 4, label: "Civil Engineering", color: "gray" },
    { id: 5, label: "Public Works", color: "yellow" },
    { id: 6, label: "Priority", color: "red" },
  ]);

  if (isLoading)
    return (
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-gray-200 p-7 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 mb-4 rounded" />
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    );

  const manager = data?.data;

  const alerts: Alert[] = [
    {
      id: 1,
      type: "error",
      title: "Overdue Material Delivery",
      description: "Segment A - 2 days overdue",
      time: "10 minutes ago",
      by: "By System",
    },
    {
      id: 2,
      type: "warning",
      title: "Safety Inspection Required",
      description: "Bridge support structure",
      time: "43 minutes ago",
      by: "By Santa Claus",
    },
    {
      id: 3,
      type: "info",
      title: "Permit Approval Pending",
      description: "Environmental Assessment",
      time: "10 minutes ago",
      by: "By System",
    },
    {
      id: 4,
      type: "success",
      title: "Excavation completed",
      description: "Ground floor excavation completed",
      time: "10 minutes ago",
      by: "By Project Manager",
    },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-orange-500";
      case "info":
        return "bg-teal-500";
      case "success":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTagColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "green":
        return "bg-green-100 text-green-700 border-green-200";
      case "purple":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "gray":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "yellow":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "red":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const removeTag = (id: number) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  const addTag = () => {
    const tagName = prompt("Enter tag name:");
    if (tagName) {
      const colors = ["blue", "green", "purple", "gray", "yellow", "red"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setTags([
        ...tags,
        { id: Date.now(), label: tagName, color: randomColor },
      ]);
    }
  };

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-gray-200 p-7">
      {/* Program Manager Section */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">
          Program Manager
        </h3>
        <div className="flex items-center gap-3">
          {manager?.profileImage ? (
            <img
              src={manager.profileImage}
              alt={manager.name}
              className="w-10 h-10 rounded-full object-cover border border-gray-100"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-semibold text-sm border border-blue-100">
              {manager?.name?.substring(0, 2).toUpperCase() || "NA"}
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {manager?.name || "Unknown Manager"}
            </div>
            <div className="text-xs text-gray-500">
              {manager?.email || "No email available"}
            </div>
          </div>
        </div>
      </div>

      {/* Program Duration Section */}
      <h3 className="text-xs font-semibold text-gray-600 mb-3">
        Program Duration
      </h3>
      <div className="mb-6 bg-gray-100 p-4 rounded-md">
        <div className="flex gap-3 mb-3">
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">Start Date</div>
            <div className="text-sm font-medium text-gray-900">21-Oct-2024</div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">End Date</div>
            <div className="text-sm font-medium text-gray-900">21-Oct-2024</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-blue-600 font-medium">
              Time Remaining
            </span>
            <span className="text-xs text-gray-900 font-medium">45 days</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: "70%" }}
            />
          </div>
        </div>
      </div>

      {/* Tags Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-600">Tags</h3>
          <button
            onClick={addTag}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={14} />
            Add more
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getTagColor(
                tag.color,
              )}`}
            >
              {tag.label}
              <button
                onClick={() => removeTag(tag.id)}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Alerts Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-gray-600">Alerts</h3>
          <span className="text-xs text-red-600 font-medium">3 Issues</span>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getAlertColor(
                  alert.type,
                )}`}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-0.5">
                  {alert.title}
                </h4>
                <p className="text-xs text-gray-600 mb-1">
                  {alert.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{alert.time}</span>
                  <span>{alert.by}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramManager;
