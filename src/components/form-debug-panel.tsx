// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import type { FormData } from "@/types/form-types"
// import type { FieldErrors } from "react-hook-form"

// interface FormDebugPanelProps {
//   formData: FormData
//   errors: FieldErrors<FormData>
//   currentStep: number
//   isValid: boolean
// }

// export function FormDebugPanel({ formData, errors, currentStep, isValid }: FormDebugPanelProps) {
//   const [isExpanded, setIsExpanded] = useState(false)

//   const getStepData = (step: number): Partial<FormData> => {
//     switch (step) {
//       case 1:
//         return {
//           clientName: formData.clientName,
//           email: formData.email,
//           contactPersonName: formData.contactPersonName,
//           phoneNumber: formData.phoneNumber,
//           isReferred: formData.isReferred,
//         }
//       case 2:
//         return {
//           primaryBrandColor: formData.primaryBrandColor,
//           secondaryBrandColor: formData.secondaryBrandColor,
//           showFooterInViewer: formData.showFooterInViewer,
//         }
//       case 3:
//         return {
//           subdomain: formData.subdomain,
//           regionServerLocation: formData.regionServerLocation,
//           timeZone: formData.timeZone,
//         }
//       case 4:
//         return {
//           enableCustomChartLibrary: formData.enableCustomChartLibrary,
//           notifyDevQATeam: formData.notifyDevQATeam,
//         }
//       case 5:
//         return {
//           storageQuota: formData.storageQuota,
//           billingCycle: formData.billingCycle,
//           subscriptionPlan: formData.subscriptionPlan,
//         }
//       default:
//         return {}
//     }
//   }

//   if (!isExpanded) {
//     return (
//       <div className="fixed top-4 right-4 z-50">
//         <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)} className="bg-white shadow-lg">
//           Debug Form
//           <Badge variant={isValid ? "default" : "destructive"} className="ml-2">
//             Step {currentStep}
//           </Badge>
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <Card className="fixed top-4 right-4 w-80 max-h-96 overflow-auto z-50 shadow-lg">
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-center">
//           <CardTitle className="text-sm">Form Debug Panel</CardTitle>
//           <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
//             ×
//           </Button>
//         </div>
//         <div className="flex gap-2">
//           <Badge variant={isValid ? "default" : "destructive"}>
//             Step {currentStep} {isValid ? "Valid" : "Invalid"}
//           </Badge>
//           <Badge variant="outline">{Object.keys(errors).length} Errors</Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div className="space-y-3">
//           <div>
//             <h4 className="text-xs font-semibold mb-1">Current Step Data:</h4>
//             <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
//               {JSON.stringify(getStepData(currentStep), null, 2)}
//             </pre>
//           </div>

//           {Object.keys(errors).length > 0 && (
//             <div>
//               <h4 className="text-xs font-semibold mb-1 text-red-600">Validation Errors:</h4>
//               <div className="space-y-1">
//                 {Object.entries(errors).map(([field]) => (
//                   <div key={field} className="text-xs bg-red-50 p-1 rounded">
//                     <span className="font-medium text-red-700">{field}:</span>{" "}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => console.log("[v0] Full form data:", formData)}
//             className="w-full text-xs"
//           >
//             Log Full Data to Console
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
