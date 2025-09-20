import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, CircleAlert  } from 'lucide-react';


const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password is required"),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const Signup = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();


  const onSubmit = (data: SignupFormInputs) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    console.log("Signup Data:", Object.fromEntries(formData));
    navigate("/login");
  };


  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[40%]">
        <img src="Logo.png" alt="" />
        <img className="w-full" src="signup image.png" alt="" />
      </div>
      <div>
        <h2 className="text-[48px] leading-[56px] font-semibold">Create your account</h2>
        <p className="text-[#475569] font-normal text-4 mt-[10px] text-center">Enter your email and password to create your account</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-[48px]">
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1D2028] mb-3">
              Email*
            </label>

            <div className={`flex items-center border ${errors.password ? "border-red-500" : "border-[#94A3B8]"} bg-[#F5F8FA] rounded-md focus:outline-none relative`}>
              <Mail className="ml-[17px] w-[5%]" />
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full py-[14px] px-2  bg-[#F5F8FA] rounded-md focus:outline-none"
              />
              {errors.password 
              ?
              <CircleAlert className="mr-[17px] text-red-500"/>
              :
              ""
              }
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-[8px]">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1D2028] mb-3">
              Password*
            </label>
            <div className={`flex items-center border ${errors.password ? "border-red-500" : "border-[#94A3B8]"} bg-[#F5F8FA] rounded-md focus:outline-none relative`}>
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-[8px]">{errors.password.message}</p>
            )}
          </div>
          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1D2028] mb-3">
              Confirm Password*
            </label>

            <div className={`flex items-center border ${errors.password ? "border-red-500" : "border-[#94A3B8]"} bg-[#F5F8FA] rounded-md focus:outline-none relative`}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
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
                aria-label={showConfirmPassword  ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword  ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-[8px]">{errors.confirmPassword.message}</p>
            )}

            {/* Privacy policy */}

            <div className="flex items-start gap-2 my-6 w-[90%]">
              <input type="checkbox" className="bg-gray-100 rounded-2xl w-5 h-5 cursor-pointer"/>
              <div>
                I agree to Theta Analyzer <span className="text-blue-500 underline cursor-pointer">Licence Agreement</span> and <span className="text-blue-500 underline cursor-pointer">Privacy policy</span>
              </div>
            </div>
          </div>

          <button
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer"
          >
            Register Now
          </button>
          <div className="text-center mt-6">
            <div>
              <NavLink to="/login" className="font-medium text-[#0151FF]">
                  Log In Now
              </NavLink>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
