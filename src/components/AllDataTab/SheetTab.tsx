import React from "react";
import { useLocation } from "react-router-dom";
import DataTable from "@/common/DataTable";

const SheetTab: React.FC = () => {
  const location = useLocation();
  const uploadedData =
    location.state?.uploadedData || [
      {
        ID: "EMP-001",
        Name: "John Doe",
        Email: "john.doe@example.com",
        Role: "Manager",
        Department: "Operations",
        Status: "Active",
      },
      {
        ID: "EMP-002",
        Name: "Sarah Khan",
        Email: "sarah.khan@example.com",
        Role: "Software Engineer",
        Department: "IT",
        Status: "Active",
      },
      {
        ID: "EMP-003",
        Name: "Michael Smith",
        Email: "michael.smith@example.com",
        Role: "Accountant",
        Department: "Finance",
        Status: "Inactive",
      },
      {
        ID: "EMP-004",
        Name: "Emily Clark",
        Email: "emily.clark@example.com",
        Role: "HR Specialist",
        Department: "Human Resources",
        Status: "Active",
      },
      {
        ID: "EMP-005",
        Name: "David Wilson",
        Email: "david.wilson@example.com",
        Role: "Team Lead",
        Department: "IT",
        Status: "Active",
      },
      {
        ID: "EMP-006",
        Name: "Amina Rahman",
        Email: "amina.rahman@example.com",
        Role: "Customer Support",
        Department: "Support",
        Status: "On Leave",
      },
      {
        ID: "EMP-007",
        Name: "Robert Brown",
        Email: "robert.brown@example.com",
        Role: "Sales Executive",
        Department: "Sales",
        Status: "Active",
      },
      {
        ID: "EMP-008",
        Name: "Sophia Martinez",
        Email: "sophia.m@example.com",
        Role: "Marketing Analyst",
        Department: "Marketing",
        Status: "Active",
      },
      {
        ID: "EMP-009",
        Name: "Liam Anderson",
        Email: "liam.anderson@example.com",
        Role: "UX Designer",
        Department: "Product",
        Status: "Active",
      },
      {
        ID: "EMP-010",
        Name: "Chloe Kim",
        Email: "chloe.kim@example.com",
        Role: "Project Coordinator",
        Department: "Operations",
        Status: "Inactive",
      },
    ] ||
    [];

  const uploadedHeaders =
    location.state?.uploadedHeaders || [
      "ID",
      "Name",
      "Email",
      "Role",
      "Department",
      "Status",
    ] ||
    [];

  return (
    <div className="">
      {uploadedData.length > 0 ? (
        <div className="">
          <DataTable initialHeaders={uploadedHeaders} initialData={uploadedData} />
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
