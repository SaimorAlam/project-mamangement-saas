import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch" // The original Switch component
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone } from "lucide-react"
import CustomCheckbox from "@/components/ui/CustomCheckBox"

export default function StepOne() {
    const { register, watch, setValue } = useFormContext()
    const isReferred = watch("isReferred")

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-semibold text-blue-500 mb-6 text-lg">Company Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-md" htmlFor="clientName">Client Name *</Label>
                        <Input
                            id="clientName"
                            placeholder="Enter Client company name"
                            className="border border-gray-100"
                            {...register("clientName", { required: true })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-md" htmlFor="email">Email *</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="border border-gray-100 pl-10"
                                {...register("email", { required: true })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-md" htmlFor="contactPersonName">Contact Person Name *</Label>
                        <Input
                            id="contactPersonName"
                            placeholder="Enter company contact person name"
                            {...register("contactPersonName", { required: true })}
                            className="border border-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-md" htmlFor="phoneNumber">Phone number *</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                id="phoneNumber"
                                placeholder="+1 (555) 000-0000"
                                className="border border-gray-100 pl-10"
                                {...register("phoneNumber", { required: true })}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                    <CustomCheckbox
                        id="isReferred"
                        label="Client is referred by a partner or contact"
                        checked={isReferred}
                        onChange={(checked) => setValue("isReferred", checked)}
                    />
                </div>
            </div>

            {isReferred && (
                <div>
                    <h3 className="text-xl font-medium text-blue-500 mb-4">Referrer Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-md" htmlFor="referrerName">Name *</Label>
                            <Input
                                id="referrerName"
                                placeholder="Enter discount rate or promo code here"
                                {...register("referrerName")}
                                className="border border-gray-100"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-md" htmlFor="referrerEmail">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="referrerEmail"
                                    type="email"
                                    placeholder="Enter referrer email"
                                    className="border border-gray-100 pl-10"
                                    {...register("referrerEmail")}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-md" htmlFor="referrerPhone">Phone number *</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="referrerPhone"
                                    placeholder="+1 (555) 000-0000"
                                    className="border border-gray-100 pl-10"
                                    {...register("referrerPhone")}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="howDidHear">How did this client hear about us?</Label>
                            <Textarea
                                id="howDidHear"
                                placeholder="e.g. Social Media, Google, Friend, etc"
                                className="border border-gray-100 resize-none"
                                {...register("howDidHear")}
                            />
                            <p className="text-xs text-gray-500">Not visible to client</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
