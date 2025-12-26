/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Search,
  ArrowDownUp,
  ChevronDown,
  TableIcon,
  AlignStartHorizontal,
} from "lucide-react";
import ProjectDueDate from "./ProjectDueDate";
import ReviewerActivity from "./ReviewerActivity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/common/PrimaryButton";
import Pagination from "../Pagination";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useGetAllProgramQuery } from "@/store/Api/ProgramApi/ProgramApi";
import StaffEmployeeProgramTable from "@/components/staffEmployee/StaffEmployeeProjectTable";
import StaffEmployeeProgramCard from "@/components/staffEmployee/StaffEmployeeProjectCard";

export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type ProjectStatus =
  | "LIVE"
  | "PENDING"
  | "RETURNED"
  | "OVERDUE"
  | "DRAFT"
  | "IN_REVIEW"
  | "SUBMITTED";
export type ProjectPriority = "HIGH" | "MEDIUM" | "LOW";

export interface Project {
  id: string;
  programId: string;

  name: string;
  description: string;

  status: ProjectStatus;
  priority: ProjectPriority;

  startDate: string;
  deadline: string;

  progress: number;

  managerId: string;

  chartList: unknown[];

  estimatedCompletedDate: string;
  projectCompleteDate: string | null;

  currentRate: string;
  budget: string;

  latitude: number | null;
  longitude: number | null;

  createdAt: string;
  updatedAt: string;
}

interface Program {
  id: string;
  programName: string;
  programDescription: string;
  priority: Priority;
  deadline: string;
  progress: number;
  projects: Project[];
}

const AllProjectReview: React.FC = () => {
  const [viewMode, setViewMode] = useState<"table" | "board">(
    "board"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [sortBy, setSortBy] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  const { data } = useGetAllProgramQuery({});

  const programs = data?.data?.data || [];

  const totalPages = Math.ceil(programs.length / itemsPerPage);

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
                  placeholder="Search Projects"
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

              {/* Sort By Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none appearance-none  bg-white cursor-pointer"
                  >
                    <ArrowDownUp className="size-5" />
                    Sort By
                    <ChevronDown className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white border border-[#CAD2DB] p-1"
                >
                  {/* Field Selection */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Field
                  </div>
                  <DropdownMenuItem
                    className={`rounded-md cursor-pointer ${
                      sortBy === "startDate"
                        ? "bg-indigo-50 text-indigo-600"
                        : ""
                    }`}
                    onClick={() => setSortBy("name")}
                  >
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`rounded-md cursor-pointer ${
                      sortBy === "endDate"
                        ? "bg-indigo-50 text-indigo-600"
                        : ""
                    }`}
                    onClick={() => setSortBy("submitDate")}
                  >
                    Submit Date
                  </DropdownMenuItem>

                  <div className="my-1 border-t border-gray-100" />

                  {/* Order Selection */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order
                  </div>
                  <DropdownMenuItem
                    className={`rounded-md cursor-pointer ${
                      sortOrder === "asc"
                        ? "bg-indigo-50 text-indigo-600"
                        : ""
                    }`}
                    onClick={() => setSortOrder("asc")}
                  >
                    Ascending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`rounded-md cursor-pointer ${
                      sortOrder === "desc"
                        ? "bg-indigo-50 text-indigo-600"
                        : ""
                    }`}
                    onClick={() => setSortOrder("desc")}
                  >
                    Descending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Toggle */}
              <div className="flex items-center  bg-white gap-3">
                <PrimaryButton
                  type="Primary"
                  title="Boards"
                  leftIcon={
                    <AlignStartHorizontal className="w-4 h-4" />
                  }
                  className={`${
                    viewMode === "board"
                      ? "bg-black text-white border-black hover:bg-black! hover:text-white!"
                      : "bg-white border-black text-black! hover:text-black!"
                  }`}
                  onClick={() => setViewMode("board")}
                />

                <PrimaryButton
                  type="Primary"
                  title="Tables"
                  leftIcon={<TableIcon className="w-4 h-4" />}
                  className={`${
                    viewMode === "table"
                      ? "bg-black text-white border-black hover:bg-black! hover:text-white!"
                      : "bg-white border-black text-black! hover:text-black!"
                  }`}
                  onClick={() => setViewMode("table")}
                />
              </div>
            </div>
          </div>

          {viewMode === "table" ? (
            <>
              <StaffEmployeeProgramTable programs={programs} />

              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                filteredDataLength={programs.length}
              />
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-5">
                {programs?.map((programData: Program) => {
                  return (
                    <div key={programData.id}>
                      <StaffEmployeeProgramCard
                        program={programData}
                      />
                    </div>
                  );
                })}
              </div>

              {/* "View All" button if there are more than 4 programs/projects */}
              {programs.length > 4 && (
                <div className="pt-6">
                  <Link to="/work-in-progress">
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      {/* Display total count */}
                      View all {programs.length}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
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
