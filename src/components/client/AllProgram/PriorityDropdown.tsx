import { useState } from "react";
import { Flag } from "lucide-react";

interface IPriorityDropdownProps {
  defaultPriority: "High" | "Medium" | "Low";
}

export default function PriorityDropdown({
  defaultPriority,
}: IPriorityDropdownProps) {
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">(
    defaultPriority
  );

  const getColor = () => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-orange-500";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getFillColor = () => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-orange-500";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className={`flex items-center gap-1 text-sm font-medium ${getColor()}`}
    >
      <Flag
        size={14}
        className={getFillColor()}
        fill="currentColor"
      />
      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value as "High" | "Medium" | "Low")
        }
        className="border border-gray-300 rounded-md text-sm text-gray-700 px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  );
}
