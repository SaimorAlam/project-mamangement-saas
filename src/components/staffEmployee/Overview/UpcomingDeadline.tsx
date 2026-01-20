import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoxContainer from "../../../common/BoxContainer";
import { useState } from "react";
import "react-calendar/dist/Calendar.css"; // important!
import ViewCalender from "@/common/ViewCalender";
import ContentLoader from "react-content-loader";

import UpcomingDeadlineCard from "./UpcomingDeadlineCard";
import { useGetStaffEmployeeUpcomingDeadlinesQuery } from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface IUpcomingDeadlineFromBackend {
  programName: string;
  projectId: string;
  projectName: string;
  deadline: string;
  daysLeft: number;
  employees: {
    id: string;
    name: string;
    profileImage: string | null;
  }[];
}

const UpcomingDeadline = () => {
  const [value, setValue] = useState<Value>([null, null]); // Set initial value as [null, null]
  const [selectedDays, setSelectedDays] = useState<number | null>(
    null
  ); // To store the selected number of days
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch data for upcoming deadlines
  const { data, isLoading } =
    useGetStaffEmployeeUpcomingDeadlinesQuery({
      days: selectedDays !== null ? selectedDays : "2025",
    });

  // if (error)
  //   return (
  //     <div className="text-gray-400 text-center">
  //       Something went wrong.
  //     </div>
  //   );

  const deadlineData = data?.data?.projects || [];

  // Function to calculate the number of days between selected range
  const handleDateChange = (newValue: Value) => {
    setValue(newValue);

    if (Array.isArray(newValue) && newValue[0] && newValue[1]) {
      const startDate = newValue[0] as Date;
      const endDate = newValue[1] as Date;

      // Calculate the difference in days between start and end date
      const diffTime = Math.abs(
        endDate.getTime() - startDate.getTime()
      );
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // Convert to days

      setSelectedDays(diffDays); // Update selectedDays
    }
  };

  return (
    <BoxContainer>
      <div className="flex items-center justify-between gap-2 pb-8 relative">
        {/* Header */}
        <div className="flex gap-1 items-center justify-center">
          <Clock className="size-8 text-gray-600 w-6 h-6" />
          <h4 className="text-xl font-semibold">
            Upcoming Deadlines
          </h4>
        </div>

        {/* View Calendar Button */}
        <ViewCalender
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          onChange={handleDateChange} // Pass the handleDateChange to get the selected range
          value={value}
        />
      </div>

      {/* Display Selected Range Days */}
      {selectedDays !== null && (
        <div className="text-center text-sm text-gray-400 mb-4">
          You have selected the date range for : {selectedDays} days
        </div>
      )}

      {/* Deadline Cards */}
      <div className="w-full">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div className="flex items-start gap-y-2">
                <ContentLoader
                  width={355}
                  height={600}
                  viewBox="0 0 355 600"
                  key={index}
                  className="flex  gap-y-2"
                >
                  <rect
                    x="4"
                    y="8"
                    rx="16"
                    ry="16"
                    width="7"
                    height="86"
                  />
                  <rect
                    x="6"
                    y="8"
                    rx="16"
                    ry="16"
                    width="675"
                    height="8"
                  />
                  <rect
                    x="6"
                    y="86"
                    rx="16"
                    ry="16"
                    width="669"
                    height="8"
                  />
                  <rect
                    x="350"
                    y="8"
                    rx="16"
                    ry="16"
                    width="6"
                    height="86"
                  />
                  <rect
                    x="25"
                    y="25"
                    rx="16"
                    ry="16"
                    width="200"
                    height="50"
                  />
                  <rect
                    x="240"
                    y="25"
                    rx="3"
                    ry="3"
                    width="100"
                    height="10"
                  />
                  <rect
                    x="240"
                    y="45"
                    rx="3"
                    ry="3"
                    width="100"
                    height="10"
                  />
                  <rect
                    x="240"
                    y="65"
                    rx="3"
                    ry="3"
                    width="100"
                    height="10"
                  />
                </ContentLoader>
              </div>
            ))
          : deadlineData?.map(
              (project: IUpcomingDeadlineFromBackend, i: number) => (
                <div key={i} className="pb-6">
                  <UpcomingDeadlineCard deadlineData={project} />
                </div>
              )
            )}
      </div>

      {/* View All Button */}
      <div>
        {deadlineData.length === 0 ? (
          <div className="py-6 text-center text-gray-400">
            Nothing is upcoming.
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            View all {deadlineData.length}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </BoxContainer>
  );
};

export default UpcomingDeadline;
