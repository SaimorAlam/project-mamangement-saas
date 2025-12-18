import React from "react";
import PrimaryButton from "./PrimaryButton";
import { CalendarDays, X } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

/* ✅ Correct Types */
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
  return (
    <>
      {/* View Calendar Button */}
      <PrimaryButton
        title="View Calendar"
        type="Primary"
        rightIcon={<CalendarDays />}
        className="text-sm"
        onClick={() => setShowCalendar(true)}
      />

      {/* Calendar Popup */}
      {showCalendar && (
        <div
          className="absolute top-14 right-0 z-50 bg-white rounded-xl shadow-lg border border-gray-200 p-4"
          onMouseLeave={() => setShowCalendar(false)}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-800">Calendar</h4>
            <button
              onClick={() => setShowCalendar(false)}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Correct Calendar Component */}
          <Calendar
            onChange={onChange}
            value={value}
          />
        </div>
      )}
    </>
  );
};

export default ViewCalender;
