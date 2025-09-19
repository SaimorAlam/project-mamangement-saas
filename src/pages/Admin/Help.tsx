// import React, { useState } from 'react';
// import { Search, Filter, Eye, Edit, ChevronDown } from 'lucide-react';

// interface SupportTicket {
//   id: string;
//   ticketId: string;
//   companyName: string;
//   companyLogo: string;
//   subject: string;
//   status: 'Opened' | 'Solved' | 'Unassigned' | 'In Progress';
//   lastUpdated: string;
//   priority: 'High' | 'Medium' | 'Normal' | 'Low';
//   assignedTo: string;
//   assigneeAvatar: string;
// }

// const supportTickets: SupportTicket[] = [
//   {
//     id: '1',
//     ticketId: 'CNH252024',
//     companyName: 'Acme',
//     companyLogo: '🅰️',
//     subject: 'CSV file upload failed',
//     status: 'Opened',
//     lastUpdated: '2 hours ago',
//     priority: 'High',
//     assignedTo: 'Kathryn Murphy',
//     assigneeAvatar: '👩🏽‍💼'
//   },
//   {
//     id: '2',
//     ticketId: 'CNH252024',
//     companyName: 'Global Tech',
//     companyLogo: '🌐',
//     subject: 'Chart render failed',
//     status: 'Opened',
//     lastUpdated: '4 hours ago',
//     priority: 'High',
//     assignedTo: 'Leslie Alexander',
//     assigneeAvatar: '👩🏻‍💼'
//   },
//   {
//     id: '3',
//     ticketId: 'CNH252024',
//     companyName: 'Tech Stark',
//     companyLogo: '⚡',
//     subject: "I don't know what happen...",
//     status: 'Unassigned',
//     lastUpdated: 'Yesterday',
//     priority: 'Medium',
//     assignedTo: 'Annette Black',
//     assigneeAvatar: '👩🏿‍💼'
//   },
//   {
//     id: '4',
//     ticketId: 'CNH252024',
//     companyName: 'Next Gen',
//     companyLogo: '🚀',
//     subject: 'Chart render failed',
//     status: 'In Progress',
//     lastUpdated: 'Jun 25, 10:20AM',
//     priority: 'Low',
//     assignedTo: 'Arlene McCoy',
//     assigneeAvatar: '👩🏾‍💼'
//   },
//   {
//     id: '5',
//     ticketId: 'CNH252024',
//     companyName: 'Softvence',
//     companyLogo: '💼',
//     subject: 'Chart render failed',
//     status: 'In Progress',
//     lastUpdated: 'Jun 25, 10:20AM',
//     priority: 'Normal',
//     assignedTo: 'Deblian Junior',
//     assigneeAvatar: '👨🏿‍💼'
//   },
//   {
//     id: '6',
//     ticketId: 'CNH252024',
//     companyName: 'Next Gen',
//     companyLogo: '🚀',
//     subject: 'Chart render failed',
//     status: 'Solved',
//     lastUpdated: 'Jun 25, 10:20AM',
//     priority: 'Low',
//     assignedTo: 'Arlene McCoy',
//     assigneeAvatar: '👩🏾‍💼'
//   },
//   {
//     id: '7',
//     ticketId: 'CNH252024',
//     companyName: 'Acme',
//     companyLogo: '🅰️',
//     subject: 'Chart render failed',
//     status: 'Solved',
//     lastUpdated: 'Jun 25, 10:20AM',
//     priority: 'Normal',
//     assignedTo: 'Kathryn Murphy',
//     assigneeAvatar: '👩🏽‍💼'
//   },
//   {
//     id: '8',
//     ticketId: 'CNH252024',
//     companyName: 'Global Tech',
//     companyLogo: '🌐',
//     subject: 'Chart render failed',
//     status: 'Solved',
//     lastUpdated: 'Jun 25, 10:20AM',
//     priority: 'Low',
//     assignedTo: 'Deblian Junior',
//     assigneeAvatar: '👨🏿‍💼'
//   },
//   {
//     id: '9',
//     ticketId: 'CNH252024',
//     companyName: 'Tech Stark',
//     companyLogo: '⚡',
//     subject: 'Chart render failed',
//     status: 'In Progress',
//     lastUpdated: 'Jun 25, 10:20AM',
//     priority: 'Normal',
//     assignedTo: 'Annette Black',
//     assigneeAvatar: '👩🏿‍💼'
//   },
//   {
//     id: '10',
//     ticketId: 'CNH252024',
//     companyName: 'Softvence',
//     companyLogo: '💼',
//     subject: 'Chart render failed',
//     status: 'Unassigned',
//     lastUpdated: 'Jun 25, 10:20AM',
//     priority: 'Low',
//     assignedTo: 'Leslie Alexander',
//     assigneeAvatar: '👩🏻‍💼'
//   },
//   {
//     id: '11',
//     ticketId: 'CNH252024',
//     companyName: 'Acme',
//     companyLogo: '🅰️',
//     subject: 'Chart render failed',
//     status: 'In Progress',
//     lastUpdated: 'Jun 25, 10:20AM',
//     priority: 'Normal',
//     assignedTo: 'Unassigned',
//     assigneeAvatar: ''
//   }
// ];

// const SupportTickets: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterBy, setFilterBy] = useState<string>('Filter By');
//   const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
//   const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
//   const [selectAll, setSelectAll] = useState<boolean>(false);
//   const [currentPage, setCurrentPage] = useState<number>(1);

//   const itemsPerPage = 11;
//   const totalItems = 500;

//   const getStatusColor = (status: string): string => {
//     switch (status) {
//       case 'Opened':
//         return 'bg-red-50 text-red-700 border-red-200';
//       case 'Solved':
//         return 'bg-green-50 text-green-700 border-green-200';
//       case 'Unassigned':
//         return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//       case 'In Progress':
//         return 'bg-blue-50 text-blue-700 border-blue-200';
//       default:
//         return 'bg-gray-50 text-gray-700 border-gray-200';
//     }
//   };

//   const getPriorityColor = (priority: string): string => {
//   switch (priority) {
//     case 'High':
//       return 'text-red-600 border-red-400';
//     case 'Medium':
//       return 'text-yellow-600 border-yellow-400';
//     case 'Normal':
//       return 'text-gray-600 border-gray-400';
//     case 'Low':
//       return 'text-blue-600 border-blue-400';
//     default:
//       return 'text-gray-600 border-gray-300';
//   }
// };


//   const handleSelectAll = () => {
//     if (selectAll) {
//       setSelectedTickets(new Set());
//       setSelectAll(false);
//     } else {
//       setSelectedTickets(new Set(supportTickets.map(ticket => ticket.id)));
//       setSelectAll(true);
//     }
//   };

//   const handleSelectTicket = (ticketId: string) => {
//     const newSelected = new Set(selectedTickets);
//     if (newSelected.has(ticketId)) {
//       newSelected.delete(ticketId);
//     } else {
//       newSelected.add(ticketId);
//     }
//     setSelectedTickets(newSelected);
//     setSelectAll(newSelected.size === supportTickets.length);
//   };

//   return (

//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-lg border border-gray-200">
//           {/* Header */}
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <h1 className="text-xl font-semibold text-gray-900">Support Tickets</h1>

//               <div className="flex items-center space-x-3">
//                 {/* Search */}
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                   <input
//                     type="text"
//                     placeholder="Search user..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-9 pr-4 py-2 w-48 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>

//                 {/* Filter */}
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowFilterDropdown(!showFilterDropdown)}
//                     className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                   >
//                     <Filter className="w-4 h-4 text-gray-400" />
//                     <span className="text-gray-700">{filterBy}</span>
//                     <ChevronDown className="w-4 h-4 text-gray-400" />
//                   </button>

//                   {showFilterDropdown && (
//                     <div className="absolute right-0 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
//                       <div className="py-1">
//                         <button
//                           onClick={() => {
//                             setFilterBy('Filter By');
//                             setShowFilterDropdown(false);
//                           }}
//                           className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                         >
//                           All Tickets
//                         </button>
//                         <button
//                           onClick={() => {
//                             setFilterBy('Opened');
//                             setShowFilterDropdown(false);
//                           }}
//                           className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                         >
//                           Opened
//                         </button>
//                         <button
//                           onClick={() => {
//                             setFilterBy('In Progress');
//                             setShowFilterDropdown(false);
//                           }}
//                           className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                         >
//                           In Progress
//                         </button>
//                         <button
//                           onClick={() => {
//                             setFilterBy('Solved');
//                             setShowFilterDropdown(false);
//                           }}
//                           className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                         >
//                           Solved
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left">
//                     <input
//                       type="checkbox"
//                       checked={selectAll}
//                       onChange={handleSelectAll}
//                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
//                     />
//                   </th>
//                   <th className="px-6 py-3 text-left text-[16px] font-medium text-black">
//                     Ticket ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-[16px] font-medium text-black">
//                     Company Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-[16px] font-medium text-black">
//                     Subject
//                   </th>
//                   <th className="px-6 py-3 text-left text-[16px] font-medium text-black">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-[16px] font-medium text-black">
//                     Last Updated
//                   </th>
//                   <th className="px-6 py-3 text-left text-[16px] font-medium text-black">
//                     Priority
//                   </th>
//                   <th className="px-6 py-3 text-left text-[16px] font-medium text-black">
//                     Assigned To
//                   </th>
//                   <th className="px-6 py-3 text-left text-[16px] font-medium text-black">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {supportTickets.map((ticket) => (
//                   <tr key={ticket.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedTickets.has(ticket.id)}
//                         onChange={() => handleSelectTicket(ticket.id)}
//                         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {ticket.ticketId}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm mr-3">
//                           {ticket.companyLogo}
//                         </div>
//                         <span className="text-sm font-medium text-gray-900">{ticket.companyName}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
//                       {ticket.subject}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 rounded-[45px] text-xs font-medium border ${getStatusColor(ticket.status)}`}>
//                         {ticket.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {ticket.lastUpdated}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}
//                       >
//                         {ticket.priority}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {ticket.assignedTo === 'Unassigned' ? (
//                         <span className="text-sm text-gray-500">Unassigned</span>
//                       ) : (
//                         <div className="flex items-center">
//                           <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs mr-2">
//                             {ticket.assigneeAvatar}
//                           </div>
//                           <span className="text-sm text-gray-900">{ticket.assignedTo}</span>
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <button className="p-1 text-blue-600 hover:text-blue-800">
//                           <Eye className="w-4 h-4" />
//                         </button>
//                         <button className="p-1 text-green-600 hover:text-green-800">
//                           <Edit className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="px-6 py-4 border-t border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-gray-700">
//                 Showing 1 to 11 of 500 client
//               </div>
//               <div className="flex items-center space-x-1">
//                 <button
//                   onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Prev
//                 </button>

//                 <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
//                   1
//                 </button>
//                 <button className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
//                   2
//                 </button>
//                 <button className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
//                   3
//                 </button>
//                 <span className="px-3 py-1 text-sm text-gray-500">...</span>
//                 <button className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
//                   30
//                 </button>

//                 <button
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                   className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// };

// export default SupportTickets;

import React, { useState } from 'react';
import { Search, Filter, ChevronDown, UserPlus } from 'lucide-react';

interface SupportTicket {
  id: string;
  ticketId: string;
  companyName: string;
  companyLogo: string;
  subject: string;
  status: 'Opened' | 'Solved' | 'Unassigned' | 'In Progress';
  lastUpdated: string;
  priority: 'High' | 'Medium' | 'Normal' | 'Low';
  assignedTo: string;
  assigneeAvatar: string;
}

// Sample assigned staff
const staffMembers = [
  { name: 'Kathryn Murphy', avatar: '👩🏽‍💼' },
  { name: 'Leslie Alexander', avatar: '👩🏻‍💼' },
  { name: 'Annette Black', avatar: '👩🏿‍💼' },
  { name: 'Arlene McCoy', avatar: '👩🏾‍💼' },
  { name: 'Deblian Junior', avatar: '👨🏿‍💼' },
];

// Sample tickets
const supportTickets: SupportTicket[] = [
  {
    id: '1',
    ticketId: 'CNH252024',
    companyName: 'Acme',
    companyLogo: '🅰️',
    subject: 'CSV file upload failed',
    status: 'Opened',
    lastUpdated: '2 hours ago',
    priority: 'High',
    assignedTo: staffMembers[0].name,
    assigneeAvatar: staffMembers[0].avatar,
  },
  {
    id: '2',
    ticketId: 'CNH252025',
    companyName: 'Global Tech',
    companyLogo: '🌐',
    subject: 'Chart render failed',
    status: 'Opened',
    lastUpdated: '4 hours ago',
    priority: 'High',
    assignedTo: staffMembers[1].name,
    assigneeAvatar: staffMembers[1].avatar,
  },
  {
    id: '3',
    ticketId: 'CNH252026',
    companyName: 'Tech Stark',
    companyLogo: '⚡',
    subject: "I don't know what happen...",
    status: 'Unassigned',
    lastUpdated: 'Yesterday',
    priority: 'Medium',
    assignedTo: 'Unassigned',
    assigneeAvatar: '',
  },
  {
    id: '4',
    ticketId: 'CNH252027',
    companyName: 'Next Gen',
    companyLogo: '🚀',
    subject: 'Chart render failed',
    status: 'In Progress',
    lastUpdated: 'Jun 25, 10:20AM',
    priority: 'Low',
    assignedTo: staffMembers[3].name,
    assigneeAvatar: staffMembers[3].avatar,
  },
  {
    id: '5',
    ticketId: 'CNH252028',
    companyName: 'Softvence',
    companyLogo: '💼',
    subject: 'Chart render failed',
    status: 'In Progress',
    lastUpdated: 'Jun 25, 10:20AM',
    priority: 'Normal',
    assignedTo: staffMembers[4].name,
    assigneeAvatar: staffMembers[4].avatar,
  },
];

const SupportTickets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('Filter By');
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5;
  const totalItems = supportTickets.length;

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Opened':
        return 'bg-red-100 text-red-700';
      case 'Solved':
        return 'bg-green-100 text-green-700';
      case 'Unassigned':
        return 'bg-yellow-100 text-yellow-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'High':
        return 'text-red-600 border-red-400 border';
      case 'Medium':
        return 'text-yellow-600 border-yellow-400 border';
      case 'Normal':
        return 'text-gray-600 border-gray-400 border';
      case 'Low':
        return 'text-blue-600 border-blue-400 border';
      default:
        return 'text-gray-600 border-gray-300 border';
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTickets(new Set());
      setSelectAll(false);
    } else {
      setSelectedTickets(new Set(supportTickets.map(ticket => ticket.id)));
      setSelectAll(true);
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    const newSelected = new Set(selectedTickets);
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId);
    } else {
      newSelected.add(ticketId);
    }
    setSelectedTickets(newSelected);
    setSelectAll(newSelected.size === supportTickets.length);
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Support Tickets</h1>

          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-48 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{filterBy}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {showFilterDropdown && (
                <div className="absolute right-0 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="py-1">
                    {['All Tickets', 'Opened', 'In Progress', 'Solved'].map(item => (
                      <button
                        key={item}
                        onClick={() => {
                          setFilterBy(item);
                          setShowFilterDropdown(false);
                        }}
                        className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Staff</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {supportTickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTickets.has(ticket.id)}
                      onChange={() => handleSelectTicket(ticket.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.ticketId}</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm mr-3">
                        {ticket.companyLogo}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{ticket.companyName}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{ticket.subject}</td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.lastUpdated}</td>

                  {/* Priority */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>

                  {/* Assigned Staff */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.assignedTo === 'Unassigned' ? (
                      <button className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50 flex items-center space-x-3">
                        <UserPlus className="w-4 h-4" />
                        <span className='text-black'>Assign</span>
                      </button>
                    ) : (
                      <button className="px-2 py-1 text-sm  flex items-center space-x-1">
                        <>
                          <span className="text-xs">{ticket.assigneeAvatar}</span>
                          <span>{ticket.assignedTo}</span>
                        </>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">Showing 1 to {itemsPerPage} of {totalItems} tickets</div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >Prev</button>

            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">3</button>
            <span className="px-3 py-1 text-sm text-gray-500">...</span>
            <button className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50">5</button>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
            >Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
