import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectUploadSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  sheetCount: number;
}

const ProjectUploadSuccessModal = ({
  open,
  onOpenChange,
  projectId,
  sheetCount,
}: ProjectUploadSuccessModalProps) => {
  const navigate = useNavigate();

  const handleOpenProject = () => {
    onOpenChange(false);
    navigate(`/client-panel/project-builder/project-details/${projectId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white p-0 overflow-hidden gap-0 border-none shadow-lg rounded-2xl">
        <div className="relative p-10 flex flex-col items-center justify-center text-center">
            {/* Close button */}
            <button 
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

          <div className="w-16 h-16 bg-[#16A34A] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Check className="w-8 h-8 text-white stroke-3" />
          </div>

          <DialogTitle className="sr-only">Upload Success</DialogTitle>
          <div className="text-[#111827] font-medium text-lg mb-2">
            CSV file has been uploaded successfully.
          </div>
          <p className="text-gray-500 text-sm mb-6">
            {sheetCount} sheet{sheetCount !== 1 ? 's' : ''} parsed and added to the project.
          </p>

          <button
            onClick={handleOpenProject}
            className="text-[#2563EB] hover:text-[#1D4ED8] font-medium flex items-center gap-2 transition-colors text-base"
          >
            Open Project
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectUploadSuccessModal;
