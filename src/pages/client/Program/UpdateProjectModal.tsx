/* eslint-disable @typescript-eslint/no-explicit-any */
import CreateProject from "@/Layout/clientPanel/CreateProject/CreateProject";

interface UpdateProjectModalProps {
  open: boolean;
  project: any;
  onClose: () => void;
  onSubmit?: (data: any) => void;
}

export default function UpdateProjectModal({
  open,
  project,
  onClose,
}: UpdateProjectModalProps) {
  
  if (!open) return null;

  return <CreateProject project={project} onClose={onClose} programId={project?.programId} />;
}
