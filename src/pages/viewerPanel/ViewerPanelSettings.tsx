import { useState } from "react";
import CheckboxGroupComponent from "@/components/client/Settings/CheckboxGroupComponent";
import APIConnectionCard from "@/components/client/Settings/APIConnectionCard";
import UserProfileSettings from "../client/Settings/Components/UserProfileSettings";

const ViewerPanelSettings = () => {
  // Notification checkboxes
  const [notifications, setNotifications] = useState({
    onProjectApproval: true,
    onProjectRejection: true,
    fileImportByEmployees: true,
    weeklySummary: true,
    storageLimit: true,
  });

  const notificationItems = [
    {
      id: "onProjectApproval",
      label: "On project Approval",
      checked: notifications.onProjectApproval,
    },
    {
      id: "onProjectRejection",
      label: "On project Rejection",
      checked: notifications.onProjectRejection,
    },
    {
      id: "fileImportByEmployees",
      label: "File import by employees",
      checked: notifications.fileImportByEmployees,
    },
    {
      id: "weeklySummary",
      label: "Weekly Summary",
      checked: notifications.weeklySummary,
    },
    {
      id: "storageLimit",
      label: "Storage Limit",
      checked: notifications.storageLimit,
    },
  ];

  const handleNotificationChange = (id: string, checked: boolean) => {
    setNotifications({ ...notifications, [id]: checked });
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserProfileSettings />

        <div className="space-y-6">
          <CheckboxGroupComponent
            title="Notification Settings"
            items={notificationItems}
            onChange={handleNotificationChange}
          />
          <div className="lg:col-span-2 border border-gray-100 rounded-2xl p-6 bg-white shadow-sm">
            <h4 className="mb-6 font-bold text-gray-900 tracking-tight text-xl">
              API Connection
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <APIConnectionCard
                name="Slack"
                status="Connected"
                lastSynced="Today"
                icon="/slack.png"
              />

              <APIConnectionCard
                name="Salesforce"
                status="Connected"
                lastSynced="Today"
                icon="/salesforce.png"
              />

              <APIConnectionCard
                name="AWS S3"
                status="Connected"
                lastSynced="Today"
                icon="/aws.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPanelSettings;
