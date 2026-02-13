import ProjectStats from "@/components/staffManager/Projects/ProjectStats";
import { useState, useMemo } from "react";
import PriorityDropdown from "@/components/client/AllProgram/PriorityDropdown";
import Pagination from "@/common/Pagination";
// import { IProject } from "@/types/project";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
// import { useDebounce } from "@/hooks/useDebounce";
// import { useGetProjectsByProgramIdQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { Progress } from "@/components/ui/progress";
import { useUpdateProjectMutation } from "@/store/Api/ProjectApi/ProjectApi";
import { UpdateProjectPayload } from "@/types/Projects";
import { toast } from "sonner";
import UpdateProjectModal from "../client/Program/UpdateProjectModal";
import { ChevronDown, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import DropdownSelect from "@/common/DropdownSelect";
import RenderStaffAvatars from "@/components/client/RenderStaffAvater";
import SkeletonLoading from "@/common/Skeleton/SkeletonLoading";
import { useGetEmployeeAllProjectsQuery } from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";

// import EditProjectModal from "./EditProjectModal";

interface IProjectTableProps {
  title?: string;
  programId?: string;
}

const priorityOrder: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};


const StaffEmployeeProjects = ({
  title = "All Projects",
}: IProjectTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  const [sortBy] = useState<string>("");
  const [sortOrder] = useState<"asc" | "desc">("asc");

  const [editProject] = useState<UpdateProjectPayload | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { data, isLoading, error } = useGetEmployeeAllProjectsQuery({
    priority: priorityFilter === "ALL" ? undefined : priorityFilter,
    status: statusFilter === "ALL" ? undefined : statusFilter,
    search: search || undefined,
    page: currentPage,
    limit,
  });

  const [updateProject] = useUpdateProjectMutation();

  const projects = useMemo(() => data?.data?.projects?.data ?? [], [data]);

  const meta = data?.data?.meta;
  const totalProjects = meta?.total ?? projects.length;
  const itemsPerPage = meta?.limit ?? limit;
  const totalPages =
    meta?.totalPages ?? Math.ceil(totalProjects / itemsPerPage);

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
  ];

  const sortedProjects = useMemo(() => {
    const list = [...projects];

    if (!sortBy) {
      return list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return list.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (sortBy === "priority") {
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
  }, [projects, sortBy, sortOrder]);

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      : "-";

  const handleUpdateProject = async (project: UpdateProjectPayload) => {
    try {
      const res = await updateProject({
        id: editProject?.id,
        ...project,
      }).unwrap();
      if (res.success) {
        toast.success("Project updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update project");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h1 className="text-gray-400 text-center">
          Something wrong to fetch projects.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="flex gap-3 justify-between">
        <div className="bg-white rounded-lg border border-gray-200 mt-10 grow">
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold">{title}</h1>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400 size-4" />
                <input
                  value={search}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder="Search project..."
                  className="pl-9 pr-4 py-2 border border-[#CAD2DB] rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter By */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent border border-[#CAD2DB] h-10"
                  >
                    <Filter className="size-4" />
                    Filter By
                    <ChevronDown className="size-4" />
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

          {/* Table */}
          {isLoading ? (
            <SkeletonLoading count={10} height="h-10" direction="vertical" />
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "name",
                    "assignStaff",
                    "priority",
                    "deadline",
                    "progress",
                  ].map(
                    (col) =>
                      col && (
                        <th
                          key={col}
                          className="px-6 py-3 text-left text-xs font-semibold capitalize"
                        >
                          {col.replace(/([A-Z])/g, " $1")}
                        </th>
                      ),
                  )}
                </tr>
              </thead>

              <tbody>
                <tr>
                  {sortedProjects.length === 0 && (
                    <div className="text-gray-400 p-10 text-center">
                      No projects found.
                    </div>
                  )}
                </tr>
                {sortedProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{project.name}</td>
                    <td className="px-6 py-4">
                      {project.projectEmployees?.length > 0 ? (
                        <RenderStaffAvatars
                          staff={project.projectEmployees.map(
                            (emp: {
                              user?: { name: string; image: string };
                            }) => ({
                              name: emp.user?.name || "Staff",
                              avatar:
                                emp.user?.image ||
                                "https://ui-avatars.com/api/?name=Staff",
                            }),
                          )}
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">No Staff</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <PriorityDropdown defaultPriority={project.priority} />
                    </td>

                    {/* <td className="px-6 py-4">{formatDate(project.startDate)}</td> */}

                    <td className="px-6 py-4">
                      {formatDate(project.deadline)}
                    </td>

                    <td className="px-6 py-4 w-[180px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500">
                          {project.progress}%
                        </span>
                        <Progress value={project.progress} />
                      </div>
                    </td>

                    {/* <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setEditProject(project);
                        setEditModalOpen(true);
                      }}
                    >
                      <FaEdit className="text-blue-600" />
                    </button>
                  </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalPrograms={totalProjects}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {editModalOpen && editProject && (
        <UpdateProjectModal
          project={editProject}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleUpdateProject}
        />
      )}
    </div>
  );
};

export default StaffEmployeeProjects;
