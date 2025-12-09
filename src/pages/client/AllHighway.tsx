import AllHighwayProject from "@/components/client/AllHighway/AllHighwayProject";
import HighwayStats from "@/components/client/AllHighway/HighwayStats";
import HighwayMap from "@/components/client/AllHighway/HighwayMap";
import ProgramManager from "@/components/client/AllHighway/ProgramManage";

const AllHighway = () => {
  return (
    <div>
      <HighwayStats />
      <div className="flex items-baseline gap-6">
        <AllHighwayProject />
        <ProgramManager />
      </div>
      <HighwayMap />
    </div>
  );
};

export default AllHighway;
