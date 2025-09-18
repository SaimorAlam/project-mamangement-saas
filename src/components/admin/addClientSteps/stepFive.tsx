import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function StepFive() {
  const { register, watch, setValue } = useFormContext()
  const enableUsageWarning = watch("enableUsageWarning")
  const internalNotes = watch("internalNotes")

  const billingCycles = [
    { value: "Monthly", label: "Monthly", discount: null },
    { value: "Half-Yearly", label: "Half-Yearly", discount: "Save up to 10% Annually" },
    { value: "Yearly", label: "Yearly", discount: "Save 15% Annually" },
    { value: "2-Yearly", label: "2-Yearly", discount: "Save 20% Annually" },
    { value: "Enterprise", label: "Enterprise", discount: "Custom Billing" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Storage Configuration</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="storageQuota">Storage Quota (GB) *</Label>
            <div className="flex">
              <Input id="storageQuota" {...register("storageQuota", { required: true })} className="rounded-r-none" />
              <div className="bg-gray-100 border border-l-0 px-3 py-2 rounded-r text-sm text-gray-600">GB</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="archiveAfter">Archive after (Days) *</Label>
            <div className="flex">
              <Input id="archiveAfter" {...register("archiveAfter", { required: true })} className="rounded-r-none" />
              <div className="bg-gray-100 border border-l-0 px-3 py-2 rounded-r text-sm text-gray-600">days</div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enableUsageWarning"
              checked={enableUsageWarning}
              onCheckedChange={(checked) => setValue("enableUsageWarning", checked)}
            />
            <Label htmlFor="enableUsageWarning">Enable usage warning alerts</Label>
          </div>
          <p className="text-sm text-gray-600 mt-1">Send alert when client reaches 80% of capacity</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-blue-600 mb-4">Billing Information</h3>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-3 block">Billing Cycle</Label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {billingCycles.map((cycle) => (
                <div
                  key={cycle.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    watch("billingCycle") === cycle.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setValue("billingCycle", cycle.value)}
                >
                  <div className="text-sm font-medium">{cycle.label}</div>
                  {cycle.discount && (
                    <Badge variant="secondary" className="text-xs mt-1 bg-green-100 text-green-700">
                      {cycle.discount}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Subscription Plan *</Label>
              <Select value={watch("subscriptionPlan")} onValueChange={(value) => setValue("subscriptionPlan", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter - $29/month</SelectItem>
                  <SelectItem value="professional">Professional - $79/month</SelectItem>
                  <SelectItem value="enterprise">Enterprise - $199/month</SelectItem>
                  <SelectItem value="custom">Custom Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount/Promotions</Label>
              <Input placeholder="Enter discount rate or promo code here" {...register("discountCode")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startBillingDate">Start Billing Date</Label>
              <Input id="startBillingDate" type="date" {...register("startBillingDate")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trialPeriod">Trial Period</Label>
              <div className="flex">
                <Input id="trialPeriod" {...register("trialPeriod")} className="rounded-r-none" />
                <div className="bg-gray-100 border border-l-0 px-3 py-2 rounded-r text-sm text-gray-600">Days</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Client's Preferred Payment Method *</Label>
              <Select value={watch("paymentMethod")} onValueChange={(value) => setValue("paymentMethod", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                  <SelectItem value="PayPal">PayPal</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Invoice">Invoice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount/Promotions</Label>
              <Input placeholder="Enter discount rate or promo code here" {...register("discountCode")} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="internalNotes"
            checked={internalNotes}
            onCheckedChange={(checked) => setValue("internalNotes", checked)}
          />
          <Label htmlFor="internalNotes">Internal Notes</Label>
        </div>

        {internalNotes && (
          <div>
            <h4 className="text-blue-600 font-medium mb-3">Internal Notes for Admin only</h4>
            <div className="space-y-2">
              <Label htmlFor="adminNote">Admin Note</Label>
              <Textarea
                id="adminNote"
                placeholder="e.g. Custom instance setup required for this client."
                rows={4}
                {...register("adminNote")}
              />
              <p className="text-xs text-gray-500">Not visible to client</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
