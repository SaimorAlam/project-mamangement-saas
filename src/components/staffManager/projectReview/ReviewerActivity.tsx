/* eslint-disable @typescript-eslint/no-explicit-any */


import { useGetAllReviewProjectsReviewerActivityQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import { ArrowRight, Filter, List } from "lucide-react";

const ReviewerActivity = () => {
  const { data, isLoading, error } = useGetAllReviewProjectsReviewerActivityQuery({});

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border p-6 text-sm text-gray-500">
        Loading reviewer activity...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border p-6 text-sm text-red-500">
        Failed to load reviewer activity
      </div>
    );
  }

  const activities = data?.data ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <List size={22} className="text-gray-700" />
          <h3 className="text-2xl font-semibold text-[#111827]">
            Reviewer Activity
          </h3>
        </div>
        {activities.length > 0 && (
        <button className="text-gray-500 hover:bg-gray-50 p-1 rounded-md transition-colors">
          <Filter size={22} />
        </button>
        )}
      </div>

      {/* Activity List */}
      <div className="relative">
        {activities.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Not yet any reviewer activity found
          </p>
        )}

        {activities.map((item: any, index: number) => (
          <div key={index} className="relative flex gap-4 pb-8 last:pb-4">
            {/* Timeline Line & Dot */}
            <div className="flex flex-col items-center">
              <div 
                className={`w-3 h-3 rounded-full mt-1.5 z-10 ${
                  index % 2 === 0 ? "bg-[#10B981]" : "bg-[#EF4444]"
                }`} 
              />
              {/* {index !== activities.length - 1 && (
                <div className="w-[2px] bg-gray-800 h-full absolute top-4 left-[5px] -z-0" />
              )} */}
              <div className="w-[2px] bg-gray-300 h-full absolute top-4 left-[5px] -z-0" />
            </div>

            {/* Content Container */}
            <div className="flex-1">
              {/* User Header */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={item.employee.profileImage || "https://ui-avatars.com/api/?name=User"}
                  alt={item.employee.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                />
                <span className="text-lg font-medium text-gray-700">
                  {item.employee.name}
                </span>
              </div>

              {/* Status Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-[#F0FDF4] text-[#15803D] border border-[#BBF7D0] rounded-full text-sm font-medium">
                  {item.statusSummary.APPROVED} Approved
                </span>
                <span className="px-3 py-1 bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7] rounded-full text-sm font-medium">
                  {item.statusSummary.PENDING} In Review
                </span>
                <span className="px-3 py-1 bg-[#FEF2F2] text-[#B91C1C] border border-[#FEE2E2] rounded-full text-sm font-medium">
                  {item.statusSummary.REJECTED} Returned
                </span>
              </div>

              {/* Timestamp */}
              <div className="text-sm text-gray-400 font-normal">
                {/* Assuming you have a time property, otherwise placeholder used */}
                Total submissions : {item.totalSubmissions}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Footer */}
      {activities.length > 0 && (
      <button className="w-full flex items-center justify-center gap-2 pt-4 mt-2 text-[#2563EB] font-semibold text-lg hover:underline decoration-2 underline-offset-4">
        View All Activity <ArrowRight size={20} />
      </button>
      )}
    </div>
  );
};

export default ReviewerActivity;