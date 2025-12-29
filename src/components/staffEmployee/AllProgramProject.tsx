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
// import Pagination from "@/common/Pagination";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/common/PrimaryButton";
import DropdownSelect from "@/common/DropdownSelect";
import StaffEmployeeProjectTable from "@/components/staffEmployee/StaffEmployeeProjectTable";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import StaffEmployeeProjectCard from "./StaffEmployeeProjectCard";
import ContentLoader from "react-content-loader";
import Pagination from "./../../common/Pagination";

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

const AllProgramProject = () => {
  const [viewMode, setViewMode] = useState<"table" | "board">(
    "board"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [sortBy, setSortBy] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showItems, setShowItems] = useState(8);

  const itemsPerPage = 6;

  const { data, isLoading } = useGetAllProjectsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: statusFilter === "all" ? "" : statusFilter.toUpperCase(),
    priority:
      priorityFilter === "all" ? "" : priorityFilter.toUpperCase(),
  });

  const projects = data?.data?.projects?.data || [];

  const totalPages = Math.ceil(projects.length / itemsPerPage);

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 9 }).map((_, index) => (
          <ContentLoader
            viewBox="0 0 500 280"
            height={280}
            width={500}
            key={index}
          >
            <rect
              x="3"
              y="3"
              rx="10"
              ry="10"
              width="300"
              height="180"
            />
            <rect
              x="6"
              y="190"
              rx="0"
              ry="0"
              width="292"
              height="20"
            />
            <rect
              x="4"
              y="215"
              rx="0"
              ry="0"
              width="239"
              height="20"
            />
            <rect
              x="4"
              y="242"
              rx="0"
              ry="0"
              width="274"
              height="20"
            />
          </ContentLoader>
        ))}
      </div>
    );
  }

  return (
    <div className="pb-6 min-h-[500px]">
      {/* Header  */}
      <div className="flex items-center justify-between pb-6">
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
                onClick={() => setSortBy("startDate")}
              >
                Starting Date
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`rounded-md cursor-pointer ${
                  sortBy === "endDate"
                    ? "bg-indigo-50 text-indigo-600"
                    : ""
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
      {viewMode === "table" ? (
        <>
          <StaffEmployeeProjectTable
            projects={projects as StaffEmployeeProject[]}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalPrograms={projects.length}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-5">
            {projects
              ?.slice(0, showItems)
              .map((projectData: StaffEmployeeProject) => {
                return (
                  <div key={projectData.id}>
                    <StaffEmployeeProjectCard project={projectData} />
                  </div>
                );
              })}
          </div>
          {projects.length > 4 && (
            <div className="pt-6">
              <Button
                variant="ghost"
                className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() =>
                  setShowItems(
                    showItems !== projects.length
                      ? projects.length
                      : 8
                  )
                }
              >
                {/* Display total count */}
                {showItems !== projects.length
                  ? `View All ${projects.length}`
                  : `View Less`}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllProgramProject;
