import { useState, useEffect } from "react";
import { CardHeader } from "@/components/ui/card";
import BoxContainer from "../../../common/BoxContainer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import SubmissionTable from "../SubmissionTable";
import { useGetAllLatestSubmissionsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import SkeletonLoading from "@/common/Skeleton/SkeletonLoading";


const LatestSubmission = () => {
  const [submissions, setSubmissions] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useGetAllLatestSubmissionsQuery({
  });

  const submissionsData = data?.data || [];

  useEffect(() => {
    setSubmissions(submissionsData);
  }, []);

  const sortedSubmissions = submissions;
  console.log("working sorted", sortedSubmissions);

  return (
    <BoxContainer>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0">
        <h4 className="text-xl font-semibold">Latest Submission</h4>
        {submissionsData.length > 0 && (
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
                className={`rounded-md cursor-pointer ${sortBy === "startDate" ? "bg-indigo-50 text-indigo-600" : ""}`}
                onClick={() => setSortBy("startDate")}
              >
                Date
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`rounded-md cursor-pointer ${sortBy === "endDate" ? "bg-indigo-50 text-indigo-600" : ""}`}
                onClick={() => setSortBy("endDate")}
              >
                Name
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`rounded-md cursor-pointer ${sortBy === "endDate" ? "bg-indigo-50 text-indigo-600" : ""}`}
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
                className={`rounded-md cursor-pointer ${sortOrder === "asc" ? "bg-indigo-50 text-indigo-600" : ""}`}
                onClick={() => setSortOrder("asc")}
              >
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`rounded-md cursor-pointer ${sortOrder === "desc" ? "bg-indigo-50 text-indigo-600" : ""}`}
                onClick={() => setSortOrder("desc")}
              >
                Descending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>
      {/* Pass the whole array instead of mapping */}
      {isLoading ? (
        <SkeletonLoading count={5} height="h-12" direction="vertical" />
      ) : (
        <SubmissionTable submissions={submissionsData} />
      )}
    </BoxContainer>
  );
};

export default LatestSubmission;
