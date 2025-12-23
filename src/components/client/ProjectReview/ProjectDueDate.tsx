import ViewCalender from "@/common/ViewCalender";
import { ChevronRight, Clock4 } from "lucide-react";
import { useState } from "react";

export interface DueDateCard {
  programName: string;
  projectName: string;
  assignedTo: string[];
  dueDate: string;
  daysLeft: number;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const ProjectDueDate = () => {
  // const [value, onChange] = useState<Value>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<Value>(null);

  const dueDateCards: DueDateCard[] = [
    {
      programName: "Program name",
      projectName: "Employee Management System",
      assignedTo: ["user1", "user2", "user3", "user4"],
      dueDate: "Jul 20, 2023",
      daysLeft: 8,
    },
    {
      programName: "Program name",
      projectName: "Project name",
      assignedTo: ["user1", "user2", "user3", "user4"],
      dueDate: "Jul 20, 2023",
      daysLeft: 4,
    },
    {
      programName: "Program name",
      projectName: "Project name",
      assignedTo: ["user1", "user2", "user3", "user4"],
      dueDate: "Jul 20, 2023",
      daysLeft: 2,
    },
  ];

  const getDaysLeftColor = (days: number) => {
    if (days <= 2) return "bg-red-50 text-red-600";
    if (days <= 4) return "bg-orange-50 text-orange-600";
    return "bg-green-50 text-green-600";
  };

  return (
    <div>
      {/* Due Date Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock4 size={20} className="text-gray-700" />
            <h3 className="text-lg font-semibold text-gray-900">
              Due Date
            </h3>
          </div>
          <ViewCalender
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            value={dateRange}
            onChange={(range) => {
              setDateRange(range);
              setShowCalendar(false); // optional: auto-close
            }}
          />
        </div>

        <div className="space-y-3">
          {dueDateCards.map((card, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    {card.programName}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {card.projectName}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${getDaysLeftColor(
                    card.daysLeft
                  )}`}
                >
                  {card.daysLeft} Days left
                </span>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                Assigned to
              </div>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {card.assignedTo.map((_, idx) => (
                    <img
                      key={idx}
                      src={`https://i.pravatar.cc/150?img=${20 + idx
                        }`}
                      alt="User"
                      className="w-7 h-7 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  Due Date: {card.dueDate}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 flex items-center justify-center gap-1">
          View all 25 <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProjectDueDate;
