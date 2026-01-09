// import { ArrowRight, Clock } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import BoxContainer from "../../../common/BoxContainer";
// import { useState } from "react";
// import "react-calendar/dist/Calendar.css"; // important!
// import ViewCalender from "@/common/ViewCalender";
// import { Loader2 } from "lucide-react";

// import UpcomingDeadlineCard from "./UpcomingDeadlineCard";
// import { useGetUpcomingDeadlinesQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];
// interface IUpcomingDeadlineFromBackend {
//   programName: string;
//   projectId: string;
//   projectName: string;
//   deadline: string;
//   daysLeft: number;
//   employees: {
//     id: string;
//     name: string;
//     profileImage: string | null;
//   }[];
// }

// const SmUpcomingDeadline = () => {
//   const [value, onChange] = useState<Value>(new Date());
//   const [showCalendar, setShowCalendar] = useState(false);

//   const { data, isLoading, error } = useGetUpcomingDeadlinesQuery({});

//   if(error) return <div className="text-gray-400 text-center">Something</div>

//   const deadlineData = data?.data?.projects || [];
//   console.log("Upcommitn dddddddddd:");
//   console.log("Upcommitn dddddddddd:",deadlineData,deadlineData.length);


//   return (
//     <BoxContainer>
//       <div className="flex items-center justify-between gap-2 pb-8 relative">
//         {/* Header */}
//         <div className="flex gap-1 items-center justify-center ">
//           <Clock className="size-8 text-gray-600 w-6 h-6" />
//           <h4 className="text-lg font-semibold">Upcoming Deadline</h4>
//         </div>

//         {/* View Calendar Button */}
//         <ViewCalender
//           showCalendar={showCalendar}
//           setShowCalendar={setShowCalendar}
//           onChange={onChange}
//           value={value}
//         />
//       </div>

//       {/* Deadline Cards */}
//       <div className="w-full">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-32">
//             <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
//           </div>
//         ) : (
//           deadlineData?.map(
//             (project: IUpcomingDeadlineFromBackend, i: number) => (
//               <div key={i} className="pb-6">
//                 <UpcomingDeadlineCard deadlineData={project} />
//               </div>
//             )
//           )
//         )}
//       </div>

//       {/* View All Button */}
//       <div>
//         {deadlineData.length===0? (
//             <div className="py-6 text-center text-gray-400">Nothing is upcomming.</div>
//         ):(
//             <Button
//           variant="ghost"
//           className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
//         >
//           View all {deadlineData.length}
//           <ArrowRight className="h-4 w-4 ml-2" />
//         </Button>
//         )}
//       </div>
//     </BoxContainer>
//   );
// };

// export default SmUpcomingDeadline;

import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import BoxContainer from "../../../common/BoxContainer";
import { useState } from "react";
import "react-calendar/dist/Calendar.css"; // important!
import ViewCalender from "@/common/ViewCalender";
import { Loader2 } from "lucide-react";

import UpcomingDeadlineCard from "./UpcomingDeadlineCard";
import { useGetUpcomingDeadlinesQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import ErrorPage from "@/common/ErrorPage";

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

const SmUpcomingDeadline = () => {
  const [value, setValue] = useState<Value>([null, null]); // Set initial value as [null, null]
  const [selectedDays, setSelectedDays] = useState<number | null>(null); // To store the selected number of days
  const [showCalendar, setShowCalendar] = useState(false);

  // Fetch data for upcoming deadlines
  const { data, isLoading, error } = useGetUpcomingDeadlinesQuery({
    selectedDays: selectedDays !== null ? selectedDays : 365,
  });

  if (error) return <ErrorPage/>;

  const deadlineData = data?.data?.projects || [];

  // Function to calculate the number of days between selected range
  const handleDateChange = (newValue: Value) => {
    setValue(newValue);

    if (Array.isArray(newValue) && newValue[0] && newValue[1]) {
      const startDate = newValue[0] as Date;
      const endDate = newValue[1] as Date;

      // Calculate the difference in days between start and end date
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
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
          <h4 className="text-lg font-semibold">Upcoming Deadline</h4>
        </div>

        {/* View Calendar Button */}
        {/* {deadlineData.length !== 0 && ( */}
          <ViewCalender
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
            onChange={handleDateChange} // Pass the handleDateChange to get the selected range
            value={value}
          />
        {/* )} */}
      </div>

      {/* Display Selected Range Days */}
      {selectedDays !== null && (
        <div className="text-center text-sm text-gray-400 mb-4">
          You have selected the date range for : {selectedDays} days
        </div>
      )}

      {/* Deadline Cards */}
      <div className="w-full">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin h-6 w-6 text-gray-600" />
          </div>
        ) : (
          deadlineData?.map((project: IUpcomingDeadlineFromBackend, i: number) => (
            <div key={i} className="pb-6">
              <UpcomingDeadlineCard deadlineData={project} />
            </div>
          ))
        )}
      </div>

      {/* View All Button */}
      <div>
        {deadlineData.length === 0 ? (
          <div className="py-6 text-center text-gray-400">Nothing is in upcoming.</div>
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

export default SmUpcomingDeadline;
