import { useState, useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  useVerifyEmailMutation,
  useVerifyPhoneMutation,
  useVerificationTypeMutation,
} from "@/store/Api/AuthApi/VerificationApi";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUser } from "@/store/Slices/AuthSlice/authSlice";

const Role = {
  VIEWER: "viewer-panel",
  EMPLOYEE: "employee",
  SUPPORTER: "supporter",
  MANAGER: "staff-manager-panel",
  ADMIN: "admin",
  CLIENT: "client-panel",
  SUPERADMIN: "superadmin",
};

const EmailCode = () => {
  const { state } = useLocation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [verifyPhone] = useVerifyPhoneMutation();
  const [verificationTypeApi] = useVerificationTypeMutation();

  const type = state?.type;
  const value = state?.value;

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [code, setCode] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(6000); // 10 minutes
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Timer logic
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  if (!type) return <Navigate to="/login" />;

  // Handle typing in inputs
  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // only last digit
    setCode(newCode);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = code.join("");
    if (enteredCode.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }
    const toastId = toast.loading("Verifying code...");
    try {
      let res;
      if (type === "email") {
        res = await verifyEmail({ email: value, otp: enteredCode }).unwrap();
      } else if (type === "phone") {
        res = await verifyPhone({ phone: value, otp: enteredCode }).unwrap();
      }
      if (res.success) {
        dispatch(setUser(res?.data));
        const { role } = jwtDecode<{ role: keyof typeof Role }>(
          res.data.accessToken,
        );
        if (Role[role]) {
          navigate(`/${Role[role]}`);
        }
        toast.success("Code verified successfully", { id: toastId });
      }
    } catch {
      toast.error("Failed to verify code", { id: toastId });
      navigate("/login");
    }
  };

  const handleResend = async () => {
    if (!type || !value) return;
    setTimer(600);
    setCanResend(false);
    const toastId = toast.loading("Resending code...");
    try {
      const res = await verificationTypeApi(type).unwrap();
      if (res.success) {
        toast.success(`Code resent successfully to your ${type}`, {
          id: toastId,
        });
      }
    } catch {
      toast.error("Failed to resend code", { id: toastId });
      setCanResend(true);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[40%]">
        <img src="Logo.png" alt="Logo" />
        <img className="w-full" src="login image.png" alt="" />
      </div>
      <div>
        <h2 className="text-[48px] leading-14 font-semibold text-center">
          Enter the {type} code
        </h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <ul className="flex justify-center items-center gap-4 mt-[48px]">
            {code.map((digit, i) => (
              <li
                key={i}
                className="border border-[#E2E8F0] rounded-[8px] w-[72px] h-[72px] text-center"
              >
                <input
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  className="text-[48px] font-medium text-center w-full h-full outline-none"
                />
              </li>
            ))}
          </ul>

          <p className="text-[#475569] text-center mt-4 mb-2">
            Didn’t get the code?{" "}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-[#1C73E0] underline"
              >
                Resend now
              </button>
            ) : (
              <span>Send again in {formatTimer(timer)}</span>
            )}
          </p>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="w-[70%] cursor-pointer bg-blue-500 text-center text-white p-2 rounded-md hover:bg-blue-600"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailCode;
