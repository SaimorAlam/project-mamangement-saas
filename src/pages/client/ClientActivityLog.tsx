import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import Pagination from "@/components/client/Pagination";
import SearchBar from "@/components/client/SearchBar";
import DateRange from "@/components/client/DateRange";
import ActivityLogTable from "@/pages/client/ActivityLog/ActivityLogTable";
import { useGetAllActivityLogQuery } from "@/store/Api/ActivityLogApi/ActivityLogApi";

export default function ClientActivityLog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError } = useGetAllActivityLogQuery();

  // Filter data
  const filteredData = useMemo(() => {
    const activityLogs = data?.data || [];
    return activityLogs.filter((entry) =>
      Object.values(entry).some(
        (value) =>
          value &&
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const tableHeaders = [
    "timestamp",
    "user",
    "description",
    "projectName",
    "ipAddress",
  ];

  // Export CSV
  const handleExport = () => {
    const headers = tableHeaders;
    const csvContent = [
      headers.join(","),
      ...filteredData.map((entry) =>
        headers.map((key) => `"${entry[key as keyof typeof entry]}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees-activity-log.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[400px] items-center justify-center text-red-500">
        Failed to load activity logs.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          All Employees Activity Log
        </h2>
        <div className="flex items-center gap-3">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            className="max-w-[250px]"
          />
          <DateRange />
          <Button
            variant="outline"
            onClick={handleExport}
            size="lg"
            className="gap-2 bg-transparent border border-[#E2E8F0]"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="">
        <ActivityLogTable
          paginatedData={paginatedData}
          tableHeaders={tableHeaders}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        filteredDataLength={filteredData.length}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
      />
    </div>
  );
}
