import { useAppSelector } from "@/hooks/useRedux";
import { MessageSquareText, Mail } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useVerificationTypeMutation } from "@/store/Api/AuthApi/VerificationApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
type VerificationType = "email" | "phone";
const TwoStepVerification = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [verificationType] = useVerificationTypeMutation();
  const { email, phone } = user!;
  const navigate = useNavigate();
  const [type, setType] = useState("email");
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = (selectedType: VerificationType) => {
    setType(selectedType);
    setValue(selectedType === "email" ? user?.email ?? "" : user?.phone ?? "");
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!value.trim()) {
      toast.error("Value is required");
      return;
    }
    const toastId = toast.loading("Sending verification code...");
    try {
      const res = await verificationType(type).unwrap();

      if (res.success && type) {
        toast.success(`Verification code sent to ${value}`, { id: toastId });
        setOpen(false);

        navigate("/emailcode", {
          state:
            type === "email"
              ? { type: "email", value }
              : { type: "phone", value },
        });
      }
    } catch {
      toast.error("Failed to send verification code", { id: toastId });
    }
  };
  return (
    <>
      <div className="flex justify-center items-start min-h-screen mt-[50px] gap-[100px]">
        <div className="w-[28%]">
          <img src="Logo.png" alt="Logo" className="pb-[100px]" />
          <h3 className="text-[48px] font-semibold mb-2.5">
            2-Step Verification
          </h3>
          <p className="text-4 text-[#475569]">
            To help keep your account safe, Theta Analyzer wants to make sure
            it’s really you trying to log in
          </p>
        </div>
        <div className="pt-[150px]">
          <h4 className="text-[18px] font-medium">
            Choose your log in process:
          </h4>
          <button onClick={() => handleOpen("phone")}>
            <div className="flex items-start mt-8 pb-4 gap-3 bg-transparent p-4 hover:bg-gray-100">
              <MessageSquareText />
              <div>
                <h5>Get verification code at {phone}</h5>
              </div>
            </div>
          </button>
          <hr className="my-2 border-[#94A3B8]" />
          <button onClick={() => handleOpen("email")}>
            <div className="flex items-start gap-3 p-4 bg-transparent hover:bg-gray-100">
              <Mail />
              <div>
                <h5>Get verification code at {email}</h5>
              </div>
            </div>
          </button>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {type === "email"
                ? "Verify e-mail address"
                : "Verify phone number"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder={type === "email" ? "Enter e-mail" : "Enter phone"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="default" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSubmit}>
              Send Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TwoStepVerification;
