import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import {
  useVerifyEmailMutation,
  useVerifyPhoneMutation,
} from "@/store/Api/AuthApi/VerificationApi";

const EmailCode = () => {
  const { state } = useLocation();
  const [verifyEmail] = useVerifyEmailMutation();
  const [verifyPhone] = useVerifyPhoneMutation();
  const user = useAppSelector((state) => state?.auth!.user);
  const { email, phone } = user!;
  const type = state?.type;
  const [code, setCode] = useState(["", "", "", ""]); // 4-digit code
  const [timer, setTimer] = useState(125); // in seconds
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  if (!type) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = code.join("");
    if (type === "email") {
      console.log("Submit email code:", enteredCode);
      const res = await verifyEmail({
        email,
        code: enteredCode,
      }).unwrap();
      console.log(res);
    }
    if (type === "phone") {
      console.log("Submit phone code:", enteredCode);
      const res = await verifyPhone({
        phone,
        code: enteredCode,
      }).unwrap();
      console.log(res);
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // only allow digits
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
  };

  const handleResend = () => {
    console.log("Resend code");
    setTimer(125);
    setCanResend(false);
    // Call API to resend code here
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
          <div className="mb-4">
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
                    onChange={(e) => handleChange(e.target.value, i)}
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
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
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
