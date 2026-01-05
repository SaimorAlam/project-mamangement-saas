/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectStats from "@/components/staffManager/Projects/ProjectStats";
import { useState, useMemo } from "react";
import { FaSpinner } from "react-icons/fa";
import PriorityDropdown from "@/components/client/AllProgram/PriorityDropdown";
import Pagination from "@/common/Pagination";
// import { IProject } from "@/types/project";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
// import { useDebounce } from "@/hooks/useDebounce";
// import { useGetProjectsByProgramIdQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { Progress } from "@/components/ui/progress";
import { useUpdateProjectMutation } from "@/store/Api/ProjectApi/ProjectApi";
import { UpdateProjectPayload } from "@/types/Projects";
import { toast } from "sonner";
import UpdateProjectModal from "../client/Program/UpdateProjectModal";
import SideManagerMain from "@/components/staffManager/Projects/SideManagerMain";
import { ChevronDown } from "lucide-react";
import { useGetProgramAllProjectsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import ProjectLocationsMap from "@/components/staffManager/Projects/ProjectLocationsMap";

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

const StaffManagerProjects = ({
  title = "All Projects",
  // programId = "2a4b2086-0147-40ca-be12-1bfd855046fd",
}: IProjectTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
  "HIGH" | "MEDIUM" | "LOW" | ""
>("");

const priorityLabel =
  priorityFilter === "" ? "ALL PRIORITY" : priorityFilter;


  const [sortColumn, setSortColumn] = useState<any | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [editProject] = useState<UpdateProjectPayload | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);

  // const { data, isLoading, error } = useGetProgramAllProjectsQuery({});

  const { data, isLoading, error } = useGetProgramAllProjectsQuery({
    priority: priorityFilter || undefined,
    search: search || undefined
  });

  const [updateProject] = useUpdateProjectMutation();  

  const projects = useMemo(() => data?.data?.projects ?? [], [data]);
  const programDetails = useMemo(() => data?.data?.sidebar ?? [], [data]); // Sidebar data

  const meta = data?.data?.meta;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <FaSpinner className="animate-spin" size={24} />
      </div>
    );
  }
  if (!projects) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h1 className="text-gray-400 text-center">Not yet any Projects Found.</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h1 className="text-gray-400 text-center">Not yet any projects found to this manager.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <ProjectStats />
      <div className="flex gap-3 justify-between">
        <div className="bg-white rounded-lg border border-gray-200 mt-10 grow">
          {/* Header */}
          <div className="flex justify-between px-6 py-4 border-b border-gray-200">
            <h1 className="text-lg font-semibold">{title}</h1>

            <div className="flex gap-3">
              <input
                value={search}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearch(e.target.value);
                }}
                placeholder="Search project..."
                className="border border-gray-200 rounded px-4 py-2 text-sm"
              />

              <DropdownMenu>
                <DropdownMenuTrigger className="flex gap-3 items-center border border-gray-200 px-4 py-2 rounded">
                  {priorityLabel} <ChevronDown className="text-gray-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["ALL", "HIGH", "MEDIUM", "LOW"].map((p) => (
                    <>
                      <DropdownMenuItem
                        key={p}
                        onClick={() => {
                          setCurrentPage(1);
                          setPriorityFilter(p === "ALL" ? "" : (p as "HIGH" | "MEDIUM" | "LOW"));
                        }}
                      >
                        {p}
                      </DropdownMenuItem>
                    </>
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
                  "name",
                  "assignStaff",
                  "priority",
                  // "startDate",
                  "deadline",
                  "progress",
                  // "actions",
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
                        className="px-6 py-3 text-left text-xs font-semibold cursor-pointer capitalize"
                      >
                        {col.replace(/([A-Z])/g, " $1")}
                      </th>
                    )
                )}
              </tr>
            </thead>

            <tbody>
              <tr>
              {sortedProjects.length===0 && (<div className="text-gray-400 mt-5 ml-6">No projects found.</div>)}
              </tr>
              {sortedProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{project.name}</td>
                  <td className="px-6 py-4">
                    {project.assignStuff?.avatars?.length > 0 ? (
                      <div className="flex items-center">
                        <div className="flex -space-x-2">
                          {project.assignStuff.avatars
                            .slice(0, 3)
                            .map((staff: any, index: number) => (
                              <img
                                key={staff.name + index}
                                src={
                                  staff.image ??
                                  "https://images.pexels.com/photos/4126749/pexels-photo-4126749.jpeg"
                                }
                                alt={staff.name}
                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                style={{ zIndex: 10 - index }}
                              />
                            ))}

                          {/* +N Avatar */}
                          {project.assignStuff.avatars.length > 3 && (
                            <div
                              className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white 
                       flex items-center justify-center text-xs font-semibold text-gray-700"
                              style={{ zIndex: 6 }}
                            >
                              +{project.assignStuff.avatars.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">No Staff</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <PriorityDropdown defaultPriority={project.priority} />
                  </td>

                  {/* <td className="px-6 py-4">{formatDate(project.startDate)}</td> */}

                  <td className="px-6 py-4">{formatDate(project.deadline)}</td>

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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalPrograms={totalProjects}
            onPageChange={setCurrentPage}
          />
        </div>
        <SideManagerMain sidebar={programDetails} />
      </div>

      {/* <div className="bg-green-200 h-[80vh]"></div> */}
      {/* google map according to longitude and latitude  */}
      <ProjectLocationsMap projects={projects} />

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

export default StaffManagerProjects;
