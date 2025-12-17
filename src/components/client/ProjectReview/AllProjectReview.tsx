import React, { useRef, useState } from "react";
import {
  Search,
  Calendar,
  Download,
  Eye,
  Edit2,
  Trash2,
  Flag,
} from "lucide-react";
import ProjectDueDate from "./ProjectDueDate";
import ReviewerActivity from "./ReviewerActivity";
import IndividualProjectDetails from "@/components/staffManager/Projects/IndividualProjectDetails";

interface Project {
  id: number;
  name: string;
  assignedStaff: string[];
  status: "Approved" | "Pending" | "Returned";
  priority: "High" | "Medium" | "Low" | "Default";
  submitDate: string;
  selected: boolean;
}

const AllProjectReview: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>(
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: "Project Name",
      assignedStaff: ["user1", "user2", "user3"],
      status: ["Approved", "Pending", "Returned"][
        Math.floor(Math.random() * 3)
      ] as any,
      priority: ["High", "Medium", "Low", "Default"][
        Math.floor(Math.random() * 4)
      ] as any,
      submitDate: "24-7-2024",
      selected: false,
    }))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-700";
      case "Pending":
        return "bg-orange-50 text-orange-700";
      case "Returned":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-orange-500";
      case "Low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const toggleSelectAll = () => {
    setProjects(
      projects.map((p) => ({
        ...p,
        selected: !projects.every((p) => p.selected),
      }))
    );
  };

  const toggleSelect = (id: number) => {
    setProjects(
      projects.map((p) =>
        p.id === id ? { ...p, selected: !p.selected } : p
      )
    );
  };

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = projects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const dateInputRef = useRef(null);

  const handleButtonClick = () => {
    if (dateInputRef.current) {
      (dateInputRef.current as HTMLInputElement).showPicker();
    }
  };

  return (
    <div className="min-h-screen border border-gray-200 rounded-lg my-6 p-6">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              All Project Review
            </h1>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search Permissions"
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none  w-64"
                />
              </div>

              {/* All Status Dropdown */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none appearance-none  bg-white cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Returned</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Date Range */}
              <div className="relative">
                <button
                  onClick={handleButtonClick}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <Calendar size={18} />
                  Date Range
                </button>

                <input
                  type="date"
                  ref={dateInputRef}
                  className="absolute opacity-0 pointer-events-none -bottom-2 left-0 w-0 h-0"
                />
              </div>
              {/* Export */}
              <button 
                onClick={() => {
                  const headers = ["ID", "Project Name", "Assigned Staff", "Status", "Priority", "Submit Date"];
                  const rows = projects.map(p => [
                    p.id,
                    p.name,
                    p.assignedStaff.join(", "),
                    p.status,
                    p.priority,
                    p.submitDate
                  ]);
                  
                  const csvContent = [
                    headers.join(","),
                    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
                  ].join("\n");
                  
                  const blob = new Blob([csvContent], { type: "text/csv" });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = "projects.csv";
                  link.click();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={projects.every((p) => p.selected)}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 cursor-pointer"
                    />
                  </th>
                  <th className="px-2 py-3 text-left text-sm font-semibold text-gray-700">
                    Submitted Project Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Assign Staff
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Priority
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Submit Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={project.selected}
                        onChange={() => toggleSelect(project.id)}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {project.assignedStaff
                            .slice(0, 3)
                            .map((_, idx) => (
                              <img
                                key={idx}
                                src={`https://i.pravatar.cc/150?img=${project.id * 3 + idx
                                  }`}
                                alt="Staff"
                                className="w-8 h-8 rounded-full border-2 border-white"
                              />
                            ))}
                          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +3
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className={`flex items-center gap-1 text-sm font-medium ${getPriorityColor(
                          project.priority
                        )}`}
                      >
                        <Flag size={14} />
                        {project.priority}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {project.submitDate}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <IndividualProjectDetails project={project}/>
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, projects.length)}{" "}
                of {projects.length} Project
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Prev
                </button>
                {[1, 2, 3, "...", 30].map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      typeof page === "number" && setCurrentPage(page)
                    }
                    className={`px-3 py-1.5 text-sm rounded ${page === currentPage
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    disabled={page === "..."}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(totalPages, currentPage + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-90 space-y-6">
          <ProjectDueDate />
          <ReviewerActivity />
        </div>
      </div>
    </div>
  );
};

export default AllProjectReview;
