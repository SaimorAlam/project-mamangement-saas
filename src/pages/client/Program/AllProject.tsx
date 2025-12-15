/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { FaSpinner, FaEdit } from "react-icons/fa";
import PriorityDropdown from "@/components/client/AllProgram/PriorityDropdown";
import //   useUpdateProjectMutation,
"@/store/Api/ProjectApi/ProjectApi";
import Pagination from "@/common/Pagination";
// import { IProject } from "@/types/project";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetProjectsByProgramIdQuery } from "@/store/Api/ProgramApi/ProgramApi";
// import EditProjectModal from "./EditProjectModal";

interface IProjectTableProps {
  title?: string;
  programId: string;
  hideCreatedOn?: boolean;
}

const priorityOrder: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const AllProject = ({
  title = "All Projects",
  programId,
  hideCreatedOn = false,
}: IProjectTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    "ALL" | "HIGH" | "MEDIUM" | "LOW"
  >("ALL");

  const [sortColumn, setSortColumn] = useState<any | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const debouncedSearch = useDebounce(search, 500);

  //   const [editProject, setEditProject] = useState<IProject | null>(null);
  //   const [editModalOpen, setEditModalOpen] = useState(false);

  const { data, isLoading } = useGetProjectsByProgramIdQuery({
    programId,
    page: currentPage,
    limit,
    search: debouncedSearch || undefined,
    priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
  });

  //   const [updateProject] = useUpdateProjectMutation();

  const projects = useMemo(() => data?.data ?? [], [data]);

  const meta = data?.meta;

  const totalProjects = meta?.total ?? projects.length;
  const itemsPerPage = meta?.limit ?? limit;
  const totalPages =
    meta?.totalPages ?? Math.ceil(totalProjects / itemsPerPage);

  const handleSort = (column: any) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedProjects = useMemo(() => {
    const list = [...projects];

    if (!sortColumn) {
      return list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return list.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (sortColumn === "priority") {
        return sortOrder === "asc"
          ? priorityOrder[aVal as string] - priorityOrder[bVal as string]
          : priorityOrder[bVal as string] - priorityOrder[aVal as string];
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [projects, sortColumn, sortOrder]);

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <FaSpinner className="animate-spin" size={24} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="flex justify-between px-6 py-4 border-b">
          <h1 className="text-lg font-semibold">{title}</h1>

          <div className="flex gap-3">
            <input
              value={search}
              onChange={(e) => {
                setCurrentPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search project..."
              className="border rounded px-4 py-2 text-sm"
            />

            <DropdownMenu>
              <DropdownMenuTrigger className="border px-4 py-2 rounded">
                {priorityFilter}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                "projectName",
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
                          ? () => handleSort(col as any)
                          : undefined
                      }
                      className="px-6 py-3 text-left text-xs font-semibold cursor-pointer"
                    >
                      {col.replace(/([A-Z])/g, " $1")}
                    </th>
                  )
              )}
            </tr>
          </thead>

          <tbody>
            {sortedProjects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{project.projectName}</td>

                <td className="px-6 py-4">
                  <PriorityDropdown defaultPriority={project.priority} />
                </td>

                {!hideCreatedOn && (
                  <td className="px-6 py-4">{formatDate(project.createdAt)}</td>
                )}

                <td className="px-6 py-4">{formatDate(project.updatedAt)}</td>

                <td className="px-6 py-4">{formatDate(project.deadline)}</td>

                <td className="px-6 py-4">{project.progress}%</td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      //   setEditProject(project);
                      //   setEditModalOpen(true);
                    }}
                  >
                    <FaEdit className="text-blue-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalPrograms={totalProjects}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* {editModalOpen && editProject && (
        <EditProjectModal
          project={editProject}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={async (payload) => {
            await updateProject({
              id: editProject.id,
              ...payload,
            });
            setEditModalOpen(false);
          }}
        />
      )} */}
    </div>
  );
};

export default AllProject;
