/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Search,
  ArrowDownUp,
  ChevronDown,
  TableIcon,
  AlignStartHorizontal,
} from "lucide-react";
import ProjectDueDate from "./ProjectDueDate";
import ReviewerActivity from "./ReviewerActivity";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/common/PrimaryButton";
import AllProgramProjectTableView from "../AllProgramProjectTableView";
import Pagination from "../Pagination";
import AllProgramProjectGridView from "../AllProgramProjectGridView";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface Project {
  id: number;
  name: string;
  assignedStaff: string[];
  status: "Approved" | "Pending" | "Returned";
  priority: "High" | "Medium" | "Low" | "Default";
  submitDate: string;
  selected: boolean;
}

const allProgramProjectData = [
  {
    id: "1",
    programName: "Health Awareness",
    projectName: "Wellness Project",
    status: "Live",
    staffMembers: [
      {
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        name: "Michael Smith",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    ],
    startDate: "15-06-2024",
    endDate: "24-07-2024",
    priority: "High",
    progress: 35,
  },
  {
    id: "2",
    programName: "Education Drive",
    projectName: "School Support",
    status: "Returned",
    staffMembers: [
      {
        name: "James Lee",
        avatar: "https://randomuser.me/api/portraits/men/76.jpg",
      },
      {
        name: "David Wilson",
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      },
    ],
    startDate: "10-07-2024",
    endDate: "20-08-2024",
    priority: "Medium",
    progress: 20,
  },
  {
    id: "3",
    programName: "Clean City",
    projectName: "Community Cleaning",
    status: "Draft",
    staffMembers: [
      {
        name: "Chris Adams",
        avatar: "https://randomuser.me/api/portraits/men/15.jpg",
      },
      {
        name: "Oliver Brown",
        avatar: "https://randomuser.me/api/portraits/men/36.jpg",
      },
    ],
    startDate: "01-05-2024",
    endDate: "30-06-2024",
    priority: "Low",
    progress: 100,
  },
  {
    id: "4",
    programName: "Sports Program",
    projectName: "Youth Football",
    status: "In Review",
    staffMembers: [
      {
        name: "Adam Clark",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      },
      {
        name: "Ryan Scott",
        avatar: "https://randomuser.me/api/portraits/men/18.jpg",
      },
    ],
    startDate: "12-06-2024",
    endDate: "12-09-2024",
    priority: "High",
    progress: 60,
  },
  {
    id: "5",
    programName: "Green Project",
    projectName: "Tree Plantation",
    status: "Overdue",
    staffMembers: [
      {
        name: "Ethan Hall",
        avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      },
      {
        name: "Lucas King",
        avatar: "https://randomuser.me/api/portraits/men/29.jpg",
      },
    ],
    startDate: "20-06-2024",
    endDate: "25-07-2024",
    priority: "Medium",
    progress: 45,
  },
  {
    id: "6",
    programName: "Food Distribution",
    projectName: "Hunger Relief",
    status: "Live",
    staffMembers: [
      {
        name: "Henry Evans",
        avatar: "https://randomuser.me/api/portraits/men/53.jpg",
      },
      {
        name: "Jack White",
        avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      },
    ],
    startDate: "05-07-2024",
    endDate: "15-08-2024",
    priority: "High",
    progress: 10,
  },
  {
    id: "7",
    programName: "Mental Health",
    projectName: "Wellbeing Sessions",
    status: "Live",
    staffMembers: [
      {
        name: "William Harris",
        avatar: "https://randomuser.me/api/portraits/men/66.jpg",
      },
      {
        name: "Thomas Nelson",
        avatar: "https://randomuser.me/api/portraits/men/72.jpg",
      },
    ],
    startDate: "01-08-2024",
    endDate: "30-09-2024",
    priority: "Medium",
    progress: 55,
  },
  {
    id: "8",
    programName: "Coding Bootcamp",
    projectName: "Youth Tech Training",
    status: "Live",
    staffMembers: [
      {
        name: "Daniel Moore",
        avatar: "https://randomuser.me/api/portraits/men/83.jpg",
      },
      {
        name: "Matthew Taylor",
        avatar: "https://randomuser.me/api/portraits/men/87.jpg",
      },
    ],
    startDate: "10-06-2024",
    endDate: "15-07-2024",
    priority: "High",
    progress: 70,
  },
  {
    id: "9",
    programName: "Disaster Relief",
    projectName: "Flood Assistance",
    status: "Overdue",
    staffMembers: [
      {
        name: "Andrew Martinez",
        avatar: "https://randomuser.me/api/portraits/men/92.jpg",
      },
      {
        name: "Joseph Anderson",
        avatar: "https://randomuser.me/api/portraits/men/99.jpg",
      },
    ],
    startDate: "15-07-2024",
    endDate: "25-08-2024",
    priority: "High",
    progress: 15,
  },
  {
    id: "10",
    programName: "Scholarship Fund",
    projectName: "Student Aid",
    status: "Completed",
    staffMembers: [
      {
        name: "Samuel Perez",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      {
        name: "Anthony Hill",
        avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      },
    ],
    startDate: "01-04-2024",
    endDate: "30-05-2024",
    priority: "Low",
    progress: 100,
  },
  {
    id: "11",
    programName: "Water Sanitation",
    projectName: "Clean Water",
    status: "Live",
    staffMembers: [
      {
        name: "Jonathan Clark",
        avatar: "https://randomuser.me/api/portraits/men/14.jpg",
      },
      {
        name: "Patrick Allen",
        avatar: "https://randomuser.me/api/portraits/men/21.jpg",
      },
    ],
    startDate: "10-05-2024",
    endDate: "20-07-2024",
    priority: "Medium",
    progress: 40,
  },
  {
    id: "12",
    programName: "Recycling Drive",
    projectName: "Waste Management",
    status: "Live",
    staffMembers: [
      {
        name: "Peter Roberts",
        avatar: "https://randomuser.me/api/portraits/men/25.jpg",
      },
      {
        name: "George Lewis",
        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      },
    ],
    startDate: "12-06-2024",
    endDate: "12-08-2024",
    priority: "Low",
    progress: 50,
  },
  {
    id: "13",
    programName: "Digital Literacy",
    projectName: "Online Training",
    status: "Pending",
    staffMembers: [
      {
        name: "Paul Walker",
        avatar: "https://randomuser.me/api/portraits/men/37.jpg",
      },
      {
        name: "Kevin Hall",
        avatar: "https://randomuser.me/api/portraits/men/39.jpg",
      },
    ],
    startDate: "18-07-2024",
    endDate: "30-08-2024",
    priority: "Medium",
    progress: 25,
  },
  {
    id: "14",
    programName: "Startup Mentorship",
    projectName: "Business Training",
    status: "Live",
    staffMembers: [
      {
        name: "Brian Young",
        avatar: "https://randomuser.me/api/portraits/men/49.jpg",
      },
      {
        name: "Eric Green",
        avatar: "https://randomuser.me/api/portraits/men/57.jpg",
      },
    ],
    startDate: "05-06-2024",
    endDate: "25-07-2024",
    priority: "High",
    progress: 65,
  },
  {
    id: "15",
    programName: "Art Therapy",
    projectName: "Creative Workshops",
    status: "Completed",
    staffMembers: [
      {
        name: "Kyle Baker",
        avatar: "https://randomuser.me/api/portraits/men/63.jpg",
      },
      {
        name: "Dylan Reed",
        avatar: "https://randomuser.me/api/portraits/men/68.jpg",
      },
    ],
    startDate: "01-03-2024",
    endDate: "01-05-2024",
    priority: "Low",
    progress: 100,
  },
];

const AllProjectReview: React.FC = () => {
  const [viewMode, setViewMode] = useState<"table" | "board">(
    "board"
  );
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [sortBy, setSortBy] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  const totalPages = Math.ceil(
    allProgramProjectData.length / itemsPerPage
  );

  return (
    <div className="min-h-screen border border-gray-200 rounded-lg my-6 p-6">
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              All Project Review
            </h1>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search Projects"
                  className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none  w-64"
                />
              </div>

              {/* All Status Dropdown */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none appearance-none  bg-white cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Returned</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* Sort By Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="px-4 py-2 pr-8 text-sm border border-gray-300 rounded-lg focus:outline-none appearance-none  bg-white cursor-pointer"
                  >
                    <ArrowDownUp className="size-5" />
                    Sort By
                    <ChevronDown className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-white border border-[#CAD2DB] p-1"
                >
                  {/* Field Selection */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Field
                  </div>
                  <DropdownMenuItem
                    className={`rounded-md cursor-pointer ${
                      sortBy === "startDate"
                        ? "bg-indigo-50 text-indigo-600"
                        : ""
                    }`}
                    onClick={() => setSortBy("name")}
                  >
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`rounded-md cursor-pointer ${
                      sortBy === "endDate"
                        ? "bg-indigo-50 text-indigo-600"
                        : ""
                    }`}
                    onClick={() => setSortBy("submitDate")}
                  >
                    Submit Date
                  </DropdownMenuItem>

                  <div className="my-1 border-t border-gray-100" />

                  {/* Order Selection */}
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order
                  </div>
                  <DropdownMenuItem
                    className={`rounded-md cursor-pointer ${
                      sortOrder === "asc"
                        ? "bg-indigo-50 text-indigo-600"
                        : ""
                    }`}
                    onClick={() => setSortOrder("asc")}
                  >
                    Ascending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`rounded-md cursor-pointer ${
                      sortOrder === "desc"
                        ? "bg-indigo-50 text-indigo-600"
                        : ""
                    }`}
                    onClick={() => setSortOrder("desc")}
                  >
                    Descending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Toggle */}
              <div className="flex items-center  bg-white gap-3">
                <PrimaryButton
                  type="Primary"
                  title="Boards"
                  leftIcon={
                    <AlignStartHorizontal className="w-4 h-4" />
                  }
                  className={`${
                    viewMode === "board"
                      ? "bg-black text-white border-black hover:bg-black! hover:text-white!"
                      : "bg-white border-black text-black! hover:text-black!"
                  }`}
                  onClick={() => setViewMode("board")}
                />

                <PrimaryButton
                  type="Primary"
                  title="Tables"
                  leftIcon={<TableIcon className="w-4 h-4" />}
                  className={`${
                    viewMode === "table"
                      ? "bg-black text-white border-black hover:bg-black! hover:text-white!"
                      : "bg-white border-black text-black! hover:text-black!"
                  }`}
                  onClick={() => setViewMode("table")}
                />
              </div>
            </div>
          </div>

          {viewMode === "table" ? (
            <>
              <AllProgramProjectTableView
                allProgramProjectData={allProgramProjectData.map(
                  (item) => ({
                    ...item,
                    priority:
                      item.priority === "High"
                        ? "High"
                        : item.priority === "Medium"
                        ? "Medium"
                        : item.priority === "Low"
                        ? "Low"
                        : "Low", // fallback to "Low" if not matching
                  })
                )}
              />

              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalPages={totalPages}
                filteredDataLength={allProgramProjectData.length}
              />
            </>
          ) : (
            <>
              <AllProgramProjectGridView
                allProgramProjectData={allProgramProjectData.map(
                  (item) => ({
                    ...item,
                    priority:
                      item.priority === "High"
                        ? "High"
                        : item.priority === "Medium"
                        ? "Medium"
                        : item.priority === "Low"
                        ? "Low"
                        : "Low", // fallback to "Low" if not matching
                  })
                )}
              />
              {/* "View All" button if there are more than 4 programs/projects */}
              {allProgramProjectData.length > 4 && (
                <div className="pt-6">
                  <Link to="/work-in-progress">
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      {/* Display total count */}
                      View all {allProgramProjectData.length}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-90 space-y-6">
          <ProjectDueDate />
          <ReviewerActivity />
        </div>
      </div>
    </div>
  );
};

export default AllProjectReview;
