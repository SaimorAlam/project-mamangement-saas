import { useState } from "react";
import { CardHeader } from "@/components/ui/card";
import BoxContainer from "../../../common/BoxContainer";
import {
  useGetAllEmployeeSubmissionsQuery,
  useDeleteEmployeeSubmissionMutation,
} from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";
import DropdownSelect from "./../../../common/DropdownSelect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Loader2, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewSubmissionModal from "./ViewSubmissionModal";
import { useNavigate } from "react-router-dom";
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

const MAX_ROWS = 5;

const statusOptions = [
  { value: "all", title: "All" },
  { value: "APPROVED", title: "Approved" },
  { value: "PENDING", title: "Pending" },
  { value: "REJECTED", title: "Rejected" },
];

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  APPROVED: {
    label: "Approved",
    classes: "text-[#0B5A4A] bg-[#EBFFF2] border border-[#ABEFD5]",
  },
  PENDING: {
    label: "In Review",
    classes: "text-[#665CFF] bg-[#F2F2FF] border border-[#C7C2FF]",
  },
  REJECTED: {
    label: "Returned",
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

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString.split("T")[0];
  }
};

const LatestSubmission = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedSubmission,] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data, isLoading } = useGetAllEmployeeSubmissionsQuery(
    statusFilter !== "all" ? { status: statusFilter } : {}
  );
  const [deleteSubmission, { isLoading: isDeleting }] =
    useDeleteEmployeeSubmissionMutation();

  const allSubmissions: any[] = data?.data ?? [];

  // Client-side status filter fallback
  const filtered =
    statusFilter === "all"
      ? allSubmissions
      : allSubmissions.filter((s) => s.status === statusFilter);

  // Sort newest first, then take only the first MAX_ROWS
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const visible = sorted.slice(0, MAX_ROWS);
  const hasMore = sorted.length > MAX_ROWS;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSubmission(deleteTarget).unwrap();
      toast.success("Submission deleted successfully.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete submission.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <BoxContainer>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0">
          <h4 className="font-semibold text-xl">My Latest Submissions</h4>
          <div className="mb-3 w-[200px]">
            <DropdownSelect
              placeholderText="Status"
              dropdownItem={statusOptions}
              onChange={setStatusFilter}
            />
          </div>
        </CardHeader>

        <div className="border border-[#E2E8F0] rounded-lg w-full">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E2E8F0] bg-[#F7F9FA]">
                  <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                    Project
                  </TableHead>
                  <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                    Information
                  </TableHead>
                  <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                    Submitted By
                  </TableHead>
                  <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                    Date
                  </TableHead>
                  <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                    Status
                  </TableHead>
                  <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <Loader2
                        className="animate-spin mx-auto text-blue-500"
                        size={24}
                      />
                    </TableCell>
                  </TableRow>
                ) : visible.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No submissions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((submission) => {
                    const employeeName =
                      submission.employee?.user?.name ?? "—";
                    const profileImage =
                      submission.employee?.user?.profileImage ?? undefined;
                    const statusCfg = STATUS_CONFIG[submission.status] ?? {
                      label: submission.status,
                      classes:
                        "text-gray-600 bg-gray-100 border border-gray-300",
                    };

                    return (
                      <TableRow
                        key={submission.id}
                        className="border-b border-[#E2E8F0] hover:bg-muted/30 transition-colors odd:bg-white even:bg-[#F7F9FA]"
                      >
                        {/* Project */}
                        <TableCell className="px-6 py-3.5 font-medium text-sm">
                          {submission.project?.name ?? "—"}
                          <span className="block text-xs text-gray-400 font-normal mt-0.5">
                            {submission.project?.status ?? ""}
                          </span>
                        </TableCell>

                        {/* Information */}
                        <TableCell className="px-6 py-3.5 text-sm text-muted-foreground max-w-[180px] truncate">
                          {submission.information}
                        </TableCell>

                        {/* Employee */}
                        <TableCell className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage
                                src={profileImage}
                                alt={employeeName}
                              />
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                                {getInitials(employeeName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {employeeName}
                            </span>
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="px-6 py-3.5 text-sm text-muted-foreground">
                          {formatDate(submission.createdAt)}
                        </TableCell>

                        {/* Status */}
                        <TableCell className="px-6 py-3.5">
                          <Badge
                            variant="outline"
                            className={`py-1 px-3 min-w-[80px] text-xs ${statusCfg.classes}`}
                          >
                            {statusCfg.label}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-6 py-3.5">
                          <div className="flex items-center gap-1">
                            {/* View */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 hover:bg-blue-50"
                              title="View submission"
                              onClick={() => navigate(`/staff-employee-panel/projects/project-details/${submission.project?.id}`)}
                            >
                              <Eye className="size-4 text-[#1C73E0]" />
                            </Button>

                            {/* Delete */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="size-8 p-0 hover:bg-red-50"
                              title="Delete submission"
                              onClick={() => setDeleteTarget(submission.id)}
                            >
                              <Trash2 className="size-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* View All Footer — only visible when there are more than 5 */}
          {hasMore && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-[#E2E8F0] bg-[#F7F9FA] rounded-b-lg">
              <span className="text-sm text-muted-foreground">
                Showing {MAX_ROWS} of {sorted.length} submissions
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium text-sm"
                onClick={() => navigate("project-review")}
              >
                View All
                <ArrowRight size={15} />
              </Button>
            </div>
          )}
        </div>
      </BoxContainer>

      {/* View Modal */}
      <ViewSubmissionModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={selectedSubmission}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="z-[9999] bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this submission. This action cannot
              be undone.
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
                <Loader2 className="animate-spin size-4 mr-1" />
              ) : (
                <Trash2 className="size-4 mr-1" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LatestSubmission;
