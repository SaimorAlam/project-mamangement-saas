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
import RenderStaffAvatars from "@/components/ViewerPanel/RenderStaffAvater";
import { Project } from "./AllProject";
import ProjectModal from "./ProjectModal";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(projects.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectIndividual = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((pId) => pId !== id));
    }
  };

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
      className="px-4 py-3.5 cursor-pointer"
    >
      <div className="flex items-center gap-2 text-sm">
        <SortIcon column={column} />
        <span>{label}</span>
      </div>
    </TableHead>
  );

  return (
    <Card className="shadow-none border-none">
      <CardContent className="p-0 border border-[#E2E8F0] rounded-lg min-h-[420px] overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[800px] md:min-w-full">
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-[#F7F9FA]">
                <TableHead className="w-[50px] px-4 py-3.5">
                  <Checkbox
                    checked={
                      projects.length > 0 &&
                      selectedIds.length === projects.length
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <SortableHead column="name" label="Submitted Project Name" />
                <TableHead className="px-4 py-3.5 text-sm font-medium text-gray-600">
                  Assign Staff
                </TableHead>
                <SortableHead column="status" label="Status" />
                <SortableHead column="priority" label="Priority" />
                <SortableHead column="startDate" label="Submit Date" />
                <TableHead className="px-4 py-3.5 text-sm font-medium text-gray-600">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedProjects.map((project) => (
                <TableRow
                  onClick={() => navigate(`project-details/${project.id}`)}
                  key={project.id}
                  className="border-b border-gray-200 hover:bg-muted/30 odd:bg-white even:bg-[#F7F9FA]"
                >
                  <TableCell className="px-4 py-3.5">
                    <Checkbox
                      checked={selectedIds.includes(project.id)}
                      onCheckedChange={(checked) =>
                        toggleSelectIndividual(project.id, checked as boolean)
                      }
                      aria-label={`Select ${project.name}`}
                    />
                  </TableCell>

                  <TableCell className="px-4 py-3.5 font-medium text-gray-700">
                    <span className="block truncate max-w-[180px] md:max-w-none">
                      {project.name}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    <RenderStaffAvatars
                      staff={Array.from({ length: 3 }, (_, i) => ({
                        id: i.toString(),
                        name: `Staff ${i + 1}`,
                        avatar:
                          "https://randomuser.me/api/portraits/men/19.jpg",
                      }))}
                    />
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    {renderStatusBadge(project.status)}
                  </TableCell>

                  <TableCell className="px-4 py-3.5">
                    {renderPriority(project.priority)}
                  </TableCell>

                  <TableCell className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">
                    {formatDate(project.startDate)}
                  </TableCell>

                  <TableCell className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedProject(project);
                          navigate(
                            `/client-panel/project-review/project-details/${project.id}`,
                          );
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4 text-[#3B82F6]" />
                      </Button>

                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4 text-[#10B981]" />
                      </Button>

                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4 text-[#EF4444]" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {openProjectModal && (
        <ProjectModal
          project={selectedProject as Project}
          open={openProjectModal}
          setOpen={setOpenProjectModal}
        />
      )}
    </Card>
  );
};

export default AllProjectTable;
