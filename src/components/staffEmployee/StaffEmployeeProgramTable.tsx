import { Edit, Eye, Flag, Trash2, Layers } from "lucide-react";
import { useState } from "react";
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

// Types
export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface Project {
  id: string;
  programId: string;
  name: string;
  description: string;
  status: string;
  priority: Priority;
  startDate: string;
  deadline: string;
  progress: number;
  managerId: string;
}

export interface Program {
  id: string;
  programName: string;
  programDescription: string;
  priority: Priority;
  deadline: string;
  progress: number;
  projects: Project[];
}

interface ProgramTableProps {
  programs: Program[];
}

// Utils
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const priorityColors: Record<Priority, string> = {
  HIGH: "text-red-600",
  MEDIUM: "text-orange-600",
  LOW: "text-blue-600",
};

const renderPriority = (priority: Priority) => (
  <div className="flex items-center gap-1">
    <Flag className={`w-4 h-4 ${priorityColors[priority]}`} />
    <span
      className={`text-sm font-medium ${priorityColors[priority]}`}
    >
      {priority}
    </span>
  </div>
);

// Modal for viewing program details
const ProgramModal = ({
  program,
  open,
  setOpen,
}: {
  program: Program;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl">
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {program.programName}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Program details overview
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="px-6 py-6 space-y-6">
        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Program ID</p>
          <p className="font-medium text-gray-900">{program.id}</p>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Deadline</p>
          <p className="font-medium text-gray-900">
            {formatDate(program.deadline)}
          </p>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Priority</p>
          {renderPriority(program.priority)}
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Progress</p>
          <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              style={{ width: `${program.progress}%` }}
            />
          </div>
          <p className="mt-1 text-sm font-medium">
            {program.progress}%
          </p>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Description</p>
          <p className="leading-relaxed">
            {program.programDescription || "No description provided."}
          </p>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Projects</p>
          <ul className="list-disc pl-5 space-y-1">
            {program.projects.map((proj) => (
              <li key={proj.id}>
                {proj.name} ({proj.status}, {proj.priority})
              </li>
            ))}
          </ul>
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

// Table Component
const StaffEmployeeProgramTable = ({
  programs,
}: ProgramTableProps) => {
  const [selectedProgram, setSelectedProgram] =
    useState<Program | null>(null);
  const [open, setOpen] = useState(false);

  const handleViewProgram = (program: Program) => {
    setSelectedProgram(program);
    setOpen(true);
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardContent className="p-0 border border-[#E2E8F0] rounded-lg w-full min-h-[420px]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-[#F7F9FA]">
              <TableHead className="px-6 py-3.5">Program</TableHead>
              <TableHead className="px-6 py-3.5">Priority</TableHead>
              <TableHead className="px-6 py-3.5">Deadline</TableHead>
              <TableHead className="px-6 py-3.5">Projects</TableHead>
              <TableHead className="px-6 py-3.5">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {programs.map((program) => (
              <TableRow
                key={program.id}
                className="border-b border-gray-200 hover:bg-muted/30 odd:bg-white even:bg-[#F7F9FA]"
              >
                <TableCell className="px-6 py-3.5 font-medium">
                  {program.programName}
                </TableCell>

                <TableCell className="px-6 py-3.5">
                  {renderPriority(program.priority)}
                </TableCell>

                <TableCell className="px-6 py-3.5 text-muted-foreground">
                  {formatDate(program.deadline)}
                </TableCell>

                <TableCell className="px-6 py-3.5">
                  {program.projects.length}
                </TableCell>

                <TableCell className="px-6 py-3.5">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProgram(program)}
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

      {selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          open={open}
          setOpen={setOpen}
        />
      )}
    </Card>
  );
};

export default StaffEmployeeProgramTable;
