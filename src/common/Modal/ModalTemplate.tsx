import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";

interface AppDialogProps {
  triggerButton: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const AppDialog = ({
  triggerButton,
  title,
  description,
  children,
  footer,
}: AppDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <button className="bg-[#262f30] hover:bg-[#303b3c] text-white font-medium px-4 py-2 rounded-md border border-white/10"> */}
          {triggerButton}
        {/* </button> */}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            {title}
          </DialogTitle>

          {description && (
            <div className="text-xs text-gray-700">
              {description}
            </div>
          )}
        </DialogHeader>

        {/* Main Content */}
        <div className="py-2">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;
