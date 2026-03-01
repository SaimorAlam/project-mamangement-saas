/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import {
  Search,
  Download,
  Calendar as CalendarIcon,
  X,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/common/Pagination";
import ProjectDueDate from "./ProjectDueDate";
import AllProjectTable from "./AllProjectTable";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import ReviewerActivity from "./ReviewerActivity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Project } from "@/store/Api/ProjectApi/ProjectType";
/* -------------------- Types -------------------- */

export type ProjectStatus =
  | "LIVE"
  | "PENDING"
  | "RETURNED"
  | "OVERDUE"
  | "DRAFT"
  | "IN_REVIEW"
  | "SUBMITTED";

export type ProjectPriority = "HIGH" | "MEDIUM" | "LOW";


/* -------------------- Component -------------------- */

const AllProject: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<any>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const { data } = useGetAllProjectsQuery({});
  const projects: Project[] = useMemo(
    () => data?.data?.projects?.data || [],
    [data],
  );

  const ITEMS_PER_PAGE = 9;

  /* -------------------- Utilities -------------------- */

  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  /* -------------------- Derived Data -------------------- */

  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (selectedStatus) {
      list = list.filter((p) =>
        selectedStatus === "ALL" ? true : p.status === selectedStatus,
      );
    }

    if (searchQuery) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (dateRange) {
      if (Array.isArray(dateRange)) {
        const [start, end] = dateRange;
        if (start && end) {
          list = list.filter((p) => {
            const pDate = new Date(p.startDate);
            // Normalize dates to ignore time for range comparison
            const s = new Date(start.setHours(0, 0, 0, 0));
            const e = new Date(end.setHours(23, 59, 59, 999));
            return pDate >= s && pDate <= e;
          });
        }
      } else if (dateRange instanceof Date) {
        list = list.filter((p) => {
          const pDate = new Date(p.startDate).toLocaleDateString();
          return pDate === dateRange.toLocaleDateString();
        });
      }
    }

    return list;
  }, [projects, selectedStatus, searchQuery, dateRange]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  /*   ACTIONS   */

  const handleExport = () => {
    try {
      if (filteredProjects.length === 0) {
        toast.error("No data available to export");
        return;
      }

      // Prepare data for export
      const exportData = filteredProjects.map((p) => ({
        "Project Name": p.name,
        Status: p.status,
        Priority: p.priority,
        "Start Date": p.startDate
          ? new Date(p.startDate).toLocaleDateString()
          : "-",
        Deadline: p.deadline ? new Date(p.deadline).toLocaleDateString() : "-",
        Progress: `${p.progress}%`,
        Budget: p.budget || "-",
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Projects");

      // Generate file and trigger download
      XLSX.writeFile(
        wb,
        `Project_Review_Export_${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      toast.success("Spreadsheet exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export spreadsheet");
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <div className="min-h-screen my-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 md:p-6 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
            <h1 className="text-xl font-bold text-gray-900">
              All Project Review
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search Permissions"
                  className="pl-9 bg-white border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status */}
              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="LIVE">Live</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Button & Popup */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-10 border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon size={18} className="text-gray-400" />
                  <span className="text-sm font-medium">
                    {dateRange
                      ? Array.isArray(dateRange)
                        ? `${dateRange[0] ? formatShortDate(dateRange[0]) : ""} - ${dateRange[1] ? formatShortDate(dateRange[1]) : ""}`
                        : formatShortDate(dateRange)
                      : "Date Range"}
                  </span>
                </Button>

                {showCalendar && (
                  <div className="absolute top-12 right-0 z-100 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 min-w-[320px] animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          Select Date Range
                        </h4>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
                          Project Schedule
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCalendar(false)}
                        className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 text-gray-400"
                      >
                        <X size={16} />
                      </Button>
                    </div>

                    <div className="custom-calendar-wrapper">
                      <Calendar
                        selectRange={true}
                        onChange={(val: any) => {
                          setDateRange(val);
                          setCurrentPage(1);
                        }}
                        value={dateRange}
                        className="border-none font-inter w-full"
                        nextLabel={<span className="text-gray-400">&gt;</span>}
                        prevLabel={<span className="text-gray-400">&lt;</span>}
                        next2Label={null}
                        prev2Label={null}
                      />
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50 flex items-start gap-2">
                      <Info
                        size={14}
                        className="text-blue-500 mt-0.5 shrink-0"
                      />
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {Array.isArray(dateRange) &&
                        dateRange[0] &&
                        dateRange[1] ? (
                          <span>
                            Selected:{" "}
                            <span className="font-semibold text-gray-700">
                              {dateRange[0].toLocaleDateString()}
                            </span>{" "}
                            to{" "}
                            <span className="font-semibold text-gray-700">
                              {dateRange[1].toLocaleDateString()}
                            </span>
                          </span>
                        ) : (
                          "Click a start date and then an end date to select a range."
                        )}
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 h-9 text-xs border border-gray-200"
                        onClick={() => {
                          setDateRange(null);
                          setShowCalendar(false);
                          setCurrentPage(1);
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        className="flex-1 h-9 text-xs bg-[#1C73E0] hover:bg-[#155fc1] text-white"
                        onClick={() => setShowCalendar(false)}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Export */}
              <Button
                variant="outline"
                size="lg"
                className="h-10 border-gray-200"
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4 text-gray-400" />
                Export
              </Button>
            </div>
          </div>
          <div className="w-full">
            <AllProjectTable projects={paginatedProjects} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
              totalPrograms={filteredProjects.length}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[350px] space-y-6">
          <ProjectDueDate />
          <ReviewerActivity />
        </div>
      </div>

      {/* Scoped Styles for react-calendar to match site design */}
      <style>{`
        .custom-calendar-wrapper .react-calendar {
          background: white;
          border: none;
          font-family: inherit;
        }
        .custom-calendar-wrapper .react-calendar__navigation {
          margin-bottom: 10px;
        }
        .custom-calendar-wrapper .react-calendar__navigation button {
          min-width: 30px;
          background: none;
          font-weight: 600;
          color: #374151;
        }
        .custom-calendar-wrapper .react-calendar__navigation button:enabled:hover,
        .custom-calendar-wrapper .react-calendar__navigation button:enabled:focus {
          background-color: #f9fafb;
          border-radius: 6px;
        }
        .custom-calendar-wrapper .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: 700;
          font-size: 10px;
          color: #9ca3af;
          margin-bottom: 8px;
        }
        .custom-calendar-wrapper .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        .custom-calendar-wrapper .react-calendar__tile {
          padding: 10px 5px !important;
          font-size: 13px;
          color: #4b5563;
          border-radius: 6px;
        }
        .custom-calendar-wrapper .react-calendar__tile:enabled:hover,
        .custom-calendar-wrapper .react-calendar__tile:enabled:focus {
          background-color: #eff6ff;
          color: #1d4ed8;
        }
        .custom-calendar-wrapper .react-calendar__tile--now {
          background: #f3f4f6;
          color: #111827;
          font-weight: bold;
        }
        .custom-calendar-wrapper .react-calendar__tile--active {
          background: #1c73e0 !important;
          color: white !important;
        }
        .custom-calendar-wrapper .react-calendar__tile--selectRange {
          background: #eff6ff;
          color: #1d4ed8;
          border-radius: 0;
        }
      `}</style>
    </div>
  );
};

export default AllProject;
