/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/store/Api/UserApi/UserApi";
import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ViewUserModal from "./ViewUserModal";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import AddEmployeeModal from "@/components/client/Employee/AddEmployeeModal";

const EmployeeTable = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<keyof any | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [deleteUser] = useDeleteUserMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pageLoading, setPageLoading] = useState(false);

  const PAGE_SIZE = 10;

  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    page: currentPage,
    limit: PAGE_SIZE,
  });
  const loading = isLoading || isFetching || pageLoading;
  console.log(data);
  const users = data?.data?.data || [];
  const meta = data?.data?.meta;

  useEffect(() => {
    if (currentPage !== 1) {
      setPageLoading(true);
    }
  }, [currentPage]);

  useEffect(() => {
    if (!isFetching) {
      setPageLoading(false);
    }
  }, [isFetching]);
  // Compute total users and current page range
  const totalUsers = meta?.total || 0;
  const totalPages = meta?.totalPages || 1;
  const startUser = (currentPage - 1) * PAGE_SIZE + 1;
  const endUser = Math.min(currentPage * PAGE_SIZE, totalUsers);

  // Clear selection on page/data change
  useEffect(() => {
    setSelectedIds([]);
  }, [data, currentPage]);

  // Filtered & searched data
  const filteredUsers = useMemo(() => {
    let filtered = [...users];

    if (search) {
      filtered = filtered.filter(
        (user: any) =>
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (roleFilter !== "All") {
      filtered = filtered.filter((user: any) => user.role === roleFilter);
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter(
        (user: any) =>
          (statusFilter === "Active" && user.userStatus === "ACTIVE") ||
          (statusFilter === "Inactive" && user.userStatus !== "ACTIVE"),
      );
    }

    if (sortBy) {
      filtered.sort((a: any, b: any) => {
        const aVal = a[sortBy] ?? "";
        const bVal = b[sortBy] ?? "";
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [users, search, roleFilter, statusFilter, sortBy, sortOrder]);

  const handleSort = (field: keyof any) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: keyof any) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredUsers.map((user: any) => user.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((userId) => userId !== id));
    }
  };

  const renderSkeleton = () =>
    Array.from({ length: PAGE_SIZE }).map((_, i) => (
      <tr key={i} className="even:bg-gray-50 odd:bg-white animate-pulse h-12">
        {Array(8)
          .fill(0)
          .map((_, idx) => (
            <td
              key={idx}
              className={`${idx === 1 ? "px-6 w-[200px]" : "px-4"} ${
                idx === 2 ? "w-[300px]" : ""
              } py-3`}
            >
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
          ))}
      </tr>
    ));

  const handleDelete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await deleteUser(id).unwrap();
        Swal.fire("Deleted!", "Employee removed.", "success");
      }
    } catch (err: any) {
      Swal.fire("Error", err?.data?.message || "Something went wrong", "error");
    }
  };
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        console.log(ids);
        // await deleteUser(id).unwrap();
        Swal.fire("Deleted!", "Employee removed.", "success");
      }
    } catch (err: any) {
      Swal.fire("Error", err?.data?.message || "Something went wrong", "error");
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="border border-gray-200 w-full rounded-xl my-10 overflow-hidden">
      {/* Header + Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center py-4 px-6 gap-4 bg-white">
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl overflow-hidden">
            <span className="text-sm text-blue-400 font-medium bg-[#CAD2DB]/10 border-r border-gray-200 p-3 ">
              {selectedIds.length} selected
            </span>
            <Button
              variant="ghost"
              onClick={() => handleBulkDelete(selectedIds)}
              className="text-sm"
            >
              <Trash2 className=" h-4 w-4 text-red-500" /> Delete
            </Button>
          </div>
        ) : (
          <h2 className="text-2xl font-medium">Employee List</h2>
        )}
        <div className="flex gap-2 flex-wrap items-center">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded px-3 py-1 max-w-64 focus:outline-none focus:border-gray-500"
          />
          <Select>
            <SelectTrigger className="min-w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="space-y-2">
              <FieldGroup className="flex flex-col gap-2 p-2 space-y-2">
                <Label className="text-xs font-medium">By Role</Label>
                {["MANAGER", "EMPLOYEE", "VIEWER"].map((role) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={roleFilter === role}
                      onCheckedChange={(checked) => {
                        setCurrentPage(1);
                        setRoleFilter(checked ? role : "All");
                      }}
                    />
                    <Label
                      onClick={() =>
                        setRoleFilter(roleFilter === role ? "All" : role)
                      }
                    >
                      {role}
                    </Label>
                  </div>
                ))}
              </FieldGroup>
              <FieldGroup className="flex flex-col gap-2 p-2 space-y-2">
                <Label className="text-xs font-medium">By Status</Label>
                {["Active", "Inactive"].map((status) => (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={statusFilter === status}
                      onCheckedChange={(checked) => {
                        setCurrentPage(1);
                        setStatusFilter(checked ? status : "All");
                      }}
                    />
                    <Label
                      onClick={() =>
                        setStatusFilter(
                          statusFilter === status ? "All" : status,
                        )
                      }
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </FieldGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left w-[50px]">
                <Checkbox
                  checked={
                    filteredUsers.length > 0 &&
                    selectedIds.length === filteredUsers.length
                  }
                  className="size-[18px]"
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked as boolean)
                  }
                />
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold w-[350px] cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Profile Name {renderSortIcon("name")}
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold w-[300px] cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email {renderSortIcon("email")}
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer"
                onClick={() => handleSort("role")}
              >
                Role {renderSortIcon("role")}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold w-[300px]">
                Assign Project
              </th>
              <th
                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer"
                onClick={() => handleSort("lastActive")}
              >
                Last Active {renderSortIcon("lastActive")}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Level
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? renderSkeleton()
              : filteredUsers.map((user: any) => {
                  return (
                    <tr
                      key={user.id}
                      className={`even:bg-gray-50 odd:bg-white hover:bg-gray-100 transition h-12 ${
                        selectedIds.includes(user.id) ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-6 py-3 w-[50px] align-middle">
                        <Checkbox
                          className="size-[18px]"
                          checked={selectedIds.includes(user.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(user.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="px-6 py-3 w-[350px] align-middle">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              user.profileImage ||
                              "https://randomuser.me/api/portraits/men/19.jpg"
                            }
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 w-[300px] align-middle">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm align-middle">
                        <Badge
                          variant="outline"
                          className={`px-2 py-1 font-medium ${
                            user.role === "MANAGER"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : user.role === "EMPLOYEE"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {user.role === "MANAGER"
                            ? "Manager"
                            : user.role === "EMPLOYEE"
                              ? "Staff"
                              : "Viewer"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 align-middle w-[300px]">
                        <div className="flex flex-wrap gap-1">
                          {user.role === "MANAGER" &&
                            user.manager?.projects?.map((p: any) => (
                              <Badge
                                key={p.id}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0.5 border-gray-200 truncate block text-center"
                                title={p.name}
                              >
                                {p.name}
                              </Badge>
                            ))}
                          {(user.role === "EMPLOYEE" ||
                            user.role === "VIEWER") &&
                            user.employee?.projectEmployees?.map((pe: any) => (
                              <Badge
                                key={pe.id}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0.5 border-gray-200 truncate block text-center"
                                title={pe.project?.name}
                              >
                                {pe.project?.name}
                              </Badge>
                            ))}
                          {user.role === "VIEWER" &&
                            user.viewer?.projectViewers?.map((pv: any) => (
                              <Badge
                                key={pv.id}
                                variant="outline"
                                className="text-[10px] px-1.5 py-0.5 border-gray-200 truncate block text-center"
                                title={pv.project?.name}
                              >
                                {pv.project?.name}
                              </Badge>
                            ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 align-middle">
                        {user.lastActive
                          ? new Date(user.lastActive).toLocaleDateString(
                              "en-US",
                            )
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm align-middle">
                        <Badge
                          variant="outline"
                          className={`px-2 py-1 font-medium ${
                            user.userStatus === "ACTIVE"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {user.userStatus === "ACTIVE"
                            ? "Active"
                            : "In Active"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 text-blue-500 cursor-pointer" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsUpdateModalOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4 text-green-500 cursor-pointer" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600 cursor-pointer" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

            {/* Fill remaining rows to maintain table height */}
            {!loading &&
              filteredUsers.length < PAGE_SIZE &&
              Array.from({ length: PAGE_SIZE - filteredUsers.length }).map(
                (_, i) => (
                  <tr
                    key={`empty-${i}`}
                    className="h-12 even:bg-gray-50 odd:bg-white"
                  >
                    {Array(8)
                      .fill(0)
                      .map((_, idx) => (
                        <td
                          key={idx}
                          className={`${
                            idx === 1 ? "px-6 w-[200px]" : "px-4"
                          } ${idx === 2 ? "w-[300px]" : ""} py-3`}
                        ></td>
                      ))}
                  </tr>
                ),
              )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center py-4 px-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {startUser}-{endUser} of {totalUsers} users
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={page === currentPage ? "default" : "outline"}
              className={` ${
                page === currentPage ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <ViewUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
      <AddEmployeeModal
        open={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        employee={selectedUser}
      />
    </div>
  );
};

export default EmployeeTable;
