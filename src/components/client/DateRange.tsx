/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Info, X } from "lucide-react";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DateRangePicker = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const formatShortDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
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
            <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              {Array.isArray(dateRange) && dateRange[0] && dateRange[1] ? (
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

export default DateRangePicker;
