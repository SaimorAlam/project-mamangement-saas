"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, TrendingUp } from "lucide-react"
import { useState } from "react"

export default function StepTwo() {
  const { control, watch, setValue, register } = useFormContext() // <-- register added

  const showFooter = watch("showFooter")
  const primaryColor = watch("primaryColor") || "#1C73E0"
  const secondaryColor = watch("secondaryColor") || "#F59E0B"

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)

  return (
    <div className="space-y-8">

      {/* Client Branding */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Client Branding</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Client logo *</Label>
            <Controller
              name="clientLogo"
              control={control}
              render={({ field }) => (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logoUpload"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        field.onChange(file)
                        setLogoPreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                  <label htmlFor="logoUpload" className="flex flex-col items-center">
                    {logoPreview ? (
                      <img src={logoPreview} className="w-24 h-24 object-contain mb-2" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-400">SVG, PNG, JPG, GIF (max 2MB)</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            />
          </div>

          {/* Favicon Upload */}
          <div className="space-y-2">
            <Label>Favicon (Optional)</Label>
            <Controller
              name="favicon"
              control={control}
              render={({ field }) => (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="faviconUpload"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        field.onChange(file)
                        setFaviconPreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                  <label htmlFor="faviconUpload" className="flex flex-col items-center">
                    {faviconPreview ? (
                      <img src={faviconPreview} className="w-16 h-16 object-contain mb-2" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-400">SVG, PNG (max 512KB)</span>
                      </>
                    )}
                  </label>
                </div>
              )}
            />
          </div>

        </div>

        {/* Brand Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* Primary Color */}
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary brand color *</Label>
            <Controller
              name="primaryColor"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-16 h-10 p-0 border-none cursor-pointer"
                  />
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    className="w-24 h-10 p-2 border rounded"
                  />
                  <div
                    className="w-16 h-10 rounded border"
                    style={{ backgroundColor: field.value }}
                  />
                </div>
              )}
            />
          </div>

          {/* Secondary Color */}
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary brand color *</Label>
            <Controller
              name="secondaryColor"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-16 h-10 p-0 border-none cursor-pointer"
                  />
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    className="w-24 h-10 p-2 border rounded"
                  />
                  <div
                    className="w-16 h-10 rounded border"
                    style={{ backgroundColor: field.value }}
                  />
                </div>
              )}
            />
          </div>

        </div>

      </div>

      {/* Viewer Panel */}
      <div>
        <h3 className="text-lg font-medium text-blue-600 mb-4">Viewer panel configuration</h3>

        <Controller
          name="showFooter"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3 mb-4">
              <Switch
                id="showFooter"
                checked={field.value || false}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="showFooter">Show footer in viewer panel</Label>
            </div>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="customFooterText">Custom footer text</Label>
            <Input id="customFooterText" {...register("customFooterText")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportContactLink">Support contact link</Label>
            <Input id="supportContactLink" {...register("supportContactLink")} />
          </div>
        </div>
      </div>

      {/* Branding Preview */}
      <div>
        <h3 className="text-lg font-medium text-blue-600 mb-4">Branding preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Overview</h4>
            <div className="space-y-2">
              <div className="h-4 rounded" style={{ backgroundColor: primaryColor }} />
              <div className="h-4 rounded" style={{ backgroundColor: secondaryColor }} />
              <div className="h-2 bg-gray-200 rounded w-3/4" />
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Statics</h4>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded" style={{ backgroundColor: primaryColor }}>
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Total Sales</div>
                    <div className="text-2xl font-bold">$2150k</div>
                    <div className="text-sm text-green-600">+15% ↗</div>
                    <div className="text-xs text-gray-500">$80k+ Sales growth</div>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      View report →
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
