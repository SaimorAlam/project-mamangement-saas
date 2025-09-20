import type React from "react"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Upload, TrendingUp, X } from "lucide-react"
import { useState, useRef } from "react"
import type { FormData } from "@/types/form-types"

export function StepTwo() {
  const { control, watch, setValue } = useFormContext<FormData>()
  const primaryColor = watch("primaryBrandColor")
  const secondaryColor = watch("secondaryBrandColor")
  const logoInputRef = useRef<HTMLInputElement>(null)
  const faviconInputRef = useRef<HTMLInputElement>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null)

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue("clientLogo", file)
      const reader = new FileReader()
      reader.onload = (e) => setLogoPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setValue("favicon", file)
      const reader = new FileReader()
      reader.onload = (e) => setFaviconPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setValue("clientLogo", null)
    setLogoPreview(null)
    if (logoInputRef.current) logoInputRef.current.value = ""
  }

  const removeFavicon = () => {
    setValue("favicon", null)
    setFaviconPreview(null)
    if (faviconInputRef.current) faviconInputRef.current.value = ""
  }

  return (
    <div className="space-y-8">
      {/* Client Branding */}
      <div>
        <h3 className="text-lg font-medium text-blue-600 mb-4">Client Branding</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Client logo *</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    className="mx-auto h-16 w-16 object-contain mb-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeLogo}
                    className="absolute top-0 right-0 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <p className="text-sm text-gray-600">Logo uploaded successfully</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">64X64 or 256X256px</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Click to upload or drag and drop SVG, PNG, JPG or GIF (max size 2mb)
                  </p>
                </>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm" type="button">
                <Upload className="w-4 h-4 mr-2" />
                {logoPreview ? "Change Logo" : "Upload Logo"}
              </Button>
            </div>
          </div>
          <div>
            <Label>Favicon (Optional)</Label>
            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
              {faviconPreview ? (
                <div className="relative">
                  <img
                    src={faviconPreview || "/placeholder.svg"}
                    alt="Favicon preview"
                    className="mx-auto h-8 w-8 object-contain mb-2"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={removeFavicon}
                    className="absolute top-0 right-0 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <p className="text-sm text-gray-600">Favicon uploaded successfully</p>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">32X32</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Click to upload or drag and drop SVG, PNG(max size 512kb)
                  </p>
                </>
              )}
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/*"
                onChange={handleFaviconUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm" type="button">
                <Upload className="w-4 h-4 mr-2" />
                {faviconPreview ? "Change Favicon" : "Upload Favicon"}
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <FormField
            control={control}
            name="primaryBrandColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary brand color *</FormLabel>
                <div className="flex items-center gap-3">
                  <Input value={field.value} onChange={field.onChange} className="w-24" />
                  <input
                    type="color"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-16 h-10 rounded border cursor-pointer"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="secondaryBrandColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary brand color *</FormLabel>
                <div className="flex items-center gap-3">
                  <Input value={field.value} onChange={field.onChange} className="w-24" />
                  <input
                    type="color"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-16 h-10 rounded border cursor-pointer"
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Viewer Panel Configuration */}
      <div>
        <h3 className="text-lg font-medium text-blue-600 mb-4">Viewer panel configuration</h3>

        <FormField
          control={control}
          name="showFooterInViewer"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 mb-4">
              <Switch checked={field.value} onCheckedChange={field.onChange} />
              <FormLabel>Show footer in viewer panel</FormLabel>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={control}
            name="customFooterText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom footer text</FormLabel>
                <Input value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="supportContactLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support contact link</FormLabel>
                <Input value={field.value} onChange={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Branding Preview */}
      <div>
        <h3 className="text-lg font-medium text-blue-600 mb-4">Branding preview</h3>
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Overview</h4>
              <div className="space-y-2">
                <div className="h-4 rounded" style={{ backgroundColor: primaryColor, width: "80%" }} />
                <div className="h-4 rounded" style={{ backgroundColor: secondaryColor, width: "60%" }} />
                <div className="h-4 bg-gray-200 rounded w-40" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Statics</h4>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded" style={{ backgroundColor: primaryColor }}>
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Total Sales</p>
                  <p className="text-2xl font-bold">$2150k</p>
                  <p className="text-sm text-green-600">+15% ↗</p>
                  <p className="text-xs text-gray-500">$80k+ Sales growth</p>
                  <Button variant="link" className="p-0 h-auto text-xs">
                    View report →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
