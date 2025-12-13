import { useAppSelector } from "@/hooks/useRedux";
import { MessageSquareText, Mail } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useVerificationTypeMutation } from "@/store/Api/AuthApi/VerificationApi";

const TwoStepVerification = () => {
  const { user } = useAppSelector((state) => state.auth);
  console.log(user)
  const [verificationType] = useVerificationTypeMutation();
  const { email, phone } = user!;
  const navigate = useNavigate();
  const handleOnClick = async (type: string) => {
    if (type === "email") {
      const res = await verificationType(email as string).unwrap();
      if (res.success) {
        navigate("/emailcode", { state: { type: "email", email } });
        toast.success(`we have sent a password reset code in your ${email}`);
      }
    }
    if (type === "phone") {
      const res = await verificationType(phone as string).unwrap();
      if (res.success) {
        navigate("/emailcode", { state: { type: "phone", phone } });
        toast.success(`we have sent a password reset code in your ${phone}`);
      }
    }
  };
  return (
    <div className="flex justify-center items-start min-h-screen mt-[50px] gap-[100px]">
      <div className="w-[28%]">
        <img src="Logo.png" alt="Logo" className="pb-[100px]" />
        <h3 className="text-[48px] font-semibold mb-2.5">
          2-Step Verification
        </h3>
        <p className="text-4 text-[#475569]">
          To help keep your account safe, Theta Analyzer wants to make sure it’s
          really you trying to log in
        </p>
      </div>
      <div className="pt-[150px]">
        <h4 className="text-[18px] font-medium">Choose your log in process:</h4>
        <NavLink to="/emailcode" onClick={() => handleOnClick("phone")}>
          <div className="flex items-start mt-8 pb-4 gap-3 bg-transparent p-4 hover:bg-gray-100">
            <MessageSquareText />
            <div>
              <h5>Get verification code at {phone}</h5>
            </div>
          </div>
        </NavLink>
        <hr className="my-2 border-[#94A3B8]" />
        <button onClick={() => handleOnClick("email")}>
          <div className="flex items-start gap-3 p-4 bg-transparent hover:bg-gray-100">
            <Mail />
            <div>
              <h5>Get verification code at {email}</h5>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TwoStepVerification;
