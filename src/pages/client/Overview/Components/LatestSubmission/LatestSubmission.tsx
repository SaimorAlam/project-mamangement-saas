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
import { ArrowDownUp, ChevronDown } from "lucide-react";
import BoxContainer from "@/common/BoxContainer";
import { useGetAllSubmissionQuery } from "@/store/Api/ClientDashboardApi/ClientDashboardApi";
import ViewSubmissionDialog from "./ViewSubmissionDialog";
import { Skeleton } from "@/components/ui/skeleton";

type SortField = "date" | "submission" | "status";
type SortOrder = "asc" | "desc";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  RETURNED: "bg-red-50 text-red-700 border-red-200",
};

const TABLE_SKELETON_ROWS = 6;

const LatestSubmission = () => {
  const { data, isLoading } = useGetAllSubmissionQuery({});

  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedSubmissions = useMemo(() => {
    const list = [...(data?.data ?? [])];

    return list.sort((a: any, b: any) => {
      if (sortBy === "date") {
        const aDate = new Date(a.createdAt).getTime();
        const bDate = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (sortBy === "submission") {
        return sortOrder === "asc"
          ? a.submission.localeCompare(b.submission)
          : b.submission.localeCompare(a.submission);
      }

      if (sortBy === "status") {
        return sortOrder === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }

      return 0;
    });
  }, [data?.data, sortBy, sortOrder]);

  return (
    <BoxContainer>
      <Card className="border-none shadow-none p-0!">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between px-0">
          <h4 className="text-2xl font-medium">Latest Submission</h4>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-12"
              >
                <ArrowDownUp className="w-5 h-5" />
                Sort By
                <ChevronDown className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                Field
              </div>

              <DropdownMenuItem
                onClick={() => setSortBy("date")}
                className={
                  sortBy === "date" ? "bg-indigo-50 text-indigo-600" : ""
                }
              >
                Date
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setSortBy("submission")}
                className={
                  sortBy === "submission" ? "bg-indigo-50 text-indigo-600" : ""
                }
              >
                Submission
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setSortBy("status")}
                className={
                  sortBy === "status" ? "bg-indigo-50 text-indigo-600" : ""
                }
              >
                Status
              </DropdownMenuItem>

              <div className="my-1 border-t border-gray-200" />

              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                Order
              </div>

              <DropdownMenuItem
                onClick={() => setSortOrder("asc")}
                className={
                  sortOrder === "asc" ? "bg-indigo-50 text-indigo-600" : ""
                }
              >
                Ascending
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setSortOrder("desc")}
                className={
                  sortOrder === "desc" ? "bg-indigo-50 text-indigo-600" : ""
                }
              >
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        {/* Table */}
        <CardContent className="p-0 border border-gray-200 rounded-xl overflow-hidden">
          <ScrollArea className="h-[500px] w-full">
            <table className="w-full caption-bottom text-sm">
              <TableHeader className="sticky top-0 bg-gray-50 z-20 shadow-sm">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-6 py-4 w-[20%]">
                    Submission
                  </TableHead>
                  <TableHead className="px-6 py-4 w-[20%]">Project</TableHead>
                  <TableHead className="px-6 py-4 w-[20%]">
                    Submitted By
                  </TableHead>
                  <TableHead className="px-6 py-4 w-[15%]">Date</TableHead>
                  <TableHead className="px-6 py-4 text-center w-[15%]">
                    Status
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right w-[10%]">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="border border-gray-200">
                {isLoading ? (
                  Array.from({ length: TABLE_SKELETON_ROWS }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-6 py-4">
                        <Skeleton className="h-4 w-[70%]" />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Skeleton className="h-4 w-[60%]" />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Skeleton className="h-4 w-[65%]" />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Skeleton className="h-4 w-[50%]" />
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sortedSubmissions.length > 0 ? (
                  sortedSubmissions.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <TableCell className="px-6 py-4 font-medium truncate">
                        {item.submission}
                      </TableCell>

                      <TableCell className="px-6 py-4 truncate text-gray-600">
                        {item.project?.name ?? "-"}
                      </TableCell>

                      <TableCell className="px-6 py-4 truncate text-gray-600">
                        {item.employee?.user?.name ?? "-"}
                      </TableCell>

                      <TableCell className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>

                      <TableCell className="px-6 py-4 text-center">
                        <Badge
                          variant="outline"
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            statusStyles[item.status] ??
                            "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
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
                    <TableCell
                      colSpan={6}
                      className="py-20 text-center text-gray-500"
                    >
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
