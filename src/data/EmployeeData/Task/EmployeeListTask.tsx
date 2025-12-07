import React, { useState } from "react";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  projects: string[];
  lastActive: string;
  level: string;
  avatar: string;
}

interface EmployeeListTaskProps {
  employees?: Employee[];
}

const EmployeeListTask: React.FC<EmployeeListTaskProps> = ({ employees: propEmployees }) => {
  const data = propEmployees || [];

  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const allSelected = data.length > 0 && selectedEmployees.length === data.length;

 
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(data.map((emp) => emp.id));
    }
  };


  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  return (

    <div>
      <div className="bg-white">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-lg font-semibold text-gray-700 border-b border-gray-100">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="accent-black cursor-pointer mr-2"
                  />{" "}
                  File Name
                </th>
                <th className="px-6 py-3 text-lg font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-lg font-semibold text-gray-700">Last Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((emp) => (
                <tr
                  key={emp.id}
                  className={`hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                    selectedEmployees.includes(emp.id) ? "bg-gray-100" : ""
                  }`}
                >
                  <td className="px-6 py-3 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={() => handleSelectEmployee(emp.id)}
                      className="accent-black cursor-pointer"
                    />
                    <span className="text-xl">{emp.avatar}</span>
                    <span className="text-gray-800 font-medium">{emp.name}</span>
                  </td>
                  <td className="px-6 py-3  text-gray-600">{emp.role}</td>
                  <td className="px-6 py-3 text-gray-500">{emp.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
     </div>
  );
};

export default EmployeeListTask;
