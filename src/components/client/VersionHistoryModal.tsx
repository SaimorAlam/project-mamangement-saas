import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  ChevronDown,
  RotateCcw,
  Download,
  Trash2,
  User,
  Paperclip,
  Link2,
  Calendar,
  Activity,
  Trash,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  className?: string;
}

const versions = [
  {
    id: "1",
    type: "assignee",
    description: "Assignee added: Jhon Doe",
    date: "24-7-2024",
    changedBy: {
      name: "Alexandria",
      avatar: "https://i.pravatar.cc/150?u=Alexandria",
    },
  },
  {
    id: "2",
    type: "file",
    description: "File added: photo-2025-07-18.09-16-OOjpg",
    date: "24-7-2024",
    changedBy: {
      name: "Arlene",
      avatar: "https://i.pravatar.cc/150?u=Arlene",
    },
  },
  {
    id: "3",
    type: "link",
    description: "Link to footing added",
    date: "24-7-2024",
    changedBy: {
      name: "Ann",
      avatar: "https://i.pravatar.cc/150?u=Ann",
    },
  },
  {
    id: "4",
    type: "link_removed",
    description: "Link to footing removed",
    date: "25-7-2024",
    changedBy: {
      name: "Kyle",
      avatar: "https://i.pravatar.cc/150?u=Kyle",
    },
  },
  {
    id: "5",
    type: "link",
    description: "Link to footing added",
    date: "25-7-2024",
    changedBy: {
      name: "Kristin",
      avatar: "https://i.pravatar.cc/150?u=Kristin",
    },
  },
  {
    id: "6",
    type: "date",
    description: "Due Date changed from 24/04/2025 to 10/5/2025",
    date: "26-7-2024",
    changedBy: {
      name: "Colleen",
      avatar: "https://i.pravatar.cc/150?u=Colleen",
    },
  },
  {
    id: "7",
    type: "date",
    description: "Due Date changed from 24/04/2025 to 10/5/2025",
    date: "26-7-2024",
    changedBy: {
      name: "Aubrey",
      avatar: "https://i.pravatar.cc/150?u=Aubrey",
    },
  },
  {
    id: "8",
    type: "date",
    description: "Due Date changed from 24/04/2025 to 10/5/2025",
    date: "26-7-2024",
    changedBy: {
      name: "Aubrey",
      avatar: "https://i.pravatar.cc/150?u=Aubrey",
    },
  },
  {
    id: "9",
    type: "date",
    description: "Due Date changed from 24/04/2025 to 10/5/2025",
    date: "26-7-2024",
    changedBy: {
      name: "Aubrey",
      avatar: "https://i.pravatar.cc/150?u=Aubrey",
    },
  },
  {
    id: "10",
    type: "date",
    description: "Due Date changed from 24/04/2025 to 10/5/2025",
    date: "26-7-2024",
    changedBy: {
      name: "Aubrey",
      avatar: "https://i.pravatar.cc/150?u=Aubrey",
    },
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "assignee":
      return <User className="w-4 h-4 text-purple-500" />;
    case "file":
      return <Paperclip className="w-4 h-4 text-blue-500" />;
    case "link":
    case "link_removed":
      return <Link2 className="w-4 h-4 text-cyan-500" />;
    case "date":
      return <Calendar className="w-4 h-4 text-blue-400" />;
    case "progress":
      return <Activity className="w-4 h-4 text-purple-400" />;
    case "subtask_removed":
      return <Trash className="w-4 h-4 text-red-400" />;
    default:
      return <Paperclip className="w-4 h-4 text-gray-400" />;
  }
};

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  projectName,
  className,
}) => {
  const [search, setSearch] = useState("");
  const [changeType, setChangeType] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const filteredVersions = useMemo(() => {
    return versions.filter((v) => {
      const matchesSearch = v.description
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = changeType === "all" || v.type === changeType;
      const matchesDate = dateFilter === "all" || v.date === dateFilter;
      const matchesUser =
        userFilter === "all" || v.changedBy.name === userFilter;
      return matchesSearch && matchesType && matchesDate && matchesUser;
    });
  }, [search, changeType, dateFilter, userFilter]);

  const uniqueUsers = useMemo(() => {
    return Array.from(new Set(versions.map((v) => v.changedBy.name)));
  }, []);

  const uniqueDates = useMemo(() => {
    return Array.from(new Set(versions.map((v) => v.date)));
  }, []);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(versions.map((v) => v.type)));
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/5 z-50" onClick={onClose} />
      <div
        className={cn(
          "absolute right-0 top-14 w-[850px] bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100",
          className,
        )}
      >
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Version History - {projectName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-50">
          <div className="relative flex-1 max-w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5 min-w-fit">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                Changes:
              </span>
              <Select value={changeType} onValueChange={setChangeType}>
                <SelectTrigger className="h-9 min-w-24 border-[#E4E7EC] text-xs font-medium">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 min-w-fit">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                Date:
              </span>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="h-9 min-w-24 border-[#E4E7EC] text-xs font-medium">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5 min-w-fit">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                Changed By:
              </span>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="h-9 min-w-32 border-[#E4E7EC] text-xs font-medium">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[60vh] scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#F9FAFB] z-10">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-[#475467] uppercase tracking-wider w-[45%]">
                  Description
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-[#475467] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-[#475467] uppercase tracking-wider">
                  Changed By
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-[#475467] uppercase tracking-wider text-right pr-10">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#F2F4F7]">
              {filteredVersions.length > 0 ? (
                filteredVersions.map((version) => (
                  <tr
                    key={version.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#F9FAFB] rounded-lg group-hover:bg-white transition-colors">
                          {getIcon(version.type)}
                        </div>
                        <span className="text-sm text-[#344054] font-medium">
                          {version.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#475467]">
                        {version.date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 border border-white shadow-sm">
                          <AvatarImage src={version.changedBy.avatar} />
                          <AvatarFallback className="text-[10px] bg-gray-100">
                            {version.changedBy.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-[#344054] font-medium">
                          {version.changedBy.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Restore"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-teal-500 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-gray-500 text-sm"
                  >
                    No versions found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default VersionHistoryModal;
