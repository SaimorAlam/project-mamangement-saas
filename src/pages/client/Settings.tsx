import { useEffect, useState } from "react";
import ToggleSwitchComponent from "@/components/client/Settings/ToggleSwitchComponent";
import ColorPickerComponent from "@/components/client/Settings/ColorPickerComponent";
import FileUploadComponent from "@/components/client/Settings/FileUploadComponent";
import CheckboxGroupComponent from "@/components/client/Settings/CheckboxGroupComponent";
import BoxContainer from "@/components/client/common/BoxContainer";
import DropdownSelect from "@/components/client/common/DropdownSelect";
import PrimaryButton from "@/components/client/common/PrimaryButton";
// import APIConnectionCardComponent from '../../../components/ClientPanel/Help/Settings/APIConnectionCardComponent';

const Settings = () => {
  const [defaultLanguage, setDefaultLanguage] =
    useState("English (US)");
  const [defaultTimezone, setDefaultTimezone] = useState(
    "(UTC-06:00) Pacific Time (US & Canada)"
  );
  const [allowTimezoneOverride, setAllowTimezoneOverride] =
    useState(true);
  const [showRelativeTimestamps, setShowRelativeTimestamps] =
    useState(true);
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("12 hour");
  const [firstDayOfWeek, setFirstDayOfWeek] = useState("Sun Day");
  const [primaryColor, setPrimaryColor] = useState("#7F56D9");
  const [secondaryColor, setSecondaryColor] = useState("#6366F1");

  // Additional states for other sections
  const [currentPlan, setCurrentPlan] = useState("Business");
  const [billingCycle, setBillingCycle] = useState("Yearly");
  const [nextRenewal, setNextRenewal] = useState("25/6/2026");
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [enableAutoRenew, setEnableAutoRenew] = useState(true);
  const [enable2FA, setEnable2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("10 min");

  // Notification checkboxes
  const [notifications, setNotifications] = useState({
    onProjectApproval: true,
    onProjectRejection: true,
    fileImportByEmployees: true,
    weeklySummary: true,
    storageLimit: true,
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // update every second

    return () => clearInterval(timer); // cleanup on unmount
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

  const plans = [
    { value: "business", title: "Business" },
    { value: "basic", title: "Basic" },
    { value: "premium", title: "Premium" },
  ];
  const billingCycles = [
    { value: "yearly", title: "Yearly" },
    { value: "monthly", title: "Monthly" },
  ];
  const paymentMethods = [
    { value: "stripe", title: "Stripe" },
    { value: "paypal", title: "PayPal" },
    { value: "bank-transfer", title: "Bank Transfer" },
  ];

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

  const handleUpgrade = () => {};

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Language, Date & Time zone Settings */}
          <BoxContainer>
            <h4 className="mb-6">
              Language, Date & Time zone Settings
            </h4>

            <div className="space-y-6">
              <DropdownSelect
                label="Default Language"
                placeholderText={defaultLanguage}
                dropdownItem={languages}
                onChange={setDefaultLanguage}
              />

              <DropdownSelect
                label="Default Timezone"
                placeholderText={defaultTimezone}
                dropdownItem={timezones}
                onChange={setDefaultTimezone}
              />

              {/* Fixed: Using ToggleSwitchComponent instead of SelectDropdownComponent */}
              <ToggleSwitchComponent
                label="Allow user-level time zone override"
                enabled={allowTimezoneOverride}
                onChange={setAllowTimezoneOverride}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DropdownSelect
                  label="Date Format"
                  placeholderText={dateFormat}
                  dropdownItem={dateFormats}
                  onChange={setDateFormat}
                />
                <DropdownSelect
                  label="Time Format"
                  placeholderText={timeFormat}
                  dropdownItem={timeFormats}
                  onChange={setTimeFormat}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DropdownSelect
                  label="First Day of Week"
                  placeholderText={firstDayOfWeek}
                  dropdownItem={weekDays}
                  onChange={setFirstDayOfWeek}
                />
                <div>
                  <ToggleSwitchComponent
                    label="Show relative timestamps"
                    enabled={showRelativeTimestamps}
                    onChange={setShowRelativeTimestamps}
                    className="mb-2"
                  />
                  {showRelativeTimestamps && (
                    <div className="text-sm text-gray-600 px-3 py-2">
                      {currentTime.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </BoxContainer>

          <CheckboxGroupComponent
            title="Notification Settings"
            items={notificationItems}
            onChange={handleNotificationChange}
          />

          {/* <div className="border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">API Connection</h2>

        
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <APIConnectionCardComponent
                name="Slack"
                status="Connected"
                lastSynced="Today"
                icon={icon}
              />

              <APIConnectionCardComponent
                name="Salesforce"
                status="Connected"
                lastSynced="Today"
                icon={icon2}
              />
            </div>

       
            <div>
              <APIConnectionCardComponent
                name="AWS S3"
                status="Connected"
                lastSynced="Today"
                icon={icon3}
              />
            </div>
          </div> */}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Setup Your Branding */}
          <BoxContainer>
            <h4 className=" mb-6">Setup Your Branding</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FileUploadComponent
                label="Client logo *"
                description="64X64 or 256×256px"
                requirements="SVG, PNG, JPG or GIF (max size 2mb)"
                buttonText="Upload Logo"
              />

              <FileUploadComponent
                label="Favicon (Optional)"
                description="32X32"
                requirements="SVG, PNG (max size 512kb)"
                buttonText="Upload Favicon"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorPickerComponent
                label="Primary brand color *"
                value={primaryColor}
                onChange={setPrimaryColor}
              />

              <ColorPickerComponent
                label="Secondary brand color *"
                value={secondaryColor}
                onChange={setSecondaryColor}
              />
            </div>
          </BoxContainer>

          {/* Billing and Plan */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="mb-6">Billing and Plan</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <DropdownSelect
                label="Current Plan"
                placeholderText={currentPlan}
                dropdownItem={plans}
                onChange={setCurrentPlan}
              />

              <DropdownSelect
                label="Billing Cycle"
                placeholderText={billingCycle}
                dropdownItem={billingCycles}
                onChange={setBillingCycle}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Next renewal
                </label>
                <input
                  type="text"
                  value={nextRenewal}
                  onChange={(e) => setNextRenewal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <DropdownSelect
                label="Update Payment Method *"
                placeholderText={paymentMethod}
                dropdownItem={paymentMethods}
                onChange={setPaymentMethod}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Billing Address *{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                defaultValue="123 Business Ave
Suite 500
San Francisco, CA 94105"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <ToggleSwitchComponent
                label="Enable Auto renew"
                enabled={enableAutoRenew}
                onChange={setEnableAutoRenew}
              />

              <PrimaryButton
                type="Primary"
                title="Request to Upgrade"
                onClick={handleUpgrade}
              />
            </div>
          </div>

          {/* Security Settings */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="mb-6">Security Settings</h4>
            <div className="grid grid-cols-2 gap-30 items-start">
              <ToggleSwitchComponent
                label="Enable 2FA verification"
                enabled={enable2FA}
                onChange={setEnable2FA}
              />

              <div className="w-full sm:w-auto">
                <DropdownSelect
                  label="Session Timeout Duration"
                  placeholderText={sessionTimeout}
                  dropdownItem={[
                    "10 min",
                    "30 min",
                    "1 hour",
                    "2 hours",
                  ]}
                  onChange={setSessionTimeout}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
