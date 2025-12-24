import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flag, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../common/PrimaryButton";

export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type ProjectStatus =
  | "LIVE"
  | "RETURNED"
  | "OVERDUE"
  | "DRAFT"
  | "IN_REVIEW"
  | "SUBMITTED"
  | "PENDING";

export type ProjectPriority = "HIGH" | "MEDIUM" | "LOW";

export interface Project {
  id: string;
  programId: string;

  name: string;
  description: string;

  status: ProjectStatus;
  priority: ProjectPriority;

  startDate: string;
  deadline: string;

  progress: number;

  managerId: string;

  chartList: unknown[];

  estimatedCompletedDate: string;
  projectCompleteDate: string | null;

  currentRate: string;
  budget: string;

  latitude: number | null;
  longitude: number | null;

  createdAt: string;
  updatedAt: string;
}

interface Program {
  id: string;
  programName: string;
  programDescription: string;
  priority: Priority;
  deadline: string;
  progress: number;
  projects: Project[];
}

interface StaffEmployeeProgramCardProps {
  program: Program;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const StaffEmployeeProgramCard = ({
  program,
}: StaffEmployeeProgramCardProps) => {
  const { id, programName, priority, deadline, progress, projects } = program;

  const priorityColor =
    priority === "HIGH"
      ? "text-[#DA4352]"
      : priority === "MEDIUM"
      ? "text-[#F59E0B]"
      : "text-[#16A34A]";

  const statusCount = projects?.reduce<Record<ProjectStatus, number>>(
    (acc, project) => {
      acc[project?.status] = (acc[project?.status] || 0) + 1;
      return acc;
    },
    {} as Record<ProjectStatus, number>
  );

  return (
    <Card className="w-full max-w-md bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition h-[400px] flex flex-col">
      <CardContent className="p-6 space-y-5 flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#069576] flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 leading-tight">
                {programName}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {projects?.length > 0 ? projects[0]?.name : "No projects"}
              </p>
            </div>
          </div>

          <Badge variant="outline" className="text-xs px-2 py-1">
            {projects?.length} Projects
          </Badge>
        </div>

        {/* Meta */}
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-gray-500">Deadline</p>
            <p className="font-medium">{formatDate(deadline)}</p>
          </div>

          <div>
            <p className="text-gray-500">Priority</p>
            <div className="flex items-center gap-1">
              <Flag className={`w-4 h-4 ${priorityColor}`} />
              <span className={`font-medium ${priorityColor}`}>{priority}</span>
            </div>
          </div>
        </div>

        {/* Project Status Summary */}
        <div className="flex flex-wrap gap-2 overflow-auto max-h-[60px]">
          {statusCount &&
            Object?.entries(statusCount)?.map(([status, count]) => (
              <Badge key={status} variant="secondary" className="text-xs">
                {status.replace("_", " ")} · {count}
              </Badge>
            ))}
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* CTA */}
        <Link to={`/programs/${id}`}>
          <PrimaryButton
            title="View Program"
            type="Primary"
            className="w-full h-10"
          />
        </Link>
      </CardContent>
    </Card>
  );
};

export default StaffEmployeeProgramCard;
