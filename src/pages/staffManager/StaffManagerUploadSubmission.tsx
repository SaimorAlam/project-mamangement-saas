import SideManager from "@/components/staffManager/Projects/SideManager";
import ProjectStats from "@/components/staffManager/Projects/ProjectStats";
import UploadProject from "@/components/staffManager/Projects/UploadProject";

const StaffManagerUploadSubmission = () => {
  return (
    <div>
      <ProjectStats />
      <div className="flex items-start gap-6">
        <UploadProject />
        <SideManager />
      </div>
    </div>
  );
};
export default StaffManagerUploadSubmission;
