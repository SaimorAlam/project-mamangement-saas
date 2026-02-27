/* eslint-disable @typescript-eslint/no-explicit-any */
import { List } from "lucide-react";
import { Card } from "@/components/ui/card";
import BoxContainer from "../../../../common/BoxContainer";
import { useGetAllActivityLogsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import { formatDate } from "@/common/Charts/ProjectInfo";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

const ActivityLogSkeleton = () => {
  return Array.from({ length: 6 }).map((_, index) => (
    <div key={index} className="flex items-start gap-3 animate-pulse">
      <div className="relative min-h-20 flex">
        <div className="size-2.5 rounded-full bg-gray-300 shrink-0" />
        <div className="absolute inset-x-1/2 left-1 w-px h-full bg-gray-200" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
        <div className="h-3 w-48 bg-gray-200 rounded" />
      </div>
    </div>
  ));
};

const ActivityLog = () => {
  const { data, isLoading } = useGetAllActivityLogsQuery({});
  const activityData = data?.data ?? [];

  return (
    <BoxContainer>
      <Card className="bg-white border-none shadow-none rounded-lg py-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <List className="w-5 h-5" />
            <h4 className="text-lg font-semibold text-gray-900">
              Activity Log
            </h4>
          </div>
          {/* {activityData?.length > 0 && (
            <div className="border border-gray-200 p-2 rounded-lg">
              <Filter size={24} color="#CBD5E1" />
            </div>
          )} */}
        </div>

        {/* Activity Items */}
        <div className="space-y-6 py-4">
          {isLoading ? (
            <ActivityLogSkeleton />
          ) : activityData.length > 0 ? (
            activityData.slice(0, 5).map((activity: any, index: number) => (
              <div
                key={activity?.id ?? index}
                className="flex items-start gap-3"
              >
                <div className="relative min-h-20 flex">
                  <div className="size-2.5 rounded-full shrink-0 bg-green-600 z-20" />
                  <div className="absolute inset-x-1/2 left-1 w-px h-full border border-gray-200" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-end justify-between">
                    <div className="flex-1">
                      <h5 className="text-[#1D2028] capitalize">
                        {activity?.actionType ?? "-"}
                      </h5>

                      <p className="text-sm text-[#475569] mt-1">
                        {activity?.description ?? "-"}
                      </p>

                      <div className="flex flex-col mt-2 text-sm text-[#475569]">
                        {/* <span>{activity?.ipAddress ?? "-"}</span> */}
                        <span>
                          {activity?.timestamp
                            ? formatDate(activity.timestamp)
                            : "-"}
                        </span>
                      </div>
                    </div>

                    {activity?.user?.name && (
                      <span className="text-sm text-[#475569]">
                        By {activity.user.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-32 text-gray-500">
              No Data Found
            </div>
          )}
          {activityData?.length > 5 && (
            <Link
              to="/client-panel/activity-log"
              className="flex justify-center items-center gap-2 text-blue-500 cursor-pointer hover:text-blue-600 pt-4"
            >
              View full audit trail <BsArrowRight />
            </Link>
          )}
        </div>
      </Card>
    </BoxContainer>
  );
};

export default ActivityLog;
