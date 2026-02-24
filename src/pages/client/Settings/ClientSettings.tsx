import { useState } from "react";
import ToggleSwitchComponent from "@/components/client/Settings/ToggleSwitchComponent";
import ColorPickerComponent from "@/components/client/Settings/ColorPickerComponent";
import FileUploadComponent from "@/components/client/Settings/FileUploadComponent";
import BoxContainer from "@/common/BoxContainer";
import DropdownSelect from "@/common/DropdownSelect";
import PrimaryButton from "@/common/PrimaryButton";
import APIConnectionCard from "@/components/client/Settings/APIConnectionCard";
import Notification from "./Components/Notification";
import UserProfileSettings from "./Components/UserProfileSettings";

interface BrandingState {
  primaryColor: string;
  secondaryColor: string;
  logo: File | null;
  favicon: File | null;
}

interface BillingState {
  currentPlan: string;
  billingCycle: string;
  nextRenewal: string;
  paymentMethod: string;
  enableAutoRenew: boolean;
  address: string;
}

const ClientSettings = () => {
  const [branding, setBranding] = useState<BrandingState>({
    primaryColor: "#7F56D9",
    secondaryColor: "#6366F1",
    logo: null,
    favicon: null,
  });

  const [billing, setBilling] = useState<BillingState>({
    currentPlan: "Business",
    billingCycle: "Yearly",
    nextRenewal: "25/6/2026",
    paymentMethod: "Stripe",
    enableAutoRenew: true,
    address: "123 Business Ave\nSuite 500\nSan Francisco, CA 94105",
  });

  return (
    <div className="p-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
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

          <BoxContainer className="shadow-sm border-gray-100">
            <h4 className="text-xl font-semibold text-gray-800 mb-6">
              Setup Your Branding
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <FileUploadComponent
                label="Client Logo *"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          </BoxContainer>
        </div>

        {/* Column 2 */}
        <div className="space-y-8">
          <BoxContainer className="shadow-sm border-gray-100 bg-linear-to-br from-white to-gray-50/50">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-semibold text-gray-800">
                Billing & Plan
              </h4>
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                Pro
              </span>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DropdownSelect
                  label="Current Plan"
                  placeholderText={billing.currentPlan}
                  dropdownItem={[
                    { value: "Business", title: "Business" },
                    { value: "Premium", title: "Premium" },
                  ]}
                  onChange={(val: string) =>
                    setBilling((prev: BillingState) => ({
                      ...prev,
                      currentPlan: val,
                    }))
                  }
                />
                <DropdownSelect
                  label="Billing Cycle"
                  placeholderText={billing.billingCycle}
                  dropdownItem={[
                    { value: "Yearly", title: "Yearly" },
                    { value: "Monthly", title: "Monthly" },
                  ]}
                  onChange={(val: string) =>
                    setBilling((prev: BillingState) => ({
                      ...prev,
                      billingCycle: val,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Address
                </label>
                <textarea
                  className="w-full text-xs p-3 bg-white border border-gray-200 rounded-lg h-24 resize-none transition-all focus:ring-2 focus:ring-blue-100 outline-none"
                  value={billing.address}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setBilling((prev: BillingState) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                <ToggleSwitchComponent
                  label="Auto-renew"
                  enabled={billing.enableAutoRenew}
                  onChange={(val: boolean) =>
                    setBilling((prev: BillingState) => ({
                      ...prev,
                      enableAutoRenew: val,
                    }))
                  }
                />
                <PrimaryButton
                  type="Outline"
                  title="Upgrade"
                  className="scale-75 origin-right"
                />
              </div>
            </div>
          </BoxContainer>

          <Notification title="Notification Settings" />
          {/* Full width row at bottom for API Connections */}
          <div className="">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientSettings;
