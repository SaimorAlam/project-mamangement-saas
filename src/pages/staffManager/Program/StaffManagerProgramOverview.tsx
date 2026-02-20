import HighwayMap from "@/components/client/AllHighway/HighwayMap";
import HighwayStats from "@/components/client/AllHighway/HighwayStats";
import ProgramManager from "@/components/client/AllHighway/ProgramManage";
import { useParams } from "react-router-dom";
import { useGetProgramByIdQuery } from "@/store/Api/ProgramApi/ProgramApi";
import StaffManagerAllProject from "./StaffManagerAllProject";

const StaffManagerProgramOverview = () => {
    const { id } = useParams();
    const { data: program } = useGetProgramByIdQuery(id);

    return (
        <div className="">
            <h1 className="text-2xl font-semibold my-6">
                {program?.data?.programName}
            </h1>
            <div>
                <HighwayStats />
                <div className="flex items-baseline gap-6">
                    <StaffManagerAllProject title="All Project" programId={id as string} />
                    <ProgramManager managerId={program?.data?.managerId} />
                </div>
                <div className="z-0!">
                    <HighwayMap />
                </div>
            </div>
        </div>
    );
};

export default StaffManagerProgramOverview;
