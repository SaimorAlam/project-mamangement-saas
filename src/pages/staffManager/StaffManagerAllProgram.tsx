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

const StaffManagerAllProgram = ({
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
              {sortedPrograms.map((program: IProgram) => (
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
