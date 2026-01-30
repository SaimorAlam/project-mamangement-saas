import { Edit, Eye, Flag, Trash2, ArrowDownUp } from "lucide-react";
import { useState, useMemo } from "react";

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
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import RenderStaffAvatars from "@/components/client/RenderStaffAvater";
import { Progress } from "@/components/ui/progress";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

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
  program?: {
    programName?: string;
  };
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  deadline: string;
  progress: number;
}

interface AllProgramTableProps {
  projects: StaffEmployeeProject[];
  isLoading?: boolean; // optional loading flag
}

/* -------------------------------------------------------------------------- */
/*                                   UTILS                                    */
/* -------------------------------------------------------------------------- */

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
    <span className={`text-sm font-medium ${priorityColors[priority]}`}>
      {priority}
    </span>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               MODAL                                        */
/* -------------------------------------------------------------------------- */

const ProjectModal = ({
  project,
  open,
  setOpen,
}: {
  project: StaffEmployeeProject;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl">
      <div className="px-6 py-5 border-b border-gray-200 bg-linear-to-r from-slate-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {project.name}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Project details overview
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Project ID</p>
          <p className="font-medium text-gray-900">{project.id}</p>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Status</p>
          {renderStatusBadge(project.status)}
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Deadline</p>
          <p className="font-medium text-gray-900">
            {formatDate(project.deadline)}
          </p>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Priority</p>
          {renderPriority(project.priority)}
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Progress</p>
          <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="mt-1 text-sm font-medium">{project.progress}%</p>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Description</p>
          <p className="leading-relaxed">
            {project.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-slate-50 flex justify-end gap-2">
        <Button variant="outline" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

/* -------------------------------------------------------------------------- */
/*                               TABLE                                        */
/* -------------------------------------------------------------------------- */

type SortField =
  | "programName"
  | "name"
  | "status"
  | "priority"
  | "startDate"
  | "deadline"
  | "progress";

type SortOrder = "asc" | "desc";

const TABLE_SKELETON_ROWS = 6;

const AllProgramTable = ({
  projects,
  isLoading = false,
}: AllProgramTableProps) => {
  const [selectedProject, setSelectedProject] =
    useState<StaffEmployeeProject | null>(null);
  const [open, setOpen] = useState(false);

  const [sortBy, setSortBy] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleViewProject = (project: StaffEmployeeProject) => {
    setSelectedProject(project);
    setOpen(true);
  };

  /* ---------- sorting ---------- */
  const sortedProjects = useMemo(() => {
    const list = [...projects];
    list.sort((a, b) => {
      let aValue: string | number = "";
      let bValue: string | number = "";

      switch (sortBy) {
        case "programName":
          aValue = a.program?.programName || "";
          bValue = b.program?.programName || "";
          break;
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "priority":
          aValue = a.priority;
          bValue = b.priority;
          break;
        case "startDate":
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
        case "deadline":
          aValue = new Date(a.deadline).getTime();
          bValue = new Date(b.deadline).getTime();
          break;
        case "progress":
          aValue = a.progress;
          bValue = b.progress;
          break;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
    return list;
  }, [projects, sortBy, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const columns: { label: string; field?: SortField; align?: string }[] = [
    { label: "Program", field: "programName" },
    { label: "Project", field: "name" },
    { label: "Status", field: "status" },
    { label: "Assigned People" },
    { label: "Priority", field: "priority" },
    { label: "Started On", field: "startDate" },
    { label: "Deadline", field: "deadline" },
    { label: "Progress", field: "progress" },
    { label: "Action" },
  ];

  return (
    <Card className="w-full shadow-none border-none">
      <CardContent className="p-0 border border-[#E2E8F0] rounded-lg w-full min-h-[420px]">
        {projects.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-[#F7F9FA]">
                {columns.map((col) => (
                  <TableHead
                    key={col.label}
                    className={`px-6 py-3.5 ${
                      col.field ? "cursor-pointer select-none" : ""
                    } ${col.align === "center" ? "text-center" : ""} ${
                      col.align === "right" ? "text-right" : ""
                    }`}
                    onClick={
                      col.field ? () => handleSort(col.field!) : undefined
                    }
                  >
                    <div className="inline-flex items-center gap-1">
                      {col.label}
                      {col.field && (
                        <ArrowDownUp
                          className={`w-4 h-4 transition-transform duration-200 ${
                            sortBy === col.field
                              ? sortOrder === "asc"
                                ? "rotate-180"
                                : "rotate-0"
                              : "opacity-30"
                          }`}
                        />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading
                ? Array.from({ length: TABLE_SKELETON_ROWS }).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      {columns.map((_, j) => (
                        <TableCell key={j} className="px-6 py-3.5">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : sortedProjects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="border-b border-gray-200 hover:bg-muted/30 odd:bg-white even:bg-[#F7F9FA]"
                    >
                      <TableCell className="px-6 py-3.5 font-medium">
                        {project?.program?.programName || "Program Name"}
                      </TableCell>
                      <TableCell className="px-6 py-3.5 font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell className="px-6 py-3.5">
                        {renderStatusBadge(project.status)}
                      </TableCell>
                      <TableCell className="px-6 py-3.5">
                        <RenderStaffAvatars
                          staff={Array.from({ length: 3 }, (_, i) => ({
                            id: i.toString(),
                            name: `Staff ${i + 1}`,
                            avatar:
                              "https://randomuser.me/api/portraits/men/19.jpg",
                          }))}
                        />
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
                      <TableCell className="px-6 py-3.5 text-muted-foreground flex items-center gap-2">
                        <Progress value={project.progress} className="h-2" />
                        <span className="font-medium">{project.progress}%</span>
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
        ) : (
          <div className="flex items-center justify-center h-96 text-gray-500 text-xl">
            No projects found
          </div>
        )}
      </CardContent>

      {selectedProject && (
        <ProjectModal project={selectedProject} open={open} setOpen={setOpen} />
      )}
    </Card>
  );
};

export default AllProgramTable;
