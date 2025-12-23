import { Edit, Eye, Flag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

export type ProjectStatus =
  | "LIVE"
  | "RETURNED"
  | "OVERDUE"
  | "DRAFT"
  | "IN_REVIEW"
  | "SUBMITTED";

export type ProjectPriority = "HIGH" | "MEDIUM" | "LOW";

export interface BackendProject {
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

interface StaffEmployeeProgramTableProps {
  projects: BackendProject[];
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const priorityColors: Record<ProjectPriority, string> = {
  HIGH: "text-red-600",
  MEDIUM: "text-orange-600",
  LOW: "text-blue-600",
};

const renderPriority = (priority: ProjectPriority) => (
  <div className="flex items-center gap-1">
    <Flag className={`w-4 h-4 ${priorityColors[priority]}`} />
    <span
      className={`text-sm font-medium ${priorityColors[priority]}`}
    >
      {priority}
    </span>
  </div>
);

const StaffEmployeeProgramTable = ({
  projects,
}: StaffEmployeeProgramTableProps) => {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] =
    useState<BackendProject | null>(null);

  const handleViewProject = (project: BackendProject) => {
    setSelectedProject(project);
    setOpen(true);
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardContent className="p-0 border border-[#E2E8F0] rounded-lg w-full min-h-[420px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-[#F7F9FA]">
              <TableHead className="px-6 py-3.5">Program</TableHead>
              <TableHead className="px-6 py-3.5">Project</TableHead>
              <TableHead className="px-6 py-3.5">Priority</TableHead>
              <TableHead className="px-6 py-3.5">
                Started On
              </TableHead>
              <TableHead className="px-6 py-3.5">Deadline</TableHead>
              <TableHead className="px-6 py-3.5">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                className="border-b border-gray-200 hover:bg-muted/30 odd:bg-white even:bg-[#F7F9FA]"
              >
                <TableCell className="px-6 py-3.5 font-medium">
                  {project.programId.slice(0, 8)}…
                </TableCell>

                <TableCell className="px-6 py-3.5">
                  {project.name}
                </TableCell>

                <TableCell className="px-6 py-3.5">
                  {renderPriority(project.priority)}
                </TableCell>

                <TableCell className="px-6 py-3.5 text-muted-foreground">
                  {formatDate(project.startDate)}
                </TableCell>

                <TableCell className="px-6 py-3.5 text-muted-foreground">
                  {formatDate(project.deadline)}
                </TableCell>

                <TableCell className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProject(project)}
                    >
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl">
          {selectedProject && (
            <>
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    {selectedProject.name}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Project details overview
                  </DialogDescription>
                </DialogHeader>

                {/* Status & Priority */}
                <div className="flex items-center gap-3 mt-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {selectedProject.status.replace("_", " ")}
                  </span>

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                    <span className="inline-flex items-center gap-1">
                      <Flag className="w-3.5 h-3.5" />
                      {selectedProject.priority}
                    </span>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-6 space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">
                      Project ID
                    </p>
                    <p className="font-medium text-gray-900 break-all">
                      {selectedProject.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">
                      Program ID
                    </p>
                    <p className="font-medium text-gray-900 break-all">
                      {selectedProject.programId}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">
                      Start Date
                    </p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedProject.startDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground mb-1">
                      Deadline
                    </p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedProject.deadline)}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-muted-foreground">
                      Progress
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedProject.progress}%
                    </p>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{
                        width: `${selectedProject.progress}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Description
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedProject.description ||
                      "No description provided."}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-slate-50 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StaffEmployeeProgramTable;
