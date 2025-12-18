import AppDialog from "@/common/Modal/ModalTemplate";
import { Project } from "@/components/client/ProjectReview/AllProjectReview";
import { Eye, Calendar, Users, AlertCircle, CheckCircle, Clock } from "lucide-react";

const IndividualProjectDetails = ({ project }: { project: Project }) => {
    
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Returned":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={16} className="text-emerald-600" />;
      case "Pending":
        return <Clock size={16} className="text-amber-600" />;
      case "Returned":
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-300";
      case "Medium":
        return "bg-orange-100 text-orange-700 border-orange-300";
      case "Low":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const avatarColors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  return (
    <AppDialog
      triggerButton={
        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors">
          <Eye size={16} />
        </button>
      }
      title="Project Details"
      description="View complete project information"
      footer={
        <div className="w-full flex gap-3">
          {/* <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Edit Project
          </button> */}
          {/* <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Close
          </button> */}
        </div>
      }
    >
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {project.name}
          </h3>
          <div className="flex gap-3">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-sm ${getStatusColor(
                project.status
              )}`}
            >
              {getStatusIcon(project.status)}
              <span>{project.status}</span>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border font-semibold text-sm ${getPriorityColor(
                project.priority
              )}`}
            >
              <span>{project.priority} Priority</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <Calendar size={16} />
              <span className="font-medium">Submit Date</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {project.submitDate}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <Users size={16} />
              <span className="font-medium">Staff Members</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {project.assignedStaff.length} Members
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700 font-semibold">
            <Users size={18} />
            <span>Assigned Staff</span>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
            {project.assignedStaff.map((staff, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full ${
                    avatarColors[index % avatarColors.length]
                  } flex items-center justify-center text-white font-semibold text-sm shadow-md`}
                >
                  {getInitials(staff)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{staff}</p>
                  <p className="text-sm text-gray-500">Staff Member</p>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle size={16} className="text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Status Overview</h4>
              <p className="text-sm text-blue-700">
                {project.status === "Approved"
                  ? "This project has been approved and is ready to proceed."
                  : project.status === "Pending"
                  ? "This project is pending review and awaiting approval."
                  : "This project has been returned for revisions."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppDialog>
  );
};

export default IndividualProjectDetails;
