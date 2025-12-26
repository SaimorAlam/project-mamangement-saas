import { Edit, Eye, Flag, Trash2, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

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
import { Dialog, DialogContent } from "@/components/ui/dialog";
import RenderStaffAvatars from "@/components/ViewerPanel/RenderStaffAvater";
import { Progress } from "@/components/ui/progress";
import { Project } from "./AllProject";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type SortKey =
  | "programName"
  | "name"
  | "status"
  | "priority"
  | "startDate"
  | "deadline"
  | "progress";

type SortOrder = "asc" | "desc";

/* -------------------------------------------------------------------------- */
/*                                   UTILS                                    */
/* -------------------------------------------------------------------------- */

const statusStyles: Record<Project["status"], string> = {
  LIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  SUBMITTED: "bg-blue-50 text-blue-700 border-blue-200",
  IN_REVIEW: "bg-indigo-50 text-indigo-700 border-indigo-200",
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  RETURNED: "bg-orange-50 text-orange-700 border-orange-200",
  OVERDUE: "bg-red-50 text-red-700 border-red-200",
  DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
};

const renderStatusBadge = (status: Project["status"]) => (
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

const priorityColors: Record<Project["priority"], string> = {
  HIGH: "text-red-600",
  MEDIUM: "text-orange-600",
  LOW: "text-blue-600",
};

const renderPriority = (priority: Project["priority"]) => (
  <div className="flex items-center gap-1">
    <Flag className={`w-4 h-4 ${priorityColors[priority]}`} />
    <span className={`text-sm font-medium ${priorityColors[priority]}`}>
      {priority}
    </span>
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               COMPONENT                                    */
/* -------------------------------------------------------------------------- */

const AllProjectTable = ({ projects }: { projects: Project[] }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [open, setOpen] = useState(false);

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedProjects = useMemo(() => {
    if (!sortKey) return projects;

    return [...projects].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (!aVal || !bVal) return 0;

      if (typeof aVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(String(bVal))
          : String(bVal).localeCompare(aVal);
      }

      return sortOrder === "asc"
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal);
    });
  }, [projects, sortKey, sortOrder]);

  const SortIcon = ({ column }: { column: SortKey }) => (
    <ArrowUpDown
      className={`w-4 h-4 ${
        sortKey === column ? "text-gray-900" : "text-gray-400"
      }`}
    />
  );

  const SortableHead = ({
    column,
    label,
  }: {
    column: SortKey;
    label: string;
  }) => (
    <TableHead
      onClick={() => handleSort(column)}
      className="px-6 py-3.5 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <SortIcon column={column} />
        <span>{label}</span>
      </div>
    </TableHead>
  );

  return (
    <Card className="w-full shadow-none border-none">
      <CardContent className="p-0 border border-[#E2E8F0] rounded-lg w-full min-h-[420px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-[#F7F9FA]">
              {/* <SortableHead column="programName" label="Program" /> */}
              <SortableHead column="name" label="Project" />
              <SortableHead column="status" label="Status" />
              <TableHead className="px-6 py-3.5">Assigned People</TableHead>
              <SortableHead column="priority" label="Priority" />
              <SortableHead column="startDate" label="Started On" />
              <SortableHead column="deadline" label="Deadline" />
              <SortableHead column="progress" label="Progress" />
              <TableHead className="px-6 py-3.5">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {sortedProjects.map((project) => (
              <TableRow
                key={project.id}
                className="border-b border-gray-200 hover:bg-muted/30 odd:bg-white even:bg-[#F7F9FA]"
              >
                {/* <TableCell className="px-6 py-3.5 font-medium">
                  {project.programName || "Program Name"}
                </TableCell> */}

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
                      avatar: "https://randomuser.me/api/portraits/men/19.jpg",
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

                <TableCell className="px-6 py-3.5 flex items-center gap-2">
                  <Progress value={project.progress} className="h-2" />
                  <span className="font-medium">{project.progress}%</span>
                </TableCell>

                <TableCell className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedProject(project);
                        setOpen(true);
                      }}
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

      {selectedProject && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent />
        </Dialog>
      )}
    </Card>
  );
};

export default AllProjectTable;
