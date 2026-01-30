import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programName: string;
  redirectPath: string;
}

export default function SuccessModal({
  open,
  onOpenChange,
  programName,
  redirectPath,
}: SuccessModalProps) {
  const navigate = useNavigate();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {/* Overlay */}
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/30 z-40" />

      {/* Modal Content */}
      <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8">
        {/* Close Button */}
        <DialogPrimitive.Close asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 h-6 w-6 p-0 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogPrimitive.Close>

        {/* Modal Body */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          <p className="text-sm text-gray-900 font-medium">
            {programName} has been successfully created.
          </p>

          <Button
            className="bg-[#1C73E0] hover:bg-blue-600 text-white h-10 px-6 flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => {
              onOpenChange(false);

              if (redirectPath === "/highway-expansion") {
                localStorage.setItem("showHighwayExpansion", "true");
              }

              navigate(redirectPath);
            }}
          >
            Open Program Builder <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  );
}
