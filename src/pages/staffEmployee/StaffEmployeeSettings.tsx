import { useEffect, useState } from "react";
import ToggleSwitchComponent from "@/components/client/Settings/ToggleSwitchComponent";
// import ColorPickerComponent from "@/components/client/Settings/ColorPickerComponent";
// import FileUploadComponent from "@/components/client/Settings/FileUploadComponent";
import BoxContainer from "@/common/BoxContainer";
import DropdownSelect from "@/common/DropdownSelect";
import PrimaryButton from "@/common/PrimaryButton";
// import APIConnectionCard from "@/components/client/Settings/APIConnectionCard";
import UserProfileSettings from "@/pages/client/Settings/Components/UserProfileSettings";
import { toast } from "sonner";

interface PreferencesState {
  defaultLanguage: string;
  defaultTimezone: string;
  allowTimezoneOverride: boolean;
  showRelativeTimestamps: boolean;
  dateFormat: string;
  timeFormat: string;
  firstDayOfWeek: string;
  enable2FA: boolean;
  sessionTimeout: string;
}

interface NotificationState {
  onProjectApproval: boolean;
  onProjectRejection: boolean;
  fileImportByEmployees: boolean;
  weeklySummary: boolean;
  storageLimit: boolean;
}

const StaffEmployeeSettings = () => {

  // const [branding, setBranding] = useState<BrandingState>({
  //   primaryColor: "#7F56D9",
  //   secondaryColor: "#6366F1",
  //   logo: null,
  //   favicon: null,
  // });

  const [preferences, setPreferences] = useState<PreferencesState>({
    defaultLanguage: "English (US)",
    defaultTimezone: "(UTC-06:00) Pacific Time (US & Canada)",
    allowTimezoneOverride: true,
    showRelativeTimestamps: true,
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12 hour",
    firstDayOfWeek: "Sunday",
    enable2FA: true,
    sessionTimeout: "10 min",
  });

  const [notifications, setNotifications] = useState<NotificationState>({
    onProjectApproval: true,
    onProjectRejection: true,
    fileImportByEmployees: true,
    weeklySummary: true,
    storageLimit: true,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const languages = [
    { value: "en-US", title: "English (US)" },
    { value: "en-UK", title: "English (UK)" },
    { value: "es", title: "Spanish" },
    { value: "fr", title: "French" },
    { value: "de", title: "German" },
    { value: "ja", title: "Japanese" },
    { value: "zh", title: "Chinese" },
    { value: "ar", title: "Arabic" },
  ];

  const timezones = [
    {
      value: "America/Los_Angeles",
      title: "(UTC-08:00) Pacific Time (US & Canada)",
    },
    {
      value: "America/Denver",
      title: "(UTC-07:00) Mountain Time (US & Canada)",
    },
    {
      value: "America/Chicago",
      title: "(UTC-06:00) Central Time (US & Canada)",
    },
    {
      value: "America/New_York",
      title: "(UTC-05:00) Eastern Time (US & Canada)",
    },
    { value: "Europe/London", title: "(UTC+00:00) London" },
    { value: "Europe/Paris", title: "(UTC+01:00) Paris" },
    { value: "Europe/Athens", title: "(UTC+02:00) Athens" },
    { value: "Asia/Kolkata", title: "(UTC+05:30) India" },
  ];

  const dateFormats = [
    { value: "DD/MM/YYYY", title: "DD/MM/YYYY" },
    { value: "MM/DD/YYYY", title: "MM/DD/YYYY" },
    { value: "YYYY-MM-DD", title: "YYYY-MM-DD" },
    { value: "DD MMM YYYY", title: "DD MMM YYYY" },
  ];

  const timeFormats = [
    { value: "12h", title: "12 hour" },
    { value: "24h", title: "24 hour" },
  ];

  const weekDays = [
    { value: "sunday", title: "Sunday" },
    { value: "monday", title: "Monday" },
    { value: "tuesday", title: "Tuesday" },
    { value: "wednesday", title: "Wednesday" },
    { value: "thursday", title: "Thursday" },
    { value: "friday", title: "Friday" },
    { value: "saturday", title: "Saturday" },
  ];

  // const plans = [
  //   { value: "business", title: "Business" },
  //   { value: "basic", title: "Basic" },
  //   { value: "premium", title: "Premium" },
  // ];
  // const billingCycles = [
  //   { value: "yearly", title: "Yearly" },
  //   { value: "monthly", title: "Monthly" },
  // ];
  // const paymentMethods = [
  //   { value: "stripe", title: "Stripe" },
  //   { value: "paypal", title: "PayPal" },
  //   { value: "bank-transfer", title: "Bank Transfer" },
  // ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
  ];

  const handleNotificationChange = (id: string, checked: boolean) => {
    setNotifications({ ...notifications, [id]: checked });
  };

  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Preferences saved successfully");
    } catch (error) {
      toast.error("Failed to save preferences");
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification settings saved successfully");
    } catch (error) {
      toast.error("Failed to save notification settings");
    } finally {
      setIsSavingNotifications(false);
    }
  };

  // const handleSaveBranding = async () => {
  //   try {
  //     // Simulate API call - replace with actual API
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     toast.success("Branding settings saved successfully");
  //   } catch (error) {
  //     toast.error("Failed to save branding settings");
  //   }
  // };

  return (
    <div className=" max-w-[1600px] mx-auto animate-in fade-in duration-500 mb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your account preferences and application configuration.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1 */}
        <div className="space-y-8">
          <UserProfileSettings />

          {/* <BoxContainer className="shadow-sm border-gray-100">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">
              Setup Your Branding
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <FileUploadComponent
                label="Employee Logo *"
                description="64x64 or 256x256"
                requirements="SVG, PNG, JPG (max 2MB)"
                buttonText="Upload Logo"
              />
              <FileUploadComponent
                label="Favicon"
                description="32x32"
                requirements="SVG, PNG (max 512KB)"
                buttonText="Upload Fav"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <ColorPickerComponent
                label="Primary Brand Color"
                value={branding.primaryColor}
                onChange={(val: string) =>
                  setBranding((prev: BrandingState) => ({
                    ...prev,
                    primaryColor: val,
                  }))
                }
              />
              <ColorPickerComponent
                label="Secondary Brand Color"
                value={branding.secondaryColor}
                onChange={(val: string) =>
                  setBranding((prev: BrandingState) => ({
                    ...prev,
                    secondaryColor: val,
                  }))
                }
              />
            </div>

            <div className="flex justify-end">
              <PrimaryButton
                type="Primary"
                title="Save Branding"
                onClick={handleSaveBranding}
              />
            </div>
          </BoxContainer> */}
        </div>

        {/* Column 2 */}
        <div className="space-y-8">
          <BoxContainer>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-800">
                Language, Date & Time zone Settings
              </h4>
            </div>

            <div className="space-y-6">
              <DropdownSelect
                label="Default Language"
                placeholderText={preferences.defaultLanguage}
                dropdownItem={languages}
                onChange={(val: string) =>
                  setPreferences((prev: PreferencesState) => ({
                    ...prev,
                    defaultLanguage: val,
                  }))
                }
              />

              <DropdownSelect
                label="Default Timezone"
                placeholderText={preferences.defaultTimezone}
                dropdownItem={timezones}
                onChange={(val: string) =>
                  setPreferences((prev: PreferencesState) => ({
                    ...prev,
                    defaultTimezone: val,
                  }))
                }
              />

              <ToggleSwitchComponent
                label="Allow user-level time zone override"
                enabled={preferences.allowTimezoneOverride}
                onChange={(val: boolean) =>
                  setPreferences((prev: PreferencesState) => ({
                    ...prev,
                    allowTimezoneOverride: val,
                  }))
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DropdownSelect
                  label="Date Format"
                  placeholderText={preferences.dateFormat}
                  dropdownItem={dateFormats}
                  onChange={(val: string) =>
                    setPreferences((prev: PreferencesState) => ({
                      ...prev,
                      dateFormat: val,
                    }))
                  }
                />
                <DropdownSelect
                  label="Time Format"
                  placeholderText={preferences.timeFormat}
                  dropdownItem={timeFormats}
                  onChange={(val: string) =>
                    setPreferences((prev: PreferencesState) => ({
                      ...prev,
                      timeFormat: val,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DropdownSelect
                  label="First Day of Week"
                  placeholderText={preferences.firstDayOfWeek}
                  dropdownItem={weekDays}
                  onChange={(val: string) =>
                    setPreferences((prev: PreferencesState) => ({
                      ...prev,
                      firstDayOfWeek: val,
                    }))
                  }
                />
                <div>
                  <ToggleSwitchComponent
                    label="Show relative timestamps"
                    enabled={preferences.showRelativeTimestamps}
                    onChange={(val: boolean) =>
                      setPreferences((prev: PreferencesState) => ({
                        ...prev,
                        showRelativeTimestamps: val,
                      }))
                    }
                    className="mb-2"
                  />
                  {preferences.showRelativeTimestamps && (
                    <div className="text-sm text-gray-600 px-3 py-2">
                      {currentTime.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <PrimaryButton
                  type="Primary"
                  title={isSavingPreferences ? "Saving..." : "Save Preferences"}
                  onClick={handleSavePreferences}
                  disabled={isSavingPreferences}
                />
              </div>
            </div>
          </BoxContainer>

          <BoxContainer>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-800">
                Notification Settings
              </h4>
              <PrimaryButton
                type="Primary"
                title={isSavingNotifications ? "Saving..." : "Save Changes"}
                onClick={handleSaveNotifications}
                disabled={isSavingNotifications}
              />
            </div>

            <div className="space-y-4">
              {notificationItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={
                      notifications[item.id as keyof typeof notifications]
                    }
                    onChange={(e) =>
                      handleNotificationChange(item.id, e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">{item.label}</label>
                </div>
              ))}
            </div>
          </BoxContainer>

          {/* <div className="">
            <BoxContainer className="shadow-sm border-gray-100">
              <h4 className="text-xl font-semibold text-gray-800 mb-6">
                Security Settings
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <ToggleSwitchComponent
                  label="Enable 2FA verification"
                  enabled={preferences.enable2FA}
                  onChange={(val: boolean) =>
                    setPreferences((prev: PreferencesState) => ({
                      ...prev,
                      enable2FA: val,
                    }))
                  }
                />
                <DropdownSelect
                  label="Session Timeout Duration"
                  placeholderText={preferences.sessionTimeout}
                  dropdownItem={[
                    { value: "10 min", title: "10 min" },
                    { value: "30 min", title: "30 min" },
                    { value: "1 hour", title: "1 hour" },
                    { value: "2 hours", title: "2 hours" },
                  ]}
                  onChange={(val: string) =>
                    setPreferences((prev: PreferencesState) => ({
                      ...prev,
                      sessionTimeout: val,
                    }))
                  }
                />
              </div>
            </BoxContainer>
          </div> */}

          {/* <div className="">
            <BoxContainer className="shadow-sm border-gray-100">
              <h4 className="text-xl font-semibold text-gray-800 mb-6">
                API Connections
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                <APIConnectionCard
                  name="Slack"
                  status="Active"
                  icon="/slack.png"
                  lastSynced="Today"
                />
                <APIConnectionCard
                  name="Salesforce"
                  status="Pending"
                  icon="/salesforce.png"
                  lastSynced="Today"
                />
                <APIConnectionCard
                  name="AWS S3"
                  status="Active"
                  icon="/aws.png"
                  lastSynced="Today"
                />
              </div>
            </BoxContainer>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default StaffEmployeeSettings;
