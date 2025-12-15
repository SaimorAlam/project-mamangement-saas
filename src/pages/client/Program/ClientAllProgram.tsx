/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { FaSpinner, FaEdit } from "react-icons/fa";
import PriorityDropdown from "@/components/client/AllProgram/PriorityDropdown";
import {
  useGetAllProgramQuery,
  useUpdateProgramNameMutation,
} from "@/store/Api/ProgramApi/ProgramApi";
import Pagination from "@/common/Pagination";
import { IProgram } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/useDebounce";
// import { useNavigate } from "react-router-dom";
import EditProgramModal from "./EditProgramModal";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    "ALL" | "HIGH" | "MEDIUM" | "LOW"
  >("ALL");
  // const navigate = useNavigate();

  const [sortColumn, setSortColumn] = useState<keyof IProgram | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const debouncedSearch = useDebounce(search, 500);

  // Edit modal
  const [editProgram, setEditProgram] = useState<IProgram | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // API calls
  const { data, isLoading } = useGetAllProgramQuery({
    page: currentPage,
    limit,
    programName: debouncedSearch || undefined,
    priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
  });

  const [updateProgram] = useUpdateProgramNameMutation();

  const programs = useMemo(() => data?.data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const totalPrograms = meta?.total ?? programs.length;
  const itemsPerPage = meta?.limit ?? limit;
  const totalPages =
    meta?.totalPages ?? Math.ceil(totalPrograms / itemsPerPage);

  const handleSort = (column: keyof IProgram) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedPrograms = useMemo(() => {
    const list = [...programs];

    if (!sortColumn) {
      return list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return list.sort((a, b) => {
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
  }, [programs, sortColumn, sortOrder]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEditClick = (program: IProgram) => {
    setEditProgram(program);
    setEditModalOpen(true);
  };

  // const handleDeleteClick = async (programId: string) => {
  //   if (confirm("Are you sure you want to delete this program?")) {
  //     await deleteProgram(programId);
  //   }
  // };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 h-[60vh]">
        <FaSpinner size={24} className="animate-spin" />
      </div>
    );
  }

  const totalRows = 10;
  const emptyRowsCount = totalRows - sortedPrograms.length;
  const tableRows = [
    ...sortedPrograms,
    ...Array.from({ length: emptyRowsCount }).map(() => null),
  ];

  return (
    <div className="min-h-screen py-6">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b border-gray-200 gap-3">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by program name..."
              value={search}
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md w-64"
            />
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 text-sm border border-gray-300 rounded-md min-w-32">
                {priorityFilter === "ALL" ? "All Priorities" : priorityFilter}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {["ALL", "HIGH", "MEDIUM", "LOW"].map((p) => (
                  <DropdownMenuItem
                    key={p}
                    onClick={() => {
                      setCurrentPage(1);
                      setPriorityFilter(p as any);
                    }}
                  >
                    {p}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {[
                  "programName",
                  "priority",
                  !hideCreatedOn && "createdAt",
                  "updatedAt",
                  "deadline",
                  "progress",
                  "actions",
                ].map(
                  (col) =>
                    col && (
                      <th
                        key={col}
                        onClick={
                          col !== "actions"
                            ? () => handleSort(col as keyof IProgram)
                            : undefined
                        }
                        className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 ${
                          col !== "actions" ? "cursor-pointer" : ""
                        }`}
                      >
                        {col.toString().replace(/([A-Z])/g, " $1")}
                        {sortColumn === col &&
                          (sortOrder === "asc" ? " ▲" : " ▼")}
                      </th>
                    )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableRows.map((program, idx) =>
                program ? (
                  <tr key={program.id} className="hover:bg-gray-50 h-[60px]">
                    <td className="px-6 py-4 text-sm">{program.programName}</td>
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
                        <div className="flex-1 max-w-[120px] h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all"
                            style={{ width: `${program.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {program.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleEditClick(program)}>
                        <FaEdit className="text-blue-600" />
                      </button>
                      {/* <button onClick={() => handleDeleteClick(program.id)}>
                        <FaTrash className="text-red-600" />
                      </button> */}
                    </td>
                  </tr>
                ) : (
                  <tr key={`empty-${idx}`} className="h-[60px]">
                    {[
                      "programName",
                      "priority",
                      !hideCreatedOn && "createdAt",
                      "updatedAt",
                      "deadline",
                      "progress",
                      "actions",
                    ]
                      .filter(Boolean)
                      .map((_, i) => (
                        <td key={i} className="px-6 py-4 text-sm text-gray-200">
                          &nbsp;
                        </td>
                      ))}
                  </tr>
                )
              )}
            </tbody>
          </table>

          {sortedPrograms.length === 0 && (
            <div className="w-full h-[60vh] flex items-center justify-center">
              <h2 className="text-center text-5xl font-semibold text-gray-200 uppercase">
                No Program Data Available
              </h2>
            </div>
          )}
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

      {/* Edit Modal */}
      {editModalOpen && editProgram && (
        <EditProgramModal
          open={editModalOpen}
          program={editProgram}
          onClose={() => setEditModalOpen(false)}
          onSave={async (updatedData: Partial<IProgram>) => {
            await updateProgram({ id: editProgram.id, ...updatedData });
            setEditModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ClientAllProgram;
