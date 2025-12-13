import AllHighwayProject from "@/components/client/AllHighway/AllHighwayProject";
import HighwayMap from "@/components/client/AllHighway/HighwayMap";
import HighwayStats from "@/components/client/AllHighway/HighwayStats";
import ProgramManager from "@/components/client/AllHighway/ProgramManage";
import { useParams } from "react-router-dom";

const ProgramOverview = () => {
  const { id } = useParams();
  console.log(id);
  return (
    <div className="">
      <div>
        <HighwayStats />
        <div className="flex items-baseline gap-6">
          <AllHighwayProject />
          <ProgramManager />
        </div>
        <HighwayMap />
      </div>
    </div>
  );
};

export default ProgramOverview;
