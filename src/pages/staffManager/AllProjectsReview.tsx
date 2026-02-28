/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import PriorityDropdown from "@/components/client/AllProgram/PriorityDropdown";
import Pagination from "@/common/Pagination";
import { DateRange } from "react-day-picker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  ChevronDown,
  Eye,
  PencilLine,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useGetAllReviewProjectsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";

import SmUpcomingDeadline from "@/components/staffManager/overview/SmUpcomingDeadline";
import ReviewerActivity from "@/components/staffManager/projectReview/ReviewerActivity";
import { Badge } from "@/components/ui/badge";

import ViewSubmissionModal from "@/components/staffManager/projectReview/ViewSubmissionModal";
import ReviewSubmissionModal from "@/components/staffManager/projectReview/ReviewSubmissionModal";
import DeleteSubmissionModal from "@/components/staffManager/projectReview/DeleteSubmissionModal";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import SkeletonLoading from "@/common/Skeleton/SkeletonLoading";
import ProjectReviewOverviewCard from "./ProjectReviewOverviewCard";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface IProjectTableProps {
  title?: string;
  programId?: string;
}

const priorityOrder: Record<string, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const AllProjectsReview = ({ title = "All Projects" }: IProjectTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const [priorityFilter, setPriorityFilter] = useState<
    "" | "APPROVED" | "PENDING" | "REJECTED"
  >("");

  const [sortColumn, setSortColumn] = useState<"" | "startDate" | "endDate">(
    "",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  /*   RTK QUERY   */
  const { data, isLoading } = useGetAllReviewProjectsQuery({
    status: priorityFilter || undefined,
    fromDate: dateRange?.from?.toISOString(),
    toDate: dateRange?.to?.toISOString(),
    page: currentPage,
    limit,
    search: search || undefined,
  });

  const projects = useMemo(() => data?.data ?? [], [data]);
  const meta = data?.data?.meta;

  const totalProjects = meta?.total ?? projects.length;
  const itemsPerPage = meta?.limit ?? limit;
  const totalPages =
    meta?.totalPages ?? Math.ceil(totalProjects / itemsPerPage);

  /*   SORTING   */
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
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return list.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (sortColumn === "startDate") {
        return sortOrder === "asc"
          ? priorityOrder[aVal] - priorityOrder[bVal]
          : priorityOrder[bVal] - priorityOrder[aVal];
      }

      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === "number") {
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

  const handleExportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    // Title
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // Sub info (filters)
    doc.setFontSize(10);
    const filterText = [
      priorityFilter ? `Status: ${priorityFilter}` : "Status: All",
      dateRange?.from && dateRange?.to
        ? `Date: ${format(dateRange.from, "dd MMM yyyy")} - ${format(
          dateRange.to,
          "dd MMM yyyy",
        )}`
        : "Date: All",
    ];

    doc.text(filterText.join(" | "), 14, 22);

    // Table data
    const tableColumn = [
      "Project Name",
      "Assigned Staff",
      "Status",
      "Priority",
      "Submit Date",
    ];

    const tableRows = sortedProjects.map((project) => [
      project.project.name,
      project.assignStuff?.avatars?.length
        ? `${project.assignStuff.avatars.length} Staff`
        : "No Staff",
      project.status,
      project.project.priority,
      formatDate(project.createdAt),
    ]);

    autoTable(doc, {
      startY: 28,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: "bold",
      },
    });

    doc.save(`projects-submissions-review-${Date.now()}.pdf`);
  };

  const statusClasses: Record<string, string> = {
    APPROVED: "text-[#0B5A4A] bg-[#EBFFF2] border border-[#ABEFD5]",
    PENDING: "text-[#665CFF] bg-[#F2F2FF] border border-[#C7C2FF]",
    REJECTED: "text-[#B00020] bg-[#FFEAEA] border border-[#FFB3B3]",
  };

  const statusLabels: any = {
    APPROVED: "APPROVED",
    PENDING: "PENDING",
    REJECTED: "RETURNED",
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();


  return (
    <>
      <ProjectReviewOverviewCard />
      <div className="min-h-screen py-6">
        <div className="flex gap-3 justify-between">
          <div className="bg-white rounded-lg border border-gray-200 grow">
            {/* HEADER */}
            <div className="flex justify-between px-6 py-4 border-b border-gray-200">
              <h1 className="text-lg font-semibold">{title}</h1>

              <div className="flex gap-3">
                {/* SEARCH */}
                <input
                  value={search}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder="Search project..."
                  className="border border-gray-200 rounded px-4 py-2 text-sm"
                />

                {/* DATE RANGE */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="default"
                      className="flex gap-2 text-sm font-normal border border-gray-200 rounded h-full"
                    >
                      <CalendarIcon size={16} />
                      {dateRange?.from && dateRange?.to
                        ? `${format(dateRange.from, "MMM dd, yyyy")} - ${format(
                          dateRange.to,
                          "MMM dd, yyyy",
                        )}`
                        : "Select Range"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-auto p-0 bg-white" align="end">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        setCurrentPage(1);
                        setDateRange(range);
                      }}
                      numberOfMonths={1}
                    />

                    {dateRange?.from && (
                      <div className="p-3 border-t text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDateRange(undefined)}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                {/* STATUS FILTER */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex gap-2 items-center border border-gray-200 px-4 py-2 rounded text-sm">
                    {priorityFilter === "" ? "All Status" : priorityFilter}
                    <ChevronDown size={16} />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    {["ALL", "APPROVED", "PENDING", "REJECTED"].map((p) => (
                      <DropdownMenuItem
                        key={p}
                        onClick={() => {
                          setCurrentPage(1);
                          setPriorityFilter(p === "ALL" ? "" : (p as any));
                        }}
                      >
                        {p}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  onClick={handleExportPDF}
                  className="flex gap-2 text-sm font-normal border border-gray-200 rounded h-full"
                >
                  <Download size={16} />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* TABLE */}
            {isLoading ? (
              <SkeletonLoading count={10} direction="vertical" height="h-10" />
            ) : sortedProjects.length === 0 ? (
              <div className="flex items-center justify-center h-[60vh] text-gray-400">
                No projects found.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "name",
                      "assignStaff",
                      "status",
                      "priority",
                      "submitDate",
                      "actions",
                    ].map((col) => (
                      <th
                        key={col}
                        onClick={
                          col !== "actions" ? () => handleSort(col) : undefined
                        }
                        className="px-6 py-3 text-left text-xs font-semibold capitalize cursor-pointer"
                      >
                        {col.replace(/([A-Z])/g, " $1")}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {sortedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{project.project.name}</td>
                      <td className="px-6 py-3.5">
                        {project?.employee?.user?.profileImage ? (
                          <Avatar className="size-10 border border-gray-300">
                            <AvatarImage src={project?.employee?.user?.profileImage} />
                            <AvatarFallback className="text-base font-normal">
                              {getInitials(project?.employee?.user?.name)}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <AvatarFallback>
                            {getInitials(project?.employee?.user?.name)}
                          </AvatarFallback>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={statusClasses[project.status]}
                        >
                          {statusLabels[project.status]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <PriorityDropdown
                          defaultPriority={project.project.priority}
                        />
                      </td>
                      <td className="px-6 py-4">
                        {formatDate(project.createdAt)}
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <Eye
                          size={18}
                          className="text-blue-600 cursor-pointer"
                          onClick={() => {
                            setSelectedSubmission(project);
                            navigate(`/staff-manager-panel/projects/project-details/${project.id}`)
                          }}
                        />
                        <PencilLine
                          size={18}
                          className="text-green-600 cursor-pointer"
                          onClick={() => {
                            setSelectedSubmission(project);
                            setReviewOpen(true);
                          }}
                        />
                        <Trash2
                          size={18}
                          className="text-red-600 cursor-pointer"
                          onClick={() => {
                            setSelectedSubmission(project);
                            setDeleteOpen(true);
                          }}
                        />
                      </td>
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
    </>
  );
};

export default AllProjectsReview;
