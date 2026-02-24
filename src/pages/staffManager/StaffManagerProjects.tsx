import AllProgramProject from "@/components/staffManager/overview/AllProgramProject";
import ProjectLocationsMap from "@/components/staffManager/Projects/ProjectLocationsMap";
import ProjectStats from "@/components/staffManager/Projects/ProjectStats";
import { useGetProgramAllProjectsQuery } from "@/store/Api/staffManagerApi/StaffManagerApi";
import { useSelector } from "react-redux";

const StaffManagerProjects = () => {
  const managerId = useSelector((state: any) => state.auth.user?.userId);
  
    const { data } = useGetProgramAllProjectsQuery({
      managerId});
      console.log("data fetched are: ",data);
      
  return (
    <div className="flex flex-col gap-4 xl:gap-8">
      <ProjectStats/>
  <AllProgramProject showSearch={true} showViewAll={false} title="All Projects" />
  {/* <ProjectLocationsMap allFilteredProjects={sortedProjects} /> */}
  <ProjectLocationsMap allFilteredProjects={data?.data?.projects?.data || []} />
    </div>
  );
};

export default StaffManagerProjects;
