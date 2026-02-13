/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useCreateProjectMutation } from "@/store/Api/ProjectApi/ProjectApi";
import {
  useGetAllManagersQuery,
  useGetAllViewersQuery,
} from "@/store/Api/UserApi/UserApi";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { X, HelpCircle, Flag, Lock, Users, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useGetAllEmployeesQuery } from "@/store/Api/EmployeeApi/EmployeeApi";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type UploadCycle = "Daily" | "Weekly" | "By_Weekly" | "Monthly";
type Priority = "LOW" | "MEDIUM" | "HIGH";
type DaysEnum = "Sun" | "Mon" | "Tue" | "Wed" | "Thurs" | "Fri" | "Sat";

interface CreateProjectForm {
  programId: string;
  name: string;
  shareWith: "Only_Me" | "Invite_Staff"; //Invite_Staff
  managerId: string;
  viewerIds: string[];
  employeeIds: string[];
  dateDate: string;
  uploadCycle: UploadCycle;
  SelectDays: string; // Days { Sun, Mon, Tue, Wed, Thurs, Fri, Sat}
  selectDate: string;
  UploadData: string;

  description: string;
  startDate: string;
  workingDay: string;
  sortName: string;
  deadline: string;
  priority: Priority;
  status: string;
  budget: string;
  currentRate: string;
}

const CreateProject = ({
  programId,
  onClose,
  onSuccess,
}: {
  programId: string;
  onClose: () => void;
  onSuccess?: (projectName: string, projectId: string) => void;
}) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data: managersData } = useGetAllManagersQuery({});
  const allManagers = managersData?.data?.data || [];
  const { data: employeesData } = useGetAllEmployeesQuery({});
  const { data: viewerData } = useGetAllViewersQuery({});
  const allEmployees: any = employeesData?.data || [];
  const allViewer = viewerData?.data?.data || [];
  const [enableDetails, setEnableDetails] = useState(false);
  const [statuses] = useState([
    "PENDING",
    "LIVE",
    "DRAFT",
    "OVERDUE",
    "PROBLEM",
    "COMPLETED",
  ]);

  const { register, handleSubmit, watch, setValue, control } =
    useForm<CreateProjectForm>({
      defaultValues: {
        programId,
        name: "",
        shareWith: "Only_Me", //Invite_Staff
        managerId: "",
        viewerIds: [],
        employeeIds: [],
        dateDate: new Date().toISOString(),
        uploadCycle: "Weekly",
        SelectDays: "[]", // Storing as JSON string
        selectDate: "[]",
        UploadData: "3",

        description: "",
        startDate: new Date().toISOString().split("T")[0],
        workingDay: "[]",
        sortName: "",
        deadline: "",
        priority: "MEDIUM",
        status: "",
        budget: "",
        currentRate: "",
      },
    });

  const uploadCycle = watch("uploadCycle");
  const SelectDays = watch("SelectDays");
  const workingDay = watch("workingDay");
  const shareWith = watch("shareWith");
  const employeeIds = watch("employeeIds");
  const viewerIds = watch("viewerIds");
  const selectedManagerId = watch("managerId");
  const selectedEmployeeIds = employeeIds.filter(Boolean);
  const selectedViewerIds = viewerIds.filter(Boolean);

  const toggleDay = (day: string) => {
    const map: Record<string, DaysEnum> = {
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thurs",
      Fri: "Fri",
      Sat: "Sat",
      Sun: "Sun",
    };
    const apiDay = map[day] || (day.toUpperCase() as any);
    let current: DaysEnum[] = [];
    try {
      current = JSON.parse(SelectDays || "[]");
    } catch {
      current = [];
    }
    const updated = current.includes(apiDay)
      ? current.filter((d) => d !== apiDay)
      : [...current, apiDay];
    setValue("SelectDays", JSON.stringify(updated));
  };

  const isDaySelected = (shortDay: string) => {
    const map: Record<string, DaysEnum> = {
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thurs",
      Fri: "Fri",
      Sat: "Sat",
      Sun: "Sun",
    };
    let current: DaysEnum[] = [];
    try {
      current = JSON.parse(SelectDays || "[]");
    } catch {
      current = [];
    }
    return current.includes(map[shortDay]);
  };

  const toggleWorkingDay = (day: string) => {
    const map: Record<string, DaysEnum> = {
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thurs",
      Fri: "Fri",
      Sat: "Sat",
      Sun: "Sun",
    };
    const apiDay = map[day] || (day.toUpperCase() as any);
    let current: DaysEnum[] = [];
    try {
      current = JSON.parse(workingDay || "[]");
    } catch {
      current = [];
    }
    const updated = current.includes(apiDay)
      ? current.filter((d) => d !== apiDay)
      : [...current, apiDay];
    setValue("workingDay", JSON.stringify(updated));
  };

  const isWorkingDaySelected = (shortDay: string) => {
    const map: Record<string, DaysEnum> = {
      Mon: "Mon",
      Tue: "Tue",
      Wed: "Wed",
      Thu: "Thurs",
      Fri: "Fri",
      Sat: "Sat",
      Sun: "Sun",
    };
    let current: DaysEnum[] = [];
    try {
      current = JSON.parse(workingDay || "[]");
    } catch {
      current = [];
    }
    return current.includes(map[shortDay]);
  };

  const toISO = (date: string) => (date ? new Date(date).toISOString() : null);

  const cleanPayload = (obj: any) => {
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        newObj[key] = value;
      }
    });
    return newObj;
  };

  const onSubmit = async (data: CreateProjectForm) => {
    try {
      const parsedSelectDays = JSON.parse(data.SelectDays || "[]");
      const parsedWorkingDay = JSON.parse(data.workingDay || "[]");
      const parsedSelectDates = JSON.parse(data.selectDate || "[]");

      // Convert day numbers to ISO dates for Prisma DateTime[]
      const formattedSelectDates = parsedSelectDates.map((dayNum: number) => {
        const d = new Date();
        d.setDate(dayNum);
        return d.toISOString();
      });

      const payload: any = {
        ...data,
        SelectDays: parsedSelectDays,
        workingDay: parsedWorkingDay,
        selectDate: formattedSelectDates,
        dateDate: data.dateDate
          ? new Date(data.dateDate).toISOString()
          : new Date().toISOString(),
        startDate: toISO(data.startDate),
        deadline: toISO(data.deadline),
        managerId: data.managerId || null,
        status: data.status
          ? data.status.toUpperCase() === "PENDING"
            ? "PENDING"
            : data.status.toUpperCase()
          : undefined,
      };

      if (!enableDetails) {
        // Remove detail fields if section is closed
        const detailsFields = [
          "description",
          "sortName",
          "status",
          "currentRate",
          "startDate",
          "workingDay",
          "deadline",
          "priority",
          "budget",
        ];
        detailsFields.forEach((field) => {
          delete payload[field];
        });
      }

      const cleaned = cleanPayload(payload);
      const res = await createProject(cleaned).unwrap();
      console.log(res);
      if (res.success) {
        const pId = res.data?.project?.id || res.data?.id;
        if (onSuccess) {
          onSuccess(data.name, pId);
        }
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl max-h-[98vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-2 border-gray-200 border-b">
          <h2 className="font-semibold text-lg">Create New Project</h2>
          <button
            onClick={onClose}
            className="hover:bg-slate-50 p-2 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 p-6 max-h-[calc(90vh-140px)] overflow-y-auto scrollbar-hide"
        >
          {/* Project Details Section */}
          <section className="space-y-6">
            <div className="gap-x-8 gap-y-6 grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <div className="group relative">
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      placeholder="Enter project name"
                      className="bg-slate-50/50 px-4 border border-slate-200 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full h-12 placeholder:text-slate-400 text-sm transition-all"
                    />
                  </div>
                </div>
                {/* Data Date */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Data Date
                  </label>
                  <div className="relative max-w-[400px]">
                    <Controller
                      control={control}
                      name="dateDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "justify-start bg-slate-50/50 hover:bg-slate-50 px-4 border-slate-200 rounded-lg w-full h-12 font-normal text-left transition-all",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 w-4 h-4" />
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-auto" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(date?.toISOString())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-bold text-[11px] text-blue-600/70 text-sm uppercase tracking-tight">
                      Data Date Uploading Cycle
                    </h4>
                    <Controller
                      control={control}
                      name="uploadCycle"
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                          {["Weekly", "By_Weekly", "Monthly"].map((label) => {
                            const value = label as UploadCycle;
                            const displayLabel = label.replace("_", " ");
                            return (
                              <label
                                key={label}
                                className="group flex items-center gap-2.5 cursor-pointer"
                              >
                                <div className="relative flex justify-center items-center">
                                  <input
                                    type="radio"
                                    {...field}
                                    value={value}
                                    checked={field.value === value}
                                    className="peer border-2 border-slate-300 checked:border-blue-600 rounded-full w-5 h-5 transition-all appearance-none"
                                  />
                                  <div className="absolute bg-blue-600 rounded-full w-2.5 h-2.5 scale-0 peer-checked:scale-100 transition-transform" />
                                </div>
                                <span
                                  className={cn(
                                    "font-semibold text-xs transition-colors",
                                    field.value === value
                                      ? "text-slate-900"
                                      : "text-slate-500",
                                  )}
                                >
                                  {displayLabel}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    />
                  </div>

                  {uploadCycle === "Weekly" && (
                    <div className="space-y-6 slide-in-from-top-2 animate-in duration-300 fade-in">
                      <div className="space-y-3">
                        <label className="block font-semibold text-slate-700 text-sm">
                          Select days
                        </label>
                        <div className="flex gap-2">
                          {[
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ].map((day) => {
                            const isSelected = isDaySelected(day);
                            return (
                              <div
                                key={day}
                                className="flex flex-col items-center gap-2 min-w-[42px]"
                              >
                                <span className="font-bold text-[10px] text-slate-400 uppercase">
                                  {day}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleDay(day)}
                                  className={cn(
                                    "flex justify-center items-center border-2 rounded-md w-5 h-5 transition-all",
                                    isSelected
                                      ? "bg-blue-600 border-blue-600 text-white"
                                      : "bg-white border-slate-200 hover:border-slate-300",
                                  )}
                                >
                                  {isSelected && (
                                    <svg
                                      width="10"
                                      height="8"
                                      viewBox="0 0 10 8"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M1 4L3.5 6.5L8.5 1.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block font-semibold text-slate-700 text-sm">
                          Data Upload Date
                        </label>
                        <div className="flex gap-8">
                          {["3", "4", "5"].map((days) => (
                            <label
                              key={days}
                              className="group flex items-center gap-2.5 cursor-pointer"
                            >
                              <div className="relative flex justify-center items-center">
                                <input
                                  type="radio"
                                  {...register("UploadData")}
                                  value={days}
                                  className="peer border-2 border-slate-300 checked:border-blue-600 rounded-full w-5 h-5 transition-all appearance-none cursor-pointer"
                                />
                                <div className="absolute bg-blue-600 rounded-full w-2.5 h-2.5 scale-0 peer-checked:scale-100 transition-transform" />
                              </div>
                              <span className="font-semibold text-slate-600 group-hover:text-slate-900 text-xs transition-colors">
                                {days} Days
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {uploadCycle === "By_Weekly" && (
                    <div className="space-y-3 slide-in-from-top-2 animate-in duration-300 fade-in">
                      <label className="block font-semibold text-slate-700 text-sm">
                        Select 2 Date
                      </label>
                      <div className="relative">
                        <Controller
                          control={control}
                          name="selectDate"
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 px-4 border-slate-200 rounded-lg w-full h-12 font-normal text-left transition-all group",
                                    !field.value || field.value === "[]"
                                      ? "text-slate-400"
                                      : "",
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    {(() => {
                                      let dates = [];
                                      try {
                                        dates = JSON.parse(field.value || "[]");
                                      } catch {
                                        dates = [];
                                      }
                                      if (dates && dates.length > 0) {
                                        return (
                                          <span className="text-slate-700">
                                            {dates
                                              .slice(0, 2)
                                              .map((d: any, i: number) => (
                                                <React.Fragment key={d}>
                                                  {d < 10 ? `0${d}` : d}/--/----
                                                  {i === 0 &&
                                                    dates.length > 1 &&
                                                    " & "}
                                                </React.Fragment>
                                              ))}
                                            {dates.length === 1 &&
                                              " & --/--/----"}
                                          </span>
                                        );
                                      }
                                      return (
                                        <span>--/--/---- & --/--/----</span>
                                      );
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <HelpCircle
                                      size={16}
                                      className="text-slate-300 group-hover:text-slate-400 transition-colors"
                                    />
                                    <CalendarIcon className="w-4 h-4 text-slate-500" />
                                  </div>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="p-0 w-auto"
                                align="start"
                              >
                                <Calendar
                                  mode="multiple"
                                  max={2}
                                  selected={(() => {
                                    let dates = [];
                                    try {
                                      dates = JSON.parse(field.value || "[]");
                                    } catch {
                                      dates = [];
                                    }
                                    return dates.map(
                                      (d: any) =>
                                        new Date(
                                          new Date().getFullYear(),
                                          new Date().getMonth(),
                                          d,
                                        ),
                                    );
                                  })()}
                                  onSelect={(dates) => {
                                    const dayNumbers =
                                      dates?.map((d) => d.getDate()) || [];
                                    field.onChange(JSON.stringify(dayNumbers));
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {uploadCycle === "Monthly" && (
                    <div className="space-y-3 slide-in-from-top-2 animate-in duration-300 fade-in">
                      <label className="block font-semibold text-slate-700 text-sm">
                        Select Date
                      </label>
                      <div className="relative">
                        <Controller
                          control={control}
                          name="selectDate"
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "flex justify-between items-center bg-slate-50/50 hover:bg-slate-50 px-4 border-slate-200 rounded-lg w-full h-12 font-normal text-left transition-all group",
                                    !field.value || field.value === "[]"
                                      ? "text-slate-400"
                                      : "",
                                  )}
                                >
                                  <div className="flex items-center gap-2">
                                    {(() => {
                                      let dates = [];
                                      try {
                                        dates = JSON.parse(field.value || "[]");
                                      } catch {
                                        dates = [];
                                      }
                                      if (dates && dates.length > 0) {
                                        return (
                                          <span className="text-slate-700">
                                            {dates[0] < 10
                                              ? `0${dates[0]}`
                                              : dates[0]}
                                            /--/----
                                          </span>
                                        );
                                      }
                                      return <span>--/--/----</span>;
                                    })()}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <HelpCircle
                                      size={16}
                                      className="text-slate-300 group-hover:text-slate-400 transition-colors"
                                    />
                                    <CalendarIcon className="w-4 h-4 text-slate-500" />
                                  </div>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="p-0 w-auto"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={(() => {
                                    let dates = [];
                                    try {
                                      dates = JSON.parse(field.value || "[]");
                                    } catch {
                                      dates = [];
                                    }
                                    return dates[0]
                                      ? new Date(
                                          new Date().getFullYear(),
                                          new Date().getMonth(),
                                          dates[0],
                                        )
                                      : undefined;
                                  })()}
                                  onSelect={(date) => {
                                    field.onChange(
                                      date
                                        ? JSON.stringify([date.getDate()])
                                        : "[]",
                                    );
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-12">
                {/* Share With */}
                <div className="space-y-4">
                  <h4 className="font-bold text-[11px] text-blue-600/70 text-sm uppercase tracking-tight">
                    Data Date Uploading Cycle
                  </h4>
                  <Controller
                    control={control}
                    name="shareWith"
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-4 pt-1">
                        {[
                          { id: "Only_Me", label: "Only Me", icon: Lock },
                          {
                            id: "Invite_Staff",
                            label: "Invite Staff",
                            icon: Users,
                          },
                        ].map((option) => (
                          <label
                            key={option.id}
                            className="group flex items-center gap-2 cursor-pointer"
                          >
                            <div className="relative flex justify-center items-center">
                              <input
                                type="radio"
                                name="shareWith"
                                checked={field.value === option.id}
                                onChange={() => {
                                  field.onChange(option.id);
                                  if (option.id !== "Invite_Staff") {
                                    setValue("employeeIds", []);
                                    setValue("viewerIds", []);
                                  }
                                }}
                                className="peer border-2 border-slate-300 checked:border-blue-600 rounded-full w-5 h-5 transition-all appearance-none cursor-pointer"
                              />
                              <div className="absolute bg-blue-600 rounded-full w-2.5 h-2.5 scale-0 peer-checked:scale-100 transition-transform" />
                            </div>
                            <span
                              className={cn(
                                "font-medium text-xs transition-colors",
                                field.value === option.id
                                  ? "text-slate-900"
                                  : "text-slate-500",
                              )}
                            >
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  />

                  {shareWith === "Invite_Staff" && (
                    <div className="relative space-y-6 slide-in-from-top-2 mt-4 pt-6 border-slate-100 border-t animate-in">
                      <h4 className="font-bold text-[11px] text-blue-600/70 uppercase tracking-widest">
                        Configure Team Access
                      </h4>
                      {/* Employee Select */}
                      <div className="space-y-2">
                        <label className="block font-semibold text-slate-700 text-sm">
                          Assign Project Employees
                        </label>
                        <div className="relative">
                          <Controller
                            control={control}
                            name="employeeIds"
                            render={({ field }) => (
                              <Select
                                value=""
                                onValueChange={(val) => {
                                  if (val) {
                                    const current = field.value
                                      ? field.value
                                      : [];
                                    if (!current.includes(val)) {
                                      field.onChange([...current, val]);
                                    }
                                  }
                                }}
                              >
                                <SelectTrigger className="bg-slate-50 px-4 border border-slate-200 focus:border-blue-500 rounded-lg focus:ring-blue-500/20 w-full h-11! text-slate-700 text-sm transition-all">
                                  <SelectValue placeholder="Add Employee" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {allEmployees.map((emp: any) => {
                                    const employeeName =
                                      emp?.name || emp?.user?.name || "Unknown";
                                    return (
                                      <SelectItem key={emp.id} value={emp.id}>
                                        {employeeName}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                      {/* Viewer Select */}
                      <div className="space-y-2">
                        <label className="block font-semibold text-slate-700 text-sm">
                          Assign Project Viewers
                        </label>
                        <div className="relative">
                          <Controller
                            control={control}
                            name="viewerIds"
                            render={({ field }) => (
                              <Select
                                value=""
                                onValueChange={(val) => {
                                  if (val) {
                                    const current = field.value
                                      ? field.value
                                      : [];
                                    if (!current.includes(val)) {
                                      field.onChange([...current, val]);
                                    }
                                  }
                                }}
                              >
                                <SelectTrigger className="bg-slate-50 px-4 border border-slate-200 focus:border-blue-500 rounded-lg focus:ring-blue-500/20 w-full h-11! text-slate-700 text-sm transition-all">
                                  <SelectValue placeholder="Add Viewer" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {allViewer.map((v: any) => (
                                    <SelectItem key={v.id} value={v.id}>
                                      {v.user?.name || v?.name || "Unknown"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Manager Select */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Assign Project Manager
                  </label>
                  <div className="relative">
                    <Controller
                      control={control}
                      name="managerId"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-slate-50 px-4 border border-slate-200 focus:border-blue-500 rounded-lg focus:ring-blue-500/20 w-full h-11! text-slate-700 text-sm transition-all">
                            <SelectValue placeholder="Select Manager" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {allManagers.map((m: any) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {(selectedManagerId ||
                  selectedEmployeeIds.length > 0 ||
                  selectedViewerIds.length > 0) && (
                  <div className="flex flex-col gap-3 bg-slate-50/50 slide-in-from-top-1 p-3 border border-slate-100 rounded-xl animate-in fade-in">
                    <div className="flex justify-between items-center px-1">
                      <span className="flex items-center gap-2 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                        <Users size={12} className="text-blue-500/70" />
                        Team Preview
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedManagerId &&
                        (() => {
                          const manager = allManagers.find(
                            (m: any) => m.id === selectedManagerId,
                          );
                          if (!manager) return null;
                          const name = manager.user?.name || "Unknown";
                          return (
                            <div className="flex items-center gap-2 bg-white shadow-sm hover:shadow-md p-1 pr-2.5 border border-emerald-100 rounded-full transition-all group">
                              <div className="flex justify-center items-center bg-emerald-50 border border-emerald-50 rounded-full w-8 h-8 overflow-hidden shrink-0">
                                {manager.user?.profileImage ? (
                                  <img
                                    src={manager.user.profileImage}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="font-bold text-emerald-600 text-[10px]">
                                    {name.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700 text-[11px] leading-none">
                                  {name}
                                </span>
                                <span className="font-bold text-emerald-500/80 text-[8px] uppercase tracking-tighter leading-none mt-0.5">
                                  Manager
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setValue("managerId", "")}
                                className="hover:bg-red-50 ml-1 p-0.5 rounded-full text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })()}

                      {selectedEmployeeIds.map((empId) => {
                        const emp = allEmployees.find(
                          (e: any) => e.id === empId,
                        );
                        if (!emp) return null;
                        const name = emp?.name || emp?.user?.name || "Unknown";
                        return (
                          <div
                            key={empId}
                            className="flex items-center gap-2 bg-white shadow-sm hover:shadow-md p-1 pr-2.5 border border-slate-100 rounded-full transition-all group"
                          >
                            <div className="flex justify-center items-center bg-blue-50 border border-slate-50 rounded-full w-8 h-8 overflow-hidden shrink-0">
                              {emp?.profileImage ? (
                                <img
                                  src={emp.profileImage}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="font-bold text-blue-600 text-[10px]">
                                  {name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700 text-[11px] leading-none">
                                {name}
                              </span>
                              <span className="font-bold text-blue-500/80 text-[8px] uppercase tracking-tighter leading-none mt-0.5">
                                Employee
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setValue(
                                  "employeeIds",
                                  selectedEmployeeIds.filter(
                                    (id) => id !== empId,
                                  ),
                                );
                              }}
                              className="hover:bg-red-50 ml-1 p-0.5 rounded-full text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}

                      {selectedViewerIds.map((vId) => {
                        const viewer = allViewer.find((v: any) => v.id === vId);
                        if (!viewer) return null;
                        const name =
                          viewer?.user?.name || viewer?.name || "Unknown";
                        return (
                          <div
                            key={vId}
                            className="flex items-center gap-2 bg-white shadow-sm hover:shadow-md p-1 pr-2.5 border border-slate-100 rounded-full transition-all group"
                          >
                            <div className="flex justify-center items-center bg-indigo-50 border border-slate-50 rounded-full w-8 h-8 overflow-hidden shrink-0">
                              {viewer?.user?.profileImage ? (
                                <img
                                  src={viewer.user.profileImage}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="font-bold text-indigo-600 text-[10px]">
                                  {name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700 text-[11px] leading-none">
                                {name}
                              </span>
                              <span className="font-bold text-indigo-500/80 text-[8px] uppercase tracking-tighter leading-none mt-0.5">
                                Viewer
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setValue(
                                  "viewerIds",
                                  selectedViewerIds.filter((id) => id !== vId),
                                );
                              }}
                              className="hover:bg-red-50 ml-1 p-0.5 rounded-full text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-4 py-2 pt-6 border-slate-100 border-t">
              <span className="font-bold text-slate-800 text-sm">
                Enable Project Details settings
              </span>
              <button
                type="button"
                onClick={() => setEnableDetails(!enableDetails)}
                className={cn(
                  "inline-flex relative border-2 border-transparent rounded-full focus:outline-none w-11 h-6 transition-colors duration-200 ease-in-out cursor-pointer shrink-0",
                  enableDetails ? "bg-blue-600" : "bg-slate-200",
                )}
              >
                <span
                  className={cn(
                    "inline-block bg-white shadow rounded-full ring-0 w-5 h-5 transition duration-200 ease-in-out pointer-events-none transform",
                    enableDetails ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </section>

          {enableDetails && (
            <div className="slide-in-from-bottom-2 gap-x-12 gap-y-10 grid grid-cols-1 md:grid-cols-2 animate-in duration-500 fade-in">
              {/* Column 1 */}
              <div className="space-y-8">
                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 font-semibold text-slate-700 text-sm">
                    Project Description{" "}
                    <HelpCircle size={14} className="text-slate-400" />
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder="Write a short description..."
                    className="bg-slate-50 px-4 py-3 border border-slate-200 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full h-[155px] placeholder:text-slate-400 text-sm transition-all resize-none"
                  />
                </div>

                {/* sort Name */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Project Short Name
                  </label>
                  <div className="group relative">
                    <input
                      type="text"
                      {...register("sortName")}
                      placeholder="Enter Project Short Name here"
                      className="bg-slate-50 px-4 border border-slate-200 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full h-12 placeholder:text-slate-400 text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Status Select */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Status
                  </label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="bg-slate-50 px-4 border border-slate-200 focus:border-blue-500 rounded-lg focus:ring-blue-500/20 w-full h-11! text-slate-700 text-sm transition-all">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {statuses.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s === "PENDING" ? "Pending" : s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Rate */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Current Rate
                  </label>
                  <div className="group relative">
                    <input
                      type="text"
                      {...register("currentRate")}
                      placeholder="Enter hourly rate"
                      className="bg-slate-50 px-4 border border-slate-200 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full h-12 placeholder:text-slate-400 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-8">
                {/* Starting Date */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Starting Date
                  </label>
                  <div className="relative">
                    <Controller
                      control={control}
                      name="startDate"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "justify-start bg-slate-50 hover:bg-slate-50 px-4 border-slate-200 rounded-lg w-full h-12 font-normal text-left transition-all",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 w-4 h-4" />
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-auto" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(date?.toISOString())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </div>

                {/* Working Days */}
                <div className="space-y-3">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Working Days
                  </label>
                  <div className="flex gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => {
                        const isSelected = isWorkingDaySelected(day);
                        return (
                          <div
                            key={day}
                            className="flex flex-col items-center gap-2 min-w-[42px]"
                          >
                            <span className="font-bold text-[10px] text-slate-400 uppercase">
                              {day}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleWorkingDay(day)}
                              className={cn(
                                "flex justify-center items-center border-2 rounded-md w-5 h-5 transition-all",
                                isSelected
                                  ? "bg-blue-600 border-blue-600 text-white"
                                  : "bg-white border-slate-200 hover:border-slate-300",
                              )}
                            >
                              {isSelected && (
                                <svg
                                  width="10"
                                  height="8"
                                  viewBox="0 0 10 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M1 4L3.5 6.5L8.5 1.5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Completion Date */}
                <div className="space-y-2 pt-1">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Estimated Completion Date
                  </label>
                  <div className="relative">
                    <Controller
                      control={control}
                      name="deadline"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "justify-start bg-slate-50 hover:bg-slate-50 px-4 border-slate-200 rounded-lg w-full h-12 font-normal text-left transition-all",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 w-4 h-4" />
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 w-auto" align="start">
                            <Calendar
                              mode="single"
                              selected={
                                field.value ? new Date(field.value) : undefined
                              }
                              onSelect={(date) =>
                                field.onChange(date?.toISOString())
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                  </div>
                </div>

                {/* Priority Select */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Priority
                  </label>
                  <div className="relative">
                    <div className="top-1/2 left-4 z-10 absolute text-slate-500 -translate-y-1/2">
                      <Flag size={18} />
                    </div>
                    <Controller
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="bg-slate-50 pl-12 border border-slate-200 focus:border-blue-500 rounded-lg focus:ring-blue-500/20 w-full h-11! text-slate-700 text-sm transition-all">
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="LOW">Default</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700 text-sm">
                    Budget
                  </label>
                  <div className="group relative">
                    <input
                      type="text"
                      {...register("budget")}
                      placeholder="Total budget for this project"
                      className="bg-slate-50 px-4 border border-slate-200 focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full h-12 placeholder:text-slate-400 text-sm transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex justify-between items-center mt-12 pt-8 border-slate-100 border-t">
            <button
              type="button"
              onClick={onClose}
              className="hover:bg-slate-50 px-8 py-3.5 border border-slate-200 rounded-lg font-bold text-slate-700 text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-blue-500/20 shadow-lg px-10 py-3.5 rounded-lg font-bold text-white text-sm active:scale-95 disabled:active:scale-100 transition-all"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
