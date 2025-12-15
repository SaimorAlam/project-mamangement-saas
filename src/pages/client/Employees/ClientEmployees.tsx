import React, { useEffect, useState, Suspense, lazy } from "react";
import DianneRussellTask from "@/components/client/Employee/DianneRussellTask";
import EditEmployeeModal from "@/components/client/Employee/EditEmployeeModal";
import { useGetAllEmployeesQuery } from "@/store/Api/EmployeeApi/EmployeeApi";
import Pagination from "@/common/Pagination";
import {
  IEmployeeProfile,
  IEditEmployeePayload,
} from "@/types/client-panel";
import EmployeeTableHeader from "./EmployeeTableHeader";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import EmployeeListTask from "@/components/client/Employee/EmployeeListTask";

// Lazy-load EmployeeTable
const EmployeeTable = lazy(() => import("./EmployeeTable"));

/* ------------------------------
   Badge Utilities
--------------------------------*/
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

const getStatusBadgeColor = (status: string): string =>
  status === "Active"
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-red-100 text-red-800 border-red-200";

/* ------------------------------
   Component
--------------------------------*/
const ClientEmployees: React.FC = () => {
  /* ---------- Query State ---------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<
    "asc" | "desc" | undefined
  >(undefined);
  const [joinedDateFrom, setJoinedDateFrom] = useState<
    string | undefined
  >(undefined);
  const [joinedDateTo, setJoinedDateTo] = useState<
    string | undefined
  >(undefined);

  /* ---------- Pagination ---------- */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ---------- UI State ---------- */
  const [activeTab, setActiveTab] = useState<"tables" | "task">(
    "tables"
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<
    Set<string>
  >(new Set());
  const [selectAll, setSelectAll] = useState(false);

  /* ---------- Modal ---------- */
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] =
    useState<IEditEmployeePayload | null>(null);

  /* ---------- API ---------- */
  const { data: employeeResponse, isFetching } =
    useGetAllEmployeesQuery({
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm || undefined,
      status,
      joinedDateFrom,
      joinedDateTo,
      sortBy,
      sortOrder,
    });

  const employeeList: IEmployeeProfile[] =
    employeeResponse?.data?.data || [];
  const meta = employeeResponse?.data?.meta || {};
  const totalPages = meta?.totalPages || 1;
  const totalEmployees = meta?.total || 0;

  /* ---------- Effects ---------- */
  useEffect(() => {
    setCurrentPage(1);
    setSelectedEmployees(new Set());
    setSelectAll(false);
  }, [
    searchTerm,
    status,
    sortBy,
    sortOrder,
    joinedDateFrom,
    joinedDateTo,
  ]);

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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterDropdown]);

  /* ---------- Handlers ---------- */
  const handleSort = (field: string) => {
    setSortBy(field);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleEditClick = (employee: IEmployeeProfile) => {
    const payload: IEditEmployeePayload = {
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

    setEditEmployee(payload);
    setEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditEmployee(null);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees(new Set());
    } else {
      const ids = employeeList.map((e) => e.id as string);
      setSelectedEmployees(new Set(ids));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectEmployee = (id: string) => {
    const updated = new Set(selectedEmployees);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setSelectedEmployees(updated);
    setSelectAll(updated.size === employeeList.length);
  };

  const handleDeleteEmployee = (id: string) => {
    console.log("Deleting employee:", id);

    // later:
    // deleteEmployeeMutation(id)
  };

  const handleDeleteSelected = () => {
    if (selectedEmployees.size === 0) return;

    const ids = Array.from(selectedEmployees);
    console.log("Deleting selected employees:", ids);

    // later:
    // bulkDeleteEmployeesMutation(ids)

    setSelectedEmployees(new Set());
    setSelectAll(false);
  };

  /* ---------- Render ---------- */
  return (
    <div className="my-10 flex gap-5 flex-col">
      <div className="w-full">
        {employeeList.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <EmployeeTableHeader
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleDeleteSelected={handleDeleteSelected}
              showFilterDropdown={showFilterDropdown}
              setShowFilterDropdown={setShowFilterDropdown}
              selectedEmployees={selectedEmployees}
              filterBy={status || "all"}
              setFilterBy={(value) =>
                setStatus(value === "all" ? undefined : value)
              }
              setSearchTerm={setSearchTerm}
              setJoinedDateFrom={setJoinedDateFrom}
              setJoinedDateTo={setJoinedDateTo}
            />

            {activeTab === "tables" ? (
              <Suspense
                fallback={
                  <div className="p-6">
                    <Skeleton
                      count={5}
                      height={40}
                      className="mb-2"
                    />
                  </div>
                }
              >
                <EmployeeTable
                  employees={employeeList}
                  selectedEmployees={selectedEmployees}
                  selectAll={selectAll}
                  handleSelectAll={handleSelectAll}
                  handleSelectEmployee={handleSelectEmployee}
                  handleEditClick={handleEditClick}
                  handleDeleteEmployee={handleDeleteEmployee}
                  handleSort={handleSort}
                  getRoleBadgeColor={getRoleBadgeColor}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              </Suspense>
            ) : (
              <EmployeeListTask employees={employeeList} />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalPrograms={totalEmployees}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        ) : isFetching ? (
          <div className="p-6">
            <Skeleton count={5} height={40} className="mb-2" />
          </div>
        ) : (
          <div className="h-[60vh] flex items-center justify-center text-5xl text-gray-200 uppercase">
            No Employees Data Available
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
