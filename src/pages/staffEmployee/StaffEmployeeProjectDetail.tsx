import React from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  TrendingUp,
  AlertCircle,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useGetProjectByIdQuery } from "@/store/Api/ProjectApi/ProjectApi";
import { useRemoveFavouriteProjectMutation } from "@/store/Api/StaffEmployeeApi/StaffEmployeeApi";
import { Skeleton } from "@/components/ui/skeleton";

const formatDate = (date: string | null) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "ACTIVE":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "MEDIUM":
      return "bg-orange-50 text-orange-700 border-orange-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export default function StaffEmployeeProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetProjectByIdQuery(
    id!
  );
  const [deleteProject, { isLoading: isDeleting }] =
    useRemoveFavouriteProjectMutation();

  const project = data?.data?.project || {};

  const handleDelete = async () => {
    if (!project) return;
    if (
      window.confirm("Are you sure you want to delete this project?")
    ) {
      await deleteProject(id).unwrap();
      navigate("/staff-employee-panel");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="container mx-auto px-4 py-6 text-center text-red-500">
        {error
          ? "Failed to load project details."
          : "Project not found."}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with Back + Delete */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-9">
          <div
            className="p-3 rounded-lg flex items-center gap-3 cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
            onClick={handleDelete}
          >
            <Trash2 size={18} />
            {isDeleting ? "Removing..." : "Remove from Favourites"}
          </div>
        </div>
      </div>

      {/* Title & Description */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {project.name}
        </h1>
        <p className="text-slate-500">{project.description}</p>
      </div>
      <div className="mb-8 flex items-end gap-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(
            project.status
          )}`}
        >
          {project.status}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityStyles(
            project.priority
          )}`}
        >
          {project.priority} Priority
        </span>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeline */}
        <section className="p-5 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4" /> Timeline
          </h4>

          <div className="space-y-4">
            <InfoItem
              icon={<Clock className="w-4 h-4" />}
              label="Start Date"
              value={formatDate(project.startDate)}
            />
            <InfoItem
              icon={<AlertCircle className="w-4 h-4" />}
              label="Deadline"
              value={formatDate(project.deadline)}
              highlight
            />
            <InfoItem
              icon={<Calendar className="w-4 h-4" />}
              label="Estimated Completion"
              value={formatDate(project.estimatedCompletedDate)}
            />
          </div>
        </section>

        {/* Project Data */}
        <section className="p-5 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4" /> Project Data
          </h4>

          <div className="space-y-4">
            <InfoItem
              icon={<DollarSign className="w-4 h-4" />}
              label="Budget"
              value={project.budget ?? "Not Set"}
            />
            <InfoItem
              icon={<TrendingUp className="w-4 h-4" />}
              label="Current Rate"
              value={project.currentRate ?? "N/A"}
            />
            <InfoItem
              icon={<MapPin className="w-4 h-4" />}
              label="Location"
              value={`${project.latitude.toFixed(
                2
              )}, ${project.longitude.toFixed(2)}`}
            />
          </div>
        </section>
      </div>

      {/* Progress */}
      <div className="p-5 mt-5 rounded-xl bg-slate-50 border border-slate-100 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Project Progress
          </span>
          <span className="text-sm font-bold text-primary">
            {project.progress}%
          </span>
        </div>
        <Progress value={project.progress} className="h-2" />
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-100 text-right text-xs text-slate-400">
        Last updated {formatDate(project.updatedAt)}
      </div>
    </div>
  );
}

/* Reusable Info Item */
const InfoItem = ({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) => (
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
      {icon}
    </div>
    <div>
      <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">
        {label}
      </p>
      <p
        className={`text-sm font-semibold ${
          highlight ? "text-rose-600" : "text-slate-700"
        }`}
      >
        {value}
      </p>
    </div>
  </div>
);
