/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetAllProgramQuery } from "@/store/Api/ProgramApi/ProgramApi";


const useGetAllProgram = () => {
    const { data, isLoading, error } = useGetAllProgramQuery({});
    const programs = data?.data?.data?.map((item: any) => ({
        id: item.id,
        name: item.programName,
    }));
    return {
        programs,
        isLoading,
        error
    }
};

export default useGetAllProgram;
