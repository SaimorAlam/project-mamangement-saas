import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Mail, Calendar, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { IAddEmployeePayload } from "@/types";
import { useAddEmployeeMutation } from "@/store/Api/EmployeeApi/EmployeeApi";

interface IAddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

const today = new Date().toISOString().split("T")[0];

const AddEmployeeModal = ({
  open,
  onClose,
}: IAddEmployeeModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<IAddEmployeePayload>({
    defaultValues: {
      joinedDate: today,
      description: "",
      sendWelcomeEmail: true,
      notifyProjectManager: false,
      skills: ["Civil Eng", "Architect"],
      projects: ["Carlyle Hall", "Highway expedition"],
    },
  });

  const skills = watch("skills");
  const projects = watch("projects");

  const [skillInput, setSkillInput] = useState("");
  const [projectInput, setProjectInput] = useState("");

  const [addEmployee, { isLoading }] = useAddEmployeeMutation();

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        joinedDate: today,
        description: "",
        sendWelcomeEmail: true,
        notifyProjectManager: false,
        skills: ["Civil Eng", "Architect"],
        projects: ["Carlyle Hall", "Highway expedition"],
      });
      setSkillInput("");
      setProjectInput("");
    }
  }, [open, reset]);

  const addSkillTag = () => {
    const value = skillInput.trim();
    if (!value) return;
    if (skills.includes(value)) return;
    setValue("skills", [...skills, value]);
    setSkillInput("");
  };

  const removeSkillTag = (skillToRemove: string) => {
    setValue(
      "skills",
      skills.filter((skill) => skill !== skillToRemove)
    );
  };

  const addProjectTag = () => {
    const value = projectInput.trim();
    if (!value) return;
    if (projects.includes(value)) return;
    setValue("projects", [...projects, value]);
    setProjectInput("");
  };

  const removeProjectTag = (projectToRemove: string) => {
    setValue(
      "projects",
      projects.filter((project) => project !== projectToRemove)
    );
  };

  const handleSkillKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkillTag();
    }
    if (e.key === "Backspace" && !skillInput && skills.length) {
      removeSkillTag(skills[skills.length - 1]);
    }
  };

  const handleProjectKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addProjectTag();
    }
    if (!projectInput && projects.length && e.key === "Backspace") {
      removeProjectTag(projects[projects.length - 1]);
    }
  };

  const onSubmit = async (data: IAddEmployeePayload) => {
    if (!skills.length || !projects.length) {
      toast.error("Please add at least one skill and one project");
      return;
    }

    try {
      await addEmployee(data).unwrap();

      toast.success("Employee added successfully!");
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const errorData = (err as { data?: { message?: string } })
          .data;
        toast.error(
          errorData?.message ||
            "Failed to add employee. Please try again."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Employee
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-140px)] space-y-5"
        >
          {/* Employee Name and Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Employee Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name", {
                  required: "Name is required",
                })}
                placeholder="Enter employee name"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Employee Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                  placeholder="Enter employee email"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone and Password */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Employee Phone <span className="text-red-500">*</span>
              </label>
              <input
                {...register("phoneNumber", {
                  required: "Phone is required",
                  minLength: {
                    value: 10,
                    message: "Phone must be at least 10 digits",
                  },
                })}
                placeholder="Enter employee phone"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Employee Password{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message:
                        "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="Enter employee password"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Joined Date */}
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="joinedDate"
              control={control}
              rules={{ required: "Joined date is required" }}
              render={({ field }) => {
                const inputRef = useRef<HTMLInputElement>(null);
                const openPicker = () => {
                  inputRef.current?.showPicker?.();
                  inputRef.current?.focus();
                };
                return (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Joined Date{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        {...field}
                        ref={(e) => {
                          field.ref(e);
                          inputRef.current = e;
                        }}
                        onClick={openPicker}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none pr-16 cursor-pointer no-date-icon"
                      />
                      <button
                        type="button"
                        onClick={openPicker}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Calendar size={16} />
                      </button>
                    </div>
                    {errors.joinedDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.joinedDate.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </div>

          {/* Skills & Projects */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Skill <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-gray-300">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkillTag(skill)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter"
                  className="flex-1 min-w-[120px] text-sm outline-none border-none bg-transparent"
                />
              </div>
              {!skills.length && (
                <p className="text-red-500 text-xs mt-1">
                  At least one skill is required
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Project <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-gray-300">
                {projects.map((project) => (
                  <span
                    key={project}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {project}
                    <button
                      type="button"
                      onClick={() => removeProjectTag(project)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <input
                  value={projectInput}
                  onChange={(e) => setProjectInput(e.target.value)}
                  onKeyDown={handleProjectKeyDown}
                  placeholder="Type project name and press Enter"
                  className="flex-1 min-w-[120px] text-sm outline-none border-none bg-transparent"
                />
              </div>
              {!projects.length && (
                <p className="text-red-500 text-xs mt-1">
                  At least one project is required
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1.5">
                Program Description{" "}
                <HelpCircle size={14} className="text-gray-400" />{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={4}
                placeholder="Enter a description..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                isLoading
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading ? "Adding Employee..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
