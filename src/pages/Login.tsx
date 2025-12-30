import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Mail, CircleAlert } from "lucide-react";
import { useLoginMutation } from "@/store/Api/AuthApi/AuthApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUser } from "@/store/Slices/AuthSlice/authSlice";
import { jwtDecode } from "jwt-decode";

const Role = {
  VIEWER: "viewer-panel",
  EMPLOYEE: "staff-employee-panel", // todo: change to employee-panel when ready
  SUPPORTER: "supporter",
  MANAGER: "staff-manager-panel",
  ADMIN: "admin",
  CLIENT: "client-panel",
  SUPERADMIN: "admin",
};
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "mdkazinaim0018@gmail.com",
      password: "123456789",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormInputs) => {
    const toastId = toast.loading("Logging in...");
    try {
      const res = await login(data).unwrap();
      if (res.success) {
        dispatch(setUser(res?.data));
        toast.success("Logged in successfully", { id: toastId });
        if (res.data.specialToken) {
          navigate("/verification");
        } else {
          const { role } = jwtDecode<{ role: keyof typeof Role }>(
            res.data.accessToken
          );
          if (Role[role]) {
            navigate(`/${Role[role]}`);
          }
        }
      }
    } catch {
      toast.error("Login Failed", { id: toastId });
    }
  };

  const [password, setPassword] = useState("123456789");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[40%]">
        <img src="Logo.png" alt="logo" />
        <img className="w-full" src="login image.png" alt="login-Image" />
      </div>
      <div>
        <h2 className="text-[48px] leading-[56px] font-semibold text-center">
          Welcome back
        </h2>
        <p className="text-[#475569] font-normal text-4 mt-[10px] text-center">
          Enter your email and password to access your account
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-[48px]">
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1D2028] mb-3">
              Email*
            </label>

            <div
              className={`flex items-center border ${
                errors.password ? "border-red-500" : "border-[#94A3B8]"
              } bg-[#F5F8FA] rounded-md focus:outline-none relative`}
            >
              <Mail className="ml-[17px] w-[5%]" />
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full py-[14px] px-2  bg-[#F5F8FA] rounded-md focus:outline-none"
              />
              {errors.password ? (
                <CircleAlert className="mr-[17px] text-red-500" />
              ) : (
                ""
              )}
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-[8px]">
                {errors.email.message}
              </p>
            )}
          </div>

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
                {...register("password")}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Enter your password"
                className="w-full py-[14px] px-4  bg-[#F5F8FA] rounded-md focus:outline-none"
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

            <div className="flex gap-4 items-baseline my-6 justify-between">
              <input
                type="checkbox"
                name="policy"
                id="policy"
                className="text-[#D0D5DD] rounded-3xl cursor-pointer"
              />
              <p className="text-[#0F1325] w-[90%]">Remember me</p>
              <NavLink
                to="/forgot"
                className="font-medium text-[#0151FF] w-[60%] cursor-pointer"
              >
                Forgot Password?
              </NavLink>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>

          <NavLink to="/signup">
            <div className="text-center mt-6">
              <h3 className="font-normal text-[#0151FF]">
                Create a new account
              </h3>
            </div>
          </NavLink>
        </form>
      </div>
    </div>
  );
};

export default Login;
