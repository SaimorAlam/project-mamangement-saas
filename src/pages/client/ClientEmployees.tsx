import React, { useEffect, useState } from "react";
import EmployeeTable from "@/components/client/Employee/EmployeeTable";
import EmployeeListTask from "@/components/client/Employee/EmployeeListTask";
import DianneRussellTask from "@/components/client/Employee/DianneRussellTask";
import EmployeeHeader from "@/components/client/Employee/EmployeeHeader";
import EditEmployeeModal from "@/components/client/Employee/EditEmployeeModal";

import { useGetAllEmployeesQuery } from "@/store/Api/EmployeeApi/EmployeeApi";

import FullScreenMessage from "@/common/FullScreenMessage";
import { IEmployeeProfile, IEditEmployeePayload } from "@/types/client-panel";

const getRoleBadgeColor = (role: string): string => {
  switch (role) {
    case "Manager":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "Staff":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Viewer":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusBadgeColor = (status: string): string => {
  return status === "Active"
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-red-100 text-red-800 border-red-200";
};

const ClientEmployees: React.FC = () => {
  const [searchTerm] = useState<string>("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState<IEditEmployeePayload | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"tables" | "task">("tables");

  const itemsPerPage = 10;

  const {
    data: employeeResponse,
    isLoading,
    isError,
  } = useGetAllEmployeesQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const employeeList = employeeResponse?.data || [];
  const employeeMeta = employeeResponse?.meta || {};

  const totalPages = employeeMeta?.totalPages;
  const startIndex = (employeeMeta?.page - 1) * itemsPerPage + 1;
  const endIndex = employeeList?.length;

  useEffect(() => {
    setCurrentPage(1);
    setSelectedEmployees(new Set());
    setSelectAll(false);
  }, [searchTerm, filterBy]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.getElementById("filter-dropdown");
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    if (showFilterDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropdown]);

  const handleSelectAll = () => {};

  const handleSelectEmployee = (employeeId: string) => {};

  const handleDeleteEmployee = (employeeId: string) => {};

  const handleEditClick = (employee: IEmployeeProfile) => {
    const updateEmployeeData: IEditEmployeePayload = {
      id: employee.id,
      name: employee.user.name,
      email: employee.user.email,
      phoneNumber: employee.user.phoneNumber,
      joinedDate: employee.joinedDate,
      skills: employee.skills,
      projects: [],
      description: employee.description,
      profileImage: employee.user.profileImage,
      userStatus: "ACTIVE",
    };

    setEditEmployee(updateEmployeeData);
    setEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditEmployee(null);
  };

  const handleDeleteSelected = () => {
    setSelectedEmployees(new Set());
    setSelectAll(false);
  };

  if (isLoading) {
    return <FullScreenMessage type="loading" />;
  }
  if (isError) {
    return (
      <FullScreenMessage
        type="message"
        message="Error fetching employees data!"
        className="text-red-500/70"
      />
    );
  }

  return (
    <div className="my-10 flex gap-5">
      <div
        className={`${
          activeTab === "task" ? "w-full" : "w-full"
        } transition-all duration-300`}
      >
        {employeeList.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <EmployeeHeader
              selectedEmployees={selectedEmployees}
              handleDeleteSelected={handleDeleteSelected}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showFilterDropdown={showFilterDropdown}
              setShowFilterDropdown={setShowFilterDropdown}
              filterBy={filterBy}
              setFilterBy={setFilterBy}
            />

            {activeTab === "tables" ? (
              <EmployeeTable
                employees={employeeList}
                selectedEmployees={selectedEmployees}
                selectAll={selectAll}
                handleSelectAll={handleSelectAll}
                handleSelectEmployee={handleSelectEmployee}
                handleEditClick={handleEditClick}
                handleDeleteEmployee={handleDeleteEmployee}
                getRoleBadgeColor={getRoleBadgeColor}
                getStatusBadgeColor={getStatusBadgeColor}
              />
            ) : (
              <EmployeeListTask employees={employeeList} />
            )}

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {startIndex} to {endIndex} of {employeeMeta?.total}{" "}
                  Files
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-3 py-1 text-sm text-gray-500">
                        ...
                      </span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-[60vh] flex items-center justify-center">
            <h2 className="w-[80vw] h-[100vh] flex items-center justify-center text-5xl font-semibold text-[#e8ecf0] uppercase">
              No Employees Data Available
            </h2>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalOpen && editEmployee && (
        <EditEmployeeModal
          open={editModalOpen}
          employee={editEmployee}
          onClose={handleEditCancel}
        />
      )}
      {activeTab === "task" && (
        <div className="w-full">
          <DianneRussellTask />
        </div>
      )}
    </div>
  );
};

export default ClientEmployees;
