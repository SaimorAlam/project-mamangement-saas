import { useLazyGetProjectsByProgramIdQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { useEffect } from "react";


const useGetLazyProject = (id:string) => {
    const [getLazyProject,{data,isLoading,error}] = useLazyGetProjectsByProgramIdQuery();
    useEffect(() => {
        if(id){
            getLazyProject({programId:id});
        }
    }, [id]);
    const projects = data?.data?.data?.map((item: any) => ({
        id: item.id,
        name: item.name,
    }));
    return {
        projects,
        isLoading,
        error
       }
};

export default useGetLazyProject;
