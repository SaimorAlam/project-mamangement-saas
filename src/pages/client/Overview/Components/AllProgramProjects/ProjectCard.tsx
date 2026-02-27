/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flag, Layers } from "lucide-react";
import { FaStar } from "react-icons/fa6";
import { toast } from "sonner";
import RenderStaffAvatars from "@/components/client/RenderStaffAvater";
// import ProjectDetailsModal from "@/components/staffManager/overview/ProjectDetailsModal";
import {
  useAddFavoriteProjectMutation,
  useGetFavoriteProjectsQuery,
  useRemoveFavoriteProjectMutation,
} from "@/store/Api/FavoriteProjectApi/FavoriteProjectApi";
import PrimaryButton from "@/common/PrimaryButton";
import { useNavigate } from "react-router-dom";

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
  programName?: string;
  program?: {
    programName?: string;
  };
  name: string;
  description: string;
  dateDate:string;
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

interface ProjectCardProps {
  project: Project;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusStyles: Record<ProjectStatus, string> = {
  LIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
  IN_REVIEW: "bg-indigo-50 text-indigo-700 border-indigo-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  RETURNED: "bg-orange-50 text-orange-700 border-orange-200",
  OVERDUE: "bg-red-50 text-red-700 border-red-200",
  DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
};

const renderStatusBadge = (status: ProjectStatus) => (
  <Badge
    variant="outline"
    className={`text-xs px-2 py-1 font-medium ${statusStyles[status]}`}
  >
    {status.replace("_", " ")}
  </Badge>
);

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { id, name, program, priority, deadline,dateDate, progress, status } =
    project;
  const navigate = useNavigate();
  const [addFavoriteProject] = useAddFavoriteProjectMutation();
  const [removeFavoriteProject] = useRemoveFavoriteProjectMutation();
  const { data, isLoading } = useGetFavoriteProjectsQuery({});
  const FavoriteProjects = data?.data.map((item: any) => item?.projectId);
  const isFavorite = FavoriteProjects?.includes(id);
  const priorityColor =
    priority === "HIGH"
      ? "text-[#DA4352]"
      : priority === "MEDIUM"
        ? "text-[#F59E0B]"
        : "text-[#16A34A]";

  const handleAddToFavorite = async (projectId: string) => {
    let res: any;
    const toastId = toast.loading(
      isFavorite ? "Removing from favorites..." : "Adding to favorites...",
    );
    try {
      if (isFavorite) {
        res = await removeFavoriteProject(projectId).unwrap();
      } else {
        res = await addFavoriteProject(projectId).unwrap();
      }
      if (res.success) {
        toast.success(
          isFavorite
            ? "Project removed from favorites successfully"
            : "Project added to favorites successfully",
          { id: toastId },
        );
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };
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
                {program?.programName || "Program Name"}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1 flex items-center gap-x-2 cursor-pointer">
                <span
                  className="truncate max-w-32"
                  title={name || "Project Name"}
                >
                  {name || "Project Name"}
                </span>
                <button onClick={() => handleAddToFavorite(id)}>
                  {isLoading ? (
                    <FaStar className="text-gray-200 animate-pulse" size={18} />
                  ) : isFavorite ? (
                    <FaStar className="text-yellow-500" size={18} />
                  ) : (
                    <FaStar className="text-gray-500" size={18} />
                  )}
                </button>
              </p>
            </div>
          </div>

          {renderStatusBadge(status)}
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
                  avatar: "https://randomuser.me/api/portraits/men/19.jpg",
                }))}
              />
            </div>

            <div className="flex flex-col gap-y-4 text-sm py-2 px-4">
              <div>
                <p className="text-gray-500">Project start</p>
                <p className="font-medium">{formatDate(dateDate)}</p>
              </div>

              <div>
                <p className="text-gray-500">Project finish</p>
                <p className="font-medium">{deadline === null ? "-" : formatDate(deadline)}</p>
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
        <div className="py-2 space-y-4 px-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <PrimaryButton
            onClick={() =>
              navigate(`/client-panel/overview/project-details/${id}`)
            }
            title="View Project Details"
            type="Primary"
            className="w-full h-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
