/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { FaSpinner } from "react-icons/fa";
import PriorityDropdown from "@/components/client/AllProgram/PriorityDropdown";
import { useGetAllProgramQuery } from "@/store/Api/ProgramApi/ProgramApi";
import Pagination from "@/common/Pagination";
import { IProgram } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/useDebounce";

interface IProgramTableProps {
  title?: string;
  hideCreatedOn?: boolean;
}

const priorityOrder: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const StaffManagerAllProgram = ({
  title = "All Program",
  hideCreatedOn = false,
}: IProgramTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    "ALL" | "HIGH" | "MEDIUM" | "LOW"
  >("ALL");

  const [sortColumn, setSortColumn] = useState<keyof IProgram | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetAllProgramQuery({
    page: currentPage,
    limit,
    programName: debouncedSearch || undefined,
    priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
  });

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
      // Default: sort by createdAt descending
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 h-[60vh]">
        <FaSpinner size={24} className="animate-spin" />
      </div>
    );
  }

  // Ensure always 10 rows
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
            {/* Search */}
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

            {/* Priority Filter */}
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
                ].map(
                  (col) =>
                    col && (
                      <th
                        key={col}
                        onClick={() => handleSort(col as keyof IProgram)}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer"
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
                            style={{
                              width: `${program.progress}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {program.progress}%
                        </span>
                      </div>
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
                    ].map(
                      (col, i) =>
                        col && (
                          <td
                            key={i}
                            className="px-6 py-4 text-sm text-gray-200"
                          >
                            &nbsp;
                          </td>
                        )
                    )}
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
    </div>
  );
};

export default StaffManagerAllProgram;

// import { useState } from "react";
// import { Filter, ChevronLeft, ChevronRight } from "lucide-react";

// import { IProgram } from "@/types";
// import PriorityDropdown from "@/components/client/AllProgram/PriorityDropdown";

// interface IProgramTableProps {
//   title?: string;
//   programs?: IProgram[] | undefined;
//   hideCreatedOn?: boolean;
// }

// // === AllProgramTable Component ===
// const StaffManagerAllProgram = ({
//   title = "All Program",
//   programs: propPrograms,
//   hideCreatedOn = false,
// }: IProgramTableProps) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPrograms = 300;
//   const itemsPerPage = 11;

//   const programs =
//     propPrograms ||
//     Array.from({ length: 13 }, (_, i) => ({
//       id: i + 1,
//       name: "Program Name",
//       projects: [20, 1, 0, 15, 12, 25, 12, 15, 0, 25, 20, 1][i % 12],
//       assignManager: ["user1", "user2", "user3"],
//       priority: "High" as const,
//       createdOn: "15-6-2024",
//       updatedOn: "15-6-2024",
//       deadline: "24-7-2024",
//       progress: [35, 50, 0, 60, 80, 80, 80, 0, 80, 80, 35, 50][
//         i % 12
//       ],
//     }));

//   const totalPages = Math.ceil(totalPrograms / itemsPerPage);

//   return (
//     <div className="min-h-screen py-6">
//       <div className="bg-white rounded-lg border border-gray-200">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//           <h1 className="text-lg font-semibold text-gray-900">
//             {title}
//           </h1>
//           <button className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
//             <Filter size={16} />
//             Filter By
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
//                   Program
//                 </th>
//                 {!hideCreatedOn && (
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
//                     Projects
//                   </th>
//                 )}
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
//                   Assign Manager
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
//                   Priority
//                 </th>
//                 {!hideCreatedOn && (
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
//                     Created On
//                   </th>
//                 )}
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
//                   Updated On
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
//                   Deadline
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
//                   Progress
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {programs.map((program) => (
//                 <tr key={program.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 text-sm text-gray-900">
//                     {program.name}
//                   </td>
//                   {!hideCreatedOn && (
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {program.projects}{" "}
//                       {program.projects === 1
//                         ? "Project"
//                         : "Projects"}
//                     </td>
//                   )}
//                   <td className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="flex -space-x-2">
//                         {program.assignManager
//                           .slice(0, 3)
//                           .map((_, idx) => (
//                             <img
//                               key={idx}
//                               src={`https://i.pravatar.cc/150?img=${
//                                 program.id * 3 + idx
//                               }`}
//                               alt="Manager"
//                               className="w-8 h-8 rounded-full border-2 border-white"
//                             />
//                           ))}
//                         <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-700">
//                           +3
//                         </div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Priority dropdown with dynamic color */}
//                   <td className="px-6 py-4">
//                     <PriorityDropdown
//                       defaultPriority={program.priority}
//                     />
//                   </td>

//                   {!hideCreatedOn && (
//                     <td className="px-6 py-4 text-sm text-gray-600">
//                       {program.createdOn}
//                     </td>
//                   )}
//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     {program.updatedOn}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-600">
//                     {program.deadline}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-3">
//                       <div className="flex-1 max-w-[120px]">
//                         <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                           <div
//                             className="h-full bg-blue-600 rounded-full transition-all duration-300"
//                             style={{ width: `${program.progress}%` }}
//                           />
//                         </div>
//                       </div>
//                       <span className="text-sm text-gray-600 min-w-[35px]">
//                         {program.progress}%
//                       </span>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer Pagination */}
//         <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
//           <div className="text-sm text-gray-600">
//             Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
//             {Math.min(currentPage * itemsPerPage, totalPrograms)} of{" "}
//             <span className="font-semibold">{totalPrograms}</span>{" "}
//             Programs
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() =>
//                 setCurrentPage(Math.max(1, currentPage - 1))
//               }
//               disabled={currentPage === 1}
//               className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft size={16} />
//               Prev
//             </button>

//             <button
//               onClick={() => setCurrentPage(1)}
//               className={`px-3 py-2 text-sm rounded-md ${
//                 currentPage === 1
//                   ? "bg-blue-600 text-white"
//                   : "border border-gray-300 hover:bg-gray-50"
//               }`}
//             >
//               1
//             </button>

//             <button
//               onClick={() => setCurrentPage(2)}
//               className={`px-3 py-2 text-sm rounded-md ${
//                 currentPage === 2
//                   ? "bg-blue-600 text-white"
//                   : "border border-gray-300 hover:bg-gray-50"
//               }`}
//             >
//               2
//             </button>

//             <button
//               onClick={() => setCurrentPage(3)}
//               className={`px-3 py-2 text-sm rounded-md ${
//                 currentPage === 3
//                   ? "bg-blue-600 text-white"
//                   : "border border-gray-300 hover:bg-gray-50"
//               }`}
//             >
//               3
//             </button>

//             <span className="px-2 text-gray-500">...</span>

//             <button
//               onClick={() => setCurrentPage(30)}
//               className={`px-3 py-2 text-sm rounded-md ${
//                 currentPage === 30
//                   ? "bg-blue-600 text-white"
//                   : "border border-gray-300 hover:bg-gray-50"
//               }`}
//             >
//               30
//             </button>

//             <button
//               onClick={() =>
//                 setCurrentPage(Math.min(totalPages, currentPage + 1))
//               }
//               disabled={currentPage === totalPages}
//               className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StaffManagerAllProgram;
