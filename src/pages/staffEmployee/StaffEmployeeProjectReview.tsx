/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Loader2, Download, Eye, Trash2, ChevronDown, Calendar as CalendarIcon } from "lucide-react";
import Pagination from "@/common/Pagination";
import { DateRange } from "react-day-picker";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  useGetAllEmployeeSubmissionsQuery,
  useDeleteEmployeeSubmissionMutation,
} from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ViewSubmissionModal from "@/components/staffEmployee/Overview/ViewSubmissionModal";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import ReviewCards from "@/components/staffEmployee/review/ReviewCards";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  APPROVED: {
    label: "APPROVED",
    classes: "text-[#0B5A4A] bg-[#EBFFF2] border border-[#ABEFD5]",
  },
  PENDING: {
    label: "PENDING",
    classes: "text-[#665CFF] bg-[#F2F2FF] border border-[#C7C2FF]",
  },
  REJECTED: {
    label: "RETURNED",
    classes: "text-[#B00020] bg-[#FFEAEA] border border-[#FFB3B3]",
  },
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const AllProjectsReview = ({ title = "My Submissions" }: { title?: string }) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "APPROVED" | "PENDING" | "REJECTED">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const [selectedSubmission,] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  /* ── API ── */
  const { data, isLoading } = useGetAllEmployeeSubmissionsQuery(
    statusFilter ? { status: statusFilter } : {}
  );
  const [deleteSubmission, { isLoading: isDeleting }] =
    useDeleteEmployeeSubmissionMutation();

  const allSubmissions: any[] = data?.data ?? [];

  /* ── CLIENT-SIDE FILTERING ── */
  const filtered = useMemo(() => {
    let list = [...allSubmissions];

    if (statusFilter) list = list.filter((s) => s.status === statusFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.project?.name?.toLowerCase().includes(q) ||
          s.information?.toLowerCase().includes(q) ||
          s.submission?.toLowerCase().includes(q)
      );
    }

    if (dateRange?.from) {
      list = list.filter((s) => {
        const t = new Date(s.createdAt).getTime();
        const from = dateRange.from!.getTime();
        const to = dateRange.to ? dateRange.to.getTime() : Infinity;
        return t >= from && t <= to;
      });
    }

    list.sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === "desc" ? diff : -diff;
    });

    return list;
  }, [allSubmissions, statusFilter, search, dateRange, sortOrder]);

  /* ── PAGINATION ── */
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      : "—";

  /* ── PDF EXPORT ── */
  const handleExportPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(
      [
        statusFilter ? `Status: ${statusFilter}` : "Status: All",
        dateRange?.from && dateRange?.to
          ? `Date: ${format(dateRange.from, "dd MMM yyyy")} - ${format(dateRange.to, "dd MMM yyyy")}`
          : "Date: All",
      ].join(" | "),
      14,
      22
    );
    autoTable(doc, {
      startY: 28,
      head: [["Project", "Information", "Submitted By", "Elements", "Status", "Date"]],
      body: filtered.map((s) => [
        s.project?.name ?? "—",
        s.information ?? "—",
        s.employee?.user?.name ?? "—",
        `${s.elements?.length ?? 0} chart(s)`,
        s.status,
        formatDate(s.createdAt),
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: "bold" },
    });
    doc.save(`my-submissions-${Date.now()}.pdf`);
  };

  /* ── DELETE ── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSubmission(deleteTarget).unwrap();
      toast.success("Submission deleted successfully.");
      // If last item on current page and not first page, go back one
      if (paginated.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete submission.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div className="min-h-screen py-6">
        <ReviewCards />

        <div className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* ── Toolbar ── */}
            <div className="flex flex-wrap justify-between items-center gap-3 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {/* Back button */}
                <h1 className="text-lg font-semibold">{title}</h1>
                {totalItems > 0 && (
                  <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
                    {totalItems} total
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Search */}
                <input
                  value={search}
                  onChange={(e) => { setCurrentPage(1); setSearch(e.target.value); }}
                  placeholder="Search by project or info..."
                  className="border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                />

                {/* Date Range */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="flex gap-2 text-sm font-normal h-[38px] border border-gray-200">
                      <CalendarIcon size={15} />
                      {dateRange?.from && dateRange?.to
                        ? `${format(dateRange.from, "MMM dd")} – ${format(dateRange.to, "MMM dd, yyyy")}`
                        : "Date Range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="end">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(r) => { setCurrentPage(1); setDateRange(r); }}
                      numberOfMonths={1}
                    />
                    {dateRange?.from && (
                      <div className="p-3 border-t text-right">
                        <Button variant="ghost" size="sm" onClick={() => setDateRange(undefined)}>
                          Clear
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex gap-2 items-center border border-gray-200 px-4 py-2 rounded text-sm h-[38px]">
                    {statusFilter === "" ? "All Status" : statusFilter}
                    <ChevronDown size={15} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {["ALL", "APPROVED", "PENDING", "REJECTED"].map((s) => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() => { setCurrentPage(1); setStatusFilter(s === "ALL" ? "" : (s as any)); }}
                      >
                        {s}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Toggle */}
                <Button
                  className="text-sm font-normal h-[38px] border border-gray-200"
                  onClick={() => { setCurrentPage(1); setSortOrder((o) => (o === "desc" ? "asc" : "desc")); }}
                >
                  {sortOrder === "desc" ? "↓ Newest" : "↑ Oldest"}
                </Button>

                {/* Export PDF */}
                <Button
                  onClick={handleExportPDF}
                  className="flex gap-2 text-sm font-normal h-[38px] border border-gray-200"
                >
                  <Download size={15} />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* ── Table ── */}
            {isLoading ? (
              <div className="flex items-center justify-center h-[40vh]">
                <Loader2 className="animate-spin text-blue-500" size={28} />
              </div>
            ) : paginated.length === 0 ? (
              <div className="flex items-center justify-center h-[40vh] text-gray-400 text-sm">
                No submissions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Project", "Information", "Submitted By", "Elements", "Status", "Submit Date", "Actions"].map((col) => (
                        <th
                          key={col}
                          className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((submission) => {
                      const empName = submission.employee?.user?.name ?? "—";
                      const profileImg = submission.employee?.user?.profileImage ?? undefined;
                      const statusCfg = STATUS_CONFIG[submission.status] ?? {
                        label: submission.status,
                        classes: "text-gray-600 bg-gray-100 border border-gray-300",
                      };

                      return (
                        <tr key={submission.id} className="hover:bg-gray-50 border-b border-gray-100">
                          {/* Project */}
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-gray-800">
                              {submission.project?.name ?? "—"}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {submission.project?.status ?? ""}
                            </p>
                          </td>

                          {/* Information */}
                          <td className="px-6 py-4 max-w-[180px]">
                            <p className="text-sm text-gray-600 truncate" title={submission.information}>
                              {submission.information}
                            </p>
                          </td>

                          {/* Submitted By */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={profileImg} alt={empName} />
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                                  {getInitials(empName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium whitespace-nowrap">{empName}</span>
                            </div>
                          </td>

                          {/* Elements */}
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {submission.elements?.length ?? 0} chart{(submission.elements?.length ?? 0) !== 1 ? "s" : ""}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={`${statusCfg.classes} text-xs px-3 py-1 whitespace-nowrap`}
                            >
                              {statusCfg.label}
                            </Badge>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {formatDate(submission.createdAt)}
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 p-0 hover:bg-blue-50"
                                title="View details"
                                onClick={() => navigate(`/staff-employee-panel/projects/project-details/${submission.project?.id}`)}
                              >
                                <Eye size={15} className="text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="size-8 p-0 hover:bg-red-50"
                                title="Delete submission"
                                onClick={() => setDeleteTarget(submission.id)}
                              >
                                <Trash2 size={15} className="text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Pagination (10 per page) ── */}
            {!isLoading && totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalPrograms={totalItems}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Modal */}
      <ViewSubmissionModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={selectedSubmission}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}

      >
        <AlertDialogContent className="z-[9999] bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the selected submission and all its chart elements. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin size-4 mr-2" />
              ) : (
                <Trash2 className="size-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AllProjectsReview;
