import ProgramCard from "./ProgramCard";

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
  priority: "High" | "Medium" | "Low" | string;
  progress: number;
}

interface AllProgramProjectGridViewProps {
  allProgramProjectData: ProgramCardProps[];
}

export default function ProjectGridView({
  allProgramProjectData,
}: AllProgramProjectGridViewProps) {
  return (
    <div className="grid grid-cols-4 gap-5">
      {allProgramProjectData?.map((projectData) => {
        const processedProjectData = {
          ...projectData,
          priority: projectData.priority as "High" | "Medium" | "Low",
        };

        return (
          <div className="" key={projectData.programName}>
            {/* Render a single program card */}
            <ProgramCard projectData={processedProjectData} />
          </div>
        );
      })}
    </div>
  );
}
