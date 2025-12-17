import { Eye, Edit, Trash2 } from "lucide-react";
import { IEmployeeProfile } from "@/types/client-panel";

interface ITableProps {
  employees: IEmployeeProfile[];
  selectedEmployees: Set<string>;
  selectAll: boolean;
  visibleColumns?: string[];
  handleSelectAll: () => void;
  handleSelectEmployee: (id: string) => void;
  handleViewClick: (employeeId: string) => void;
  handleEditClick?: (employee: IEmployeeProfile) => void;
  handleDeleteEmployee?: (id: string) => void;
  handleSort?: (field: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  getRoleBadgeColor: (role: string) => string;
  getStatusBadgeColor?: (level: string) => string;
}

const EmployeeTable = ({
  employees,
  selectedEmployees,
  selectAll,
  visibleColumns = [
    "employeeName",
    "email",
    "role",
    "projects",
    "lastActive",
    "level",
    "action",
  ],
  handleSelectAll,
  handleSelectEmployee,
  handleViewClick,
  handleEditClick,
  handleDeleteEmployee,
  handleSort,
  sortBy,
  sortOrder,
  getRoleBadgeColor,
  getStatusBadgeColor,
}: ITableProps) => {
  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  const sortableHeader = (
    label: string,
    field: string,
    className = ""
  ) => (
    <th
      onClick={() => handleSort?.(field)}
      className={`px-6 py-3 text-left cursor-pointer select-none ${className}`}
    >
      <span className="inline-flex items-center text-sm text-xs font-medium text-gray-700">
        {label} {renderSortIcon(field)}
      </span>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2"
              />
            </th>

            {visibleColumns.includes("employeeName") &&
              sortableHeader("Employee Name", "userName")}
            {visibleColumns.includes("email") &&
              sortableHeader("Email", "email")}
            {visibleColumns.includes("role") &&
              sortableHeader("Role", "role")}
            {visibleColumns.includes("projects") &&
              sortableHeader("Projects", "projects")}
            {visibleColumns.includes("lastActive") &&
              sortableHeader("Last Active", "updatedAt")}
            {visibleColumns.includes("level") &&
              sortableHeader("Status", "status")}
            {visibleColumns.includes("action") && (
              <th className="px-6 py-3 text-left">Action</th>
            )}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedEmployees.has(employee.id)}
                  onChange={() => handleSelectEmployee(employee.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2"
                />
              </td>

              {visibleColumns.includes("employeeName") && (
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={employee.user.profileImage || ""}
                      alt="Employee Avatar"
                      className="w-10 h-10 rounded-full mr-3 bg-gray-100"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {employee.user.name}
                    </span>
                  </div>
                </td>
              )}

              {visibleColumns.includes("email") && (
                <td className="px-6 py-4 text-sm text-gray-600">
                  {employee.user.email}
                </td>
              )}

              {visibleColumns.includes("role") && (
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                      employee.user.role
                    )}`}
                  >
                    {employee.user.role}
                  </span>
                </td>
              )}

              {visibleColumns.includes("projects") && (
                <td className="px-6 py-4">
                  <div className="grid grid-cols-3 gap-2">
                    {employee.projects?.map((project, index) => (
                      <span
                        key={index}
                        className="text-xs border bg-gray-50 px-2 py-1 rounded-lg"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </td>
              )}

              {visibleColumns.includes("lastActive") && (
                <td className="px-6 py-4 text-sm text-gray-600">
                  {employee.user.updatedAt
                    ? new Date(
                        employee.user.updatedAt
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
              )}

              {visibleColumns.includes("level") &&
                getStatusBadgeColor && (
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                        employee.user.userStatus === "ACTIVE"
                          ? "Active"
                          : "In Active"
                      )}`}
                    >
                      {employee.user.userStatus === "ACTIVE"
                        ? "Active"
                        : "In Active"}
                    </span>
                  </td>
                )}

              {visibleColumns.includes("action") && (
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {handleViewClick && (
                      <button
                        onClick={() => handleViewClick(employee.id)}
                        className="p-1 text-blue-500"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {handleEditClick && (
                      <button
                        className="p-1 text-green-600"
                        onClick={() => handleEditClick(employee)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {handleDeleteEmployee && (
                      <button
                        className="p-1 text-red-600"
                        onClick={() =>
                          handleDeleteEmployee(employee.id)
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
