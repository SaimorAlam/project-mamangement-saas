import React from "react";
import { IEmployee } from "@/types";

interface IEditEmployeeModalProps {
  editEmployee: IEmployee;
  handleEditChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleEditSave: () => void;
  handleEditCancel: () => void;
}

export default function EditEmployeeModal({
  editEmployee,
  handleEditChange,
  handleEditSave,
  handleEditCancel,
}: IEditEmployeeModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.5)] bg-opacity-50 backdrop-filter backdrop-blur-sm z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              name="name"
              value={editEmployee.name}
              onChange={handleEditChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              value={editEmployee.email}
              onChange={handleEditChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              name="role"
              value={editEmployee.role}
              onChange={handleEditChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Manager">Manager</option>
              <option value="Staff">Staff</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Level
            </label>
            <select
              name="level"
              value={editEmployee.level}
              onChange={handleEditChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Active">Active</option>
              <option value="In Active">In Active</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={handleEditCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleEditSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}