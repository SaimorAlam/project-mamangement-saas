import AllProgramProject from "@/components/staffEmployee/AllProgramProject";
import UpcomingDeadline from "@/components/staffEmployee/Overview/UpcomingDeadline";
import LatestSubmission from "@/components/staffEmployee/Overview/LatestSubmissions";
import BoxContainer from "./../../common/BoxContainer";
import OverDueChart from "@/components/staffEmployee/Overview/OverdueChart";
import ProjectStatusChart from "@/components/staffEmployee/ProjectStatusChart";

import DashboardStats from "./../../components/staffEmployee/Overview/DashboardStats";

const StaffEmployeeOverview = () => {
  return (
    <div className="">
      {/* Icon and Home */}

      <DashboardStats />

      <div className="py-4">
        <AllProgramProject />
      </div>

      <div className="grid grid-cols-3 gap-3 ">
        <div className="space-y-8 col-span-2">
          <div className="flex items-start justify-center gap-3">
            <div className="flex items-start justify-center gap-8">
              <BoxContainer>
                <h2 className="text-xl font-semibold mb-4">
                  Top Overdue Projects
                </h2>
                <OverDueChart />
              </BoxContainer>
            </div>
            <ProjectStatusChart />
          </div>
        </div>
        <div className="space-y-8">
          <UpcomingDeadline />
        </div>
      </div>
      <div className="my-10">

          <LatestSubmission />
      </div>
    </div>
  );
};
export default StaffEmployeeOverview;
