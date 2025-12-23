import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Star, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import PrimaryButton from "../../common/PrimaryButton";

export type ProjectStatus =
  | "LIVE"
  | "RETURNED"
  | "OVERDUE"
  | "DRAFT"
  | "IN_REVIEW"
  | "SUBMITTED";

export type ProjectPriority = "HIGH" | "MEDIUM" | "LOW";

export interface ProjectType {
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
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

interface StaffEmployeeProgramCardProps {
  project: ProjectType;
}

const StaffEmployeeProgramCard = ({
  project,
}: StaffEmployeeProgramCardProps) => {
  const {
    id,
    name,
    status,
    priority,
    startDate,
    deadline,
    progress,
  } = project;

  const statusColors: Record<ProjectStatus, string> = {
    LIVE: "bg-[#EBFFF2] text-[#169E7B] border border-[#ABEFD5]",
    RETURNED: "bg-[#f8f0e8] text-[#FF974B] border border-[#f9dec9]",
    OVERDUE: "bg-[#FDF4F5] text-[#DA4352] border border-[#F8D3D5]",
    DRAFT: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
    IN_REVIEW: "bg-[#FFF9ED] text-[#DB940C] border border-[#FCE38C]",
    SUBMITTED: "bg-[#F5F2FC] text-[#8B69E2] border border-[#DFDBF9]",
  };

  const priorityColor =
    priority === "HIGH"
      ? "text-[#DA4352]"
      : priority === "MEDIUM"
      ? "text-[#F59E0B]"
      : "text-[#16A34A]";

  return (
    <Card className="w-full max-w-md bg-white shadow-sm border border-[#E2E8F0]">
      <CardContent className="px-0 py-0">
        {/* Header */}
        <div className="flex items-start justify-between px-6 border-b border-gray-200 py-5">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-[#069576] rounded-lg flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>

            <div>
              <h5 className="font-semibold text-gray-900">{name}</h5>
              <p className="text-sm text-gray-600">
                Project ID: {id.slice(0, 8)}…
              </p>
            </div>
          </div>

          <Badge className={`${statusColors[status]} px-2 text-sm`}>
            {status.replace("_", " ")}
          </Badge>
        </div>

        {/* Content */}
        <div className="space-y-4 p-6">
          {/* Dates */}
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-800">Start Date</p>
              <p className="text-base font-medium">
                {formatDate(startDate)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-800">Deadline</p>
              <p className="text-base font-medium">
                {formatDate(deadline)}
              </p>
            </div>
          </div>

          {/* Priority */}
          <div>
            <p className="text-sm text-gray-800 mb-1">Priority</p>
            <div className="flex items-center gap-1">
              <Flag className={`w-4 h-4 ${priorityColor}`} />
              <span
                className={`text-sm font-medium ${priorityColor}`}
              >
                {priority}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-sm font-medium">
                {progress}% completed
              </p>
            </div>
            <Progress value={progress} max={100} className="h-2" />
          </div>

          {/* CTA */}
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
