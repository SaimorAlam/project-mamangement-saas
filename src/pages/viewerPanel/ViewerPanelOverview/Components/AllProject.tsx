import {
  AlignStartHorizontal,
  ArrowDownUp,
  ChevronDown,
  Filter,
  TableIcon,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import Pagination from "@/common/Pagination";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/common/PrimaryButton";
import DropdownSelect from "@/common/DropdownSelect";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import ProjectCard from "./ProjectCard";
import { useGetUser } from "@/hooks/useGetUser";
import ProjectCardSkeleton from "@/common/Skeleton/ProjectCardSkeleton";
import AllProjectTable from "./AllProjectTable";

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
}

const AllProject = () => {
  const { id, loading } = useGetUser();
  const [viewMode, setViewMode] = useState<"table" | "board">("board");
  const [, setStatusFilter] = useState<string>("all");
  const [, setPriorityFilter] = useState<string>("all");

  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [sortBy, setSortBy] = useState<string>("all");

  const { data, isLoading: projectLoading } = useGetAllProjectsQuery(
    { viewerId: id },
    { skip: !id },
  );

  const projects = data?.data?.projects?.data || [];

  const statusOptions = [
    { value: "all", title: "All Status" },
    { value: "Live", title: "Live" },
    { value: "Returned", title: "Returned" },
    { value: "Overdue", title: "Overdue" },
    { value: "Draft", title: "Draft" },
    { value: "In Review", title: "In Review" },
    { value: "Submitted", title: "Submitted" },
  ];

  const priorityOptions = [
    { value: "all", title: "All Priority" },
    { value: "High", title: "High" },
    { value: "Medium", title: "Medium" },
    { value: "Low", title: "Low" },
    { value: "Default", title: "Default" },
  ];

  if (loading || projectLoading) {
    return (
      <div className="pb-6 min-h-[500px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 gap-4 md:gap-0">
          <div className="h-6 w-56 bg-slate-200 rounded animate-pulse" />
          <div className="flex gap-3 w-full md:w-auto">
            <div className="h-12 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-12 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Board Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6 min-h-[500px]">
      {/* Header  */}
      <div className="flex flex-col xl:flex-row items-center justify-between pb-6 gap-4 xl:gap-0">
        <h4 className="text-gray-900 text-xl font-semibold w-full xl:w-auto">
          All Program & Project
        </h4>
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* View Toggle */}
          <div className="flex items-center bg-white gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <PrimaryButton
              type="Primary"
              title="Boards"
              leftIcon={<AlignStartHorizontal className="w-4 h-4" />}
              className={`${
                viewMode === "board"
                  ? "bg-black text-white border-black hover:bg-black! hover:text-white!"
                  : "bg-white border-black text-black! hover:text-black!"
              } flex-1 sm:flex-none justify-center`}
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
              } flex-1 sm:flex-none justify-center`}
              onClick={() => setViewMode("table")}
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-transparent border border-[#CAD2DB] h-12 w-full sm:w-auto"
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
                    sortBy === "startDate" ? "bg-indigo-50 text-indigo-600" : ""
                  }`}
                  onClick={() => setSortBy("startDate")}
                >
                  Starting Date
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`rounded-md cursor-pointer ${
                    sortBy === "endDate" ? "bg-indigo-50 text-indigo-600" : ""
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
                  className={`rounded-md cursor-pointer ${
                    sortOrder === "asc" ? "bg-indigo-50 text-indigo-600" : ""
                  }`}
                  onClick={() => setSortOrder("asc")}
                >
                  Ascending
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={`rounded-md cursor-pointer ${
                    sortOrder === "desc" ? "bg-indigo-50 text-indigo-600" : ""
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
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-transparent border border-[#CAD2DB] h-12 w-full sm:w-auto"
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
      </div>
      {/* Content */}
      {viewMode === "table" ? (
        <div className="overflow-x-auto">
          <AllProjectTable projects={projects as StaffEmployeeProject[]} />

          {/* <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            filteredDataLength={projects.length}
          /> */}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {projects?.map((projectData: StaffEmployeeProject) => {
              return (
                <div key={projectData.id}>
                  <ProjectCard project={projectData} />
                </div>
              );
            })}
          </div>
          {/* {projects.length > 4 && (
            <div className="pt-6">
              <Link to="/work-in-progress">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
             
                  View all {projects.length}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default AllProject;
