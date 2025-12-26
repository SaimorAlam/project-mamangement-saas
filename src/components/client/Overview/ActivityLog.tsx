/* eslint-disable @typescript-eslint/no-explicit-any */
import { List } from "lucide-react";
import { Card } from "@/components/ui/card";
import BoxContainer from "../../../common/BoxContainer";
// import PrimaryButton from "../../../common/PrimaryButton";
import { useGetAllActivityLogsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import { formatDate } from "@/common/Charts/ProjectInfo";

const ActivityLog = () => {
  const { data } = useGetAllActivityLogsQuery({});
  const activityData = data?.data;
  return (
    <BoxContainer>
      <Card className=" bg-white border-none shadow-none rounded-lg py-0!">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className=" flex gap-2 items-center">
            <List className="w-5 h-5" />
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              Activity Log
            </h4>
          </div>
          {/* <PrimaryButton
            type="Outline"
            leftIcon={<Filter className="w-5 h-5" />}
          /> */}
        </div>

        {/* Activity Items */}
        <div className="space-y-6 py-4">
          {activityData?.slice(0, 10).map((activity: any) => {
            return (
              <div className=" flex items-start gap-3">
                <div className=" relative min-h-20 flex">
                  {/* Status Indicator */}
                  <div
                    className={`size-2.5 rounded-full shrink-0 z-1 bg-green-600`}
                  />
                  <div className="absolute transform inset-x-1/2 left-1 border-1 w-px h-full border-[#CBD5E1]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-end justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="text-[#1D2028] capitalize">
                          {activity.actionType}
                        </h5>
                      </div>
                      <p className="text-sm text-[#475569] mt-1">
                        {activity.description}
                      </p>
                      <div className="flex flex-col items-start justify-between mt-2">
                        <span className="text-sm text-[#475569] ">
                          {activity.ipAddress}
                        </span>
                        <span className="text-sm text-[#475569] ">
                          {formatDate(activity.timestamp)}
                        </span>
                        {activity.metadata && (
                          <span className="text-sm text-[#475569] ">
                            {/* {activity.metadata} */}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="">
                      {activity.user && (
                        <span className="text-sm text-[#475569] ">
                          {activity?.user?.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {/* <div className="">
          <PrimaryButton
            type="Ghost"
            title={`View full audit trail ${ActivityLog.length}`}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full"
          />
        </div> */}
      </Card>
    </BoxContainer>
  );
};

export default ActivityLog;
