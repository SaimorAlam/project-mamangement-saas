import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronDown, LucideTable2, ListChecks  } from 'lucide-react';
import { Employee, employees } from './EmployeeData';
import TableData from './TableData';
import EmployeeListTask from './Task/EmployeeListTask';
import DianneRussellTask from './Task/DianneRussellTask';

const EmployeeList: React.FC = () => {
    const [searchTerm] = useState<string>('');
    const [filterBy, setFilterBy] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
    const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [employeeList, setEmployeeList] = useState<Employee[]>(employees);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
    const [activeTab, setActiveTab] = useState<'tables' | 'task'>('tables');

    const itemsPerPage = 17;

    const filteredEmployees = employeeList.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterBy === 'all' || employee.level.toLowerCase() === filterBy.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEmployees(new Set());
            setSelectAll(false);
        } else {
            setSelectedEmployees(new Set(currentEmployees.map(emp => emp.id)));
            setSelectAll(true);
        }
    };

    const handleSelectEmployee = (employeeId: string) => {
        const newSelected = new Set(selectedEmployees);
        if (newSelected.has(employeeId)) {
            newSelected.delete(employeeId);
        } else {
            newSelected.add(employeeId);
        }
        setSelectedEmployees(newSelected);
        setSelectAll(newSelected.size === currentEmployees.length && currentEmployees.every(emp => newSelected.has(emp.id)));
    };

    const handleDeleteEmployee = (employeeId: string) => {
        setEmployeeList(prev => prev.filter(emp => emp.id !== employeeId));
    };

    const handleEditClick = (employee: Employee) => {
        setEditEmployee(employee);
        setEditModalOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editEmployee) return;
        const { name, value } = e.target;
        setEditEmployee({ ...editEmployee, [name]: value });
    };

    const handleEditSave = () => {
        if (!editEmployee) return;
        setEmployeeList(prev => prev.map(emp => emp.id === editEmployee.id ? editEmployee : emp));
        setEditModalOpen(false);
        setEditEmployee(null);
    };

    const handleEditCancel = () => {
        setEditModalOpen(false);
        setEditEmployee(null);
    };
    const handleDeleteSelected = () => {
        setEmployeeList(prev =>
            prev.filter(emp => !selectedEmployees.has(emp.id))
        );
        setSelectedEmployees(new Set());
        setSelectAll(false);
    };

    // Reset to first page when search or filter changes
    React.useEffect(() => {
        setCurrentPage(1);
        setSelectedEmployees(new Set());
        setSelectAll(false);
    }, [searchTerm, filterBy]);

    const getRoleBadgeColor = (role: string): string => {
        switch (role) {
            case 'Manager':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Staff':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Viewer':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusBadgeColor = (status: string): string => {
        return status === 'Active'
            ? 'bg-green-100 text-green-800 border-green-200'
            : 'bg-red-100 text-red-800 border-red-200';
    };

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

        return (
            <div className="my-10 flex gap-5">
                <div className={`${activeTab === "task" ? "w-full" : "w-full"} transition-all duration-300`}>
                   <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <h1 className="text-2xl font-semibold text-gray-900">Employees List</h1>
                                {selectedEmployees.size > 0 && (
                                    <div className="flex items-center space-x-3">
                                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {selectedEmployees.size} selected
                                        </span>
                                        <button
                                            onClick={handleDeleteSelected}
                                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                                        >
                                            Delete Selected
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Search */}
                                {activeTab === "task" ? (
                                    <button className="p-2 rounded-lg">
                                        <Search className="w-6 h-6 text-gray-600" />
                                    </button>
                                    ) : (
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                                        <input
                                        type="text"
                                        placeholder="Search Project..."
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                        />
                                    </div>
                                )}


                              {/* Tab */}
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveTab('tables')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                                        activeTab === 'tables'
                                            ? 'bg-black text-white'
                                            : 'border border-gray-300 text-website-color-black'
                                        }`}
                                        >
                                        <LucideTable2 className="w-4 h-4" />
                                        <span>Tables</span>
                                    </button>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setActiveTab('task')}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                                        activeTab === 'task'
                                            ? 'bg-black text-white'
                                            : 'border border-gray-300 text-website-color-black'
                                        }`}
                                        >
                                        <ListChecks className="w-4 h-4" />
                                        <span>Task</span>
                                    </button>
                                </div>
                                

                                {/* Filter Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                                    >
                                        <Filter className="w-4 h-4" />
                                        <span>Filter By</span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {showFilterDropdown && (
                                    <div id="filter-dropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                        <div className="py-2">
                                            <h3 className='text-sm font-semibold text-website-color-black px-4 pb-2'>By Role:</h3>
                                            <div className='flex items-center gap-2 pl-6 py-1'>
                                                <input
                                                type="checkbox"
                                                className="cursor-pointer"
                                                />
                                                <p className='text-sm text-website-color-black'>Editor</p>
                                            </div>
                                            <div className='flex items-center gap-2 pl-6 py-1'>
                                                <input
                                                type="checkbox"
                                                className="cursor-pointer"
                                                />
                                                <p className='text-sm text-website-color-black'>Moderator</p>
                                            </div>
                                            <div className='flex items-center gap-2 pl-6 py-1'>
                                                <input
                                                type="checkbox"
                                                className="cursor-pointer"
                                                />
                                                <p className='text-sm text-website-color-black'>Viewer</p>
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <h3 className='text-sm font-semibold text-website-color-black px-4 pb-2'>By Status:</h3>
                                            <div className='flex items-center gap-2 pl-6 py-1'>
                                                <input
                                                type="checkbox"
                                                checked={filterBy === 'active'}
                                                onChange={(e) => {
                                                setFilterBy(e.target.checked ? 'active' : 'all');
                                                }}
                                                className="cursor-pointer"
                                            />
                                            <p className='text-sm text-website-color-black'>Active Only</p>
                                            </div>
                                            <div className='flex items-center gap-2 pl-6 py-1'>
                                                <input
                                                type="checkbox"
                                                checked={filterBy === 'in active'}
                                                onChange={(e) => {
                                                setFilterBy(e.target.checked ? 'in active' : 'all');
                                                }}
                                                className="cursor-pointer"
                                                />
                                                <p className='text-sm text-website-color-black'>Inactive Only</p>
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    {activeTab === 'tables' ? (
                        <TableData
                            employees={currentEmployees}
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
                        <EmployeeListTask employees={currentEmployees} />
                    )}

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} Files
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Prev
                                </button>

                                {/* Page Numbers */}
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
                                            className={`px-3 py-1 text-sm rounded ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {totalPages > 5 && currentPage < totalPages - 2 && (
                                    <>
                                        <span className="px-3 py-1 text-sm text-gray-500">...</span>
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            {/* Edit Modal */}
            {editModalOpen && editEmployee && (
                <div className="fixed inset-0 flex items-center justify-center bg-[rgba(255,255,255,0.5)] bg-opacity-50 backdrop-filter backdrop-blur-sm z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input name="name" value={editEmployee.name} onChange={handleEditChange} className="w-full border px-3 py-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input name="email" value={editEmployee.email} onChange={handleEditChange} className="w-full border px-3 py-2 rounded" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <select name="role" value={editEmployee.role} onChange={handleEditChange} className="w-full border px-3 py-2 rounded">
                                    <option value="Manager">Manager</option>
                                    <option value="Staff">Staff</option>
                                    <option value="Viewer">Viewer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Level</label>
                                <select name="level" value={editEmployee.level} onChange={handleEditChange} className="w-full border px-3 py-2 rounded">
                                    <option value="Active">Active</option>
                                    <option value="In Active">In Active</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-6">
                            <button className="px-4 py-2 bg-gray-200 rounded" onClick={handleEditCancel}>Cancel</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleEditSave}>Save</button>
                        </div>
                    </div>
                </div>
            )}
             {activeTab === "task" && (
                <div className='w-full'>
                    <DianneRussellTask />
                </div>
            )}
        </div>
    );
};

export default EmployeeList;