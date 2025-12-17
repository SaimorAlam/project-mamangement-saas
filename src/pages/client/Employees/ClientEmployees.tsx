/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect,
  useState,
  Suspense,
  lazy,
  useMemo,
} from "react";
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
import EmployeeListTask from "@/components/client/Employee/EmployeeListTask";
import DianneRussellTask from "@/components/client/Employee/DianneRussellTask";
import ViewEmployeeModal from "@/components/client/Employee/ViewEmployeeModal";
import EditEmployeeModal from "@/components/client/Employee/EditEmployeeModal";

// Lazy-load EmployeeTable
const EmployeeTable = lazy(() => import("./EmployeeTable"));

import {
  IEmployeeProfile,
  IEditEmployeePayload,
} from "@/types/client-panel";

/* ---------- Badge Utilities ---------- */
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

/* ---------- Skeleton Loader ---------- */
const TableSkeleton = () => (
  <div className="p-6">
    <Skeleton count={5} height={40} className="mb-2" />
  </div>
);

/* ---------- Component ---------- */
const ClientEmployees: React.FC = () => {
  /* ---------- Filters & Search ---------- */
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>("");
  const [joinedDateFrom, setJoinedDateFrom] = useState<string>();
  const [joinedDateTo, setJoinedDateTo] = useState<string>();

  /* ---------- Sorting ---------- */
  const [sortColumn, setSortColumn] = useState<
    | keyof IEmployeeProfile
    | "userName"
    | "email"
    | "role"
    | "status"
    | "updatedAt"
    | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  /* ---------- Modals ---------- */
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
    });

  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [bulkDelete] = useBulkDeleteEmployeeMutation();

  const employeeList: IEmployeeProfile[] =
    employeeResponse?.data || [];
  const meta = employeeResponse?.meta || {};
  const totalPages = meta?.totalPages || 1;
  const totalEmployees = meta?.total || 0;

  /* ---------- Debounced Search ---------- */
  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchTerm),
      500
    );
    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* ---------- Reset Page on Filter Change ---------- */
  useEffect(() => {
    setCurrentPage(1);
    setSelectedEmployees(new Set());
    setSelectAll(false);
  }, [searchTerm, status, joinedDateFrom, joinedDateTo]);

  /* ---------- Sorting Handler ---------- */
  const handleSort = (field: string) => {
    if (sortColumn === field)
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortColumn(field as any);
      setSortOrder("asc");
    }
  };

  /* ---------- Sorted Employees ---------- */
  const sortedEmployees = useMemo(() => {
    const list = [...employeeList];
    if (!sortColumn) return list;

    return list.sort((a, b) => {
      let valA: any;
      let valB: any;

      switch (sortColumn) {
        case "userName":
          valA = a.user.name;
          valB = b.user.name;
          break;
        case "email":
          valA = a.user.email;
          valB = b.user.email;
          break;
        case "role":
          valA = a.user.role;
          valB = b.user.role;
          break;
        case "status":
          valA = a.user.status ? 1 : 0;
          valB = b.user.status ? 1 : 0;
          break;
        case "updatedAt":
          valA = new Date(a.user.updatedAt).getTime();
          valB = new Date(b.user.updatedAt).getTime();
          break;
        default:
          valA = a[sortColumn as keyof IEmployeeProfile];
          valB = b[sortColumn as keyof IEmployeeProfile];
      }

      if (typeof valA === "string" && typeof valB === "string")
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);

      if (typeof valA === "number" && typeof valB === "number")
        return sortOrder === "asc" ? valA - valB : valB - valA;

      return 0;
    });
  }, [employeeList, sortColumn, sortOrder]);

  /* ---------- Selection Handlers ---------- */
  const handleSelectAll = () => {
    if (selectAll) setSelectedEmployees(new Set());
    else
      setSelectedEmployees(new Set(sortedEmployees.map((e) => e.id)));
    setSelectAll(!selectAll);
  };

  const handleSelectEmployee = (id: string) => {
    const updated = new Set(selectedEmployees);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setSelectedEmployees(updated);
    setSelectAll(updated.size === sortedEmployees.length);
  };

  /* ---------- Action Handlers ---------- */
  const handleViewClick = (id: string) => {
    setViewModalId(id);
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

  const handleDeleteEmployee = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await deleteEmployee(id).unwrap();
        Swal.fire("Deleted!", "Employee removed.", "success");
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
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete ${selectedEmployees.size} employee(s)?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await bulkDelete({
        employeeIds: Array.from(selectedEmployees),
      }).unwrap();
      setSelectedEmployees(new Set());
      setSelectAll(false);
      toast.success("Employees deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
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
            setFilterBy={(v) =>
              setStatus(v === "all" ? undefined : v)
            }
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setJoinedDateFrom={setJoinedDateFrom}
            setJoinedDateTo={setJoinedDateTo}
          />
        </div>

        {isFetching ? (
          <TableSkeleton />
        ) : sortedEmployees.length > 0 ? (
          <div className="bg-white rounded-t-none rounded-lg shadow-sm border border-t-0 border-gray-200">
            {activeTab === "tables" ? (
              <Suspense fallback={<TableSkeleton />}>
                <EmployeeTable
                  employees={sortedEmployees}
                  selectedEmployees={selectedEmployees}
                  selectAll={selectAll}
                  handleSelectAll={handleSelectAll}
                  handleSelectEmployee={handleSelectEmployee}
                  handleViewClick={handleViewClick}
                  handleEditClick={handleEditClick}
                  handleDeleteEmployee={handleDeleteEmployee}
                  handleSort={handleSort}
                  sortBy={sortColumn || undefined}
                  sortOrder={sortOrder}
                  getRoleBadgeColor={getRoleBadgeColor}
                  getStatusBadgeColor={getStatusBadgeColor}
                />
              </Suspense>
            ) : (
              <EmployeeListTask employees={sortedEmployees} />
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
          onClose={() => setEditModalOpen(false)}
        />
      )}
      {viewModalOpen && viewModalId && (
        <ViewEmployeeModal
          open={true}
          employeeId={viewModalId}
          onClose={() => setViewModalOpen(false)}
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
