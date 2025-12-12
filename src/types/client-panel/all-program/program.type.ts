export interface IProgram {
  id: string;
  userId: string;
  programName: string;
  datetime: string; // ISO date string
  programDescription: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  deadline: string; // ISO date string
  progress: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
