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
import { useState } from "react";
import EditSubmissionModal from "./overview/EditSubmissionModal";

export interface Submission {
  id: number;
  submission: string;
  employee: {
    user: {
      name: string;
      profileImage: string;
    }
  };
  createdAt: string;
  status: "APPROVED" | "PENDING" | "RETURNED" | "DRAFT";
}

type SubmissionTableProps = {
  submissions: Submission[];
};

export default function SubmissionTable({
  submissions,
}: SubmissionTableProps) {
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);


  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleEdit = (id: number) => {
    console.log("Edit submission:", id);
  };

  const statusClasses: Record<string, string> = {
    APPROVED: "text-[#0B5A4A] bg-[#EBFFF2] border border-[#ABEFD5]",
    PENDING: "text-[#665CFF] bg-[#F2F2FF] border border-[#C7C2FF]",
    RETURNED: "text-[#B00020] bg-[#FFEAEA] border border-[#FFB3B3]",
    DRAFT: "text-[#6B7280] bg-[#F3F4F6] border border-[#D1D5DB]",
  };

  const statusLabels = {
    APPROVED: "APPROVED",
    PENDING: "PENDING",
    RETURNED: "RETURNED",
    DRAFT: "DRAFT",
  };

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h1 className="text-gray-400 text-center">Not yet any projects submitted.</h1>
      </div>
    )
  }

  return (
    <>
      <Card className="w-full shadow-none border-none">
        <CardContent className="p-0 border border-[#E2E8F0] rounded-lg w-full">
          {/* Scroll wrapper around full table */}
          <ScrollArea className="h-[400px] w-full">
            <Table className="overflow-x">
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
                {submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="border-b border-[#E2E8F0] hover:bg-muted/30 transition-colors odd:bg-white even:bg-[#F7F9FA]"
                  >
                    <TableCell className="text-base font-medium px-6 py-3.5">
                      {submission.submission}
                    </TableCell>
                    <TableCell className="px-6 py-3.5">
                      <div className="flex items-center space-x-3">
                        {submission.employee.user.profileImage && (
                          <Avatar className="size-10">
                            <AvatarImage
                              src={submission.employee.user.profileImage}
                              alt={submission.employee.user.name}
                            />
                            <AvatarFallback className="text-base font-normal">
                              {getInitials(submission.employee.user.name)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-base font-normal">
                          {submission.employee.user.name}
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
                            setSelectedSubmission(submission); // project = submission object
                            setViewOpen(true);
                          }}
                        >
                          <Eye className="size-6 text-[#1C73E0] " />

                          <span className="sr-only">
                            View submission
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(submission.id)}
                          className="size-6 p-0 hover:bg-muted hover:scale-105 hover:cursor-pointer"
                          title="Edit submission"
                        >
                          <EditSubmissionModal
                            data={submission}
                            onSubmit={(payload) => {
                              console.log("RTK query will integrate here :", payload);
                            }}
                          />
                          
                          <span className="sr-only">
                            Edit submission
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                    <ViewSubmissionModal
                      open={viewOpen}
                      onClose={() => setViewOpen(false)}
                      data={selectedSubmission}
                    />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  );
}
