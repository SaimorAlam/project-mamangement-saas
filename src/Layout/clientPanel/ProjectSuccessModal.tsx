import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  projectId: string;
}

const ProjectSuccessModal = ({
  open,
  onOpenChange,
  projectName,
  projectId,
}: ProjectSuccessModalProps) => {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] rounded-xl border border-gray-200 space-y-4">
        <DialogHeader>
          <DialogTitle className="flex flex-col items-center justify-center gap-2">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <span className="text-center">
              {projectName} has been successfully created.
            </span>
          </DialogTitle>
          <DialogClose asChild>
            <Button
              onClick={() =>
                navigate("/client-panel/project-builder", {
                  state: { projectId },
                })
              }
              className="p-2 text-blue-500 cursor-pointer"
            >
              Go to Project Builder <ArrowRight className="w-4 h-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSuccessModal;
