import AllProjectReview from "@/components/staffEmployee/AllProgramProject";
import DashboardStats from "./../../components/staffEmployee/Overview/DashboardStats";

const StaffEmployeeProjectReview = () => {
  return (
    <>
      <DashboardStats />
      <div className="mt-8">
        <AllProjectReview />
      </div>
    </>
  );
};
export default StaffEmployeeProjectReview;
