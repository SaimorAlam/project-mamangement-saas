import { useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetProgramByIdQuery } from "@/store/Api/ProgramApi/ProgramApi";

export default function ProgramDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetProgramByIdQuery(id!, { skip: !id });
  const program = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[80vh] gap-4">
        <Loader2 className="animate-spin text-indigo-600 h-12 w-12" />
        <p className="text-gray-600 font-medium text-lg">Loading program details...</p>
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-center px-4">
        <div className="bg-red-100 p-6 rounded-full mb-6">
          <AlertCircle className="text-red-600 h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Program</h2>
        <p className="text-gray-600 max-w-md">
          We encountered an issue retrieving the program details. Please check your connection and try again.
        </p>
      </div>
    );
  }

  const getPriorityColor = (prio: string) => {
    switch (prio?.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-8 lg:p-10 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <Badge
                  variant="outline"
                  className={`${getPriorityColor(program.priority)} px-4 py-1.5 text-xs font-semibold uppercase tracking-wider`}
                >
                  {program.priority} Priority
                </Badge>
                
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                {program.programName}
              </h1>
              <span className="text-sm text-gray-500 font-mono">ID: {id}</span>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
                {program.programDescription}
              </p>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-xl min-w-[280px] transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6" />
                  <span className="font-semibold text-indigo-100">Progress</span>
                </div>
                <span className="text-3xl font-black">{program.progress}%</span>
              </div>
              <Progress value={program.progress} className="h-3 bg-white/20">
                <div className="bg-white h-full rounded-full" />
              </Progress>
            </div>
          </div>
        </div>

        <div className="">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 w-full">
            {/* Timeline Card */}
            <div className="bg-white rounded-3xl  border border-gray-200/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b border-gray-200 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <h2 className="font-bold text-gray-800 uppercase tracking-wider text-sm">
                  Timeline & Schedule
                </h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <DetailItem
                  label="Start Date"
                  value={formatDate(program.datetime)}
                  icon={<Clock className="h-5 w-5 text-indigo-600" />}
                />
                <DetailItem
                  label="Deadline"
                  value={formatDate(program.deadline)}
                  icon={<AlertCircle className="h-5 w-5 text-orange-500" />}
                />
                <DetailItem label="Last Updated" value={formatDate(program.updatedAt)} />
                <DetailItem label="Created On" value={formatDate(program.createdAt)} />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="group hover:bg-gray-50/50 p-6 rounded-2xl transition-colors duration-200">
      <div className="flex items-center gap-3 mb-3">
        {icon || ""}
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
        {value}
      </p>
    </div>
  );
}