import AllProjectReview from "@/components/staffEmployee/AllProgramProject";
import ProjectReviewStats from "@/components/client/ProjectReview/ProjectReviewStats";

const StaffEmployeeProjectReview = () => {
  return (
    <>
      <ProjectReviewStats />
      <div className="mt-8">
        <AllProjectReview />
      </div>
    </>
  );
};
export default StaffEmployeeProjectReview;
