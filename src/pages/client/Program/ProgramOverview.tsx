import HighwayMap from "@/components/client/AllHighway/HighwayMap";
import HighwayStats from "@/components/client/AllHighway/HighwayStats";
import ProgramManager from "@/components/client/AllHighway/ProgramManage";
import { useParams } from "react-router-dom";
import {
  useGetProgramByIdQuery,
  // useGetProjectsByProgramIdQuery,
} from "@/store/Api/ProgramApi/ProgramApi";
import AllProject from "./AllProject";

const ProgramOverview = () => {
  const { id } = useParams();
  const { data: program } = useGetProgramByIdQuery(id);
  // const { data: allProjects } = useGetProjectsByProgramIdQuery({
  //   programId: id,
  // });
  // console.log(allProjects?.data);
  return (
    <div className="">
      <h1 className="text-2xl font-semibold my-6">
        {program?.data?.programName}
      </h1>
      <div>
        <HighwayStats />
        <div className="flex items-baseline gap-6">
          <AllProject title="All Project" programId={id as string} />
          <ProgramManager />
        </div>
        <HighwayMap />
      </div>
    </div>
  );
};

export default ProgramOverview;
