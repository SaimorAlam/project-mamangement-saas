import { useLazyGetProjectsByProgramIdQuery } from "@/store/Api/ProgramApi/ProgramApi";
import { useEffect } from "react";


const useGetLazyProject = (id:string,isProgramBuilder?:boolean) => {
    const [getLazyProject,{data,isLoading,error,isFetching}] = useLazyGetProjectsByProgramIdQuery();
    useEffect(() => {
        if(!isProgramBuilder && id){
            getLazyProject({programId:id});
        }
    }, [!isProgramBuilder && id]);
    const projects = data?.data?.data?.map((item: any) => ({
        id: item.id,
        name: item.name,
    }));
    return {
        projects,
        isLoading,
        error,
        isFetching
       }
};

export default useGetLazyProject;
