import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Forgot = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
      });
    
      const navigate = useNavigate();
    
      const onSubmit = (data: LoginFormInputs) => {
        console.log("Login Data:", data);
        navigate("/");
      };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[40%]">
        <img className="w-full" src="login image.png" alt="" />
      </div>
      <div>
        <h2 className="text-[48px] leading-[56px] font-semibold text-center">Forgot Password?</h2>
        <p className="text-[#475569] font-normal text-4 mt-[10px] mb-[48px] text-center">Enter your email and we’ll send you a password reset link.</p>
        <form className="mt-4">
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1D2028] mb-3">
              Email*
            </label>
            
            <div className="flex items-center border border-[#94A3B8] bg-[#F5F8FA] rounded-md focus:outline-none">
              <Mail className="ml-[17px] w-[5%]"/>
                <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="w-full py-[14px] px-2  bg-[#F5F8FA] rounded-md focus:outline-none"
              />

            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Send Reset Password Link
          </button>
        </form>
      </div>
    </div>
  )
}

export default Forgot