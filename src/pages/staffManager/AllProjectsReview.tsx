/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { ChevronDown, Eye, PencilLine, Trash2 } from "lucide-react";
import { useGetAllReviewProjectsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import SmUpcomingDeadline from "@/components/staffManager/overview/SmUpcomingDeadline";
import ReviewerActivity from "@/components/staffManager/projectReview/ReviewerActivity";
import { Badge } from "@/components/ui/badge";
import ViewSubmissionModal from "@/components/staffManager/projectReview/ViewSubmissionModal";
import ReviewSubmissionModal from "@/components/staffManager/projectReview/ReviewSubmissionModal";
import DeleteSubmissionModal from "@/components/staffManager/projectReview/DeleteSubmissionModal";

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

const AllProjectsReview = ({
  title = "All Projects",
  // programId = "2a4b2086-0147-40ca-be12-1bfd855046fd",
}: IProjectTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    "ALL" | "HIGH" | "MEDIUM" | "LOW"
  >("ALL");

  const [sortColumn, setSortColumn] = useState<any | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);


  // const debouncedSearch = useDebounce(search, 500);


  // const { data, isLoading } = useGetAllProjectsQuery({});
  const { data, isLoading } = useGetAllReviewProjectsQuery({});


  const projects = useMemo(() => data?.data ?? [], [data]);
  //   const programDetails = useMemo(() => data?.data?.sidebar ?? [], [data]); // Sidebar data

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <FaSpinner className="animate-spin" size={24} />
      </div>
    );
  }
  const statusClasses: Record<string, string> = {
    APPROVED: "text-[#0B5A4A] bg-[#EBFFF2] border border-[#ABEFD5]",
    PENDING: "text-[#665CFF] bg-[#F2F2FF] border border-[#C7C2FF]",
    REJECTED: "text-[#B00020] bg-[#FFEAEA] border border-[#FFB3B3]",
    DRAFT: "text-[#6B7280] bg-[#F3F4F6] border border-[#D1D5DB]",
    OVERDUE: "text-[#6B7280] bg-[#F3F4F6] border border-[#D1D5DB]",
  };

  const statusLabels: any = {
    APPROVED: "APPROVED",
    PENDING: "PENDING",
    REJECTED: "RETURNED",
    DRAFT: "DRAFT",
    OVERDUE: "OVERDUE",
  };

  return (
    <div className="min-h-screen py-6">
      <div className="flex gap-3 justify-between">
        <div className="bg-white rounded-lg border border-gray-200  grow">
          {
            sortedProjects.length === 0 ? (
              <div className="flex items-center justify-center h-[60vh]">
                <h1 className="text-gray-400 text-center">Still now, no projects has come for review.</h1>
              </div>
            ) : (
              <>


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
                        {priorityFilter} <ChevronDown className="text-gray-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {["ALL", "HIGH", "MEDIUM", "LOW"].map((p) => (
                          <>
                            <DropdownMenuItem
                              key={p}
                              onClick={() => {
                                setCurrentPage(1);
                                setPriorityFilter(p as any);
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
                        "status",
                        "priority",
                        // "startDate",
                        "submitDate",
                        //   "progress",
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
                              className="px-6 py-3 text-left text-xs font-semibold cursor-pointer capitalize"
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
                        <td className="px-6 py-4">{project.project.name}</td>
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
                          <Badge
                            variant="outline"
                            className={`py-1.5 px-3 min-w-20 ${statusClasses[project.status]
                              }`}
                          >
                            {statusLabels[project.status]}
                          </Badge>
                        </td>

                        <td className="px-6 py-4">
                          <PriorityDropdown defaultPriority={project.project.priority} />
                        </td>

                        {/* <td className="px-6 py-4">{formatDate(project.startDate)}</td> */}

                        <td className="px-6 py-4">{formatDate(project.createdAt)}</td>

                        <td className="px-6 py-4 flex gap-3">
                          {/* View */}
                          <button
                            onClick={() => {
                              setSelectedSubmission(project);
                              setViewOpen(true);
                            }}
                          >
                            <Eye className="text-blue-600 cursor-pointer" size={20}/>
                          </button>

                          {/* Review */}
                          <button
                            onClick={() => {
                              setSelectedSubmission(project);
                              setReviewOpen(true);
                            }}
                          >
                            <PencilLine className="text-green-600 cursor-pointer" size={20}/>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setSelectedSubmission(project);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 className="text-red-600 cursor-pointer"  size={20}/>
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
              </>
            )
          }
        </div>
        <div className="w-110 space-y-6">
          <SmUpcomingDeadline />
          <ReviewerActivity />
        </div>
      </div>
      <ViewSubmissionModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        submission={selectedSubmission}
      />

      <ReviewSubmissionModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        submission={selectedSubmission}
      />

      <DeleteSubmissionModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        submissionId={selectedSubmission}
      />
    </div>
  );
};

export default AllProjectsReview;
