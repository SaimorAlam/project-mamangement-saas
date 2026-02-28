import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useGetUser } from "@/hooks/useGetUser";
import { useGetProgramByIdQuery } from "@/store/Api/ProgramApi/ProgramApi";

interface Tag {
  id: string;
  name: string;
  color: string;
}

const SideManager = ({ programId }: { programId?: any }) => {
  const { name, email, profileImage } = useGetUser();

  const [tags, setTags] = useState<Tag[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const { data: programResponse } = useGetProgramByIdQuery(programId);
  const program = programResponse?.data;

  const today = new Date();

  const startDate = program?.datetime
    ? new Date(program.datetime)
    : null;

  const endDate = program?.deadline
    ? new Date(program.deadline)
    : null;

  // Format function
  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return date.toLocaleDateString();
  };

  // Calculate remaining days
  let remainingDays = 0;

  if (endDate) {
    const diff = endDate.getTime() - today.getTime();
    remainingDays = Math.max(
      Math.ceil(diff / (1000 * 60 * 60 * 24)),
      0
    );
  }

  const programDuration = {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    remainingDays,
    progress: program?.progress || 0,
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const colors = [
        "bg-blue-100 text-blue-700",
        "bg-green-100 text-green-700",
        "bg-purple-100 text-purple-700",
        "bg-orange-100 text-orange-700",
        "bg-pink-100 text-pink-700",
      ];

      const newTag: Tag = {
        id: Date.now().toString(),
        name: newTagName.trim(),
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setTags([...tags, newTag]);
      setNewTagName("");
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
  };

  return (
    <div className="min-h-screen w-[30%] pt-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Program Manager Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Program Manager
          </h3>
          <div className="flex items-center gap-3">
            <img
              src={profileImage}
              alt={name}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {name}
              </p>
              <p className="text-xs text-gray-500">
                {email}
              </p>
            </div>
          </div>
        </div>

        {/* Program Duration Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">
            Program Duration
          </h3>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Start Date
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {programDuration.startDate}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">
                  End Date
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {programDuration.endDate}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-600">
                  Time Remaining
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {programDuration.remainingDays} days
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${programDuration.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">
              {tags.length} {tags.length === 1 ? "Tag" : "Tags"}
            </p>
            <button
              onClick={() => setShowTagInput(true)}
              className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <Plus size={16} />
              Add Tags
            </button>
          </div>

          {/* Tag Input */}
          {showTagInput && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleAddTag()
                }
                placeholder="Enter tag name..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowTagInput(false);
                  setNewTagName("");
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Tags Display */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${tag.color}`}
                >
                  {tag.name}
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="ml-1 hover:opacity-70 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* No Issues Section */}
        <div className="bg-gray-50 rounded-lg py-8 text-center">
          <p className="text-sm text-gray-500">
            No Issues reported yet
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideManager;
