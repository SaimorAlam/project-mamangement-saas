import PrimaryButton from "@/common/PrimaryButton";
import { useUpdateNotificationClientMutation } from "@/store/Api/SettingsApi/SettingsApi";
import { useState } from "react";
import { toast } from "sonner";

interface CheckboxGroupProps {
  title: string;
  className?: string;
}
type NotificationState = {
  onProjectApproval: boolean;
  onProjectRejection: boolean;
  fileImportByEmployees: boolean;
  weeklySummary: boolean;
  storageLimit: boolean;
  billPayment: boolean;
  overdueProject: boolean;
};

const Notification = ({ title, className = "" }: CheckboxGroupProps) => {
  const [updateNotificationClient] = useUpdateNotificationClientMutation();
  const [notifications, setNotifications] = useState<NotificationState>({
    onProjectApproval: true,
    onProjectRejection: true,
    fileImportByEmployees: true,
    weeklySummary: true,
    storageLimit: true,
    billPayment: true,
    overdueProject: true,
  });

  const notificationItems = [
    {
      id: "onProjectApproval",
      label: "On project Approval",
    },
    {
      id: "onProjectRejection",
      label: "On project Rejection",
    },
    {
      id: "fileImportByEmployees",
      label: "File import by employees",
    },
    {
      id: "weeklySummary",
      label: "Weekly Summary",
    },
    {
      id: "storageLimit",
      label: "Storage Limit",
    },
    {
      id: "billPayment",
      label: "Bill Payment",
    },
    {
      id: "overdueProject",
      label: "Overdue Project",
    },
  ] as const;

  const handleNotificationChange = (id: string, checked: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await updateNotificationClient(notifications).unwrap();
      console.log(response);
      toast.success("Notification settings updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update notification settings");
    }
  };
  return (
    <div className={`border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <PrimaryButton
          onClick={handleSubmit}
          type="Primary"
          title="Save Changes"
          className=""
        />
      </div>
      <div className="space-y-4">
        {notificationItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={notifications[item.id as keyof typeof notifications]}
              onChange={(e) =>
                handleNotificationChange(item.id, e.target.checked)
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">{item.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
