import { ProjectStatus, ProjectPriority } from "@/pages/client/Overview/Components/AllProgramProjects/ProjectCard";

export interface Project {
  id: string;
  programId: string;
  programName?: string;
  program?: {
    programName?: string;
  };
  name: string;
  description: string;
  dateDate: string;
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
  projectEmployees: unknown[];
  projectViewers: unknown[];
  currentRate: string;
  budget: string;
  manager:
    | {
        id: string;
        userId: string;
        user: {
          id: string;
          name: string;
          email: string;
          profileImage: string | null;
          role: string;
        };
      };
  latitude: number | null;
  longitude: number | null;

  createdAt: string;
  updatedAt: string;
}