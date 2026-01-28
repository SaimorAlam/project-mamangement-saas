/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Mail, Calendar, HelpCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { IAddEmployeePayload } from "@/types";
import {
  useAddEmployeeMutation,
  useAddManagerMutation,
  useAddViewerMutation,
} from "@/store/Api/EmployeeApi/EmployeeApi";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";

interface IAddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
}

const today = new Date().toISOString().split("T")[0];

const AddEmployeeModal = ({ open, onClose }: IAddEmployeeModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
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
      projects: [],
      role: "Employee",
    },
  });

  const selectedRole = watch("role");

  const [skillInput, setSkillInput] = useState("");
  // const [projectInput, setProjectInput] = useState("");
  const joinedDateRef = useRef<HTMLInputElement>(null);
  const [addEmployee, { isLoading: employeeLoading }] =
    useAddEmployeeMutation();
  const [addManager, { isLoading: managerloading }] = useAddManagerMutation();
  const [addViewer, { isLoading: viewerloading }] = useAddViewerMutation();
  const { data: allProjects } = useGetAllProjectsQuery({});
  const projectsData = allProjects?.data?.projects?.data?.map(
    (project: { name: string; id: string }) => ({
      name: project.name,
      id: project.id,
    }),
  );
  const PROJECT_OPTIONS = projectsData?.map((project: any) => ({
    label: project.name,
    value: project.id,
  }));
  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset({
        joinedDate: today,
        description: "",
        sendWelcomeEmail: true,
        notifyProjectManager: false,
        skills: [],
        projects: [],
        role: "Employee",
      });
      setSkillInput("");
      // setProjectInput("");
    }
  }, [open, reset]);

  const cleanObject = (obj: Record<string, any>) => {
    const newObj: Record<string, any> = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (
        value !== "" &&
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        newObj[key] = value;
      }
    });
    return newObj;
  };

  const onSubmit = async (data: IAddEmployeePayload) => {
    try {
      let payload: any = {};
      let mutation: any;

      if (selectedRole === "Employee") {
        payload = {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
          skills: data.skills,
          description: data.description,
          joinedDate: data.joinedDate,
          projects: data.projects,
          sendWelcomeEmail: data.sendWelcomeEmail,
          notifyProjectManager: data.notifyProjectManager,
        };
        mutation = addEmployee;
      } else if (selectedRole === "Manager") {
        payload = {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
          skills: data.skills,
          description: data.description,
          joinedDate: data.joinedDate,
          projects: data.projects,
          sendWelcomeEmail: data.sendWelcomeEmail,
          notifyProjectManager: data.notifyProjectManager,
        };
        mutation = addManager;
      } else if (selectedRole === "Viewer") {
        payload = {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password,
        };
        mutation = addViewer;
      }

      const cleanedPayload = cleanObject(payload);

      await mutation(cleanedPayload).unwrap();
      toast.success(`${selectedRole} added successfully!`);
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const errorData = (err as { data?: { message?: string } }).data;
        toast.error(
          errorData?.message ||
            `Failed to add ${selectedRole}. Please try again.`,
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ">
      <div className="bg-white rounded-lg shadow-xl w-full min-w-xl max-w-2xl max-h-[90vh]">
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
          className="px-6 py-5 max-h-[calc(90vh-140px)] space-y-5 overflow-y-auto scrollbar-hide"
        >
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Role <span className="text-red-500">*</span>
            </label>
            <select
              {...register("role", { required: "Role is required" })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none bg-white"
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

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
                Employee Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <HelpCircle
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
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
          {selectedRole !== "Viewer" && (
            <div className="grid grid-cols-1 gap-4">
              <Controller
                name="joinedDate"
                control={control}
                rules={{ required: "Joined date is required" }}
                render={({ field }) => {
                  const openPicker = () => {
                    joinedDateRef.current?.showPicker?.();
                    joinedDateRef.current?.focus();
                  };
                  return (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Joined Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          {...field}
                          ref={(e) => {
                            field.ref(e);
                            joinedDateRef.current = e;
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
          )}

          {/* Skills & Projects */}
          {selectedRole !== "Viewer" && (
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="skills"
                control={control}
                rules={{
                  required: "At least one skill is required",
                  validate: (val) =>
                    !val || val.length > 0 || "At least one skill is required",
                }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Skill <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-gray-300">
                      {field.value.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => {
                              const newVal = field.value.filter(
                                (s) => s !== skill,
                              );
                              field.onChange(newVal);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      <div className="flex-1 flex items-center min-w-[120px]">
                        <input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = skillInput.trim();
                              if (val && !field.value.includes(val)) {
                                field.onChange([...field.value, val]);
                                setSkillInput("");
                              }
                            }
                          }}
                          placeholder="Type a skill..."
                          className="w-full text-sm outline-none border-none bg-transparent"
                        />
                        {skillInput.trim() && (
                          <button
                            type="button"
                            onClick={() => {
                              const val = skillInput.trim();
                              if (val && !field.value.includes(val)) {
                                field.onChange([...field.value, val]);
                                setSkillInput("");
                              }
                            }}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {errors.skills && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.skills.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="projects"
                control={control}
                rules={{
                  required: "At least one project is required",
                  validate: (val) =>
                    !val ||
                    val.length > 0 ||
                    "At least one project is required",
                }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Project <span className="text-red-500">*</span>
                    </label>

                    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md min-h-[42px] focus-within:ring-2 focus-within:ring-gray-300">
                      {field.value.map((projectId: string) => (
                        <span
                          key={projectId}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {PROJECT_OPTIONS?.find(
                            (p: any) => p.value === projectId,
                          )?.label || projectId}
                          <button
                            type="button"
                            onClick={() => {
                              const newVal = field.value.filter(
                                (p) => p !== projectId,
                              );
                              field.onChange(newVal);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}

                      <select
                        value=""
                        onChange={(e) => {
                          if (
                            e.target.value &&
                            !field.value.includes(e.target.value)
                          ) {
                            field.onChange([...field.value, e.target.value]);
                          }
                        }}
                        className="flex-1 min-w-[140px] text-sm outline-none border-none bg-transparent text-gray-600 cursor-pointer"
                      >
                        <option value="" disabled>
                          Select project
                        </option>
                        {PROJECT_OPTIONS.filter(
                          (p: any) => !field.value.includes(p.value),
                        ).map((project: any) => (
                          <option key={project.value} value={project.value}>
                            {project.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.projects && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.projects.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          )}

          {/* Description */}
          {selectedRole !== "Viewer" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
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
          )}

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
              disabled={employeeLoading || managerloading || viewerloading}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                employeeLoading || managerloading || viewerloading
                  ? "bg-blue-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {employeeLoading || managerloading || viewerloading
                ? `Adding ${selectedRole}...`
                : `Add ${selectedRole}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
