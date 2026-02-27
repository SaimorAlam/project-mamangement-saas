import { useEffect, useState } from "react";
import BoxContainer from "@/common/BoxContainer";
import PrimaryButton from "@/common/PrimaryButton";
import DropdownSelect from "@/common/DropdownSelect";
import ToggleSwitchComponent from "@/components/client/Settings/ToggleSwitchComponent";
import {
  useGetProfileQuery,
  useUpdateUsersMutation,
} from "@/store/Api/UserApi/UserApi";
import { toast } from "sonner";

interface ProfileState {
  name: string;
  email: string;
  phoneNumber: string;
  language: string;
  timezone: string;
  verification2FA: boolean;
  userStatus: string;
  profileImage: File | null;
  imagePreview: string;
  // New fields from parents
  allowTimezoneOverride: boolean;
  showRelativeTimestamps: boolean;
  dateFormat: string;
  timeFormat: string;
  firstDayOfWeek: string;
  sessionTimeout: string;
}

// const IMG_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "/");

const UserProfileSettings = ({ className = "" }: { className?: string }) => {
  const { data: profileData, isLoading: profileLoading } = useGetProfileQuery({});
  const [updateUser, { isLoading: isUpdating }] = useUpdateUsersMutation();

  const [profile, setProfile] = useState<ProfileState>({
    name: "",
    email: "",
    phoneNumber: "",
    language: "English (US)",
    timezone: "(UTC-06:00) Central Time (US & Canada)",
    verification2FA: false,
    userStatus: "active",
    profileImage: null,
    imagePreview: "",
    allowTimezoneOverride: true,
    showRelativeTimestamps: true,
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12 hour",
    firstDayOfWeek: "Sunday",
    sessionTimeout: "10 min",
  });

  useEffect(() => {
    if (profileData?.data) {
      const user = profileData.data;
      setProfile((prev: ProfileState) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        language: user.language || prev.language,
        timezone: user.timezone || prev.timezone,
        verification2FA: user.verification2FA || false,
        userStatus: user.userStatus || "active",
        imagePreview: user.profileImage
          ? `${user.profileImage}`
          : "",
        // Initialize other fields with current state or backend defaults if they existed
      }));
    }
  }, [profileData]);

  const handleProfileUpdate = async () => {
    const user = profileData?.data;
    const hasImage = !!profile.profileImage;
    let hasChanged = false;

    // Use JSON if no image, otherwise FormData
    if (!hasImage) {
      const payload: Record<string, string | boolean | number | null> = {};

      if (profile.language !== user?.language) {
        payload.language = profile.language;
        hasChanged = true;
      }
      if (profile.timezone !== user?.timezone) {
        // Convert to ISO 8601 date string to satisfy backend validation
        payload.timezone = new Date().toISOString();
        hasChanged = true;
      }

      if (!hasChanged) {
        toast.info("No changes to save");
        return;
      }

      try {
        await updateUser(payload).unwrap();
        toast.success("Profile updated successfully");
      } catch {
        toast.error("Failed to update profile");
      }
    } else {
      const formData = new FormData();
      if (profile.language !== user?.language) {
        formData.append("language", profile.language);
        hasChanged = true;
      }
      if (profile.timezone !== user?.timezone) {
        formData.append("timezone", new Date().toISOString());
        hasChanged = true;
      }
      if (profile.profileImage) {
        formData.append("profileImage", profile.profileImage);
        hasChanged = true;
      }

      try {
        await updateUser(formData).unwrap();
        toast.success("Profile updated successfully");
        setProfile((prev) => ({ ...prev, profileImage: null }));
      } catch {
        toast.error("Failed to update profile");
      }
    }
  };

  const handle2FAChange = async (val: boolean) => {
    // Optimistically update local state
    setProfile((prev: ProfileState) => ({
      ...prev,
      verification2FA: val,
    }));

    try {
      // Send as JSON to preserve boolean type
      await updateUser({ verification2FA: val }).unwrap();
      toast.success(`2FA ${val ? "enabled" : "disabled"} successfully`);
    } catch {
      // Revert if API fails
      setProfile((prev: ProfileState) => ({
        ...prev,
        verification2FA: !val,
      }));
      toast.error("Failed to update 2FA status");
    }
  };

  const languages = [
    { value: "English (US)", title: "English (US)" },
    { value: "English (UK)", title: "English (UK)" },
    { value: "Spanish", title: "Spanish" },
    { value: "French", title: "French" },
  ];

  const timezones = [
    {
      value: "America/Chicago",
      title: "(UTC-06:00) Central Time (US & Canada)",
    },
    {
      value: "America/New_York",
      title: "(UTC-05:00) Eastern Time (US & Canada)",
    },
    { value: "Europe/London", title: "(UTC+00:00) London" },
  ];

  if (profileLoading)
    return <div className="p-6 text-center">Loading Profile...</div>;

  return (
    <BoxContainer className={`shadow-sm border-gray-100 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xl font-semibold text-gray-900 tracking-tight">
            User Profile & Preferences
          </h4>
          <p className="text-xs text-gray-400 font-medium">
            Manage your personal information and application settings
          </p>
        </div>
        <PrimaryButton
          type="Primary"
          title={isUpdating ? "Saving..." : "Save Changes"}
          onClick={handleProfileUpdate}
          disabled={isUpdating}
          className="scale-90"
        />
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-linear-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-50/50">
          <div className="w-24 h-24 rounded-full bg-white shadow-md border-4 border-white overflow-hidden group relative shrink-0">
            {profile.imagePreview ? (
              <img
                src={profile.imagePreview}
                alt="Profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-3xl transition-transform duration-500 group-hover:scale-110">
                {profile.name?.charAt(0) || "U"}
              </div>
            )}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                Change
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setProfile((prev: ProfileState) => ({
                      ...prev,
                      profileImage: file,
                      imagePreview: URL.createObjectURL(file),
                    }));
                  }
                }}
              />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate">
              {profile.name || "User Name"}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-colors ${
                  profile.userStatus?.toLowerCase() === "active"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-gray-50 text-gray-500 border-gray-100"
                }`}
              >
                {profile.userStatus}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border bg-blue-50 text-blue-600 border-blue-100">
                {profileData?.data?.role || "CLIENT"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="text"
              value={profile.email}
              disabled
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-medium text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Phone Number
            </label>
            <input
              type="text"
              value={profile.phoneNumber}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-medium text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DropdownSelect
            label="Preferred Language"
            placeholderText={profile.language}
            dropdownItem={languages}
            onChange={(val: string) =>
              setProfile((prev: ProfileState) => ({
                ...prev,
                language: val,
              }))
            }
          />

          <DropdownSelect
            label="Region/Timezone"
            placeholderText={profile.timezone}
            dropdownItem={timezones}
            onChange={(val: string) =>
              setProfile((prev: ProfileState) => ({
                ...prev,
                timezone: val,
              }))
            }
          />
        </div>

        <div className="space-y-6 pt-4 border-t border-gray-100">
          <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
            Security Settings
          </h5>
          <div className="grid">
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full -mr-12 -mt-12 transition-all duration-700 group-hover:scale-150" />
              <div className="flex items-center justify-between relative z-10">
                <ToggleSwitchComponent
                  label="2FA Verification"
                  enabled={profile.verification2FA}
                  onChange={handle2FAChange}
                />
                {!profile.verification2FA && (
                  <span className="text-[9px] font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-tighter animate-pulse">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-[11px] text-blue-600/70 font-medium leading-relaxed">
                Highly recommended for account security. Uses a verification
                code in addition to your password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BoxContainer>
  );
};

export default UserProfileSettings;
