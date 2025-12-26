import { useState, useEffect } from "react";
import { CardHeader } from "@/components/ui/card";
import SubmissionTable from "./SubmissionTable";
import BoxContainer from "../../../common/BoxContainer";
import { ISubmission } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import { useGetStaffEmployeeLatestSubmissionsQuery } from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";

const LatestSubmission = () => {
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data } = useGetStaffEmployeeLatestSubmissionsQuery({});

  const submissionsData = data?.data?.AllSubmissions?.data || [];

  return (
    <BoxContainer>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0">
        <h4 className="font-semibold text-2xl">Latest Submission</h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent border border-[#CAD2DB] h-12"
            >
              <ArrowDownUp className="size-5" />
              Sort By
              <ChevronDown className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border border-[#CAD2DB] p-1"
          >
            {/* Field Selection */}
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Field
            </div>
            <DropdownMenuItem
              className={`rounded-md cursor-pointer ${
                sortBy === "startDate"
                  ? "bg-indigo-50 text-indigo-600"
                  : ""
              }`}
              onClick={() => setSortBy("startDate")}
            >
              Date
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`rounded-md cursor-pointer ${
                sortBy === "endDate"
                  ? "bg-indigo-50 text-indigo-600"
                  : ""
              }`}
              onClick={() => setSortBy("endDate")}
            >
              Name
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`rounded-md cursor-pointer ${
                sortBy === "endDate"
                  ? "bg-indigo-50 text-indigo-600"
                  : ""
              }`}
              onClick={() => setSortBy("endDate")}
            >
              Status
            </DropdownMenuItem>

            <div className="my-1 border-t border-gray-100" />

            {/* Order Selection */}
            <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Order
            </div>
            <DropdownMenuItem
              className={`rounded-md cursor-pointer ${
                sortOrder === "asc"
                  ? "bg-indigo-50 text-indigo-600"
                  : ""
              }`}
              onClick={() => setSortOrder("asc")}
            >
              Ascending
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`rounded-md cursor-pointer ${
                sortOrder === "desc"
                  ? "bg-indigo-50 text-indigo-600"
                  : ""
              }`}
              onClick={() => setSortOrder("desc")}
            >
              Descending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      {/* Pass the whole array instead of mapping */}
      <SubmissionTable submissions={submissionsData} />
    </BoxContainer>
  );
};

export default LatestSubmission;
