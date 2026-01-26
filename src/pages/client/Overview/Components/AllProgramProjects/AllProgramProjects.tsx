import {
  AlignStartHorizontal,
  ArrowDownUp,
  ChevronDown,
  Filter,
  TableIcon,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2 as Loader } from "lucide-react";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import PrimaryButton from "@/common/PrimaryButton";
import DropdownSelect from "@/common/DropdownSelect";
import Pagination from "@/components/client/Pagination";
import ProjectCard from "./ProjectCard";
import AllProgramTable from "./AllProgramTable";

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
  programName?: string;
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

const AllProgramProject = () => {
  const [viewMode, setViewMode] = useState<"table" | "board">("board");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortBy, setSortBy] = useState<keyof StaffEmployeeProject>("startDate");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const { data, isLoading } = useGetAllProjectsQuery({});
  const projects = data?.data?.projects?.data || [];

  const statusOptions = [
    { value: "all", title: "All Status" },
    { value: "LIVE", title: "Live" },
    { value: "RETURNED", title: "Returned" },
    { value: "OVERDUE", title: "Overdue" },
    { value: "DRAFT", title: "Draft" },
    { value: "IN_REVIEW", title: "In Review" },
    { value: "SUBMITTED", title: "Submitted" },
  ];

  const priorityOptions = [
    { value: "all", title: "All Priority" },
    { value: "HIGH", title: "High" },
    { value: "MEDIUM", title: "Medium" },
    { value: "LOW", title: "Low" },
  ];

  // ------------------ Filtering ------------------
  const filteredProjects = useMemo(() => {
    return projects.filter((p: StaffEmployeeProject) => {
      const statusMatch = statusFilter === "all" || p.status === statusFilter;
      const priorityMatch =
        priorityFilter === "all" || p.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });
  }, [projects, statusFilter, priorityFilter]);

  // ------------------ Sorting ------------------
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "startDate" || sortBy === "deadline") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [filteredProjects, sortBy, sortOrder]);

  if (isLoading) return <Loader className="animate-spin" />;
  // ------------------ Pagination ------------------
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="pb-6 min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-6">
        <h4 className="text-xl font-semibold text-gray-900">
          All Program & Project
        </h4>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-white gap-3">
            <PrimaryButton
              type="Primary"
              title="Boards"
              leftIcon={<AlignStartHorizontal className="w-4 h-4" />}
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

          {/* Sort By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent border border-[#CAD2DB] h-12"
              >
                <ArrowDownUp className="size-5" /> Sort By{" "}
                <ChevronDown className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white border border-[#CAD2DB] p-1"
            >
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Field
              </div>
              <DropdownMenuItem onClick={() => setSortBy("startDate")}>
                Starting Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("deadline")}>
                Ending Date
              </DropdownMenuItem>
              <div className="my-1 border-t border-gray-100" />
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Order
              </div>
              <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("desc")}>
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
                <Filter className="size-5" /> Filter By{" "}
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
      {viewMode === "table" ? (
        <>
          <AllProgramTable projects={paginatedProjects} />
          {sortedProjects.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              filteredDataLength={sortedProjects.length}
            />
          )}
        </>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="w-full col-span-4 flex items-center justify-center h-96 text-gray-500 text-xl">
                No projects found
              </div>
            )}
          </div>
          {sortedProjects.length > itemsPerPage && (
            <div className="pt-6 flex justify-center">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                filteredDataLength={sortedProjects.length}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllProgramProject;
