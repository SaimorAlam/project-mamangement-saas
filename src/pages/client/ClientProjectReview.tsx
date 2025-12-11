import { Outlet } from "react-router-dom";
import ProjectReviewStats from "@/components/client/ProjectReview/ProjectReviewStats";

const ClientProjectReview = () => {
  return (
    <>
      <ProjectReviewStats />
      <Outlet />
    </>
  );
};
export default ClientProjectReview;
