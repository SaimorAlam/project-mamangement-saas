import React, { useEffect, useState, Suspense, lazy } from "react";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";

import {
  useGetAllEmployeesQuery,
  useDeleteEmployeeMutation,
  useBulkDeleteEmployeeMutation,
} from "@/store/Api/EmployeeApi/EmployeeApi";

import Pagination from "@/common/Pagination";
import EmployeeTableHeader from "./EmployeeTableHeader";
// import EmployeeListTask from "@/components/client/Employee/EmployeeListTask";
import DianneRussellTask from "@/components/client/Employee/DianneRussellTask";
import ViewEmployeeModal from "@/components/client/Employee/ViewEmployeeModal";
import EditEmployeeModal from "@/components/client/Employee/EditEmployeeModal";

import {
  IEmployeeProfile,
  IEditEmployeePayload,
} from "@/types/client-panel";

// Lazy-load EmployeeTable
const EmployeeTable = lazy(() => import("./EmployeeTable"));

/* ------------------------------
   Badge Utilities
--------------------------------*/
const getRoleBadgeColor = (role: string) =>
  ({
    Manager: "bg-purple-100 text-purple-800 border-purple-200",
    Staff: "bg-blue-100 text-blue-800 border-blue-200",
    Viewer: "bg-gray-100 text-gray-800 border-gray-200",
  }[role] ?? "bg-gray-100 text-gray-800 border-gray-200");

const getStatusBadgeColor = (status: string) =>
  status === "Active"
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-red-100 text-red-800 border-red-200";

/* ------------------------------
   Skeleton Loader
--------------------------------*/
const TableSkeleton = () => (
  <div className="p-6">
    <Skeleton count={5} height={40} className="mb-2" />
  </div>
);

/* ------------------------------
   Component
--------------------------------*/
const ClientEmployees: React.FC = () => {
  /* ---------- Query & Filter State ---------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">();
  const [joinedDateFrom, setJoinedDateFrom] = useState<string>();
  const [joinedDateTo, setJoinedDateTo] = useState<string>();

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

  /* ---------- Modal State ---------- */
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] =
    useState<IEditEmployeePayload | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewModalId, setViewModalId] = useState("");

  /* ---------- API ---------- */
  const { data: employeeResponse, isFetching } =
    useGetAllEmployeesQuery({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch || undefined,
      status,
      joinedDateFrom,
      joinedDateTo,
      sortBy,
      sortOrder,
    });

  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [bulkDelete] = useBulkDeleteEmployeeMutation();

  console.log(employeeResponse);

  const employeeList: IEmployeeProfile[] =
    employeeResponse?.data || [];
  const meta = employeeResponse?.meta || {};
  const totalPages = meta?.totalPages || 1;
  const totalEmployees = meta?.total || 0;

  /* ---------- Effects ---------- */

  console.log(debouncedSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 1500);

    return () => clearInterval(timer);
  }, [searchTerm]);

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
      if (dropdown && !dropdown.contains(e.target as Node))
        setShowFilterDropdown(false);
    };

    if (showFilterDropdown)
      document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterDropdown]);

  /* ---------- Handlers ---------- */
  const handleSort = (field: string) => {
    setSortBy(field);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleViewClick = (employeeId: string) => {
    setViewModalId(employeeId);
    setViewModalOpen(true);
  };

  const handleEditClick = (employee: IEmployeeProfile) => {
    setEditEmployee({
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
    });
    setEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setEditModalOpen(false);
    setEditEmployee(null);
    setViewModalOpen(false);
    setViewModalId("");
  };

  const handleSelectAll = () => {
    if (selectAll) setSelectedEmployees(new Set());
    else setSelectedEmployees(new Set(employeeList.map((e) => e.id)));
    setSelectAll(!selectAll);
  };

  const handleSelectEmployee = (id: string) => {
    const updated = new Set(selectedEmployees);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedEmployees(updated);
    setSelectAll(updated.size === employeeList.length);
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await deleteEmployee(id).unwrap();
        Swal.fire(
          "Deleted!",
          "Employee has been deleted.",
          "success"
        );
      }
    } catch (err: any) {
      Swal.fire(
        "Error",
        err?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedEmployees.size) return;

    // Show confirmation modal
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will delete ${selectedEmployees.size} employee(s)! This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const ids = Array.from(selectedEmployees);
      await bulkDelete({ employeeIds: ids }).unwrap();

      setSelectedEmployees(new Set());
      setSelectAll(false);
      toast.success("Selected employees deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Bulk delete failed");
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="my-10 flex gap-5 flex-col">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow rounded-b-none border border-b-0 border-gray-200">
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
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setJoinedDateFrom={setJoinedDateFrom}
            setJoinedDateTo={setJoinedDateTo}
          />
        </div>

        {isFetching ? (
          <TableSkeleton />
        ) : employeeList.length > 0 ? (
          <div className="bg-white rounded-t-none rounded-lg shadow-sm border border-t-0 border-gray-200">
            {activeTab === "tables" ? (
              <Suspense fallback={<TableSkeleton />}>
                <EmployeeTable
                  employees={employeeList}
                  selectedEmployees={selectedEmployees}
                  selectAll={selectAll}
                  handleSelectAll={handleSelectAll}
                  handleSelectEmployee={handleSelectEmployee}
                  handleViewClick={handleViewClick}
                  handleEditClick={handleEditClick}
                  handleDeleteEmployee={handleDeleteEmployee}
                  handleSort={handleSort}
                  getRoleBadgeColor={getRoleBadgeColor}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              </Suspense>
            ) : (
              <></>
              // <EmployeeListTask employees={employeeList} />
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalPrograms={totalEmployees}
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <div className="h-[60vh] flex items-center justify-center text-5xl text-gray-200 uppercase bg-white rounded-t-none rounded-lg shadow-sm border border-t-0 border-gray-200">
            No Employees Data Available
          </div>
        )}
      </div>

      {/* Modals */}
      {editModalOpen && editEmployee && (
        <EditEmployeeModal
          open={true}
          employee={editEmployee}
          onClose={handleCloseModals}
        />
      )}
      {viewModalOpen && viewModalId && (
        <ViewEmployeeModal
          open={true}
          employeeId={viewModalId}
          onClose={handleCloseModals}
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
