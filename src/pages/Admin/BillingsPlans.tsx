// import React, { useState, useMemo } from 'react';
// import { Search, Eye, Edit2, ChevronDown, X } from 'lucide-react';

// interface ClientBilling {
//     id: string;
//     clientId: string;
//     companyName: string;
//     companyLogo: string;
//     subscriptionPlan: string;
//     planType: 'Business' | 'Enterprise' | 'Professional' | 'Starter';
//     billingCycle: string;
//     renewsDate: string;
//     status: 'Active' | 'Suspended' | 'Trial' | 'Expired' | 'Pending';
//     paymentMethod?: string;
// }


// const initialClientBillings: ClientBilling[] = [
//     {
//         id: '1',
//         clientId: 'CLI001',
//         companyName: 'Acme Corporation',
//         companyLogo: '🅰️',
//         subscriptionPlan: 'Business Plus',
//         planType: 'Business',
//         billingCycle: 'Annually',
//         renewsDate: '25-Jun-2025',
//         status: 'Active',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '2',
//         clientId: 'CLI002',
//         companyName: 'Global Tech Solutions',
//         companyLogo: '🌐',
//         subscriptionPlan: 'Enterprise Elite',
//         planType: 'Enterprise',
//         billingCycle: 'Biennially',
//         renewsDate: '15-Aug-2026',
//         status: 'Suspended',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '3',
//         clientId: 'CLI003',
//         companyName: 'Tech Stark Industries',
//         companyLogo: '⚡',
//         subscriptionPlan: 'Professional Suite',
//         planType: 'Professional',
//         billingCycle: 'Monthly',
//         renewsDate: '05-Jul-2025',
//         status: 'Trial',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '4',
//         clientId: 'CLI004',
//         companyName: 'Next Gen Innovations',
//         companyLogo: '🚀',
//         subscriptionPlan: 'Business Standard',
//         planType: 'Business',
//         billingCycle: 'Quarterly',
//         renewsDate: '30-Sep-2025',
//         status: 'Expired',
//         paymentMethod: 'PayPal'
//     },
//     {
//         id: '5',
//         clientId: 'CLI005',
//         companyName: 'Softvence Ltd',
//         companyLogo: '💼',
//         subscriptionPlan: 'Starter Pack',
//         planType: 'Starter',
//         billingCycle: 'Monthly',
//         renewsDate: '12-Jul-2025',
//         status: 'Active',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '6',
//         clientId: 'CLI006',
//         companyName: 'Data Dynamics',
//         companyLogo: '📊',
//         subscriptionPlan: 'Enterprise Basic',
//         planType: 'Enterprise',
//         billingCycle: 'Annually',
//         renewsDate: '01-Jan-2026',
//         status: 'Active',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '7',
//         clientId: 'CLI007',
//         companyName: 'CloudScape Technologies',
//         companyLogo: '☁️',
//         subscriptionPlan: 'Professional Plus',
//         planType: 'Professional',
//         billingCycle: 'Semi-Annually',
//         renewsDate: '20-Nov-2025',
//         status: 'Active',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '8',
//         clientId: 'CLI008',
//         companyName: 'WebWorks Studio',
//         companyLogo: '💻',
//         subscriptionPlan: 'Starter',
//         planType: 'Starter',
//         billingCycle: 'Monthly',
//         renewsDate: '03-Jul-2025',
//         status: 'Trial',
//         paymentMethod: 'None'
//     },
//     {
//         id: '9',
//         clientId: 'CLI009',
//         companyName: 'InnoTech Systems',
//         companyLogo: '🔬',
//         subscriptionPlan: 'Business Pro',
//         planType: 'Business',
//         billingCycle: 'Annually',
//         renewsDate: '14-Oct-2025',
//         status: 'Suspended',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '10',
//         clientId: 'CLI010',
//         companyName: 'SecureNet Solutions',
//         companyLogo: '🔒',
//         subscriptionPlan: 'Enterprise Security',
//         planType: 'Enterprise',
//         billingCycle: 'Biennially',
//         renewsDate: '22-Dec-2026',
//         status: 'Active',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '11',
//         clientId: 'CLI011',
//         companyName: 'AppCraft Studios',
//         companyLogo: '📱',
//         subscriptionPlan: 'Professional Mobile',
//         planType: 'Professional',
//         billingCycle: 'Quarterly',
//         renewsDate: '08-Aug-2025',
//         status: 'Active',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '12',
//         clientId: 'CLI012',
//         companyName: 'DataMinds Analytics',
//         companyLogo: '📈',
//         subscriptionPlan: 'Business Intelligence',
//         planType: 'Business',
//         billingCycle: 'Annually',
//         renewsDate: '19-Sep-2025',
//         status: 'Active',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '13',
//         clientId: 'CLI013',
//         companyName: 'NetVantage Communications',
//         companyLogo: '📡',
//         subscriptionPlan: 'Starter',
//         planType: 'Starter',
//         billingCycle: 'Monthly',
//         renewsDate: '28-Jun-2025',
//         status: 'Expired',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '14',
//         clientId: 'CLI014',
//         companyName: 'FutureVision Tech',
//         companyLogo: '👁️',
//         subscriptionPlan: 'Enterprise Vision',
//         planType: 'Enterprise',
//         billingCycle: 'Biennially',
//         renewsDate: '05-May-2026',
//         status: 'Active',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '15',
//         clientId: 'CLI015',
//         companyName: 'CodeCraft Developers',
//         companyLogo: '⚒️',
//         subscriptionPlan: 'Professional Dev',
//         planType: 'Professional',
//         billingCycle: 'Monthly',
//         renewsDate: '15-Jul-2025',
//         status: 'Trial',
//         paymentMethod: 'None'
//     },
//     {
//         id: '16',
//         clientId: 'CLI016',
//         companyName: 'MarketGuru Solutions',
//         companyLogo: '📣',
//         subscriptionPlan: 'Business Marketing',
//         planType: 'Business',
//         billingCycle: 'Quarterly',
//         renewsDate: '10-Aug-2025',
//         status: 'Suspended',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '17',
//         clientId: 'CLI017',
//         companyName: 'ServiceSphere',
//         companyLogo: '🔄',
//         subscriptionPlan: 'Enterprise Support',
//         planType: 'Enterprise',
//         billingCycle: 'Annually',
//         renewsDate: '30-Nov-2025',
//         status: 'Active',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '18',
//         clientId: 'CLI018',
//         companyName: 'DesignHub Creatives',
//         companyLogo: '🎨',
//         subscriptionPlan: 'Professional Design',
//         planType: 'Professional',
//         billingCycle: 'Semi-Annually',
//         renewsDate: '22-Oct-2025',
//         status: 'Active',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '19',
//         clientId: 'CLI019',
//         companyName: 'LogiChain Solutions',
//         companyLogo: '📦',
//         subscriptionPlan: 'Business Logistics',
//         planType: 'Business',
//         billingCycle: 'Annually',
//         renewsDate: '07-Dec-2025',
//         status: 'Active',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '20',
//         clientId: 'CLI020',
//         companyName: 'HealthTech Innovations',
//         companyLogo: '🏥',
//         subscriptionPlan: 'Enterprise Health',
//         planType: 'Enterprise',
//         billingCycle: 'Biennially',
//         renewsDate: '18-Mar-2026',
//         status: 'Pending',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '21',
//         clientId: 'CLI021',
//         companyName: 'EduTech Learning',
//         companyLogo: '🎓',
//         subscriptionPlan: 'Professional Education',
//         planType: 'Professional',
//         billingCycle: 'Quarterly',
//         renewsDate: '25-Jul-2025',
//         status: 'Active',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '22',
//         clientId: 'CLI022',
//         companyName: 'FinTech Advisors',
//         companyLogo: '💰',
//         subscriptionPlan: 'Business Finance',
//         planType: 'Business',
//         billingCycle: 'Monthly',
//         renewsDate: '09-Aug-2025',
//         status: 'Suspended',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '23',
//         clientId: 'CLI023',
//         companyName: 'GreenTech Solutions',
//         companyLogo: '🌿',
//         subscriptionPlan: 'Enterprise Eco',
//         planType: 'Enterprise',
//         billingCycle: 'Annually',
//         renewsDate: '14-Feb-2026',
//         status: 'Active',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '24',
//         clientId: 'CLI024',
//         companyName: 'MediaMasters Studio',
//         companyLogo: '🎬',
//         subscriptionPlan: 'Professional Media',
//         planType: 'Professional',
//         billingCycle: 'Semi-Annually',
//         renewsDate: '03-Sep-2025',
//         status: 'Active',
//         paymentMethod: 'Credit Card'
//     },
//     {
//         id: '25',
//         clientId: 'CLI025',
//         companyName: 'RetailHub Solutions',
//         companyLogo: '🛒',
//         subscriptionPlan: 'Business Retail',
//         planType: 'Business',
//         billingCycle: 'Quarterly',
//         renewsDate: '28-Jul-2025',
//         status: 'Expired',
//         paymentMethod: 'PayPal'
//     },
//     {
//         id: '26',
//         clientId: 'CLI026',
//         companyName: 'TravelTech Adventures',
//         companyLogo: '✈️',
//         subscriptionPlan: 'Enterprise Travel',
//         planType: 'Enterprise',
//         billingCycle: 'Biennially',
//         renewsDate: '11-Nov-2026',
//         status: 'Active',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '27',
//         clientId: 'CLI027',
//         companyName: 'GameDev Studios',
//         companyLogo: '🎮',
//         subscriptionPlan: 'Professional Gaming',
//         planType: 'Professional',
//         billingCycle: 'Monthly',
//         renewsDate: '16-Jul-2025',
//         status: 'Trial',
//         paymentMethod: 'None'
//     },
//     {
//         id: '28',
//         clientId: 'CLI028',
//         companyName: 'LegalEase Solutions',
//         companyLogo: '⚖️',
//         subscriptionPlan: 'Business Legal',
//         planType: 'Business',
//         billingCycle: 'Annually',
//         renewsDate: '23-Oct-2025',
//         status: 'Active',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '29',
//         clientId: 'CLI029',
//         companyName: 'RealEstate Tech',
//         companyLogo: '🏠',
//         subscriptionPlan: 'Enterprise Property',
//         planType: 'Enterprise',
//         billingCycle: 'Biennially',
//         renewsDate: '30-Apr-2026',
//         status: 'Pending',
//         paymentMethod: 'Bank Transfer'
//     },
//     {
//         id: '30',
//         clientId: 'CLI030',
//         companyName: 'FoodTech Delights',
//         companyLogo: '🍕',
//         subscriptionPlan: 'Professional Food',
//         planType: 'Professional',
//         billingCycle: 'Quarterly',
//         renewsDate: '12-Aug-2025',
//         status: 'Active',
//         paymentMethod: 'Credit Card'
//     }
// ];
// const ClientBillings: React.FC = () => {
//     const [clientBillings, setClientBillings] = useState<ClientBilling[]>(initialClientBillings);

//     const [searchTerm, setSearchTerm] = useState<string>('');
//     const [planTypeFilter, setPlanTypeFilter] = useState<string>('Plan Type');
//     const [statusFilter, setStatusFilter] = useState<string>('Status');
//     const [showPlanDropdown, setShowPlanDropdown] = useState<boolean>(false);
//     const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
//     const [currentPage, setCurrentPage] = useState<number>(1);
//     const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
//     const [selectAll, setSelectAll] = useState<boolean>(false);
//     const [editingClient, setEditingClient] = useState<ClientBilling | null>(null);
//     const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

//     const itemsPerPage = 11;
//     const totalItems = 500;

//     // Filter clients based on search term and selected filters
//     const filteredClients = useMemo(() => {
//         return clientBillings.filter(client => {
//             const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                                  client.clientId.toLowerCase().includes(searchTerm.toLowerCase());
            
//             const matchesPlan = planTypeFilter === 'Plan Type' || client.planType === planTypeFilter;
            
//             const matchesStatus = statusFilter === 'Status' || client.status === statusFilter;
            
//             return matchesSearch && matchesPlan && matchesStatus;
//         });
//     }, [searchTerm, planTypeFilter, statusFilter]);

//     // Calculate pagination
//     const paginatedClients = useMemo(() => {
//         const startIndex = (currentPage - 1) * itemsPerPage;
//         return filteredClients.slice(startIndex, startIndex + itemsPerPage);
//     }, [currentPage, filteredClients]);

//     const getPlanBadgeColor = (planType: string): string => {
//         switch (planType) {
//             case 'Business':
//                 return 'bg-blue-50 text-blue-700 border-blue-200';
//             case 'Enterprise':
//                 return 'bg-purple-50 text-purple-700 border-purple-200';
//             case 'Professional':
//                 return 'bg-green-50 text-green-700 border-green-200';
//             case 'Starter':
//                 return 'bg-orange-50 text-orange-700 border-orange-200';
//             default:
//                 return 'bg-gray-50 text-gray-700 border-gray-200';
//         }
//     };

//     const getStatusBadgeColor = (status: string): string => {
//         switch (status) {
//             case 'Active':
//                 return 'bg-green-50 text-green-700 border-green-200';
//             case 'Suspended':
//                 return 'bg-red-50 text-red-700 border-red-200';
//             case 'Trial':
//                 return 'bg-yellow-50 text-yellow-700 border-yellow-200';
//             case 'Expired':
//                 return 'bg-gray-50 text-gray-700 border-gray-200';
//             default:
//                 return 'bg-gray-50 text-gray-700 border-gray-200';
//         }
//     };

//     const handleSelectAll = () => {
//         if (selectAll) {
//             setSelectedClients(new Set());
//             setSelectAll(false);
//         } else {
//             setSelectedClients(new Set(paginatedClients.map(client => client.id)));
//             setSelectAll(true);
//         }
//     };

//     const handleSelectClient = (clientId: string) => {
//         const newSelected = new Set(selectedClients);
//         if (newSelected.has(clientId)) {
//             newSelected.delete(clientId);
//         } else {
//             newSelected.add(clientId);
//         }
//         setSelectedClients(newSelected);
//         setSelectAll(newSelected.size === paginatedClients.length);
//     };

//     const handleEditClient = (client: ClientBilling) => {
//         setEditingClient(client);
//         setIsEditModalOpen(true);
//     };

//     const handleSaveEdit = () => {
//         if (editingClient) {
//             setClientBillings(prev =>
//                 prev.map(client =>
//                     client.id === editingClient.id
//                         ? { ...client, ...editingClient }
//                         : client
//                 )
//             );
//         }
//         setIsEditModalOpen(false);
//         setEditingClient(null);
//     };


//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         if (!editingClient) return;
        
//         const { name, value } = e.target;
//         setEditingClient({
//             ...editingClient,
//             [name]: value
//         });
//     };

//     const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

//     return (
//         <div className="min-h-screen bg-gray-50 p-6">
//             <div className="max-w-7xl mx-auto">
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                     {/* Header */}
//                     <div className="px-6 py-4 border-b border-gray-200">
//                         <div className="flex items-center justify-between">
//                             <h1 className="text-xl font-semibold text-gray-900">Client Billings</h1>
                            
//                             <div className="flex items-center space-x-3">
//                                 {/* Plan Type Filter */}
//                                 <div className="relative">
//                                     <button
//                                         onClick={() => {
//                                             setShowPlanDropdown(!showPlanDropdown);
//                                             setShowStatusDropdown(false);
//                                         }}
//                                         className="flex items-center justify-between w-32 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     >
//                                         <span className="text-gray-700">{planTypeFilter}</span>
//                                         <ChevronDown className="w-4 h-4 text-gray-400" />
//                                     </button>
                                    
//                                     {showPlanDropdown && (
//                                         <div className="absolute right-0 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
//                                             <div className="py-1">
//                                                 <button
//                                                     onClick={() => {
//                                                         setPlanTypeFilter('Plan Type');
//                                                         setShowPlanDropdown(false);
//                                                     }}
//                                                     className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     All Plans
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setPlanTypeFilter('Business');
//                                                         setShowPlanDropdown(false);
//                                                     }}
//                                                     className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     Business
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setPlanTypeFilter('Enterprise');
//                                                         setShowPlanDropdown(false);
//                                                     }}
//                                                     className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     Enterprise
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setPlanTypeFilter('Professional');
//                                                         setShowPlanDropdown(false);
//                                                     }}
//                                                     className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     Professional
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setPlanTypeFilter('Starter');
//                                                         setShowPlanDropdown(false);
//                                                     }}
//                                                     className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     Starter
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Status Filter */}
//                                 <div className="relative">
//                                     <button
//                                         onClick={() => {
//                                             setShowStatusDropdown(!showStatusDropdown);
//                                             setShowPlanDropdown(false);
//                                         }}
//                                         className="flex items-center justify-between w-24 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                     >
//                                         <span className="text-gray-700">{statusFilter}</span>
//                                         <ChevronDown className="w-4 h-4 text-gray-400" />
//                                     </button>
                                    
//                                     {showStatusDropdown && (
//                                         <div className="absolute right-0 z-10 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg">
//                                             <div className="py-1">
//                                                 <button
//                                                     onClick={() => {
//                                                         setStatusFilter('Status');
//                                                         setShowStatusDropdown(false);
//                                                     }}
//                                                     className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     All Status
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setStatusFilter('Active');
//                                                         setShowStatusDropdown(false);
//                                                     }}
//                                                     className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     Active
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setStatusFilter('Suspended');
//                                                         setShowStatusDropdown(false);
//                                                     }}
//                                                     className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     Suspended
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setStatusFilter('Trial');
//                                                         setShowStatusDropdown(false);
//                                                     }}
//                                                     className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     Trial
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         setStatusFilter('Expired');
//                                                         setShowStatusDropdown(false);
//                                                     }}
//                                                     className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
//                                                 >
//                                                     Expired
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Search */}
//                                 <div className="relative">
//                                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                                     <input
//                                         type="text"
//                                         placeholder="Search Company..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                         className="pl-9 pr-4 py-2 w-48 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                                     />
//                                     {searchTerm && (
//                                         <button
//                                             onClick={() => setSearchTerm('')}
//                                             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                                         >
//                                             <X className="w-4 h-4" />
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Table */}
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left">
//                                         <input
//                                             type="checkbox"
//                                             checked={selectAll}
//                                             onChange={handleSelectAll}
//                                             className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
//                                         />
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Client ID
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Company Name
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Subscription Plan
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Billing Cycle
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Renews Date
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Status
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Action
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {paginatedClients.length > 0 ? (
//                                     paginatedClients.map((client) => (
//                                         <tr key={client.id} className="hover:bg-gray-50">
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedClients.has(client.id)}
//                                                     onChange={() => handleSelectClient(client.id)}
//                                                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
//                                                 />
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                 {client.clientId}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center">
//                                                     <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm mr-3">
//                                                         {client.companyLogo}
//                                                     </div>
//                                                     <span className="text-sm font-medium text-gray-900">{client.companyName}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${getPlanBadgeColor(client.planType)}`}>
//                                                     {client.subscriptionPlan}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                 {client.billingCycle}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                                 {client.renewsDate}
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadgeColor(client.status)}`}>
//                                                     {client.status}
//                                                 </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <div className="flex items-center space-x-2">
//                                                     <button className="p-1 text-blue-600 hover:text-blue-800">
//                                                         <Eye className="w-4 h-4" />
//                                                     </button>
//                                                     <button 
//                                                         className="p-1 text-green-600 hover:text-green-800"
//                                                         onClick={() => handleEditClient(client)}
//                                                     >
//                                                         <Edit2 className="w-4 h-4" />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
//                                             No clients found matching your criteria
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Pagination */}
//                     <div className="px-6 py-4 border-t border-gray-200">
//                         <div className="flex items-center justify-between">
//                             <div className="text-sm text-gray-700">
//                                 Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} clients
//                             </div>
//                             <div className="flex items-center space-x-1">
//                                 <button
//                                     onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                                     disabled={currentPage === 1}
//                                     className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     Prev
//                                 </button>

//                                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                                     let pageNum;
//                                     if (totalPages <= 5) {
//                                         pageNum = i + 1;
//                                     } else if (currentPage <= 3) {
//                                         pageNum = i + 1;
//                                     } else if (currentPage >= totalPages - 2) {
//                                         pageNum = totalPages - 4 + i;
//                                     } else {
//                                         pageNum = currentPage - 2 + i;
//                                     }

//                                     return (
//                                         <button
//                                             key={pageNum}
//                                             onClick={() => setCurrentPage(pageNum)}
//                                             className={`px-3 py-1 text-sm border border-gray-300 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
//                                         >
//                                             {pageNum}
//                                         </button>
//                                     );
//                                 })}

//                                 {totalPages > 5 && currentPage < totalPages - 2 && (
//                                     <span className="px-3 py-1 text-sm text-gray-500">...</span>
//                                 )}

//                                 {totalPages > 5 && currentPage < totalPages - 2 && (
//                                     <button
//                                         onClick={() => setCurrentPage(totalPages)}
//                                         className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
//                                     >
//                                         {totalPages}
//                                     </button>
//                                 )}

//                                 <button
//                                     onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                                     disabled={currentPage === totalPages}
//                                     className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     Next
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Edit Modal */}
//             {isEditModalOpen && editingClient && (
//                 <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
//                         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
//                             <h3 className="text-lg font-semibold text-gray-900">Edit Client Billing</h3>
//                             <button
//                                 onClick={() => setIsEditModalOpen(false)}
//                                 className="text-gray-400 hover:text-gray-600"
//                             >
//                                 <X className="w-5 h-5" />
//                             </button>
//                         </div>
//                         <div className="px-6 py-4 space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
//                                 <input
//                                     type="text"
//                                     name="companyName"
//                                     value={editingClient.companyName}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
//                                 <select
//                                     name="planType"
//                                     value={editingClient.planType}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                 >
//                                     <option value="Business">Business</option>
//                                     <option value="Enterprise">Enterprise</option>
//                                     <option value="Professional">Professional</option>
//                                     <option value="Starter">Starter</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
//                                 <select
//                                     name="billingCycle"
//                                     value={editingClient.billingCycle}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                 >
//                                     <option value="Monthly">Monthly</option>
//                                     <option value="Annually">Annually</option>
//                                     <option value="Biennially">Biennially</option>
//                                     <option value="Custom">Custom</option>
//                                 </select>
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                                 <select
//                                     name="status"
//                                     value={editingClient.status}
//                                     onChange={handleInputChange}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
//                                 >
//                                     <option value="Active">Active</option>
//                                     <option value="Suspended">Suspended</option>
//                                     <option value="Trial">Trial</option>
//                                     <option value="Expired">Expired</option>
//                                 </select>
//                             </div>
//                         </div>
//                         <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
//                             <button
//                                 onClick={() => setIsEditModalOpen(false)}
//                                 className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={handleSaveEdit}
//                                 className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
//                             >
//                                 Save Changes
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ClientBillings;




import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, Edit2, ChevronDown, X } from 'lucide-react';
import { ClientBilling } from '@/components/admin/ClientBillings/types/clientBilling';
import { clientBillingService } from '@/components/admin/ClientBillings/services/clientBillingService'; 

const ClientBillings: React.FC = () => {
    const [clientBillings, setClientBillings] = useState<ClientBilling[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [planTypeFilter, setPlanTypeFilter] = useState<string>('Plan Type');
    const [statusFilter, setStatusFilter] = useState<string>('Status');
    const [showPlanDropdown, setShowPlanDropdown] = useState<boolean>(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [editingClient, setEditingClient] = useState<ClientBilling | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const itemsPerPage = 11;

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await clientBillingService.getClientBillings();
                setClientBillings(data);
            } catch (error) {
                console.error('Error loading client billings:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Filter clients based on search term and selected filters
    const filteredClients = useMemo(() => {
        return clientBillings.filter(client => {
            const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 client.clientId.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesPlan = planTypeFilter === 'Plan Type' || client.planType === planTypeFilter;
            
            const matchesStatus = statusFilter === 'Status' || client.status === statusFilter;
            
            return matchesSearch && matchesPlan && matchesStatus;
        });
    }, [clientBillings, searchTerm, planTypeFilter, statusFilter]);

    // Calculate pagination
    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredClients.slice(startIndex, startIndex + itemsPerPage);
    }, [currentPage, filteredClients]);

    const getPlanBadgeColor = (planType: string): string => {
        switch (planType) {
            case 'Business':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Enterprise':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'Professional':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'Starter':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusBadgeColor = (status: string): string => {
        switch (status) {
            case 'Active':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'Suspended':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'Trial':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'Expired':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedClients(new Set());
            setSelectAll(false);
        } else {
            setSelectedClients(new Set(paginatedClients.map(client => client.id)));
            setSelectAll(true);
        }
    };

    const handleSelectClient = (clientId: string) => {
        const newSelected = new Set(selectedClients);
        if (newSelected.has(clientId)) {
            newSelected.delete(clientId);
        } else {
            newSelected.add(clientId);
        }
        setSelectedClients(newSelected);
        setSelectAll(newSelected.size === paginatedClients.length);
    };

    const handleEditClient = (client: ClientBilling) => {
        setEditingClient(client);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (editingClient) {
            try {
                // Update the client in the service
                await clientBillingService.updateClientBilling(editingClient);
                
                // Update local state
                setClientBillings(prev =>
                    prev.map(client =>
                        client.id === editingClient.id
                            ? { ...client, ...editingClient }
                            : client
                    )
                );
                
                setIsEditModalOpen(false);
                setEditingClient(null);
            } catch (error) {
                console.error('Error updating client:', error);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editingClient) return;
        
        const { name, value } = e.target;
        setEditingClient({
            ...editingClient,
            [name]: value
        });
    };

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-gray-600">Loading client billings...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-gray-900">Client Billings</h1>
                            
                            <div className="flex items-center space-x-3">
                                {/* Plan Type Filter */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowPlanDropdown(!showPlanDropdown);
                                            setShowStatusDropdown(false);
                                        }}
                                        className="flex items-center justify-between w-32 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <span className="text-gray-700">{planTypeFilter}</span>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </button>
                                    
                                    {showPlanDropdown && (
                                        <div className="absolute right-0 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        setPlanTypeFilter('Plan Type');
                                                        setShowPlanDropdown(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    All Plans
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setPlanTypeFilter('Business');
                                                        setShowPlanDropdown(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    Business
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setPlanTypeFilter('Enterprise');
                                                        setShowPlanDropdown(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    Enterprise
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setPlanTypeFilter('Professional');
                                                        setShowPlanDropdown(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    Professional
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setPlanTypeFilter('Starter');
                                                        setShowPlanDropdown(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    Starter
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Status Filter */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowStatusDropdown(!showStatusDropdown);
                                            setShowPlanDropdown(false);
                                        }}
                                        className="flex items-center justify-between w-24 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <span className="text-gray-700">{statusFilter}</span>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </button>
                                    
                                    {showStatusDropdown && (
                                        <div className="absolute right-0 z-10 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        setStatusFilter('Status');
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    All Status
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setStatusFilter('Active');
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    Active
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setStatusFilter('Suspended');
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    Suspended
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setStatusFilter('Trial');
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    Trial
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setStatusFilter('Expired');
                                                        setShowStatusDropdown(false);
                                                    }}
                                                    className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                >
                                                    Expired
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search Company..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-4 py-2 w-48 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subscription Plan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Billing Cycle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Renews Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedClients.length > 0 ? (
                                    paginatedClients.map((client) => (
                                        <tr key={client.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClients.has(client.id)}
                                                    onChange={() => handleSelectClient(client.id)}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {client.clientId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm mr-3">
                                                        {client.companyLogo}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{client.companyName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${getPlanBadgeColor(client.planType)}`}>
                                                    {client.subscriptionPlan}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {client.billingCycle}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {client.renewsDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-medium border ${getStatusBadgeColor(client.status)}`}>
                                                    {client.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <button className="p-1 text-blue-600 hover:text-blue-800">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        className="p-1 text-green-600 hover:text-green-800"
                                                        onClick={() => handleEditClient(client)}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                                            No clients found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} clients
                            </div>
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Prev
                                </button>

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
                                            className={`px-3 py-1 text-sm border border-gray-300 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {totalPages > 5 && currentPage < totalPages - 2 && (
                                    <span className="px-3 py-1 text-sm text-gray-500">...</span>
                                )}

                                {totalPages > 5 && currentPage < totalPages - 2 && (
                                    <button
                                        onClick={() => setCurrentPage(totalPages)}
                                        className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                        {totalPages}
                                    </button>
                                )}

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingClient && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Client Billing</h3>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="px-6 py-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={editingClient.companyName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
                                <select
                                    name="planType"
                                    value={editingClient.planType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="Business">Business</option>
                                    <option value="Enterprise">Enterprise</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Starter">Starter</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
                                <select
                                    name="billingCycle"
                                    value={editingClient.billingCycle}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annually">Annually</option>
                                    <option value="Biennially">Biennially</option>
                                    <option value="Custom">Custom</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={editingClient.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Trial">Trial</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientBillings;