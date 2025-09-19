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
import React, { useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, UserPlus, X } from "lucide-react";

type StatusType = "Opened" | "Solved" | "Unassigned" | "In Progress";
type PriorityType = "High" | "Medium" | "Normal" | "Low";

interface SupportTicket {
  id: string;
  ticketId: string;
  companyName: string;
  companyLogo: string;
  subject: string;
  status: StatusType;
  created: string;
  lastUpdated: string;
  priority: PriorityType;
  assignedTo: string;
  assigneeAvatar?: string;
}

interface StaffMember {
  id: string;
  name: string;
  role?: string;
  avatar: string;
  status: "Available" | "Busy";
  activeTickets?: number;
  tags?: string[];
}

const sampleStaff: StaffMember[] = [
  { id: "s1", name: "Kathryn Murphy", avatar: "👩🏽‍💼", status: "Available", role: "Support Specialist", activeTickets: 4, tags: ["Exports", "Auth"] },
  { id: "s2", name: "Leslie Alexander", avatar: "👩🏻‍💼", status: "Available", role: "Technical Support", activeTickets: 2, tags: ["Charts", "Dashboard"] },
  { id: "s3", name: "Annette Black", avatar: "👩🏿‍💼", status: "Busy", role: "Support Engineer", activeTickets: 6, tags: ["Performance"] },
  { id: "s4", name: "Arlene McCoy", avatar: "👩🏾‍💼", status: "Available", role: "Support Engineer", activeTickets: 1, tags: ["API"] },
  { id: "s5", name: "Deblian Junior", avatar: "👨🏿‍💼", status: "Busy", role: "Support", activeTickets: 5, tags: ["Backend"] },
  { id: "s6", name: "Alex Chen", avatar: "👨🏻‍💼", status: "Available", role: "Senior Support", activeTickets: 3, tags: ["Auth", "Performance"] },
];

const initialTickets: SupportTicket[] = [
  { id: "1", ticketId: "T1#252024", companyName: "Acme", companyLogo: "🅰️", subject: "Login authentication failing for some users", status: "Opened", created: "2 hours ago", lastUpdated: "2 hours ago", priority: "High", assignedTo: "Kathryn Murphy", assigneeAvatar: "👩🏽‍💼" },
  { id: "2", ticketId: "T2#252025", companyName: "Global Tech", companyLogo: "🌐", subject: "Dashboard loading performance degraded", status: "Opened", created: "4 hours ago", lastUpdated: "4 hours ago", priority: "High", assignedTo: "Leslie Alexander", assigneeAvatar: "👩🏻‍💼" },
  { id: "3", ticketId: "T3#252026", companyName: "Tech Stark", companyLogo: "⚡", subject: "Export functionality not working", status: "Unassigned", created: "Yesterday", lastUpdated: "Yesterday", priority: "Medium", assignedTo: "Unassigned" },
  { id: "4", ticketId: "T4#252027", companyName: "Next Gen", companyLogo: "🚀", subject: "Email notifications not being sent", status: "In Progress", created: "Jun 25, 10:20AM", lastUpdated: "Jun 25, 10:20AM", priority: "Low", assignedTo: "Arlene McCoy", assigneeAvatar: "👩🏾‍💼" },
  { id: "5", ticketId: "T5#252028", companyName: "Softvence", companyLogo: "💼", subject: "Chart render failed on Safari", status: "In Progress", created: "Jun 25, 10:20AM", lastUpdated: "Jun 25, 10:20AM", priority: "Normal", assignedTo: "Deblian Junior", assigneeAvatar: "👨🏿‍💼" },
  { id: "6", ticketId: "T6#252029", companyName: "Innova", companyLogo: "💡", subject: "API rate limiting too aggressive", status: "Solved", created: "Jun 24, 09:10AM", lastUpdated: "Jun 25, 10:20AM", priority: "Low", assignedTo: "Kathryn Murphy", assigneeAvatar: "👩🏽‍💼" },
  { id: "7", ticketId: "T7#252030", companyName: "Acme", companyLogo: "🅰️", subject: "CSV upload parsing error", status: "Solved", created: "Jun 23, 02:20PM", lastUpdated: "Jun 24, 11:00AM", priority: "Normal", assignedTo: "Unassigned" },
  { id: "8", ticketId: "T8#252031", companyName: "Global Tech", companyLogo: "🌐", subject: "Chart render failed (edge-case)", status: "In Progress", created: "Jun 25, 11:00AM", lastUpdated: "Jun 25, 11:15AM", priority: "Low", assignedTo: "Leslie Alexander", assigneeAvatar: "👩🏻‍💼" },
  { id: "9", ticketId: "T9#252032", companyName: "Tech Stark", companyLogo: "⚡", subject: "Unexpected 500 on report export", status: "Opened", created: "Today", lastUpdated: "1 hour ago", priority: "High", assignedTo: "Unassigned" },
  { id: "10", ticketId: "T10#252033", companyName: "Softvence", companyLogo: "💼", subject: "Chart colors not matching theme", status: "Unassigned", created: "Yesterday", lastUpdated: "Yesterday", priority: "Low", assignedTo: "Unassigned" },
  { id: "11", ticketId: "T11#252034", companyName: "Next Gen", companyLogo: "🚀", subject: "Slow API under load", status: "In Progress", created: "Jun 20, 09:00AM", lastUpdated: "Jun 25, 09:00AM", priority: "Medium", assignedTo: "Alex Chen", assigneeAvatar: "👨🏻‍💼" },
  { id: "12", ticketId: "T12#252035", companyName: "Acme", companyLogo: "🅰️", subject: "UI: overflow on small screens", status: "Solved", created: "Jun 22, 04:00PM", lastUpdated: "Jun 23, 08:00AM", priority: "Normal", assignedTo: "Kathryn Murphy", assigneeAvatar: "👩🏽‍💼" },
];

const SupportTickets: React.FC = () => {
  // Data / UI state
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [priorityFilter, setPriorityFilter] = useState<string>("All Priority");
  const [staffFilter, setStaffFilter] = useState<string>("All Staff");

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);

  const [selectedTickets, setSelectedTickets] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Assignment modal states
  const [showTeamWorkloadModal, setShowTeamWorkloadModal] = useState(false);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Helpers: badge class names
  const getPriorityClasses = (p: PriorityType) => {
    switch (p) {
      case "High":
        return "text-red-700 bg-red-50 ring-1 ring-red-200";
      case "Medium":
        return "text-yellow-700 bg-yellow-50 ring-1 ring-yellow-200";
      case "Low":
        return "text-green-700 bg-green-50 ring-1 ring-green-200";
      default:
        return "text-gray-700 bg-gray-50 ring-1 ring-gray-200";
    }
  };

  const getStatusClasses = (s: StatusType) => {
    switch (s) {
      case "Opened":
        return "text-red-700 bg-red-50 ring-1 ring-red-200";
      case "Unassigned":
        return "text-yellow-700 bg-yellow-50 ring-1 ring-yellow-200";
      case "Solved":
        return "text-green-700 bg-green-50 ring-1 ring-green-200";
      case "In Progress":
        return "text-blue-700 bg-blue-50 ring-1 ring-blue-200";
      default:
        return "text-gray-700 bg-gray-50 ring-1 ring-gray-200";
    }
  };

  // Filtering (memoized)
  const filteredTickets = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return tickets.filter((t) => {
      const matchesSearch =
        !q ||
        t.ticketId.toLowerCase().includes(q) ||
        t.companyName.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All Status" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "All Priority" || t.priority === priorityFilter;
      const matchesStaff = staffFilter === "All Staff" || t.assignedTo === staffFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesStaff;
    });
  }, [tickets, searchTerm, statusFilter, priorityFilter, staffFilter]);

  const totalItems = filteredTickets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage]);

  // update selectAll when page rows or selectedTickets change
  useEffect(() => {
    const allVisibleSelected =
      paginatedTickets.length > 0 && paginatedTickets.every((t) => selectedTickets.has(t.id));
    setSelectAll(allVisibleSelected);
  }, [paginatedTickets, selectedTickets]);

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter, staffFilter]);

  // Selection handlers (works on visible rows)
  const handleSelectAllVisible = () => {
    if (selectAll) {
      // uncheck all visible
      const next = new Set(selectedTickets);
      paginatedTickets.forEach((t) => next.delete(t.id));
      setSelectedTickets(next);
      setSelectAll(false);
    } else {
      // add visible
      const next = new Set(selectedTickets);
      paginatedTickets.forEach((t) => next.add(t.id));
      setSelectedTickets(next);
      setSelectAll(true);
    }
  };

  const handleToggleTicket = (id: string) => {
    const next = new Set(selectedTickets);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedTickets(next);
  };

  // Start assignment: open team modal with currently selected tickets (if none, user can still pick)
  const handleOpenTeamModal = () => {
    setShowTeamWorkloadModal(true);
  };

  // clicking per-row assign button: select that row and open team modal
  const handleRowAssignClick = (ticketId: string) => {
    setSelectedTickets(new Set([ticketId]));
    setShowTeamWorkloadModal(true);
  };

  const handleAssignNow = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowAssignmentForm(true);
    setShowTeamWorkloadModal(false);
  };

  const handleConfirmAssignment = (priority?: PriorityType) => {
    if (!selectedStaff) return;
    if (selectedTickets.size === 0) return;

    const updated = tickets.map((t) => {
      if (selectedTickets.has(t.id)) {
        return {
          ...t,
          assignedTo: selectedStaff.name,
          assigneeAvatar: selectedStaff.avatar,
          status: "In Progress" as StatusType,
          lastUpdated: "Just now",
          // optionally update priority if the user selected one in form (not implemented)
        };
      }
      return t;
    });
    setTickets(updated);
    setSelectedTickets(new Set());
    setSelectedStaff(null);
    setShowAssignmentForm(false);
  };

  // UI helpers for page numbering (show small range)
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }, [totalPages]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Support Tickets</h1>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ticket ID, client or keywords..."
                className="pl-9 pr-3 py-2 w-72 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStatusDropdown((s) => !s);
                  setShowPriorityDropdown(false);
                  setShowStaffDropdown(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded bg-white text-sm"
              >
                <span className="text-gray-700">{statusFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showStatusDropdown && (
                <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded shadow">
                  <div className="py-1">
                    {["All Status", "Opened", "In Progress", "Solved", "Unassigned"].map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setStatusFilter(s);
                          setShowStatusDropdown(false);
                        }}
                        className="block text-left w-full px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPriorityDropdown((s) => !s);
                  setShowStatusDropdown(false);
                  setShowStaffDropdown(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded bg-white text-sm"
              >
                <span className="text-gray-700">{priorityFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showPriorityDropdown && (
                <div className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded shadow">
                  <div className="py-1">
                    {["All Priority", "High", "Medium", "Normal", "Low"].map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setPriorityFilter(p);
                          setShowPriorityDropdown(false);
                        }}
                        className="block text-left w-full px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Staff */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStaffDropdown((s) => !s);
                  setShowStatusDropdown(false);
                  setShowPriorityDropdown(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded bg-white text-sm"
              >
                <span className="text-gray-700">{staffFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {showStaffDropdown && (
                <div className="absolute right-0 z-10 mt-2 w-56 bg-white border border-gray-200 rounded shadow">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setStaffFilter("All Staff");
                        setShowStaffDropdown(false);
                      }}
                      className="block text-left w-full px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      All Staff
                    </button>
                    {sampleStaff.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setStaffFilter(s.name);
                          setShowStaffDropdown(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        <span className="text-sm">{s.avatar}</span>
                        <span>{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleOpenTeamModal}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Staff List
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAllVisible}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Summary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Staff</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTickets.has(ticket.id)}
                        onChange={() => handleToggleTicket(ticket.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{ticket.ticketId}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm mr-3">
                          {ticket.companyLogo}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{ticket.companyName}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xl truncate">{ticket.subject}</td>

                    {/* Priority badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPriorityClasses(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.created}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.lastUpdated}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.assignedTo === "Unassigned" ? (
                        <button
                          onClick={() => handleRowAssignClick(ticket.id)}
                          className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded flex items-center gap-2 hover:bg-gray-50"
                        >
                          <UserPlus className="w-4 h-4" />
                          Assign
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{ticket.assigneeAvatar}</span>
                          <span className="text-sm text-gray-900">{ticket.assignedTo}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

                {paginatedTickets.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-6 text-center text-sm text-gray-500">
                      No tickets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + (paginatedTickets.length ? 1 : 0)} to{" "}
              {(currentPage - 1) * itemsPerPage + paginatedTickets.length} of {totalItems} tickets
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              {pageNumbers.map((n) => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`px-3 py-1 text-sm rounded ${n === currentPage ? "bg-blue-600 text-white" : "border"}`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Workload Modal - Updated Design */}
      {showTeamWorkloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-96 max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Team Workload</h3>
              <button onClick={() => setShowTeamWorkloadModal(false)} className="text-gray-500 hover:text-red-600">
                <X />
              </button>
            </div>

            <div className="px-6 py-4 bg-gray-50">
              <div className="flex justify-between">
                <div>
                  <div className="text-sm text-gray-600">Person Available</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {sampleStaff.filter(s => s.status === "Available").length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Active Tickets</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {sampleStaff.reduce((total, staff) => total + (staff.activeTickets || 0), 0)}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Show available employee only</span>
              </label>
            </div>

            <div className="px-6 pb-6 space-y-4">
              {sampleStaff
                .filter((s) => !showAvailableOnly || s.status === "Available")
                .map((s) => (
                  <div key={s.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                          {s.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{s.name}</div>
                          <div className="text-xs text-gray-500">{s.role}</div>
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 text-xs rounded-full ${s.status === "Available" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {s.status}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                        <span className="w-4 h-4">🎯</span>
                        <span>{s.activeTickets} active ticket(s)</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {s.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex items-center gap-1 px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                        <span className="w-3 h-3">👤</span>
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => handleAssignNow(s)}
                        disabled={s.status !== "Available"}
                        className={`px-3 py-1 text-xs rounded ${s.status === "Available" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
                      >
                        Assign Now
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Assignment Form Modal */}
      {showAssignmentForm && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Assign Ticket(s) to {selectedStaff.name}</h3>
              <button onClick={() => setShowAssignmentForm(false)} className="text-gray-500 hover:text-red-600">
                <X />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="mb-4 bg-blue-50 p-4 rounded">
                <div className="text-sm text-blue-800">Assignment</div>
                <div className="text-sm text-blue-700">
                  You are assigning {selectedTickets.size} ticket(s) to {selectedStaff.name}. This will set them to "In Progress".
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Selected Tickets</div>
                <div className="border rounded p-3 space-y-2">
                  {Array.from(selectedTickets).map((id) => {
                    const t = tickets.find((x) => x.id === id);
                    if (!t) return null;
                    return (
                      <div key={t.id} className="flex items-center justify-between text-sm">
                        <div>
                          <div className="font-medium">{t.ticketId}</div>
                          <div className="text-xs text-gray-600">{t.subject}</div>
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(t.status)}`}>{t.status}</span>
                        </div>
                      </div>
                    );
                  })}
                  {selectedTickets.size === 0 && <div className="text-sm text-gray-500">No tickets selected.</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Staff Member</label>
                  <div className="flex items-center gap-3 p-3 border rounded">
                    <div className="text-2xl">{selectedStaff.avatar}</div>
                    <div>
                      <div className="font-medium">{selectedStaff.name}</div>
                      <div className="text-xs text-gray-500">{selectedStaff.role}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Priority (optional)</label>
                  <select className="w-full p-3 border rounded text-sm" defaultValue="">
                    <option value="">Keep existing</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-1">Notes (optional)</label>
                <textarea className="w-full p-3 border rounded text-sm" rows={3} placeholder="Add assignment notes..."></textarea>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setShowAssignmentForm(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button
                onClick={() => handleConfirmAssignment()}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;