/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Pagination from "@/common/Pagination";
import ProjectDueDate from "./ProjectDueDate";
import AllProjectTable from "./AllProjectTable";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import ReviewerActivity from "./ReviewerActivity";

/* -------------------- Types -------------------- */

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
  programName?: string;
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

/* -------------------- Component -------------------- */

const AllProject: React.FC = () => {
  // const [viewMode, setViewMode] = useState<"table" | "board">("board");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Project | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const { data } = useGetAllProjectsQuery({});
  const projects: Project[] = data?.data?.projects?.data || [];

  const ITEMS_PER_PAGE = 9;

  /* -------------------- Utilities -------------------- */

  const sortProjects = (
    list: Project[],
    key: keyof Project,
    order: "asc" | "desc",
  ) => {
    return [...list].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];

      if (!aVal || !bVal) return 0;

      if (typeof aVal === "string") {
        return order === "asc"
          ? aVal.localeCompare(String(bVal))
          : String(bVal).localeCompare(aVal);
      }

      return order === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    });
  };

  /* -------------------- Derived Data -------------------- */

  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (selectedStatus) {
      list = list.filter((p) => p.status === selectedStatus);
    }

    if (sortBy !== "all") {
      list = sortProjects(list, sortBy, sortOrder);
    }

    return list;
  }, [projects, selectedStatus, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  /* -------------------- Render -------------------- */

  return (
    <div className="min-h-screen my-6">
      <div className="flex gap-6">
        {/* Main */}
        <div className="flex-1 border border-gray-200 rounded-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              All Project Review
            </h1>

            <div className="flex items-center gap-3">
              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white"
              >
                <option value="">All Status</option>
                <option value="LIVE">Live</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
                <option value="DRAFT">Draft</option>
              </select>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ArrowDownUp className="mr-2 h-4 w-4" />
                    Sort
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("deadline")}>
                    Deadline
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
                    Created Date
                  </DropdownMenuItem>

                  <div className="my-1 border-t" />
                  <DropdownMenuItem onClick={() => setSortOrder("asc")}>
                    Ascending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("desc")}>
                    Descending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="">
            <AllProjectTable projects={paginatedProjects} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
              totalPrograms={filteredProjects.length}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-90 space-y-6">
          <ProjectDueDate />
          <ReviewerActivity />
        </div>
      </div>
    </div>
  );
};

export default AllProject;
