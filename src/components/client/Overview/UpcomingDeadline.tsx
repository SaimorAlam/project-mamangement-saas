import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import UpcomingDeadlineCard from "./UpcomingDeadlineCard";
import BoxContainer from "../../../common/BoxContainer";
import { useState } from "react";
import "react-calendar/dist/Calendar.css"; // important!
import ViewCalender from "@/common/ViewCalender";
import { Loader2 } from "lucide-react";

import { useGetUpcomingDeadlinesQuery } from "@/store/Api/DeadlineApi/DeadlineApi";

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
  const [value, onChange] = useState<Value>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const { data, isLoading } = useGetUpcomingDeadlinesQuery({});

  const deadlineData = data?.data?.projects || [];

  return (
    <BoxContainer>
      <div className="flex items-center justify-between gap-2 pb-8 relative">
        {/* Header */}
        <div className="flex gap-1 items-center justify-center ">
          <Clock className="size-8 text-gray-600 w-6 h-6" />
          <h4 className="text-lg font-semibold">Upcoming Deadline</h4>
        </div>

        {/* View Calendar Button */}
        <ViewCalender
          showCalendar={showCalendar}
          setShowCalendar={setShowCalendar}
          onChange={onChange}
          value={value}
        />
      </div>

      {/* Deadline Cards */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
          </div>
        ) : (
          deadlineData?.map(
            (project: IUpcomingDeadlineFromBackend, i: number) => (
              <div key={i} className="pb-6">
                <UpcomingDeadlineCard deadlineData={project} />
              </div>
            )
          )
        )}
      </div>

      {/* View All Button */}
      <div>
        <Button
          variant="ghost"
          className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          View all {deadlineData.length}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </BoxContainer>
  );
};

export default UpcomingDeadline;
