import { X, Info, CalendarDays } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Button } from "@/components/ui/button";
import PrimaryButton from "./PrimaryButton";

/* Types */
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ViewCalenderProps {
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
  onChange: (value: Value) => void;
  value: Value;
}

const ViewCalender = ({
  showCalendar,
  setShowCalendar,
  onChange,
  value,
}: ViewCalenderProps) => {
  const formatShortDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div className="relative">
      {/* View Calendar Button */}
      <PrimaryButton
        title={
          value
            ? Array.isArray(value)
              ? `${value[0] ? formatShortDate(value[0]) : ""} - ${value[1] ? formatShortDate(value[1]) : ""}`
              : formatShortDate(value)
            : "View Calendar"
        }
        type="Primary"
        rightIcon={!value && <CalendarDays />}
        className="text-sm px-3"
        onClick={() => setShowCalendar(!showCalendar)}
      />

      {/* Calendar Popup */}
      {showCalendar && (
        <div className="absolute top-12 right-0 z-100 bg-white rounded-xl shadow-2xl border border-gray-100 p-5 min-w-[320px] animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="flex justify-between items-center  pb-3 ">
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                Select Date Range
              </h4>
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

          {/* Calendar Wrapper with Custom Styles */}
          <div className="custom-calendar-wrapper">
            <Calendar
              selectRange={true}
              onChange={(val) => {
                onChange(val);
                // We keep it open so user can see selection, or close if list is provided
                setShowCalendar(true);
              }}
              value={value}
              className="border-none! font-inter! w-full!"
              nextLabel={<span className="text-gray-400">&gt;</span>}
              prevLabel={<span className="text-gray-400">&lt;</span>}
              next2Label={null}
              prev2Label={null}
            />
          </div>

          {/* Selection Info */}
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-start gap-2">
            <Info size={14} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-[11px] text-gray-500 leading-relaxed">
              {Array.isArray(value) && value[0] && value[1] ? (
                <span>
                  Selected:{" "}
                  <span className="font-semibold text-gray-700">
                    {value[0].toLocaleDateString()}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-700">
                    {value[1].toLocaleDateString()}
                  </span>
                </span>
              ) : (
                "Click a start date and then an end date to select a range."
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-9 text-xs border border-gray-200"
              onClick={() => {
                onChange(null);
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
        .custom-calendar-wrapper .react-calendar__tile--rangeStart {
          //  border-top-right-radius: 0;
          //  border-bottom-right-radius: 0;
        }
        .custom-calendar-wrapper .react-calendar__tile--rangeEnd {
          //  border-top-left-radius: 0;
          //  border-bottom-left-radius: 0;
        }
        .custom-calendar-wrapper .react-calendar__tile--rangeBothEnds {
           border-radius: 6px !important;
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

export default ViewCalender;
