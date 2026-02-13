/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlignStartHorizontal,
  ArrowDownUp,
  ArrowRight,
  ChevronDown,
  Filter,
  TableIcon,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import StaffManagerProjectCard from "@/components/staffManager/StaffManagerProjectCard";
import Pagination from "@/components/client/Pagination";
import { useSelector } from "react-redux";
import SkeletonLoading from "@/common/Skeleton/SkeletonLoading";
import DropdownSelect from "@/common/DropdownSelect";
import PrimaryButton from "@/common/PrimaryButton";
import StaffManagerProjectTable from "../staffManager/overview/StaffManagerProjectTable";

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

export interface StaffEmployeeProject {
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
  viewerId: string;

  chartList: unknown[];

  estimatedCompletedDate: string;
  projectCompleteDate: string | null;

  currentRate: string;
  budget: string;

  latitude: number | null;
  longitude: number | null;

  createdAt: string;
  updatedAt: string;

  projectEmployees?: {
    employee: {
      user: {
        name: string;
        profileImage: string;
      };
    };
  };
  projectViewers?: {
    viewer: {
      user: {
        name: string;
        profileImage: string;
      };
    };
  };
  manager?: {
    user: {
      name: string;
      profileImage: string;
    };
  };
}

const AllProgramProject = () => {
  const [viewMode, setViewMode] = useState<"table" | "board">("board");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [sortBy, setSortBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const employeeId = useSelector((state: any) => state.auth.user?.userId);

  const { data, isLoading } = useGetAllProjectsQuery({
    employeeId,
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter === "ALL" ? "" : statusFilter,
    priority: priorityFilter === "ALL" ? "" : priorityFilter,
    sortBy: sortBy,
    sortOrder: sortOrder,
  });

  if (isLoading) {
    return (
      <>
        <h4 className="mb-3 text-gray-900 text-xl font-semibold">
          All Program & Project
        </h4>
        <SkeletonLoading count={3} height="h-66" />
      </>
    );
  }

  const projects = data?.data?.projects?.data || [];

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const statusOptions = [
    { value: "ALL", title: "All Status" },
    { value: "PENDING", title: "PENDING" },
    { value: "COMPLETED", title: "COMPLETED" },
    { value: "PROBLEM", title: "PROBLEM" },
    { value: "OVERDUE", title: "OVERDUE" },
    { value: "DRAFT", title: "DRAFT" },
    { value: "LIVE", title: "LIVE" },
  ];
  const priorityOptions = [
    { value: "ALL", title: "All Priority" },
    { value: "HIGH", title: "High" },
    { value: "MEDIUM", title: "Medium" },
    { value: "LOW", title: "Low" },
    { value: "NORMAL", title: "Default" },
  ];

  return (
    <div className="pb-6 min-h-[500px]">
      {/* Header  */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6">
        <h4 className=" text-gray-900 text-xl font-semibold">
          All Program & Project
        </h4>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center  bg-white gap-3">
            <PrimaryButton
              type="Primary"
              title="Boards"
              leftIcon={<AlignStartHorizontal className="w-4 h-4" />}
              className={`${viewMode === "board"
                ? "bg-black text-white border-black hover:bg-black! hover:text-white!"
                : "bg-white border-black text-black! hover:text-black!"
                }`}
              onClick={() => setViewMode("board")}
            />

            <PrimaryButton
              type="Primary"
              title="Tables"
              leftIcon={<TableIcon className="w-4 h-4" />}
              className={`${viewMode === "table"
                ? "bg-black text-white border-black hover:bg-black! hover:text-white!"
                : "bg-white border-black text-black! hover:text-black!"
                }`}
              onClick={() => setViewMode("table")}
            />
          </div>

          {/* Sort By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent border border-[#CAD2DB] h-12"
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
                className={`rounded-md cursor-pointer ${sortBy === "startDate" ? "bg-indigo-50 text-indigo-600" : ""
                  }`}
                onClick={() => setSortBy("startDate")}
              >
                Starting Date
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`rounded-md cursor-pointer ${sortBy === "endDate" ? "bg-indigo-50 text-indigo-600" : ""
                  }`}
                onClick={() => setSortBy("endDate")}
              >
                Ending Date
              </DropdownMenuItem>

              <div className="my-1 border-t border-gray-100" />

              {/* Order Selection */}
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Order
              </div>
              <DropdownMenuItem
                className={`rounded-md cursor-pointer ${sortOrder === "asc" ? "bg-indigo-50 text-indigo-600" : ""
                  }`}
                onClick={() => setSortOrder("asc")}
              >
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`rounded-md cursor-pointer ${sortOrder === "desc" ? "bg-indigo-50 text-indigo-600" : ""
                  }`}
                onClick={() => setSortOrder("desc")}
              >
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent border border-[#CAD2DB] h-12"
              >
                <Filter className="size-5" />
                Filter By
                <ChevronDown className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white border border-[#CAD2DB]"
            >
              <div className="p-2">
                <div className="mb-3">
                  <DropdownSelect
                    placeholderText="Status"
                    dropdownItem={statusOptions}
                    onChange={setStatusFilter}
                    label="Status"
                  />
                </div>
                <div>
                  <DropdownSelect
                    placeholderText="Priority"
                    dropdownItem={priorityOptions}
                    onChange={setPriorityFilter}
                    label="Priority"
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Content */}
      {isLoading && <div className="text-5xl ">Loading...</div>}
      {viewMode === "table" ? (
        <div className="">
          <StaffManagerProjectTable
            projects={projects as StaffEmployeeProject[]}
          />

          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            filteredDataLength={projects.length}
          />
        </div>
      ) : (
        <div className="border border-gray-100 rounded-md min-h-88 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-5">
            {projects?.map((projectData: StaffEmployeeProject) => {
              return (
                <div key={projectData.id}>
                  <StaffManagerProjectCard project={projectData} />
                </div>
              );
            })}
          </div>
          {projects.length > 8 && (
            <div className="pt-6">
              <Link to="/staff-manager-panel/projects">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {/* Display total count */}
                  View all {projects.length}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProgramProject;
