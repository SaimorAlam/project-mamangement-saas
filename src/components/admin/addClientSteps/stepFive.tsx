import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { FormData } from "@/types/form-types"
import { CustomCheckBox } from "@/components/ui/CustomCheckBox"

export function StepFive() {
  const { watch, setValue } = useFormContext<FormData>()
  const formData = watch()

  const updateFormData = (data: Partial<FormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      setValue(key as keyof FormData, value, { shouldValidate: true })
    })
  }

  return (
    <div className="space-y-8">
      {/* Storage Configuration */}
      <div>
        <h3 className="text-xl font-medium text-blue-600 mb-4">Storage Configuration</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-md" htmlFor="storageQuota">Storage Quota (GB) *</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="storageQuota"
                placeholder="e.g 10 GB"
                value={formData.storageQuota || ""}
                onChange={(e) => updateFormData({ storageQuota: e.target.value })}
                className="border border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-2 focus:border-gray-500"
              />
            </div>
          </div>
          <div>
            <Label className="text-md" htmlFor="archiveAfter">Archive after (Days) *</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="archiveAfter"
                placeholder="e.g 90 days"
                value={formData.archiveAfter || ""}
                onChange={(e) => updateFormData({ archiveAfter: e.target.value })}
                className="border border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-2 focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-4">
            <CustomCheckBox
              checked={formData.enableUsageWarningAlerts || false}
              onChange={(checked) => updateFormData({ enableUsageWarningAlerts: checked })}
            />
            <Label className="text-md" htmlFor="enableUsageWarningAlerts">Enable usage warning alerts</Label>
          </div>
          <p className="text-sm text-gray-600">Send alert when client reaches 80% of capacity</p>

          <div className="mt-4">
            <Label className="text-md" htmlFor="autoArchiveThreshold">Auto-Archive Threshold (%) *</Label>
            <Input
              id="autoArchiveThreshold"
              placeholder="e.g 85%"
              value={formData.autoArchiveThreshold || ""}
              onChange={(e) => updateFormData({ autoArchiveThreshold: e.target.value })}
              className="border border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-2 focus:border-gray-500 mt-1 max-w-xs"
            />
          </div>
        </div>
      </div>

      {/* Billing Information */}
      <div>
        <h3 className="text-xl text-lg font-medium text-blue-600 mb-4">Billing Information</h3>

        <div className="mb-6">
          <Label>Billing Cycle</Label>
          <div className="flex gap-2 mt-2">
            {[
              { value: "Monthly", label: "Monthly" },
              { value: "Half-Yearly", label: "Half-Yearly", discount: "Save up to 10% Annually" },
              { value: "Yearly", label: "Yearly", discount: "Save 15% Annually" },
              { value: "2-Yearly", label: "2-Yearly", discount: "Save 20% Annually" },
            ].map((option) => (
              <div key={option.value} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => updateFormData({ billingCycle: option.value })}
                  className={`px-4 py-2 rounded-md border text-sm font-medium ${
                    formData.billingCycle === option.value
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
                {option.discount && <span className="text-xs text-green-600 mt-1">{option.discount}</span>}
              </div>
            ))}
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => updateFormData({ billingCycle: "Enterprise" })}
              className={`px-4 py-2 rounded-md border text-sm font-medium ${
                formData.billingCycle === "Enterprise"
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Enterprise
            </button>
            <span className="text-xs text-blue-600 ml-2">Custom Billing</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-md" htmlFor="subscriptionPlan">Subscription Plan *</Label>
            <Select
              value={formData.subscriptionPlan || ""}
              onValueChange={(value) => updateFormData({ subscriptionPlan: value })}
            >
              <SelectTrigger className="mt-1 border border-gray-300">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent className="bg-white border-none">
                <SelectItem value="basic">Basic Plan</SelectItem>
                <SelectItem value="professional">Professional Plan</SelectItem>
                <SelectItem value="enterprise">Enterprise Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-md" htmlFor="discountPromotion">Discount/Promotions</Label>
            <Input
              id="discountPromotion"
              placeholder="Enter discount rate or promo code here"
              value={formData.discountPromotion || ""}
              onChange={(e) => updateFormData({ discountPromotion: e.target.value })}
              className="border border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-2 focus:border-gray-500 mt-1"
            />
          </div>
          <div>
            <Label className="text-md" htmlFor="startBillingDate">Start Billing Date</Label>
            <Input
              id="startBillingDate"
              type="date"
              value={formData.startBillingDate || ""}
              onChange={(e) => updateFormData({ startBillingDate: e.target.value })}
              className="border border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-2 focus:border-gray-500 mt-2"
            />
          </div>
          <div>
            <Label className="text-md" htmlFor="trialPeriod">Trial Period</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                id="trialPeriod"
                placeholder="e.g. 15 Days"
                value={formData.trialPeriod || ""}
                onChange={(e) => updateFormData({ trialPeriod: e.target.value })}
                className="border border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-2 focus:border-gray-500"
              />
            </div>
          </div>
          <div>
            <Label className="text-md" htmlFor="paymentMethod">Client's Preferred Payment Method *</Label>
            <Select
              value={formData.paymentMethod || ""}
              onValueChange={(value) => updateFormData({ paymentMethod: value })}
            >
              <SelectTrigger className="mt-2 border border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-none">
                <SelectItem value="Stripe">Stripe</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-md" htmlFor="discountPromotionSecond">Discount/Promotions</Label>
            <Input
              id="discountPromotionSecond"
              placeholder="Enter discount rate or promo code here"
              value={formData.discountPromotion || ""}
              onChange={(e) => updateFormData({ discountPromotion: e.target.value })}
              className="border border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-2 focus:border-gray-500 mt-2"
            />
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <CustomCheckBox
            checked={formData.internalNotesEnabled || false}
            onChange={(checked) => updateFormData({ internalNotesEnabled: checked })}
          />
          <Label htmlFor="internalNotesEnabled">Internal Notes</Label>
        </div>

        {formData.internalNotesEnabled && (
          <div>
            <h4 className="text-blue-600 font-medium mb-2 text-md">Internal Notes for Admin only</h4>
            <div>
              <Label htmlFor="adminNote">Admin Note</Label>
              <Textarea
                id="adminNote"
                placeholder="e.g. Custom instance setup required for this client."
                value={formData.adminNote || ""}
                onChange={(e) => updateFormData({ adminNote: e.target.value })}
                className="border border-gray-300 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus:border-2 focus:border-gray-500 mt-2"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">Not visible to client</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
