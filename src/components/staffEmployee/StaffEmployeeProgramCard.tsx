import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flag, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../common/PrimaryButton";
import RenderStaffAvatars from "../ViewerPanel/RenderStaffAvater";

export type ProjectStatus =
  | "LIVE"
  | "RETURNED"
  | "OVERDUE"
  | "DRAFT"
  | "IN_REVIEW"
  | "SUBMITTED"
  | "PENDING";

export type ProjectPriority = "HIGH" | "MEDIUM" | "LOW";

export interface StaffEmployeeProject {
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
  viewerId: string;

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

interface StaffEmployeeProgramCardProps {
  project: StaffEmployeeProject;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const StaffEmployeeProgramCard = ({
  project,
}: StaffEmployeeProgramCardProps) => {
  const {
    id,
    name,
    description,
    priority,
    deadline,
    startDate,
    progress,
  } = project;

  const priorityColor =
    priority === "HIGH"
      ? "text-[#DA4352]"
      : priority === "MEDIUM"
      ? "text-[#F59E0B]"
      : "text-[#16A34A]";

  return (
    <Card className="w-full max-w-md bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition flex flex-col">
      <CardContent className="flex flex-col justify-between p-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 py-2 px-4">
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#069576] flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 leading-tight">
                {name}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {description || "No description"}
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="text-xs px-2 py-1 border-gray-200 text-gray-500"
          >
            Project
          </Badge>
        </div>

        {/* Assigned People */}
        <div className="py-2 px-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1">Assigned People</h3>
              {/* Kept intentionally even if data is not available */}
              <RenderStaffAvatars
                staff={Array.from({ length: 3 }, (_, i) => ({
                  id: i.toString(),
                  name: `Staff ${i + 1}`,
                  avatar:
                    "https://randomuser.me/api/portraits/men/19.jpg",
                }))}
              />
            </div>

            <div className="flex flex-col gap-y-4 text-sm py-2 px-4">
              <div>
                <p className="text-gray-500">Project start</p>
                <p className="font-medium">{formatDate(startDate)}</p>
              </div>

              <div>
                <p className="text-gray-500">Project finish</p>
                <p className="font-medium">{formatDate(deadline)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority */}
        <div className="px-4 py-2">
          <p className="text-gray-500">Priority</p>
          <div className="flex items-center gap-1">
            <Flag className={`w-4 h-4 ${priorityColor}`} />
            <span className={`text-sm font-medium ${priorityColor}`}>
              {priority}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="py-2 px-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* CTA */}
        <div className="py-2 px-4">
          <Link to={`/projects/${id}`}>
            <PrimaryButton
              title="View Project"
              type="Primary"
              className="w-full h-10"
            />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffEmployeeProgramCard;
