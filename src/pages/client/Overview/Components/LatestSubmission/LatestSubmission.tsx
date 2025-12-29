/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, ArrowDownUp } from "lucide-react";
import BoxContainer from "@/common/BoxContainer";
import { useGetAllSubmissionQuery } from "@/store/Api/ClientDashboardApi/ClientDashboardApi";
import ViewSubmissionDialog from "./ViewSubmissionDialog";

type SortField = "submission" | "project" | "submittedBy" | "date" | "status";
type SortOrder = "asc" | "desc";
type StatusFilter = "ALL" | "APPROVED" | "PENDING" | "RETURNED";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  RETURNED: "bg-red-50 text-red-700 border-red-200",
};

const TABLE_SKELETON_ROWS = 6;

const LatestSubmission = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [status, setStatus] = useState<StatusFilter>("ALL");

  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data, isLoading } = useGetAllSubmissionQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status !== "ALL" ? status : undefined,
  });

  /* ---------- client-side sorting ---------- */
  const sortedSubmissions = useMemo(() => {
    const list = [...(data?.data ?? [])];

    return list.sort((a: any, b: any) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortBy) {
        case "submission":
          aValue = a.submission;
          bValue = b.submission;
          break;
        case "project":
          aValue = a.project?.name ?? "";
          bValue = b.project?.name ?? "";
          break;
        case "submittedBy":
          aValue = a.employee?.user?.name ?? "";
          bValue = b.employee?.user?.name ?? "";
          break;
        case "date":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [data?.data, sortBy, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <BoxContainer>
      <Card className="border-none shadow-none p-0!">
        {/* Header */}
        <CardHeader className="flex flex-col gap-4 px-0">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-medium">Latest Submission</h4>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 border rounded-md px-3 text-sm"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 border rounded-md px-3 text-sm"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10"
                >
                  <Filter className="w-4 h-4" />
                  Status
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                {["ALL", "APPROVED", "PENDING", "RETURNED"].map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => setStatus(s as StatusFilter)}
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {/* Table */}
        <CardContent className="p-0 border border-gray-200 rounded-xl overflow-hidden">
          <ScrollArea className="h-[500px] w-full">
            <table className="w-full text-sm">
              <TableHeader className="sticky top-0 bg-gray-50 z-20">
                <TableRow>
                  {[
                    { label: "Submission", field: "submission" },
                    { label: "Project", field: "project" },
                    { label: "Submitted By", field: "submittedBy" },
                    { label: "Date", field: "date" },
                    { label: "Status", field: "status" },
                  ].map((col) => (
                    <TableHead
                      key={col.field}
                      className={`px-6 py-4 cursor-pointer text-left ${
                        col.field === "status" ? "text-center" : ""
                      }`}
                      onClick={() => handleSort(col.field as SortField)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        <ArrowDownUp
                          className={`w-4 h-4 transition-transform duration-200 ${
                            sortBy === col.field
                              ? sortOrder === "asc"
                                ? "rotate-180"
                                : "rotate-0"
                              : "opacity-30"
                          }`}
                        />
                      </span>
                    </TableHead>
                  ))}
                  <TableHead className="px-6 py-4 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  Array.from({ length: TABLE_SKELETON_ROWS }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-6 py-4">
                        <div className="h-4 bg-gray-200 w-2/3" />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="h-4 bg-gray-200 w-1/2" />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="h-4 bg-gray-200 w-2/3" />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="h-4 bg-gray-200 w-1/3" />
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <div className="h-6 bg-gray-200 w-20 mx-auto rounded-full" />
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="h-8 bg-gray-200 w-8 ml-auto rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sortedSubmissions.length ? (
                  sortedSubmissions.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-6 py-4 font-medium">
                        {item.submission}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {item.project?.name ?? "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {item.employee?.user?.name ?? "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {new Date(item.createdAt).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Badge
                          variant="outline"
                          className={statusStyles[item.status]}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <ViewSubmissionDialog submission={item} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-20 text-center">
                      No submissions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </ScrollArea>
        </CardContent>
      </Card>
    </BoxContainer>
  );
};

export default LatestSubmission;
