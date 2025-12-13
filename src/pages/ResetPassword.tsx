import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useResetPasswordMutation } from "@/store/Api/AuthApi/AuthApi";
const forgotSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password is required"),
});

type ForgotFormInputs = z.infer<typeof forgotSchema>;

const Forgot = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ForgotFormInputs>({
    resolver: zodResolver(forgotSchema),
  });
  const [resetPassword] = useResetPasswordMutation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmit = async (data: ForgotFormInputs) => {
    try {
      const res = await resetPassword({
        token: "",
        credentials: {
          id: "",
          newPassword: data.password,
        },
      }).unwrap();
      console.log(res);
      if (res.success) {
        toast.success("Password Reset Successfully");
        navigate("/login");
      }
    } catch {
      toast.error("Password Reset Failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[40%]">
        <img className="w-full" src="login image.png" alt="" />
      </div>
      <div>
        <h2 className="text-[48px] leading-[56px] font-semibold text-center">
          Reset Password?
        </h2>
        <p className="text-[#475569] font-normal text-4 mt-[10px] mb-[48px] text-center w-[99%]">
          Please enter a new password & confirm to reset your password
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1D2028] mb-3">
              Password*
            </label>
            <div
              className={`flex items-center border ${
                errors.password ? "border-red-500" : "border-[#94A3B8]"
              } bg-[#F5F8FA] rounded-md focus:outline-none relative`}
            >
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValue("password", e.target.value);
                }}
                placeholder="Enter your password"
                className="w-full py-[14px] px-4 bg-[#F5F8FA] rounded-md focus:outline-none"
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-[8px]">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1D2028] mb-3">
              Confirm Password*
            </label>

            <div
              className={`flex items-center border ${
                errors.password ? "border-red-500" : "border-[#94A3B8]"
              } bg-[#F5F8FA] rounded-md focus:outline-none relative`}
            >
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full py-[14px] px-4 bg-[#F5F8FA] rounded-md focus:outline-none"
              />

              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 hover:text-gray-800 focus:outline-none focus:text-gray-800 transition-colors"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-[8px]">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={() =>
              toast.success("Your Password Has been rested Successfully")
            }
            className="w-full cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Forgot;
