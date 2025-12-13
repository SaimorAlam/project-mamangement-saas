import { MessageSquareText, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

const TwoStepVerification = () => {
  return (
    <div className="flex justify-center items-start min-h-screen mt-[50px] gap-[100px]">
      <div className="w-[28%]">
        <img src="Logo.png" alt="Logo" className="pb-[100px]" />
        <h3 className="text-[48px] font-semibold mb-[10px]">
          2-Step Verification
        </h3>
        <p className="text-4 text-[#475569]">
          To help keep your account safe, Theta Analyzer wants to make sure it’s
          really you trying to log in
        </p>
      </div>
      <div className="pt-[150px]">
        <h4 className="text-[18px] font-medium">Choose your log in process:</h4>
        <NavLink
          to="/emailcode"
          onClick={() =>
            toast.success("we have sent a password reset code in your number")
          }
        >
          <div className="flex items-start mt-8 pb-4 gap-[12px] border-b-1 border-b-[#94A3B8] bg-transparent p-4 hover:bg-gray-100">
            <MessageSquareText />
            <div>
              <h5>Get verification code at ****-****47</h5>
              <p className="text-[#475569]">Write additional text here.</p>
            </div>
          </div>
        </NavLink>
        <NavLink
          to="/emailcode"
          onClick={() =>
            toast.success("we have sent a password reset code in your number")
          }
        >
          <div className="flex items-start gap-[12px] p-4 bg-transparent hover:bg-gray-100">
            <Mail />
            <div>
              <h5>Get verification code at ****-****47</h5>
              <p className="text-[#475569]">Write additional text here.</p>
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default TwoStepVerification;
