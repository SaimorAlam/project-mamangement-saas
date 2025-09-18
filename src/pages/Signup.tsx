import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CiSquarePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
// import { BadgeQuestionMark } from 'lucide-react';
import { Mail } from 'lucide-react';


const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z
    .any()
    .refine((file) => file, "Image is required")
    .optional(),
});

type SignupFormInputs = z.infer<typeof signupSchema>;

const Signup = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormInputs>({
    resolver: zodResolver(signupSchema),
  });

  const navigate = useNavigate();

  const onSubmit = (data: SignupFormInputs) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (selectedFile) formData.append("image", selectedFile);

    console.log("Signup Data:", Object.fromEntries(formData));
    navigate("/login");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
      setValue("image", file, { shouldValidate: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div>
        <img src="signup.webp" alt="" />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-[48px] leading-[56px] font-semibold">Create your account</h2>
        <p className="text-[#475569] font-normal text-4 mt-[10px] text-center">Enter your email and password to create your account</p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-[48px]">
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
              {/* <BadgeQuestionMark /> */}
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1D2028] mb-3">
              Password*
            </label>
            <div className="flex items-center border border-[#94A3B8] bg-[#F5F8FA] rounded-md focus:outline-none">
              <input
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="w-full py-[14px] px-4  bg-[#F5F8FA] rounded-md focus:outline-none"
            />
            </div>
            
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          {/* Confirm Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#1D2028] mb-3">
              Confirm Password*
            </label>

            <div className="flex items-center border border-[#94A3B8] bg-[#F5F8FA] rounded-md focus:outline-none">
              <input
              type="password"
              {...register("password")}
              placeholder="Confirm your password"
              className="w-full py-[14px] px-4  bg-[#F5F8FA] rounded-md focus:outline-none"
            />
            </div>
            
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <div className="flex gap-4 items-baseline my-6">
              <input type="checkbox" name="policy" id="policy" className="text-[#D0D5DD] rounded-3xl cursor-pointer"/>
              <p className="text-[#0F1325] w-[90%]">I agree to Theta Analyzer <span className="text-[#1C73E0] underline">Licence Agreement</span> and <span className="text-[#1C73E0] underline">Privacy policy</span></p>
            </div>
          </div>
          <div className="mb-4">
            {/* input box  */}
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              className="hidden"
              onChange={handleImageChange}
            />
            {errors.image?.message &&
              typeof errors.image.message === "string" && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.image.message}
                </p>
              )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer" 
          >
            Register Now
          </button>
          <div className="text-center mt-6">
            <a href="#" className="font-medium text-[#0151FF] ">Log in Now</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
