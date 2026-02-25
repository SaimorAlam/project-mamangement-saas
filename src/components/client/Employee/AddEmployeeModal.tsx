/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Mail, Calendar, HelpCircle, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import { IAddEmployeePayload } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
} from "@/store/Api/EmployeeApi/EmployeeApi";
import { useGetAllProjectsQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { EyeOff } from "lucide-react";
interface IAddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  employee?: any;
}

const today = new Date().toISOString().split("T")[0];

const AddEmployeeModal = ({
  open,
  onClose,
  employee,
}: IAddEmployeeModalProps) => {
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
      role: "EMPLOYEE",
      notifyManager: false,
      welcomeEmail: true,
    },
  });

  useEffect(() => {
    if (employee) {
      const { password, ...rest } = employee;
      let projects: string[] = [];
      let skills: string[] = [];
      let description = "";
      let joinedDate = today;

      if (employee.role === "MANAGER" && employee.manager) {
        projects = employee.manager.projects?.map((p: any) => p.id) || [];
        skills = employee.manager.skills || [];
        description = employee.manager.description || "";
        joinedDate = employee.manager.joinedDate || today;
      } else if (employee.role === "EMPLOYEE" && employee.employee) {
        projects =
          employee.employee.projectEmployees?.map((pe: any) => pe.projectId) ||
          [];
        skills = employee.employee.skills || [];
        description = employee.employee.description || "";
        joinedDate = employee.employee.joinedDate || today;
      } else if (employee.role === "VIEWER" && employee.viewer) {
        projects =
          employee.viewer.projectViewers?.map((pv: any) => pv.projectId) || [];
        skills = employee.viewer.skills || [];
        description = employee.viewer.description || "";
        joinedDate = employee.viewer.joinedDate || today;
      }

      reset({
        ...rest,
        projects,
        skills,
        description,
        joinedDate,
      });
    }
  }, [employee, reset, open]);
  const selectedRole = watch("role");

  const [showPassword, setShowPassword] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  // const [projectInput, setProjectInput] = useState("");
  const joinedDateRef = useRef<HTMLInputElement>(null);
  const [addEmployee, { isLoading: employeeLoading }] =
    useAddEmployeeMutation();
  const [updateEmployee, { isLoading: updateLoading }] =
    useUpdateEmployeeMutation();

  const isUpdate = !!employee;
  const isLoading = employeeLoading || updateLoading;
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
        role: "EMPLOYEE",
        notifyManager: false,
        welcomeEmail: true,
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
  const email = watch("email");
  const onSubmit = async (data: IAddEmployeePayload) => {
    try {
      let payload: any = {};
      payload = {
        name: data.name,
        email: data.email,
        ...(isUpdate && { password: data.password }),
        role: data.role,
        skills: data.skills,
        description: data.description,
        joinedDate: data.joinedDate,
        projects: data.projects,
        sendWelcomeEmail: data.sendWelcomeEmail,
        notifyProjectManager: data.notifyProjectManager,
      };
      const cleanedPayload = cleanObject(payload);

      if (isUpdate) {
        await updateEmployee({ id: employee.id, ...cleanedPayload }).unwrap();
        toast.success(`${selectedRole} updated successfully!`);
      } else {
        await addEmployee(cleanedPayload).unwrap();
        toast.success(`${selectedRole} added successfully!`);
      }
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === "object" && "data" in err) {
        const errorData = (err as { data?: { message?: string } }).data;
        toast.error(
          errorData?.message ||
            `Failed to ${isUpdate ? "update" : "add"} ${selectedRole}. Please try again.`,
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
      <div className="bg-white shadow-xl rounded-lg w-full min-w-xl max-w-2xl max-h-[90vh]">
        <div className="flex justify-between items-center px-6 py-4 border-gray-200 border-b">
          <h2 className="font-semibold text-gray-900 text-lg">
            {isUpdate ? "Update Employee" : "Add New Employee"}
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
          className="space-y-5 px-6 py-5 max-h-[calc(90vh-140px)] overflow-y-auto scrollbar-hide"
        >
          {/* Employee Name and Email */}
          <div className="gap-4 grid grid-cols-2">
            <div>
              <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                Employee Name{" "}
                {!isUpdate && <span className="text-red-500">*</span>}
              </label>
              <input
                {...register("name", {
                  required: isUpdate ? false : "Name is required",
                })}
                placeholder="Enter employee name"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none w-full text-sm"
              />
              {errors.name && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                Employee Email{" "}
                {!isUpdate && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Mail
                  className="top-1/2 left-3 absolute text-gray-400 -translate-y-1/2"
                  size={16}
                />
                <input
                  type="email"
                  {...register("email", {
                    required: isUpdate ? false : "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                  placeholder="Enter employee email"
                  className="py-2 pr-3 pl-9 border border-gray-300 rounded-md focus:outline-none w-full text-sm"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone and Password */}
          <div
            className={`gap-4 grid ${isUpdate ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {/* <div>
              <label className="block mb-1.5 font-medium text-gray-700 text-sm">
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
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none w-full text-sm"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div> */}
            {/* Role Selection */}
            <div>
              <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                Select Role{" "}
                {!isUpdate && <span className="text-red-500">*</span>}
              </label>

              <Controller
                name="role"
                control={control}
                rules={{ required: isUpdate ? false : "Role is required" }}
                render={({ field }) => (
                  <Select
                    key={field.value}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-white px-3 py-2 border border-gray-300 rounded-md w-full text-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>

                    <SelectContent className="bg-white">
                      <SelectItem value="EMPLOYEE" className="hover:bg-gray-50">
                        Employee
                      </SelectItem>
                      <SelectItem value="MANAGER" className="hover:bg-gray-50">
                        Manager
                      </SelectItem>
                      <SelectItem value="VIEWER" className="hover:bg-gray-50">
                        Viewer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {isUpdate && (
              <div>
                <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                  Employee Password{" "}
                  {!isUpdate && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: isUpdate ? false : "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    placeholder="Enter employee password"
                    className="py-2 pr-3 pl-4 border border-gray-300 rounded-md focus:outline-none w-full text-sm"
                  />
                  {showPassword ? (
                    <Eye
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      className="top-1/2 right-3 absolute text-gray-400 -translate-y-1/2"
                      size={16}
                    />
                  ) : (
                    <EyeOff
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      className="top-1/2 right-3 absolute text-gray-400 -translate-y-1/2"
                      size={16}
                    />
                  )}
                </div>
                {errors.password && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Skills & Projects */}

          <div className="gap-4 grid grid-cols-2">
            <Controller
              name="joinedDate"
              control={control}
              rules={{ required: isUpdate ? false : "Joined date is required" }}
              render={({ field }) => {
                const openPicker = () => {
                  joinedDateRef.current?.showPicker?.();
                  joinedDateRef.current?.focus();
                };
                return (
                  <div>
                    <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                      Joined Date{" "}
                      {!isUpdate && <span className="text-red-500">*</span>}
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
                        className="px-3 py-2 pr-16 border border-gray-300 rounded-md focus:outline-none w-full text-sm cursor-pointer no-date-icon"
                      />
                      <button
                        type="button"
                        onClick={openPicker}
                        className="top-1/2 right-2 absolute p-1 text-gray-400 hover:text-gray-600 -translate-y-1/2"
                      >
                        <Calendar size={16} />
                      </button>
                    </div>
                    {errors.joinedDate && (
                      <p className="mt-1 text-red-500 text-xs">
                        {errors.joinedDate.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            <Controller
              name="projects"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                    Project
                  </label>

                  <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-gray-300 min-h-[42px]">
                    {field?.value?.map((projectId: string) => (
                      <span
                        key={projectId}
                        className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-700 text-xs"
                      >
                        {PROJECT_OPTIONS?.find(
                          (p: any) => p.value === projectId,
                        )?.label || projectId}
                        <button
                          type="button"
                          onClick={() => {
                            const newVal = field.value?.filter(
                              (p: string) => p !== projectId,
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
                      className="flex-1 bg-transparent border-none outline-none min-w-[140px] text-gray-600 text-sm cursor-pointer"
                    >
                      <option value="" disabled>
                        Select project
                      </option>
                      {PROJECT_OPTIONS?.filter(
                        (p: any) => !field.value.includes(p.value),
                      )?.map((project: any) => (
                        <option key={project.value} value={project.value}>
                          {project.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.projects && (
                    <p className="mt-1 text-red-500 text-xs">
                      {errors.projects.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Joined Date */}
          <div className="gap-4 grid grid-cols-1">
            <Controller
              name="skills"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block mb-1.5 font-medium text-gray-700 text-sm">
                    Skill
                  </label>
                  <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-gray-300 min-h-[42px]">
                    {field.value.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-gray-700 text-xs"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => {
                            const newVal = field.value?.filter(
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
                    <div className="flex flex-1 items-center min-w-[120px]">
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
                        className="bg-transparent border-none outline-none w-full text-sm"
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
                          className="bg-blue-50 hover:bg-blue-100 p-1.5 rounded-md text-blue-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                  {errors.skills && (
                    <p className="mt-1 text-red-500 text-xs">
                      {errors.skills.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
          {/* Description */}
          <div className="gap-4 grid grid-cols-2">
            <div className="">
              <label className="flex items-center gap-1 mb-1.5 font-medium text-gray-700 text-sm">
                Program Description{" "}
                <HelpCircle size={14} className="text-gray-400" />{" "}
              </label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Enter a description..."
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none w-full text-sm resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-1 mb-1.5 font-medium text-gray-700 text-sm">
                Login Email Preview
              </label>
              <input
                type="email"
                value={email}
                disabled={true}
                placeholder="Enter employee password"
                className="py-2 pr-3 pl-4 border border-gray-300 rounded-md focus:outline-none w-full text-sm disabled:bg-gray-100 disabled:text-gray-500"
              />
              <div className="">
                <FieldGroup className="flex flex-col gap-2">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="welcome-email"
                      {...register("welcomeEmail")}
                    />
                    <Label
                      htmlFor="welcome-email"
                      className="text-sm font-normal"
                    >
                      Send Welcome Email
                    </Label>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="notify-manager"
                      {...register("notifyManager")}
                    />
                    <Label
                      htmlFor="notify-manager"
                      className="text-sm font-normal"
                    >
                      Notify Manager
                    </Label>
                  </Field>
                </FieldGroup>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-3 py-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 text-sm transition-colors cursor-pointer"
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
              {isLoading
                ? `${isUpdate ? "Updating" : "Adding"} ${selectedRole}...`
                : `${isUpdate ? "Update" : "Add"} ${selectedRole}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
