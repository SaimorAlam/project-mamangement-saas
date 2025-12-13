import { Edit, Eye, Flag, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import RenderStaffAvatars from "./RenderStaffAvater";

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

export type StatusType =
  | "Live"
  | "Returned"
  | "Overdue"
  | "Draft"
  | "In Review"
  | "Submitted";

interface AllProgramProjectGridViewProps {
  allProgramProjectData: ProgramCardProps[];
}

const AllProgramProjectTableView: React.FC<AllProgramProjectGridViewProps> = ({
  allProgramProjectData: paginatedData,
}) => {
  const statusColors: Record<StatusType, string> = {
    Live: "bg-[#EBFFF2] text-[#169E7B] border border-[#ABEFD5]",
    Returned: "bg-[#f8f0e8] text-[#FF974B] border border-[#f9dec9]",
    Overdue: "bg-[#FDF4F5] text-[#DA4352] border border-[#F8D3D5]",
    Draft: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
    "In Review": "bg-[#FFF9ED] text-[#DB940C] border border-[#FCE38C]",
    Submitted: "bg-[#F5F2FC] text-[#8B69E2] border border-[#DFDBF9]",
  };

  const priorityColors = {
    High: "text-red-600",
    Medium: "text-orange-600",
    Low: "text-blue-600",
    Default: "text-gray-600",
  };

  const renderPriority = (priority: ProgramCardProps["priority"]) => (
    <div className="flex items-center gap-1">
      <Flag className={`w-4 h-4 ${priorityColors[priority]}`} />
      <span className={`text-sm font-medium ${priorityColors[priority]}`}>
        {priority}
      </span>
    </div>
  );

  return (
    <Card className="w-full shadow-none border-none">
      <CardContent className="p-0 border border-[#E2E8F0] rounded-lg w-full min-h-[420px]">
        <Table className="">
          <TableHeader>
            <TableRow className="border-b border-[#E2E8F0] bg-[#F7F9FA]">
              <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                Program
              </TableHead>
              <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                Project
              </TableHead>
              <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                Status
              </TableHead>
              <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                Assign Staff
              </TableHead>
              <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                Priority
              </TableHead>
              <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                Started On
              </TableHead>
              <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                Deadline
              </TableHead>
              <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                Progress
              </TableHead>
              <TableHead className="text-base font-medium text-[#1D2028] px-6 py-3.5">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                className="border-b border-[#E2E8F0] hover:bg-muted/30 transition-colors odd:bg-white even:bg-[#F7F9FA]"
              >
                <TableCell className="text-base font-medium px-6 py-3.5">
                  {item.programName}
                </TableCell>
                <TableCell className="text-base px-6 py-3.5">
                  {item.projectName}
                </TableCell>
                <TableCell className="px-6 py-3.5">
                  <Badge
                    className={`py-1.5 px-3 min-w-20  ${
                      statusColors[item.status as StatusType]
                    }`}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-3.5">
                  <RenderStaffAvatars staff={item.staffMembers} />
                </TableCell>
                <TableCell className="px-6 py-3.5">
                  {renderPriority(item.priority)}
                </TableCell>
                <TableCell className="px-6 py-3.5 text-base text-muted-foreground">
                  {item.startDate}
                </TableCell>
                <TableCell className="px-6 py-3.5 text-base text-muted-foreground">
                  {item.endDate}
                </TableCell>
                <TableCell className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <Progress
                      value={item.progress}
                      className="w-20 h-2 bg-[#E2E8F0]"
                    />
                    <span className="text-sm font-medium min-w-[3rem]">
                      {item.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4 text-[#1C73E0]" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4 text-[#169E7B]" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-[#B00020]" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AllProgramProjectTableView;
