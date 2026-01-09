import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, Star, Flag } from "lucide-react";

import PrimaryButton from "../../common/PrimaryButton";
import { useNavigate } from "react-router-dom";

export interface StaffMember {
  name: string;
  avatar: string;
}

export interface ProgramCardProps {
  id: string;
  programName: string;
  projectName: string;
  status: string;
  staffMembers: StaffMember[];
  startDate: string;
  endDate: string;
  priority: "High" | "Medium" | "Low";
  progress: number;
}

export interface ProjectData {
  projectData: ProgramCardProps;
}

export type StatusType =
  | "Live"
  | "Returned"
  | "Overdue"
  | "Draft"
  | "In Review"
  | "Submitted";

const ProgramCard = ({ projectData }: ProjectData) => {
  const {
    programName,
    projectName,
    status,
    staffMembers,
    startDate,
    endDate,
    priority,
    progress,
  } = projectData;

  const statusColors: Record<StatusType, string> = {
    Live: "bg-[#EBFFF2] text-[#169E7B] border border-[#ABEFD5]",
    Returned: "bg-[#f8f0e8] text-[#FF974B] border border-[#f9dec9]",
    Overdue: "bg-[#FDF4F5] text-[#DA4352] border border-[#F8D3D5]",
    Draft: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
    "In Review": "bg-[#FFF9ED] text-[#DB940C] border border-[#FCE38C]",
    Submitted: "bg-[#F5F2FC] text-[#8B69E2] border border-[#DFDBF9]",
  };

  const priorityColor =
    priority === "High"
      ? "text-[#DA4352]"
      : priority === "Medium"
      ? "text-[#F59E0B]"
      : "text-[#16A34A]";

  const visibleStaff = staffMembers.slice(0, 3);
  const extraStaffCount = staffMembers.length > 3 ? staffMembers.length - 3 : 0;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const navigate = useNavigate();
  return (
    <Card className="w-full max-w-md bg-white shadow-sm border border-[#E2E8F0]">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 bg-[#069576] rounded-lg flex items-center justify-center shrink-0">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>

            <div className="min-w-0">
              <h5 className="font-semibold text-gray-900 leading-tight line-clamp-2">
                {programName}
              </h5>
              <div className="flex items-center gap-1 truncate">
                <span className="text-sm text-gray-600 truncate">
                  {projectName}
                </span>
                <Star className="w-4 h-4 text-orange-400 fill-orange-400 shrink-0" />
              </div>
            </div>
          </div>

          <Badge
            className={`${
              statusColors[status as StatusType]
            } px-2 text-sm shrink-0`}
          >
            {status}
          </Badge>
        </div>

        {/* Body */}
        <div className="flex flex-col justify-between flex-1 p-6 pb-0! space-y-4">
          {/* Assigned Staff */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[15px] text-[#1D2028] mb-2">Assigned Staff</p>
              <div className="flex -space-x-3">
                {visibleStaff.map((member, index) => (
                  <Avatar
                    key={index}
                    className="w-10 h-10 border-2 border-[#94A3B8]"
                  >
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                ))}

                {extraStaffCount > 0 && (
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-full border-2 border-[#1C73E0] flex items-center justify-center">
                    <span className="text-base font-medium text-[#1C73E0]">
                      +{extraStaffCount}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="w-28">
              <p className="text-[15px] text-gray-800">Project Start</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(startDate)}
              </p>
            </div>
          </div>

          {/* Priority & Finish */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[15px] text-gray-800 mb-1">Priority</p>
              <div className="flex items-center gap-1">
                <Flag className={`w-4 h-4 ${priorityColor}`} />
                <span className={`text-sm font-medium ${priorityColor}`}>
                  {priority}
                </span>
              </div>
            </div>

            <div className="w-28">
              <p className="text-[15px] text-gray-800">Project Finish</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(endDate)}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm text-[#475569]">Progress</p>
              <p className="text-sm font-medium text-gray-800">
                {progress}% completed
              </p>
            </div>
            <Progress value={progress} max={100} className="h-2" />
          </div>

          {/* CTA */}

          <PrimaryButton
            onClick={() => {
              navigate("/viewer-panel/projects", {
                state: { id: projectData?.id },
              });
            }}
            title="View Project"
            type="Primary"
            className="w-full h-10"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
