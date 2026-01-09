import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type { DateRange as DayPickerDateRange } from "react-day-picker";
import { useState } from "react";

const DateRangePicker = () => {
  const [dateRange, setDateRange] = useState<
    DayPickerDateRange | undefined
  >({
    from: undefined,
    to: undefined,
  });

  const handleDateRangeSelect = (
    range: DayPickerDateRange | undefined
  ) => {
    setDateRange(range ?? { from: undefined, to: undefined });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-transparent border border-[#E2E8F0]"
        >
          <Calendar className="h-4 w-4" />
          Date Range
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="end">
        <CalendarComponent
          mode="range"
          selected={dateRange}
          onSelect={handleDateRangeSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
