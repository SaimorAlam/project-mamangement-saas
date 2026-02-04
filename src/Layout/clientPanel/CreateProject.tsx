/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useCreateProjectMutation } from "@/store/Api/ProjectApi/ProjectApi";
import { useGetAllManagersQuery } from "@/store/Api/UserApi/UserApi";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import useGetAllEmployees from "@/utils/useGetAllEmployees";
import { FaSpinner } from "react-icons/fa";
import {
  X,
  Calendar,
  HelpCircle,
  Flag,
  ChevronDown,
  Lock,
  Users,
  LayoutTemplate,
  Plus,
} from "lucide-react";
import ProjectSuccessModal from "./ProjectSuccessModal";
import { cn } from "@/lib/utils";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// interface IEmployeeProfile {
//   id: string;
//   user: {
//     name: string;
//     profileImage?: string;
//   };
// }

type RepeatEvery = "WEEKLY" | "BI_WEEKLY" | "MONTHLY";
type Priority = "LOW" | "MEDIUM" | "HIGH";

interface CreateProjectForm {
  name: string;
  message: string;
  programId: string;
  description?: string;
  repeatEvery: RepeatEvery;
  repeatOnDays: string[];
  repeatOnDates: number[];
  remindBefore: number;
  priority: Priority;
  startDate: string;
  deadline: string;
  estimatedCompletedDate: string;
  managerId?: string;
  employeeIds: string[];
  currentRate: string;
  budget: string;
  // latitude: number;
  shortName: string;
  // longitude: number;
  status: string;
  dataUploadDateDays: string;
  workingDays: string[]; // Added workingDays
}

// Location Picker Component
// const LocationMarker = ({
//   setPos,
//   pos,
// }: {
//   setPos: (lat: number, lng: number) => void;
//   pos: { lat: number; lng: number };
// }) => {
//   useMapEvents({
//     click(e) {
//       setPos(e.latlng.lat, e.latlng.lng);
//     },
//   });

//   return pos.lat !== 0 ? <Marker position={[pos.lat, pos.lng]} /> : null;
// };

const CreateProject = ({
  programId,
  onClose,
}: {
  programId: string;
  onClose: () => void;
}) => {
  const { allEmployees: allEmployeesData, isLoading: employeeLoading } =
    useGetAllEmployees();
  const [createProject, { isLoading, isSuccess }] = useCreateProjectMutation();

  // Queries
  const { data: managersData } = useGetAllManagersQuery({});
  const allManagers = managersData?.data?.data || [];

  // const { data: employeesData } = useGetAllEmployeesQuery({
  //   page: 1,
  //   limit: 100,
  // });
  const allEmployees: any = allEmployeesData || [];

  const [shareWith, setShareWith] = useState<
    "onlyMe" | "inviteStaff" | "followTemplate"
  >("onlyMe");

  const [enableDetails, setEnableDetails] = useState(false);
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);
  // const [mapPosition, setMapPosition] = useState({ lat: 51.505, lng: -0.09 });
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [projectId, setProjectId] = useState<string>("");
  const [statuses, setStatuses] = useState(["Pending", "Active", "Completed"]);
  const [isAddingStatus, setIsAddingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const { register, handleSubmit, watch, setValue, control } =
    useForm<CreateProjectForm>({
      defaultValues: {
        programId,
        priority: "MEDIUM",
        repeatEvery: "WEEKLY",
        repeatOnDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], // Start empty
        workingDays: [], // Initialize workingDays
        shortName: "",
        remindBefore: 30,
        startDate: new Date().toISOString().split("T")[0],
        dataUploadDateDays: "3",
      },
    });
  const projectName = watch("name");
  const repeatEvery = watch("repeatEvery");
  const repeatOnDays = watch("repeatOnDays");
  const workingDays = watch("workingDays");

  // useEffect(() => {
  //   // Get user's current location on mount
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         // setMapPosition({ lat: latitude, lng: longitude });
  //         setValue("latitude", latitude);
  //         setValue("longitude", longitude);
  //       },
  //       () => {
  //         // If denied, stick to default or previous
  //       },
  //     );
  //   }
  // }, [setValue]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Project created successfully");
      setOpenSuccessModal(true);
      onClose();
    }
  }, [isSuccess, onClose]);
  if (employeeLoading) {
    return <FaSpinner />;
  }
  const toggleDay = (day: string) => {
    const map: Record<string, string> = {
      Mon: "MONDAY",
      Tue: "TUESDAY",
      Wed: "WEDNESDAY",
      Thu: "THURSDAY",
      Fri: "FRIDAY",
      Sat: "SATURDAY",
      Sun: "SUNDAY",
    };
    const apiDay = map[day] || day.toUpperCase();
    const current = repeatOnDays || [];
    const updated = current.includes(apiDay)
      ? current.filter((d) => d !== apiDay)
      : [...current, apiDay];
    setValue("repeatOnDays", updated);
  };

  const isDaySelected = (shortDay: string) => {
    const map: Record<string, string> = {
      Mon: "MONDAY",
      Tue: "TUESDAY",
      Wed: "WEDNESDAY",
      Thu: "THURSDAY",
      Fri: "FRIDAY",
      Sat: "SATURDAY",
      Sun: "SUNDAY",
    };
    return (repeatOnDays || []).includes(map[shortDay]);
  };

  const toggleWorkingDay = (day: string) => {
    const map: Record<string, string> = {
      Mon: "MONDAY",
      Tue: "TUESDAY",
      Wed: "WEDNESDAY",
      Thu: "THURSDAY",
      Fri: "FRIDAY",
      Sat: "SATURDAY",
      Sun: "SUNDAY",
    };
    const apiDay = map[day] || day.toUpperCase();
    const current = workingDays || [];
    const updated = current.includes(apiDay)
      ? current.filter((d) => d !== apiDay)
      : [...current, apiDay];
    setValue("workingDays", updated);
  };

  const isWorkingDaySelected = (shortDay: string) => {
    const map: Record<string, string> = {
      Mon: "MONDAY",
      Tue: "TUESDAY",
      Wed: "WEDNESDAY",
      Thu: "THURSDAY",
      Fri: "FRIDAY",
      Sat: "SATURDAY",
      Sun: "SUNDAY",
    };
    return (workingDays || []).includes(map[shortDay]);
  };

  const handleStaffSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !selectedStaffs.includes(value)) {
      const newStaffs = [...selectedStaffs, value];
      setSelectedStaffs(newStaffs);
      setValue("employeeIds", newStaffs);
    }
  };

  const handleAddStatus = () => {
    const trimmed = newStatus.trim();
    if (trimmed && !statuses.includes(trimmed)) {
      setStatuses([...statuses, trimmed]);
      setValue("status", trimmed);
      setNewStatus("");
      setIsAddingStatus(false);
    }
  };

  // const handleLocationSelect = (lat: number, lng: number) => {
  //   setValue("latitude", lat);
  //   setValue("longitude", lng);
  //   setMapPosition({ lat, lng });
  // };

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
      const { dataUploadDateDays } = data;
      console.log(selectedStaffs);
      const payload = {
        message: data.message || "New Project Created",
        repeatEvery: data.repeatEvery,
        managerId: data.managerId || null,
        startDate: toISO(data.startDate),
        ...(repeatEvery === "MONTHLY"
          ? {
              repeatOnDates: data.repeatOnDates || [],
            }
          : {
              repeatOnDays: data.repeatOnDays || [],
              repeatOnDates: data.repeatOnDates || [],
              remindBefore: parseInt(dataUploadDateDays) * 24 * 60,
            }),
        ...(enableDetails && {
          description: data.description || "",
          priority: data.priority,
          status: data.status,
          computedProgress: 0,
          chartList: [],
          estimatedCompletedDate: toISO(data.estimatedCompletedDate),
          currentRate: data.currentRate || "0",
          budget: data.budget || "0",
          deadline: toISO(data.deadline || data.estimatedCompletedDate),
        }),
        ...(shareWith === "onlyMe"
          ? { shareWith: "Only_Me" }
          : shareWith === "inviteStaff"
            ? { employeeIds: selectedStaffs }
            : { templateId: "550e8400-e29b-41d4-a716-446655440000" }),
        name: data.name,
        programId: programId,
      };
      const cleanedPayload = cleanPayload(payload);
      const res = await createProject(cleanedPayload).unwrap();
      if (res.success) {
        setProjectId(res.data.id);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[98vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Create New Project</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-hide space-y-8"
        >
          {/* Project Details Section */}
          <section className="space-y-6">
            {/* <h3 className="text-base font-medium text-slate-800 tracking-tight">
              Project details
            </h3> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Project Name */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      placeholder="Enter project name"
                      className="w-full h-12 px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
                {/* Data Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Data Date
                  </label>
                  <div className="relative max-w-[400px] group">
                    <input
                      type="date"
                      {...register("startDate")}
                      className="w-full h-12 px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400 appearance-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-blue-600/70 tracking-tight uppercase text-[11px]">
                      Data Date Uploading Cycle
                    </h4>
                    <Controller
                      control={control}
                      name="repeatEvery"
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                          {["Daily", "Weekly", "Bi Weekly", "Monthly"].map(
                            (label) => {
                              const value = label
                                .toUpperCase()
                                .replace(" ", "_");
                              return (
                                <label
                                  key={label}
                                  className="flex items-center gap-2.5 cursor-pointer group"
                                >
                                  <div className="relative flex items-center justify-center">
                                    <input
                                      type="radio"
                                      {...field}
                                      value={value}
                                      checked={field.value === value}
                                      className="peer appearance-none w-5 h-5 rounded-full border-2 border-slate-300 checked:border-blue-600 transition-all"
                                    />
                                    <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition-transform" />
                                  </div>
                                  <span
                                    className={cn(
                                      "text-xs font-semibold transition-colors",
                                      field.value === value
                                        ? "text-slate-900"
                                        : "text-slate-500",
                                    )}
                                  >
                                    {label}
                                  </span>
                                </label>
                              );
                            },
                          )}
                        </div>
                      )}
                    />
                  </div>

                  {repeatEvery !== "MONTHLY" && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-3">
                        <label className="block text-sm font-semibold text-slate-700">
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
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                  {day}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => toggleDay(day)}
                                  className={cn(
                                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
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
                        <label className="block text-sm font-semibold text-slate-700">
                          Data Upload Date
                        </label>
                        <div className="flex gap-8">
                          {["3", "4", "5"].map((days) => (
                            <label
                              key={days}
                              className="flex items-center gap-2.5 cursor-pointer group"
                            >
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  {...register("dataUploadDateDays")}
                                  value={days}
                                  className="peer appearance-none w-5 h-5 rounded-full border-2 border-slate-300 checked:border-blue-600 transition-all cursor-pointer"
                                />
                                <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition-transform" />
                              </div>
                              <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">
                                {days} Days
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Share With */}
              <div className="space-y-12">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-500">
                    Share With
                  </label>
                  <div className="flex flex-wrap gap-4 pt-1">
                    {[
                      { id: "onlyMe", label: "Only Me", icon: Lock },
                      { id: "inviteStaff", label: "Invite Staff", icon: Users },
                      {
                        id: "followTemplate",
                        label: "Follow Template Settings",
                        icon: LayoutTemplate,
                      },
                    ].map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div className="relative flex items-center justify-center">
                          <input
                            type="radio"
                            name="shareWith"
                            checked={shareWith === option.id}
                            onChange={() => {
                              setShareWith(option.id as any);
                              if (option.id !== "inviteStaff")
                                setSelectedStaffs([]);
                            }}
                            className="peer appearance-none w-5 h-5 rounded-full border-2 border-slate-300 checked:border-blue-600 transition-all cursor-pointer"
                          />
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium transition-colors",
                            shareWith === option.id
                              ? "text-slate-900"
                              : "text-slate-500",
                          )}
                        >
                          {option.label}
                        </span>
                        {option.id === "onlyMe" && (
                          <option.icon size={12} className="text-slate-400" />
                        )}
                      </label>
                    ))}
                  </div>

                  {shareWith === "inviteStaff" && (
                    <div className="mt-3 relative">
                      <select
                        onChange={handleStaffSelect}
                        className="w-full h-11 pl-4 pr-10 appearance-none bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm text-slate-700"
                      >
                        <option value="">Select staff members</option>
                        {allEmployees?.map((emp: any) => (
                          <option key={emp.id} value={emp.id}>
                            {emp?.name} ({emp?.role})
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />

                      {selectedStaffs.length > 0 && (
                        <div className="mt-3 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                          <div className="flex -space-x-3 overflow-hidden">
                            {selectedStaffs.map((staffId) => {
                              const staff = allEmployees.find(
                                (e: any) => e.id === staffId,
                              );
                              return (
                                <button
                                  key={staffId}
                                  type="button"
                                  onClick={() => {
                                    const newStaffs = selectedStaffs.filter(
                                      (id) => id !== staffId,
                                    );
                                    setSelectedStaffs(newStaffs);
                                    setValue("employeeIds", newStaffs);
                                  }}
                                  className="inline-block h-8 w-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden hover:scale-110 hover:z-10 transition-transform group"
                                  title={`Click to remove ${staff?.name}`}
                                >
                                  {staff?.profileImage ? (
                                    <img
                                      src={staff.profileImage}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-slate-600">
                                      {staff?.name.charAt(0)}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                            Staffs Preview
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Manager Select */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Assign Project Manager
                  </label>
                  <div className="relative">
                    <select
                      {...register("managerId")}
                      className="w-full h-12 pl-4 pr-10 appearance-none bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-700"
                    >
                      <option value="">Select Manager</option>
                      {allManagers.map((m: any) => (
                        <option key={m.id} value={m.id}>
                          {m.user.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-4 py-2 border-t border-slate-100 pt-6">
              <span className="text-sm font-bold text-slate-800">
                Enable Project Details settings
              </span>
              <button
                type="button"
                onClick={() => setEnableDetails(!enableDetails)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  enableDetails ? "bg-blue-600" : "bg-slate-200",
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    enableDetails ? "translate-x-5" : "translate-x-0",
                  )}
                />
              </button>
            </div>
          </section>

          {enableDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Column 1 */}
              <div className="space-y-8">
                {/* Description */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    Project Description{" "}
                    <HelpCircle size={14} className="text-slate-400" />
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder="Write a short description..."
                    className="w-full h-[140px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400 resize-none"
                  />
                </div>

                {/* short Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Project Short Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      {...register("shortName")} // Bound as placeholder for address logic if implemented
                      placeholder="Enter Project Short Name here"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Status Select */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Status
                  </label>
                  <div className="flex gap-3">
                    {isAddingStatus ? (
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          placeholder="New status name"
                          className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddStatus();
                            }
                            if (e.key === "Escape") setIsAddingStatus(false);
                          }}
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleAddStatus}
                          className="px-4 h-12 bg-blue-600 text-white rounded-xl text-xs font-bold whitespace-nowrap"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingStatus(false)}
                          className="px-4 h-12 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="relative flex-1">
                          <select
                            {...register("status")}
                            className="w-full h-12 pl-4 pr-10 appearance-none bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-700"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s === "Pending" ? "Planning" : s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={18}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsAddingStatus(true)}
                          className="w-12 h-12 shrink-0 flex items-center justify-center border border-slate-200 rounded-full bg-white text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                        >
                          <Plus size={20} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Rate */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Current Rate
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      {...register("currentRate")}
                      placeholder="Enter hourly rate"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-8">
                {/* Starting Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Starting Date
                  </label>
                  <div className="relative group">
                    <input
                      type="date"
                      {...register("startDate")}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400 appearance-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <HelpCircle size={16} className="text-slate-400" />
                      <Calendar size={18} className="text-slate-600" />
                    </div>
                  </div>
                </div>

                {/* Working Days */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
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
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {day}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleWorkingDay(day)}
                              className={cn(
                                "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
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
                  <label className="block text-sm font-semibold text-slate-700">
                    Estimated Completion Date
                  </label>
                  <div className="relative group">
                    <input
                      type="date"
                      {...register("estimatedCompletedDate")}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400 appearance-none"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                      <HelpCircle size={16} className="text-slate-400" />
                      <Calendar size={18} className="text-slate-600" />
                    </div>
                  </div>
                </div>

                {/* Priority Select */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Priority
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <Flag size={18} />
                    </div>
                    <select
                      {...register("priority")}
                      className="w-full h-12 pl-12 pr-10 appearance-none bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-slate-700"
                    >
                      <option value="LOW">Default</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Budget
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      {...register("budget")}
                      placeholder="Total budget for this project"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map Section */}
          {/* <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Project Location of Highway Expansion Program
            </h3>
            <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200">
              <MapContainer
                center={[mapPosition.lat, mapPosition.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker
                  setPos={handleLocationSelect}
                  pos={mapPosition}
                />
              </MapContainer>
            </div>
            <input type="hidden" {...register("latitude")} />
            <input type="hidden" {...register("longitude")} />
          </div> */}

          {/* Modal Footer Actions */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3.5 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-bold transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-sm disabled:opacity-50 disabled:active:scale-100"
            >
              {isLoading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
      <ProjectSuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        projectName={projectName}
        projectId={projectId}
      />
    </div>
  );
};

export default CreateProject;
