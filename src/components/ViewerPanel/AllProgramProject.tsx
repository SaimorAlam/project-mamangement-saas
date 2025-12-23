import {
  AlignStartHorizontal,
  ArrowRight,
  ChevronDown,
  Filter,
  TableIcon,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProjectGridView from "./ProjectGridView";
import ProjectTableView from "./ProjectTableView";
import Pagination from "@/common/Pagination";
import { Button } from "@/components/ui/button";
import PrimaryButton from "@/common/PrimaryButton";
import DropdownSelect from "@/common/DropdownSelect";

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

const AllProgramProject = () => {
  const [viewMode, setViewMode] = useState<"table" | "board">(
    "board"
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  console.log(statusFilter);
  console.log(priorityFilter);

  const itemsPerPage = 6;

  const totalPages = Math.ceil(
    allProgramProjectData.length / itemsPerPage
  );

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const statusOptions = [
    { value: "all", title: "All Status" },
    { value: "Live", title: "Live" },
    { value: "Returned", title: "Returned" },
    { value: "Overdue", title: "Overdue" },
    { value: "Draft", title: "Draft" },
    { value: "In Review", title: "In Review" },
    { value: "Submitted", title: "Submitted" },
  ];

  const priorityOptions = [
    { value: "all", title: "All Priority" },
    { value: "High", title: "High" },
    { value: "Medium", title: "Medium" },
    { value: "Low", title: "Low" },
    { value: "Default", title: "Default" },
  ];

  return (
    <div className="pb-6 min-h-[500px]">
      {/* Header  */}
      <div className="flex items-center justify-between pb-6">
        <h4 className=" text-gray-900 text-2xl font-semibold">
          Assigned Projects
        </h4>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center  bg-white gap-3">
            <PrimaryButton
              type="Primary"
              title="Boards"
              leftIcon={<AlignStartHorizontal className="w-4 h-4" />}
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

          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent border border-[#CAD2DB] h-12"
              >
                <Filter className="size-5" />
                Filter By
                <ChevronDown className="size-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white border border-[#CAD2DB]"
            >
              <div className="p-2">
                <div className="mb-3">
                  <DropdownSelect
                    placeholderText="Status"
                    dropdownItem={statusOptions}
                    onChange={setStatusFilter}
                    label="Status"
                  />
                </div>
                <div>
                  <DropdownSelect
                    placeholderText="Priority"
                    dropdownItem={priorityOptions}
                    onChange={setPriorityFilter}
                    label="Priority"
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Content */}
      {viewMode === "table" ? (
        <>
          <ProjectTableView
            allProgramProjectData={allProgramProjectData}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalPrograms={allProgramProjectData.length}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        <>
          <ProjectGridView
            allProgramProjectData={allProgramProjectData}
          />
          {allProgramProjectData.length > 4 && (
            <div className="pt-6">
              <Link to="/work-in-progress">
                <Button
                  variant="ghost"
                  className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  View all {allProgramProjectData.length}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllProgramProject;
