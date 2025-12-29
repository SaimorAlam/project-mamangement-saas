import { useState } from "react";
import { CardHeader } from "@/components/ui/card";
import SubmissionTable from "./SubmissionTable";
import BoxContainer from "../../../common/BoxContainer";
import { useGetStaffEmployeeLatestSubmissionsQuery } from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";
import DropdownSelect from "./../../../common/DropdownSelect";

const statusOptions = [
  { value: "all", title: "All" },
  { value: "APPROVED", title: "Approved" },
  { value: "PENDING", title: "Pending" },
  { value: "REJECTED", title: "Rejected" },
];

const LatestSubmission = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data } = useGetStaffEmployeeLatestSubmissionsQuery({
    status: statusFilter === "all" ? "" : statusFilter,
  });

  const submissionsData = data?.data?.AllSubmissions?.data || [];

  return (
    <BoxContainer>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-0">
        <h4 className="font-semibold text-2xl">Latest Submission</h4>
        <div className="mb-3 w-[200px]">
          <DropdownSelect
            placeholderText="Status"
            dropdownItem={statusOptions}
            onChange={setStatusFilter}
            label="Status"
          />
        </div>
      </CardHeader>
      {/* Pass the whole array instead of mapping */}
      <SubmissionTable submissions={submissionsData} />
    </BoxContainer>
  );
};

export default LatestSubmission;
