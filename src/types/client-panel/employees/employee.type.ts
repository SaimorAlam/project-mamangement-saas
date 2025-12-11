export interface IEmployee {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string; // optional, only used when creating
  skills: string[];
  description: string;
  joinedDate: string; // ISO date string
  projects: string[]; // array of project IDs
  sendWelcomeEmail: boolean;
  notifyProjectManager: boolean;
  role: "Viewer" | "Staff" | "Manager";
  level: "Active" | "In Active";
  id?: string; // optional unique identifier for existing employees
}
