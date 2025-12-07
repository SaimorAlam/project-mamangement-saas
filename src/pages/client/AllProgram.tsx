import React, { useState } from "react";
import {
  Flag,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Program {
  id: number;
  name: string;
  projects: number;
  assignManager: string[];
  priority: "High" | "Medium" | "Low";
  createdOn: string;
  updatedOn: string;
  deadline: string;
  progress: number;
}

interface AllProgramTableProps {
  title?: string;
  programs?: Program[] | undefined;
  hideCreatedOn?: boolean;
}

// === PriorityDropdown Component ===
const PriorityDropdown: React.FC<{
  defaultPriority: "High" | "Medium" | "Low";
}> = ({ defaultPriority }) => {
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">(
    defaultPriority
  );

  const getColor = () => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-orange-500";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getFillColor = () => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-orange-500";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`flex items-center gap-1 text-sm font-medium ${getColor()}`}
    >
      <Flag
        size={14}
        className={getFillColor()}
        fill="currentColor"
      />
      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as "High" | "Medium" | "Low")
        }
        className="border border-gray-300 rounded-md text-sm text-gray-700 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  );
};

// === AllProgramTable Component ===
const AllProgram: React.FC<AllProgramTableProps> = ({
  title = "All Program",
  programs: propPrograms,
  hideCreatedOn = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPrograms = 300;
  const itemsPerPage = 11;

  const programs =
    propPrograms ||
    Array.from({ length: 13 }, (_, i) => ({
      id: i + 1,
      name: "Program Name",
      projects: [20, 1, 0, 15, 12, 25, 12, 15, 0, 25, 20, 1][i % 12],
      assignManager: ["user1", "user2", "user3"],
      priority: "High" as const,
      createdOn: "15-6-2024",
      updatedOn: "15-6-2024",
      deadline: "24-7-2024",
      progress: [35, 50, 0, 60, 80, 80, 80, 0, 80, 80, 35, 50][
        i % 12
      ],
    }));

  const totalPages = Math.ceil(totalPrograms / itemsPerPage);

  return (
    <div className="min-h-screen py-6">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">
            {title}
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter size={16} />
            Filter By
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Program
                </th>
                {!hideCreatedOn && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Projects
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Assign Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Priority
                </th>
                {!hideCreatedOn && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Created On
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Updated On
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Deadline
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Progress
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {programs.map((program) => (
                <tr key={program.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {program.name}
                  </td>
                  {!hideCreatedOn && (
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {program.projects}{" "}
                      {program.projects === 1
                        ? "Project"
                        : "Projects"}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {program.assignManager
                          .slice(0, 3)
                          .map((_, idx) => (
                            <img
                              key={idx}
                              src={`https://i.pravatar.cc/150?img=${
                                program.id * 3 + idx
                              }`}
                              alt="Manager"
                              className="w-8 h-8 rounded-full border-2 border-white"
                            />
                          ))}
                        <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-700">
                          +3
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Priority dropdown with dynamic color */}
                  <td className="px-6 py-4">
                    <PriorityDropdown
                      defaultPriority={program.priority}
                    />
                  </td>

                  {!hideCreatedOn && (
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {program.createdOn}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {program.updatedOn}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {program.deadline}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[120px]">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${program.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 min-w-[35px]">
                        {program.progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalPrograms)} of{" "}
            <span className="font-semibold">{totalPrograms}</span>{" "}
            Programs
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentPage(Math.max(1, currentPage - 1))
              }
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <button
              onClick={() => setCurrentPage(1)}
              className={`px-3 py-2 text-sm rounded-md ${
                currentPage === 1
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              1
            </button>

            <button
              onClick={() => setCurrentPage(2)}
              className={`px-3 py-2 text-sm rounded-md ${
                currentPage === 2
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              2
            </button>

            <button
              onClick={() => setCurrentPage(3)}
              className={`px-3 py-2 text-sm rounded-md ${
                currentPage === 3
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              3
            </button>

            <span className="px-2 text-gray-500">...</span>

            <button
              onClick={() => setCurrentPage(30)}
              className={`px-3 py-2 text-sm rounded-md ${
                currentPage === 30
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              30
            </button>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProgram;
