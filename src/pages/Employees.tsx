import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, Filter, ChevronDown, LucideTable2 } from 'lucide-react';
import CommonWrapper from '@/common/CommonWrapper';

interface Employee {
    id: string;
    name: string;
    email: string;
    role: 'Manager' | 'Staff' | 'Viewer';
    projects: string[];
    lastActive: string;
    level: 'Active' | 'In Active';
    avatar: string;
}

const employees: Employee[] = [
    {
        id: '1',
        name: 'Dianne Russell',
        email: 'tanya.hill@example.com',
        role: 'Manager',
        projects: ['Carlyle Hat', 'Carlyle Hat', 'Carlyle Hat', 'Carlyle Hat'],
        lastActive: '4/4/18',
        level: 'Active',
        // example image avatar: 'https://randomuser.me/api/portraits/women/44.jpg' 
        avatar: '👩🏽‍💼'
    },
    {
        id: '2',
        name: 'Brooklyn Simmons',
        email: 'curtis.weaver@example.com',
        role: 'Staff',
        projects: ['Carlyle Hat'],
        lastActive: '12/4/17',
        level: 'Active',
        avatar: '👨🏿‍💼'
    },
    {
        id: '3',
        name: 'Darlene Robertson',
        email: 'michelle.rivera@example.com',
        role: 'Viewer',
        projects: ['Carlyle Hat'],
        lastActive: '1/31/14',
        level: 'In Active',
        avatar: '👩🏻‍💼'
    },
    {
        id: '4',
        name: 'Arlene McCoy',
        email: 'jackson.graham@example.com',
        role: 'Staff',
        projects: ['Carlyle Hat'],
        lastActive: '3/4/16',
        level: 'Active',
        avatar: '👩🏾‍💼'
    },
    {
        id: '5',
        name: 'Marvin McKinney',
        email: 'bill.sanders@example.com',
        role: 'Staff',
        projects: ['Carlyle Hat'],
        lastActive: '5/7/16',
        level: 'Active',
        avatar: '👨🏿‍💼'
    },
    {
        id: '6',
        name: 'Jane Cooper',
        email: 'nathan.roberts@example.com',
        role: 'Viewer',
        projects: ['Carlyle Hat'],
        lastActive: '2/11/12',
        level: 'Active',
        avatar: '👩🏼‍💼'
    },
    {
        id: '7',
        name: 'Theresa Webb',
        email: 'tim.jennings@example.com',
        role: 'Viewer',
        projects: ['Carlyle Hat'],
        lastActive: '6/19/14',
        level: 'In Active',
        avatar: '👩🏽‍💼'
    },
    {
        id: '8',
        name: 'Darrell Steward',
        email: 'deanna.curtis@example.com',
        role: 'Manager',
        projects: ['Carlyle Hat'],
        lastActive: '9/18/16',
        level: 'Active',
        avatar: '👨🏾‍💼'
    },
    {
        id: '9',
        name: 'Jacob Jones',
        email: 'willie.jennings@example.com',
        role: 'Manager',
        projects: ['Phoenix App', 'Delta Website'],
        lastActive: '7/11/19',
        level: 'Active',
        avatar: '👨🏻‍💼'
    },
    {
        id: '10',
        name: 'Savannah Nguyen',
        email: 'dolores.chambers@example.com',
        role: 'Viewer',
        projects: ['Quantum Project'],
        lastActive: '8/30/14',
        level: 'Active',
        avatar: '👩🏻‍💼'
    },
    {
        id: '11',
        name: 'Devon Lane',
        email: 'debra.holt@example.com',
        role: 'Viewer',
        projects: ['Alpha Beta', 'Gamma Delta'],
        lastActive: '5/27/15',
        level: 'Active',
        avatar: '👨🏾‍💼'
    },
    {
        id: '12',
        name: 'Robert Fox',
        email: 'kenzi.lawson@example.com',
        role: 'Viewer',
        projects: ['Echo Platform'],
        lastActive: '5/19/12',
        level: 'Active',
        avatar: '👨🏻‍💼'
    },
    {
        id: '13',
        name: 'Albert Flores',
        email: 'alma.lawson@example.com',
        role: 'Viewer',
        projects: ['Sierra Mobile'],
        lastActive: '10/6/13',
        level: 'Active',
        avatar: '👨🏽‍💼'
    },
    {
        id: '14',
        name: 'Kathryn Murphy',
        email: 'felicia.reid@example.com',
        role: 'Viewer',
        projects: ['Tango API'],
        lastActive: '1/15/12',
        level: 'In Active',
        avatar: '👩🏼‍💼'
    },
    {
        id: '15',
        name: 'Wade Warren',
        email: 'michael.mitc@example.com',
        role: 'Viewer',
        projects: ['Bravo System'],
        lastActive: '1/15/12',
        level: 'In Active',
        avatar: '👨🏿‍💼'
    },
    {
        id: '16',
        name: 'Kristin Watson',
        email: 'nevaeh.simmons@example.com',
        role: 'Viewer',
        projects: ['Victor Cloud'],
        lastActive: '1/15/12',
        level: 'In Active',
        avatar: '👩🏽‍💼'
    },
    {
        id: '17',
        name: 'Eleanor Pena',
        email: 'eleanor.pena@example.com',
        role: 'Staff',
        projects: ['Whiskey Analytics', 'X-Ray Tools'],
        lastActive: '3/22/20',
        level: 'Active',
        avatar: '👩🏻‍💼'
    },
    {
        id: '18',
        name: 'Cameron Williamson',
        email: 'cameron.williamson@example.com',
        role: 'Staff',
        projects: ['Yankee Dashboard'],
        lastActive: '8/15/19',
        level: 'Active',
        avatar: '👨🏼‍💼'
    },
    {
        id: '19',
        name: 'Jenny Wilson',
        email: 'jenny.wilson@example.com',
        role: 'Manager',
        projects: ['Zulu Network', 'Alpha Prime'],
        lastActive: '11/3/21',
        level: 'Active',
        avatar: '👩🏾‍💼'
    },
    {
        id: '20',
        name: 'Ralph Edwards',
        email: 'ralph.edwards@example.com',
        role: 'Staff',
        projects: ['Beta Launch'],
        lastActive: '6/12/18',
        level: 'Active',
        avatar: '👨🏽‍💼'
    },
    {
        id: '21',
        name: 'Courtney Henry',
        email: 'courtney.henry@example.com',
        role: 'Viewer',
        projects: ['Charlie Protocol'],
        lastActive: '2/8/17',
        level: 'In Active',
        avatar: '👩🏿‍💼'
    },
    {
        id: '22',
        name: 'Annette Black',
        email: 'annette.black@example.com',
        role: 'Staff',
        projects: ['Delta Force', 'Echo Point'],
        lastActive: '9/30/20',
        level: 'Active',
        avatar: '👩🏻‍💼'
    },
    {
        id: '23',
        name: 'Ronald Richards',
        email: 'ronald.richards@example.com',
        role: 'Manager',
        projects: ['Foxtrot Initiative'],
        lastActive: '4/17/22',
        level: 'Active',
        avatar: '👨🏻‍💼'
    },
    {
        id: '24',
        name: 'Cody Fisher',
        email: 'cody.fisher@example.com',
        role: 'Staff',
        projects: ['Golf Suite', 'Hotel Management'],
        lastActive: '12/5/19',
        level: 'Active',
        avatar: '👨🏼‍💼'
    },
    {
        id: '25',
        name: 'Esther Howard',
        email: 'esther.howard@example.com',
        role: 'Viewer',
        projects: ['India Connect'],
        lastActive: '7/28/16',
        level: 'In Active',
        avatar: '👩🏽‍💼'
    },
    {
        id: '26',
        name: 'Leslie Alexander',
        email: 'leslie.alexander@example.com',
        role: 'Manager',
        projects: ['Juliet Framework', 'Kilo Base'],
        lastActive: '1/12/23',
        level: 'Active',
        avatar: '👩🏼‍💼'
    },
    {
        id: '27',
        name: 'Guy Hawkins',
        email: 'guy.hawkins@example.com',
        role: 'Staff',
        projects: ['Lima Portal'],
        lastActive: '10/14/21',
        level: 'Active',
        avatar: '👨🏿‍💼'
    },
    {
        id: '28',
        name: 'Floyd Miles',
        email: 'floyd.miles@example.com',
        role: 'Viewer',
        projects: ['Mike System'],
        lastActive: '3/7/15',
        level: 'In Active',
        avatar: '👨🏾‍💼'
    },
    {
        id: '29',
        name: 'Jerome Bell',
        email: 'jerome.bell@example.com',
        role: 'Staff',
        projects: ['November Tech', 'Oscar Platform'],
        lastActive: '5/23/20',
        level: 'Active',
        avatar: '👨🏽‍💼'
    },
    {
        id: '30',
        name: 'Kristin Watson',
        email: 'kristin.watson2@example.com',
        role: 'Manager',
        projects: ['Papa Solutions'],
        lastActive: '8/9/22',
        level: 'Active',
        avatar: '👩🏻‍💼'
    },
    {
        id: '31',
        name: 'Bessie Cooper',
        email: 'bessie.cooper@example.com',
        role: 'Staff',
        projects: ['Quebec Labs', 'Romeo Engine'],
        lastActive: '11/17/18',
        level: 'Active',
        avatar: '👩🏿‍💼'
    },
    {
        id: '32',
        name: 'Dianne Russell',
        email: 'dianne.russell2@example.com',
        role: 'Viewer',
        projects: ['Sierra Vista'],
        lastActive: '6/4/14',
        level: 'In Active',
        avatar: '👩🏾‍💼'
    },
    {
        id: '33',
        name: 'Marvin McKinney',
        email: 'marvin.mckinney2@example.com',
        role: 'Staff',
        projects: ['Tango Works', 'Uniform Build'],
        lastActive: '2/19/21',
        level: 'Active',
        avatar: '👨🏻‍💼'
    },
    {
        id: '34',
        name: 'Jane Cooper',
        email: 'jane.cooper2@example.com',
        role: 'Manager',
        projects: ['Victor Labs'],
        lastActive: '9/11/23',
        level: 'Active',
        avatar: '👩🏼‍💼'
    },
    {
        id: '35',
        name: 'Robert Fox',
        email: 'robert.fox2@example.com',
        role: 'Staff',
        projects: ['Whiskey Digital'],
        lastActive: '4/8/19',
        level: 'Active',
        avatar: '👨🏿‍💼'
    },
    {
        id: '36',
        name: 'Brooklyn Simmons',
        email: 'brooklyn.simmons2@example.com',
        role: 'Viewer',
        projects: ['X-Ray Vision'],
        lastActive: '12/29/17',
        level: 'In Active',
        avatar: '👨🏽‍💼'
    },
    {
        id: '37',
        name: 'Arlene McCoy',
        email: 'arlene.mccoy2@example.com',
        role: 'Manager',
        projects: ['Yankee Enterprise', 'Zulu Gateway'],
        lastActive: '7/6/24',
        level: 'Active',
        avatar: '👩🏻‍💼'
    },
    {
        id: '38',
        name: 'Theresa Webb',
        email: 'theresa.webb2@example.com',
        role: 'Staff',
        projects: ['Alpha Integration'],
        lastActive: '1/25/18',
        level: 'Active',
        avatar: '👩🏾‍💼'
    },
    {
        id: '39',
        name: 'Darrell Steward',
        email: 'darrell.steward2@example.com',
        role: 'Viewer',
        projects: ['Bravo Testing'],
        lastActive: '10/2/16',
        level: 'In Active',
        avatar: '👨🏼‍💼'
    },
    {
        id: '40',
        name: 'Jacob Jones',
        email: 'jacob.jones2@example.com',
        role: 'Staff',
        projects: ['Charlie Deploy', 'Delta Ops'],
        lastActive: '3/15/22',
        level: 'Active',
        avatar: '👨🏻‍💼'
    },
    {
        id: '41',
        name: 'Savannah Nguyen',
        email: 'savannah.nguyen2@example.com',
        role: 'Manager',
        projects: ['Echo Hub'],
        lastActive: '8/21/23',
        level: 'Active',
        avatar: '👩🏽‍💼'
    },
    {
        id: '42',
        name: 'Devon Lane',
        email: 'devon.lane2@example.com',
        role: 'Staff',
        projects: ['Foxtrot Core'],
        lastActive: '6/13/20',
        level: 'Active',
        avatar: '👨🏿‍💼'
    },
    {
        id: '43',
        name: 'Albert Flores',
        email: 'albert.flores2@example.com',
        role: 'Viewer',
        projects: ['Golf Stream'],
        lastActive: '11/8/15',
        level: 'In Active',
        avatar: '👨🏾‍💼'
    },
    {
        id: '44',
        name: 'Kathryn Murphy',
        email: 'kathryn.murphy2@example.com',
        role: 'Staff',
        projects: ['Hotel Central', 'India Bridge'],
        lastActive: '4/26/21',
        level: 'Active',
        avatar: '👩🏼‍💼'
    },
    {
        id: '45',
        name: 'Wade Warren',
        email: 'wade.warren2@example.com',
        role: 'Manager',
        projects: ['Juliet Command'],
        lastActive: '12/18/22',
        level: 'Active',
        avatar: '👨🏽‍💼'
    },
    {
        id: '46',
        name: 'Kristin Watson',
        email: 'kristin.watson3@example.com',
        role: 'Staff',
        projects: ['Kilo Network'],
        lastActive: '9/4/19',
        level: 'Active',
        avatar: '👩🏿‍💼'
    },
    {
        id: '47',
        name: 'Eleanor Pena',
        email: 'eleanor.pena2@example.com',
        role: 'Viewer',
        projects: ['Lima Flow'],
        lastActive: '5/16/17',
        level: 'In Active',
        avatar: '👩🏻‍💼'
    },
    {
        id: '48',
        name: 'Cameron Williamson',
        email: 'cameron.williamson2@example.com',
        role: 'Staff',
        projects: ['Mike Protocol', 'November Suite'],
        lastActive: '2/3/23',
        level: 'Active',
        avatar: '👨🏼‍💼'
    },
    {
        id: '49',
        name: 'Jenny Wilson',
        email: 'jenny.wilson2@example.com',
        role: 'Manager',
        projects: ['Oscar Drive'],
        lastActive: '7/14/24',
        level: 'Active',
        avatar: '👩🏽‍💼'
    },
    {
        id: '50',
        name: 'Ralph Edwards',
        email: 'ralph.edwards2@example.com',
        role: 'Staff',
        projects: ['Papa Connect', 'Quebec Engine'],
        lastActive: '10/27/21',
        level: 'Active',
        avatar: '👨🏿‍💼'
    }
];




const EmployeeList: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterBy, setFilterBy] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
    const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [employeeList, setEmployeeList] = useState<Employee[]>(employees);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editEmployee, setEditEmployee] = useState<Employee | null>(null);

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

        // Sidebar state for TaskDashboard
        const [showTaskSidebar, setShowTaskSidebar] = useState(false);

        // TaskDashboard component (from commented code)
        const TaskDashboard = () => {
            // ...existing code from your commented TaskDashboard...
            // For brevity, you can copy the full TaskDashboard code here
            return (
                <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${showTaskSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Place your TaskDashboard content here, or import if in another file */}
                    <div className="p-6">Task Dashboard Content</div>
                </div>
            );
        };

        return (
                <div className="min-h-screen bg-gray-50 p-6">
                        <CommonWrapper>
                                <div className=" mx-auto">
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
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search Project..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    {/* tabel_show */}

                                    <div className="relative">
                                        <button
                                            className="flex items-center space-x-2 px-4 py-2 bg-black text-gray-700 rounded-lg transition-colors"
                                        >
                                            <LucideTable2  className="w-4 h-4 text-white" />
                                            <span className='text-white'>Filter By</span>
                                        </button>
                                    </div>

                                    

                                    {/* Filter Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            <Filter className="w-4 h-4" />
                                            <span>Filter By</span>
                                            <ChevronDown className="w-4 h-4" />
                                        </button>

                                        {showFilterDropdown && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                                <div className="py-2">
                                                    <button
                                                        onClick={() => { setFilterBy('all'); setShowFilterDropdown(false); }}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                                    >
                                                        All Employees
                                                    </button>
                                                    <button
                                                        onClick={() => { setFilterBy('active'); setShowFilterDropdown(false); }}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                                    >
                                                        Active Only
                                                    </button>
                                                    <button
                                                        onClick={() => { setFilterBy('in active'); setShowFilterDropdown(false); }}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                                                    >
                                                        Inactive Only
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                        onClick={() => setShowTaskSidebar(true)}
                                    >
                                        Task
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            File Name
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            Assign Project
                                        </th>
                                        <th className="px-6 py-3 text-left w-36">
                                            Last Active
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            Level
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentEmployees.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmployees.has(employee.id)}
                                                    onChange={() => handleSelectEmployee(employee.id)}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg mr-3">
                                                        {employee.avatar}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{employee.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {employee.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(employee.role)}`}>
                                                    {employee.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="grid grid-cols-3 gap-2">
                                                    {employee.projects.map((project, index) => (
                                                        <span key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                                            {project}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {employee.lastActive}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(employee.level)}`}>
                                                    {employee.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <button className="p-1 text-blue-600 transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1 :text-green-600 transition-colors" onClick={() => handleEditClick(employee)}>
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-1 text-red-600 transition-colors" onClick={() => handleDeleteEmployee(employee.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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
            </CommonWrapper>

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

            {/* Task Sidebar */}
            {showTaskSidebar && <TaskDashboard />}
        </div>
    );
};

export default EmployeeList;





// import React, { useState } from 'react';
// import { Plus, List, X } from 'lucide-react';

// // Employee interface
// interface Employee {
//   id: string;
//   name: string;
//   email: string;
//   role: 'Manager' | 'Staff' | 'Viewer';
//   projects: string[];
//   lastActive: string;
//   level: 'Active' | 'In Active';
//   avatar: string; // URL
// }

// // Sample Employee data
// const employees: Employee[] = [
//   {
//     id: '1',
//     name: 'Dianne Russell',
//     email: 'tanya.hill@example.com',
//     role: 'Manager',
//     projects: ['Carlyle Hat', 'Carlyle Hat'],
//     lastActive: '4/4/18',
//     level: 'Active',
//     avatar: 'https://i.pravatar.cc/150?img=1'
//   },
//   {
//     id: '2',
//     name: 'Brooklyn Simmons',
//     email: 'curtis.weaver@example.com',
//     role: 'Staff',
//     projects: ['Carlyle Hat'],
//     lastActive: '12/4/17',
//     level: 'Active',
//     avatar: 'https://i.pravatar.cc/150?img=2'
//   },
// ];

// const TaskDashboard = () => {
//   const [selectedTask, setSelectedTask] = useState<any>(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [currentView, setCurrentView] = useState('tasks');
//   const [tasks, setTasks] = useState([
//     { id: 1, name: 'Mobilization at Site', project: 'Carlyle Hall', priority: 'High', progress: 75, status: 'In Progress', description: 'Coordinate and organize all resources at the site.' },
//     { id: 2, name: 'Surveying & Layout', project: 'Carlyle Hall', priority: 'High', progress: 60, status: 'In Progress', description: 'Conduct detailed site surveys and layout plans.' },
//   ]);

//   const [showAddTaskForm, setShowAddTaskForm] = useState(false);
//   const [newTask, setNewTask] = useState({
//     name: '',
//     project: '',
//     priority: 'Default',
//     progress: 0,
//     status: 'Not Started',
//     description: ''
//   });

//   const handleTaskClick = (task: any) => {
//     setSelectedTask(task);
//     setSidebarOpen(true);
//   };

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//     setSelectedTask(null);
//   };

//   const handleAddTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setNewTask(prev => ({ ...prev, [name]: value }));
//   };

//   const handleAddTaskSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const id = tasks.length + 1;
//     setTasks(prev => [...prev, { ...newTask, id }]);
//     setShowAddTaskForm(false);
//     setNewTask({ name: '', project: '', priority: 'Default', progress: 0, status: 'Not Started', description: '' });
//   };

//   const getPriorityColor = (priority: string) => {
//     switch (priority) {
//       case 'High': return 'text-red-500 bg-red-50 border-red-200';
//       case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//       case 'Low': return 'text-blue-500 bg-blue-50 border-blue-200';
//       default: return 'text-gray-500 bg-gray-50 border-gray-200';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 relative">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-900">Dianne Russell's Task</h1>
//           <div className="flex space-x-3">
//             <button 
//               className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               onClick={() => setShowAddTaskForm(true)}
//             >
//               <Plus className="w-4 h-4 mr-2" /> Add Task
//             </button>
//             <button 
//               className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               onClick={() => setCurrentView(currentView === 'tasks' ? 'employees' : 'tasks')}
//             >
//               <List className="w-4 h-4 mr-2" />
//               {currentView === 'tasks' ? 'Show Employees' : 'Show Tasks'}
//             </button>
//           </div>
//         </div>

//         {/* Tasks List */}
//         {currentView === 'tasks' && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                 <div className="px-6 py-4 border-b border-gray-200 grid grid-cols-4 gap-4 text-sm font-medium text-gray-500">
//                   <div>Task Name</div>
//                   <div>Project</div>
//                   <div>Priority</div>
//                   <div>Progress</div>
//                 </div>
//                 <div className="divide-y divide-gray-200">
//                   {tasks.map(task => (
//                     <div key={task.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleTaskClick(task)}>
//                       <div className="grid grid-cols-4 gap-4 items-center">
//                         <div className="text-gray-900 font-medium">{task.name}</div>
//                         <div className="text-gray-700">{task.project}</div>
//                         <div>
//                           <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(task.priority)}`}>
//                             {task.priority}
//                           </span>
//                         </div>
//                         <div className="flex items-center">
//                           <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
//                             <div className={`h-2 rounded-full bg-blue-500`} style={{ width: `${task.progress}%` }}></div>
//                           </div>
//                           <span className="text-sm text-gray-600 w-10">{task.progress}%</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Right Sidebar */}
//         {sidebarOpen && selectedTask && (
//           <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
//             <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//               <h2 className="text-xl font-semibold">{selectedTask.name}</h2>
//               <button onClick={closeSidebar}><X className="w-5 h-5" /></button>
//             </div>
//             <div className="flex-1 p-6 overflow-y-auto">
//               <p className="text-gray-700">{selectedTask.description}</p>
//             </div>
//           </div>
//         )}

//         {/* Add Task Modal */}
//         {showAddTaskForm && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
//             {/* Overlay */}
//             <div 
//               className="absolute inset-0 bg-black opacity-50"
//               onClick={() => setShowAddTaskForm(false)}
//             ></div>

//             {/* Modal Form */}
//             <form 
//               onSubmit={handleAddTaskSubmit} 
//               className="relative bg-white rounded-xl shadow-lg p-6 z-10 w-full max-w-md"
//             >
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Task</h2>

//               <div className="space-y-4">
//                 <input 
//                   type="text"
//                   name="name"
//                   placeholder="Task Name"
//                   value={newTask.name}
//                   onChange={handleAddTaskChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                   required
//                 />

//                 <input 
//                   type="text"
//                   name="project"
//                   placeholder="Project Name"
//                   value={newTask.project}
//                   onChange={handleAddTaskChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                   required
//                 />

//                 <div className="grid grid-cols-3 gap-2">
//                   {['High', 'Medium', 'Low'].map(level => (
//                     <label 
//                       key={level}
//                       className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
//                         newTask.priority === level ? 'border-blue-500' : 'border-gray-300'
//                       }`}
//                     >
//                       {level}
//                       <input 
//                         type="radio" 
//                         name="priority" 
//                         value={level} 
//                         checked={newTask.priority === level} 
//                         onChange={handleAddTaskChange} 
//                         className="hidden" 
//                       />
//                     </label>
//                   ))}
//                 </div>

//                 <textarea
//                   name="description"
//                   placeholder="Task Description"
//                   value={newTask.description}
//                   onChange={handleAddTaskChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                   rows={3}
//                 ></textarea>
//               </div>

//               <div className="flex justify-end mt-4 space-x-2">
//                 <button type="button" onClick={() => setShowAddTaskForm(false)} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Cancel</button>
//                 <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Create Task</button>
//               </div>
//             </form>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default TaskDashboard;
