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
import { Eye, FileText } from "lucide-react";

// Type definitions based on the provided object
export interface Employee {
  id: string;
  name: string;
  avatar?: string;
}

export interface SubmissionData {
  id: string;
  information: string;
  submission: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DRAFT";
  employeeId: string;
  projectId: string;
  sheetId: string;
  submiteCells: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Submission extends SubmissionData {
  employee?: Employee;
  projectName?: string;
  sheetName?: string;
}

type SubmissionTableProps = {
  submissions: Submission[];
  employees?: Record<string, Employee>;
};

export default function SubmissionTable({
  submissions,
  employees = {},
}: SubmissionTableProps) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const getEmployeeInfo = (employeeId: string): Employee => {
    if (employees[employeeId]) {
      return employees[employeeId];
    }

    // Return a dummy employee if not found
    return {
      id: employeeId,
      name: "Unknown Employee",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${employeeId}`,
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleView = (id: string) => {
    console.log("View submission:", id);
  };

  const handleEdit = (id: string) => {
    console.log("Edit submission:", id);
  };

  const statusClasses: Record<string, string> = {
    APPROVED: "text-[#0B5A4A] bg-[#EBFFF2] border border-[#ABEFD5]",
    PENDING: "text-[#665CFF] bg-[#F2F2FF] border border-[#C7C2FF]",
    REJECTED: "text-[#B00020] bg-[#FFEAEA] border border-[#FFB3B3]",
    DRAFT: "text-[#6B7280] bg-[#F3F4F6] border border-[#D1D5DB]",
  };

  const statusLabels = {
    APPROVED: "Approved",
    PENDING: "In Review",
    REJECTED: "Returned",
    DRAFT: "Draft",
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardContent className="p-0 border border-[#E2E8F0] rounded-lg w-full">
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#E2E8F0] bg-[#F7F9FA]">
                <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                  Submission
                </TableHead>
                <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                  Information
                </TableHead>
                <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                  Submitted By
                </TableHead>
                <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                  Date Submitted
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
              {submissions.map((submission) => {
                const employee =
                  submission.employee ||
                  getEmployeeInfo(submission.employeeId);

                return (
                  <TableRow
                    key={submission.id}
                    className="border-b border-[#E2E8F0] hover:bg-muted/30 transition-colors odd:bg-white even:bg-[#F7F9FA]"
                  >
                    <TableCell className="text-base font-medium px-6 py-3.5">
                      {submission.submission || "No title"}
                    </TableCell>
                    <TableCell className="text-base text-muted-foreground px-6 py-3.5">
                      {submission.information ||
                        "No information provided"}
                    </TableCell>
                    <TableCell className="px-6 py-3.5">
                      <div className="flex items-center space-x-3">
                        <Avatar className="size-10">
                          <AvatarImage
                            src={
                              employee.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.id}`
                            }
                            alt={employee.name}
                          />
                          <AvatarFallback className="text-base font-normal bg-gray-100">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-base font-normal">
                            {employee.name}
                          </span>
                          {submission.projectName && (
                            <span className="text-sm text-muted-foreground">
                              {submission.projectName}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-3.5 text-base text-muted-foreground">
                      {formatDate(submission.createdAt)}
                    </TableCell>
                    <TableCell className="px-6 py-3.5">
                      <Badge
                        variant="outline"
                        className={`py-1.5 px-3 min-w-20 ${
                          statusClasses[submission.status]
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
                          onClick={() => handleView(submission.id)}
                          className="size-6 p-0 hover:bg-muted hover:scale-105 hover:cursor-pointer"
                          title="View submission"
                        >
                          <Eye className="size-6 text-[#1C73E0]" />
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
                          <FileText className="size-6 text-[#169E7B]" />
                          <span className="sr-only">
                            Edit submission
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
