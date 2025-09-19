"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { FormData } from "@/types/form-types"

export function StepOne() {
  const { control, watch } = useFormContext<FormData>()
  const isReferred = watch("isReferred")

  return (
    <div className="space-y-8">
      {/* Company Information */}
      <div>
        <h3 className="text-lg font-medium text-blue-600 mb-4">Company Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name *</FormLabel>
                <Input placeholder="Enter Client company name" value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <Input type="email" placeholder="Enter your email" value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="contactPersonName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person Name *</FormLabel>
                <Input placeholder="Enter company contact person name" value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number *</FormLabel>
                <div className="flex">
                  <select className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-50 text-sm">
                    <option>US</option>
                  </select>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    value={field.value}
                    onChange={field.onChange}
                    className="rounded-l-none"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="isReferred"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 mt-6">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <FormLabel>Client is referred by a partner or contact</FormLabel>
            </FormItem>
          )}
        />
      </div>

      {/* Referrer Information */}
      {isReferred && (
        <div>
          <h3 className="text-lg font-medium text-blue-600 mb-4">Referrer Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={control}
              name="referrerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <Input placeholder="Enter referrer name" value={field.value || ""} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="referrerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter referrer email"
                    value={field.value || ""}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="referrerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number *</FormLabel>
                  <div className="flex">
                    <select className="px-3 py-2 border border-r-0 rounded-l-md bg-gray-50 text-sm">
                      <option>US</option>
                    </select>
                    <Input
                      placeholder="+1 (555) 000-0000"
                      value={field.value || ""}
                      onChange={field.onChange}
                      className="rounded-l-none"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="howDidClientHear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How did this client hear about us?</FormLabel>
                  <Textarea
                    placeholder="e.g. Social Media, Google, Friend, etc"
                    value={field.value || ""}
                    onChange={field.onChange}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">Not visible to client</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}
