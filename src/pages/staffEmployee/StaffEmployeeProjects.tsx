import SideManager from "@/components/staffEmployee/Projects/SideManager";
import ProjectStats from "@/components/staffEmployee/Projects/ProjectStats";
import UploadProject from "@/components/staffEmployee/Projects/UploadProject";

const StaffEmployeeProjects = () => {
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
export default StaffEmployeeProjects;
