import React, { useState } from "react";
import { Plus } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  time: string;
  by: string;
  color: string;
}

const SideManagerMain: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "Infrastructure", color: "bg-blue-100 text-blue-600" },
    { id: "2", name: "Highway", color: "bg-green-100 text-green-600" },
    { id: "3", name: "Phase 2", color: "bg-purple-100 text-purple-600" },
    { id: "4", name: "Civil Engineering", color: "bg-gray-100 text-gray-700" },
    { id: "5", name: "Public Works", color: "bg-orange-100 text-orange-600" },
    { id: "6", name: "Priority", color: "bg-red-100 text-red-600" },
  ]);

  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const programManager = {
    name: "Alex Thompson",
    email: "alex.thompson@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  };

  const programDuration = {
    startDate: "21-Oct-2024",
    endDate: "21-Oct-2024",
    remainingDays: 45,
    progress: 45,
  };

  const alerts: Alert[] = [
    {
      id: "1",
      title: "Overdue Material Delivery",
      description: "Segment A - 2 days overdue",
      time: "10 minutes ago",
      by: "System",
      color: "bg-red-500",
    },
    {
      id: "2",
      title: "Safety Inspection Required",
      description: "Bridge Support Structure",
      time: "43 minutes ago",
      by: "Santa Claus",
      color: "bg-yellow-400",
    },
    {
      id: "3",
      title: "Permit Approval Pending",
      description: "Environmental Assessment",
      time: "10 minutes ago",
      by: "System",
      color: "bg-green-500",
    },
    {
      id: "4",
      title: "Excavation completed",
      description: "Ground floor excavation completed",
      time: "10 minutes ago",
      by: "Project Manager",
      color: "bg-blue-500",
    },
  ];

  const handleAddTag = () => {
    if (!newTagName.trim()) return;

    setTags([
      ...tags,
      {
        id: Date.now().toString(),
        name: newTagName,
        color: "bg-gray-100 text-gray-700",
      },
    ]);
    setNewTagName("");
    setShowTagInput(false);
  };
// const handleDeleteTag = (id: string) => {
//     setTags(tags.filter((tag) => tag.id !== id));
// };
  return (
    <div className="min-h-screen w-[360px] p-4 mt-5">
      <div className="bg-white rounded-2xl border border-black/10 p-5 text-black">
        {/* Program Manager */}
        <div className="mb-6">
          <p className="text-sm text-black/60 mb-3">Program Manager</p>
          <div className="flex items-center gap-3">
            <img
              src={programManager.avatar}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{programManager.name}</p>
              <p className="text-xs text-black/50">
                {programManager.email}
              </p>
            </div>
          </div>
        </div>

        {/* Program Duration */}
        <div className="mb-6">
          <p className="text-sm text-black/60 mb-3">Program Duration</p>

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-black">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Start Date</p>
                <p className="text-sm font-medium">
                  {programDuration.startDate}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">End Date</p>
                <p className="text-sm font-medium">
                  {programDuration.endDate}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <p className="text-xs text-gray-500">Time Remaining</p>
                <p className="text-sm font-semibold">
                  {programDuration.remainingDays} days
                </p>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${programDuration.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-black/60">Tags</p>
            <button
              onClick={() => setShowTagInput(true)}
              className="flex items-center gap-1 text-sm text-blue-400"
            >
              <Plus size={14} /> Add more
            </button>
          </div>

          {showTagInput && (
            <div className="flex gap-2 mb-3">
              <input
                className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm text-black"
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-blue-500 text-white rounded-md text-sm"
              >
                Add
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={`px-3 py-1 rounded-md text-xs font-medium ${tag.color}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-black/60">Alerts</p>
            <span className="px-2 py-1 bg-red-100 text-red-600 rounded-md text-xs">
              {alerts.length} Issues
            </span>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${alert.color}`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-xs text-black/50">
                    {alert.description}
                  </p>
                  <div className="flex justify-between text-xs text-black/40 mt-1">
                    <span>{alert.time}</span>
                    <span>By {alert.by}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideManagerMain;
