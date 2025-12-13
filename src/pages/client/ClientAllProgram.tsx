import { useState, useMemo } from "react";
import PriorityDropdown from "@/components/client/AllProgram/PriorityDropdown";
import { useGetAllProgramQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { FaSpinner } from "react-icons/fa";
import { IProgram } from "@/types";
import Pagination from "@/common/Pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
interface IProgramTableProps {
  title?: string;
  hideCreatedOn?: boolean;
}

const priorityOrder: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const ClientAllProgram = ({
  title = "All Program",
  hideCreatedOn = false,
}: IProgramTableProps) => {
  const { data, isLoading } = useGetAllProgramQuery({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [priorityFilter, setPriorityFilter] = useState<
    "ALL" | "HIGH" | "MEDIUM" | "LOW"
  >("ALL");

  const programsMeta = useMemo(() => data?.data?.meta, [data]);
  const programs = useMemo(() => data?.data?.data || [], [data]);
  const totalPrograms = programsMeta?.total || programs.length;
  const itemsPerPage = programsMeta?.limit || 10;
  const totalPages =
    programsMeta?.totalPages || Math.ceil(totalPrograms / itemsPerPage);

  const handleSort = (column: keyof IProgram) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Apply filter
  const filteredPrograms = useMemo(() => {
    if (priorityFilter === "ALL") return programs;
    return programs.filter((p: IProgram) => p.priority === priorityFilter);
  }, [programs, priorityFilter]);

  // Apply sorting
  const sortedPrograms = useMemo(() => {
    return [...filteredPrograms].sort((a, b) => {
      if (!sortColumn) return 0;

      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (sortColumn === "priority") {
        const pA = priorityOrder[valA as string] || 0;
        const pB = priorityOrder[valB as string] || 0;
        return sortOrder === "asc" ? pA - pB : pB - pA;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      return 0;
    });
  }, [filteredPrograms, sortColumn, sortOrder]);
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <FaSpinner size={24} className="animate-spin" />
      </div>
    );
  }
  // Format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen py-6">
      {sortedPrograms.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b border-gray-200 gap-2">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 min-w-32">
                  {priorityFilter === "ALL" ? "All Priorities" : priorityFilter}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setPriorityFilter("ALL")}>
                    ALL Priorities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("HIGH")}>
                    HIGH
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("MEDIUM")}>
                    MEDIUM
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriorityFilter("LOW")}>
                    LOW
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("programName")}
                  >
                    Program{" "}
                    {sortColumn === "programName" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("priority")}
                  >
                    Priority{" "}
                    {sortColumn === "priority" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  {!hideCreatedOn && (
                    <th
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      Created On{" "}
                      {sortColumn === "createdAt" &&
                        (sortOrder === "asc" ? "▲" : "▼")}
                    </th>
                  )}
                  <th
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("updatedAt")}
                  >
                    Updated On{" "}
                    {sortColumn === "updatedAt" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("deadline")}
                  >
                    Deadline{" "}
                    {sortColumn === "deadline" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer"
                    onClick={() => handleSort("progress")}
                  >
                    Progress{" "}
                    {sortColumn === "progress" &&
                      (sortOrder === "asc" ? "▲" : "▼")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedPrograms?.map((program: IProgram) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {program.programName}
                    </td>
                    <td className="px-6 py-4">
                      <PriorityDropdown defaultPriority={program.priority} />
                    </td>
                    {!hideCreatedOn && (
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(program.createdAt)}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(program.updatedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(program.deadline)}
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

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalPrograms={totalPrograms}
            onPageChange={setCurrentPage}
          />
        </div>
      ) : (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <h2 className="w-[80vw] h-[60vh] flex items-center justify-center text-5xl font-semibold text-[#e8ecf0] uppercase">
            No Program Data Available
          </h2>
        </div>
      )}
    </div>
  );
};

export default ClientAllProgram;
