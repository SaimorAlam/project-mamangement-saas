import ProjectReviewStats from "@/components/client/ProjectReview/ProjectReviewStats";
import { Outlet } from "react-router-dom";

const StaffManagerProjectReview = () => {
  return (
    <>
      <ProjectReviewStats />
      <Outlet />
    </>
  );
};
export default StaffManagerProjectReview;
