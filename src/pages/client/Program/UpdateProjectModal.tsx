/* eslint-disable @typescript-eslint/no-explicit-any */
import UpdateProject from "@/Layout/clientPanel/UpdateProject";

interface UpdateProjectModalProps {
  open: boolean;
  project: any;
  onClose: () => void;
}

export default function UpdateProjectModal({
  open,
  project,
  onClose,
}: UpdateProjectModalProps) {
  if (!open) return null;

  return <UpdateProject project={project} onClose={onClose} />;
}
