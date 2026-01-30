import ProgressChart from "@/common/Charts/Progress";
import ProjectCostChart from "@/common/Charts/ProjectCost";

import EmployeeWorkloadChart from "@/common/Charts/WorkLoad";
import TaskStatusChart from "@/common/Charts/ProgressRingTest";
import { useParams } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";
import ClientProjectInfo from "../ClientProjectInfo";

const DashboardTab = () => {
  const { projectId } = useParams();
  const { data, isLoading } = useGetProjectByIdQuery(projectId as string);
  return (
    <div>
      <div className="flex gap-6">
        <ClientProjectInfo projectData={data?.data} isLoading={isLoading} />
        <TaskStatusChart />
        <EmployeeWorkloadChart />
      </div>
      <div className="flex gap-6 mt-6">
        <ProgressChart />
        <ProjectCostChart />
      </div>
      <div className="flex justify-end mt-6">
        <img src="/man.png" alt="Not Found" />
      </div>
    </div>
  );
};

export default DashboardTab;
