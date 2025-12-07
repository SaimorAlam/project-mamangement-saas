import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Employee } from "@/components/EmployeeData/EmployeeData";

interface TableDataProps {
  employees: Employee[];
  selectedEmployees: Set<string>;
  selectAll: boolean;
  visibleColumns?: string[]; // 👈 new prop
  handleSelectAll: () => void;
  handleSelectEmployee: (id: string) => void;
  handleEditClick?: (employee: Employee) => void;
  handleDeleteEmployee?: (id: string) => void;
  getRoleBadgeColor: (role: string) => string;
  getStatusBadgeColor?: (level: string) => string;
}

const TableData: React.FC<TableDataProps> = ({
  employees,
  selectedEmployees,
  selectAll,
  visibleColumns = ["fileName", "email", "role", "projects", "lastActive", "level", "action"],
  handleSelectAll,
  handleSelectEmployee,
  handleEditClick,
  handleDeleteEmployee,
  getRoleBadgeColor,
  getStatusBadgeColor,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </th>

            {visibleColumns.includes("fileName") && (
              <th className="px-6 py-3 text-left">File Name</th>
            )}
            {visibleColumns.includes("email") && (
              <th className="px-6 py-3 text-left">Email</th>
            )}
            {visibleColumns.includes("role") && (
              <th className="px-6 py-3 text-left">Role</th>
            )}
            {visibleColumns.includes("projects") && (
              <th className="px-6 py-3 text-left">Assign Project</th>
            )}
            {visibleColumns.includes("lastActive") && (
              <th className="px-6 py-3 text-left w-36">Last Active</th>
            )}
            {visibleColumns.includes("level") && (
              <th className="px-6 py-3 text-left">Level</th>
            )}
            {visibleColumns.includes("action") && (
              <th className="px-6 py-3 text-left">Action</th>
            )}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedEmployees.has(employee.id)}
                  onChange={() => handleSelectEmployee(employee.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </td>

              {visibleColumns.includes("fileName") && (
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg mr-3">
                      {employee.avatar}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{employee.name}</span>
                  </div>
                </td>
              )}

              {visibleColumns.includes("email") && (
                <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
              )}

              {visibleColumns.includes("role") && (
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                      employee.role
                    )}`}
                  >
                    {employee.role}
                  </span>
                </td>
              )}

              {visibleColumns.includes("projects") && (
                <td className="px-6 py-4">
                  <div className="grid grid-cols-3 gap-2">
                    {employee.projects.map((project, index) => (
                      <span
                        key={index}
                        className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </td>
              )}

              {visibleColumns.includes("lastActive") && (
                <td className="px-6 py-4 text-sm text-gray-600">{employee.lastActive}</td>
              )}

              {visibleColumns.includes("level") && getStatusBadgeColor && (
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                      employee.level
                    )}`}
                  >
                    {employee.level}
                  </span>
                </td>
              )}

              {visibleColumns.includes("action") && (
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                        className="p-1 text-blue-500 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    {handleEditClick && (
                      <button
                        className="p-1 text-green-600 cursor-pointer"
                        onClick={() => handleEditClick(employee)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {handleDeleteEmployee && (
                      <button
                        className="p-1 text-red-600 cursor-pointer"
                        onClick={() => handleDeleteEmployee(employee.id)}
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

export default TableData;
