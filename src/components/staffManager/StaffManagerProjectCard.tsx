import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Flag, Layers } from "lucide-react";
import RenderStaffAvatars from "../ViewerPanel/RenderStaffAvater";
import { FaStar } from "react-icons/fa6";
import ProjectDetailsModal from "./overview/ProjectDetailsModal";
import { useAddToFavouriteProjectMutation } from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";
import { toast } from "sonner";

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

  programName?: string;
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

const StaffManagerProjectCard = ({
  project,
}: StaffEmployeeProgramCardProps) => {
  const {
    id,
    name,
    programName,
    priority,
    deadline,
    startDate,
    progress,
    status,
  } = project;

  const [addToFavouriteProject] = useAddToFavouriteProjectMutation();

  const priorityColor =
    priority === "HIGH"
      ? "text-[#DA4352]"
      : priority === "MEDIUM"
      ? "text-[#F59E0B]"
      : "text-[#16A34A]";

  const handleAddToFavourite = async (projectId: string) => {
    try {
      const res = await addToFavouriteProject(projectId);

      // Handle error response
      if ("error" in res) {
        const errorData = res.error as any;
        const errorMessage =
          errorData?.data?.message ||
          errorData?.message ||
          "Failed to add project to favorites";

        toast.error(errorMessage);
        return;
      }

      // Handle success response
      if ("data" in res) {
        const successData = res.data as any;

        if (successData?.success === false) {
          const errorMessage =
            successData?.message ||
            "Failed to add project to favorites";
          toast.error(errorMessage);
          return;
        }

        toast.success("Project added to favorites successfully");
        return;
      }

      toast.error("Unexpected response from server");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
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
                {programName || "Program Name"}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1 flex items-center gap-x-2">
                <span>{name || "Project Name"}</span>{" "}
                <button onClick={() => handleAddToFavourite(id)}>
                  <FaStar className="text-yellow-500" size={18} />
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
          <ProjectDetailsModal project={project} />
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffManagerProjectCard;
