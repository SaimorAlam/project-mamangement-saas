export interface IProgram {
  id: number;
  name: string;
  projects: number;
  assignManager: string[];
  priority: "High" | "Medium" | "Low";
  createdOn: string;
  updatedOn: string;
  deadline: string;
  progress: number;
}
