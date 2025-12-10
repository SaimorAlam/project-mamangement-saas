import React from "react";
import { useLocation } from "react-router-dom";
import DataTable from "@/common/DataTable";

const SheetTab: React.FC = () => {
  const location = useLocation();
  const uploadedData = location.state?.uploadedData || [];
  const uploadedHeaders = location.state?.uploadedHeaders || [];

  return (
    <div className="p-4">
      {uploadedData.length > 0 ? (
        <div className="overflow-x-auto max-w-6xl mx-auto">
          <DataTable
            headers={uploadedHeaders}
            tableData={uploadedData}
          />
        </div>
      ) : (
        <p className="text-gray-500 text-sm text-center py-10">
          No uploaded data found.
        </p>
      )}
    </div>
  );
};

export default SheetTab;
