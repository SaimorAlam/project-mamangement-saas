/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import ViewSubmissionModal from "./overview/ViewSubmissionModal";
// import EditSubmissionModal from "./overview/EditSubmissionModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface Submission {
  id: number;
  submission: string;
  employee: {
    user: {
      name: string;
      profileImage: string;
    };
  };
  createdAt: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "DRAFT";
}

type SubmissionTableProps = {
  submissions: Submission[];
};

export default function SubmissionTable({
  submissions,
}: SubmissionTableProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<any>(null);
  const navigate = useNavigate();

  // Show only first 5
  const visibleSubmissions = submissions.slice(0, 5);
  const hasMoreThanFive = submissions.length > 5;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  // const handleEdit = (id: number) => {
  //   console.log("Edit submission:", id);
  // };

  const statusClasses: Record<string, string> = {
    APPROVED: "text-[#0B5A4A] bg-[#EBFFF2] border border-[#ABEFD5]",
    PENDING: "text-[#665CFF] bg-[#F2F2FF] border border-[#C7C2FF]",
    REJECTED: "text-[#B00020] bg-[#FFEAEA] border border-[#FFB3B3]",
    DRAFT: "text-[#6B7280] bg-[#F3F4F6] border border-[#D1D5DB]",
  };

  const statusLabels = {
    APPROVED: "APPROVED",
    PENDING: "PENDING",
    REJECTED: "REJECTED",
    DRAFT: "DRAFT",
  };

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h1 className="text-gray-400 text-center">
          Not yet any projects submitted.
        </h1>
      </div>
    );
  }

  return (
    <>
      <Card className="w-full shadow-none border-none">
        <CardContent className="p-0 border border-[#E2E8F0] rounded-lg w-full">

          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#E2E8F0] bg-[#F7F9FA]">
                  <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                    Submission
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
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {visibleSubmissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="border-b border-[#E2E8F0] hover:bg-muted/30 transition-colors odd:bg-white even:bg-[#F7F9FA]"
                  >
                    <TableCell className="text-base font-medium px-6 py-3.5">
                      {submission.submission}
                    </TableCell>

                    <TableCell className="px-6 py-3.5">
                      <div className="flex items-center space-x-3">
                        {submission?.employee?.user?.profileImage && (
                          <Avatar className="size-10 border border-gray-300">
                            <AvatarImage
                              src={
                                submission?.employee?.user?.profileImage
                              }
                              alt={submission?.employee?.user?.name}
                            />
                            <AvatarFallback className="text-base font-normal">
                              {getInitials(
                                submission?.employee?.user?.name
                              )}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-base font-normal">
                          {submission?.employee?.user?.name}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-3.5 text-base text-muted-foreground">
                      {submission.createdAt?.split("T")[0]}
                    </TableCell>

                    <TableCell className="px-6 py-3.5">
                      <Badge
                        variant="outline"
                        className={`py-1.5 px-3 min-w-20 ${statusClasses[submission.status]
                          }`}
                      >
                        {statusLabels[submission.status]}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-6 py-3.5">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-6 p-0 hover:bg-muted hover:scale-105 hover:cursor-pointer"
                          title="View submission"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            navigate(
                              `/staff-manager-panel/projects/project-details/${submission.id}`
                            );
                          }}
                        >
                          <Eye className="size-6 text-[#1C73E0]" />
                          <span className="sr-only">
                            View submission
                          </span>
                        </Button>

                        {/* <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(submission.id)}
                          className="size-6 p-0 hover:bg-muted hover:scale-105 hover:cursor-pointer"
                          title="Edit submission"
                        >
                          <EditSubmissionModal data={submission} />
                          <span className="sr-only">
                            Edit submission
                          </span>
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* View All Button */}
          {hasMoreThanFive && (
            <div className="flex justify-center py-4">
              <button
                onClick={() =>
                  navigate("/staff-manager-panel/project-review")
                }
                className="text-[#1C73E0] text-sm font-semibold hover:underline transition"
              >
                View All
              </button>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Modal */}
      <ViewSubmissionModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        data={selectedSubmission}
      />
    </>
  );
}