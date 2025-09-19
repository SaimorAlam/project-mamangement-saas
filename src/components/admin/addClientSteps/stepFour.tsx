import { useFormContext } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, PieChart, Radar, Grid3x3 } from "lucide-react"

export default function StepFour() {
  const { watch, setValue } = useFormContext()
  const notifyDevTeam = watch("notifyDevTeam")

  const chartTypes = [
    { name: "Column Chart", icon: BarChart3, status: "Working", employees: "576 employees" },
    { name: "Bar Chart", icon: BarChart3, status: "Working", employees: "576 employees" },
    { name: "Radar Chart", icon: Radar, status: "Working", employees: null },
    { name: "Doughnut Pie Charts", icon: PieChart, status: "Working", employees: "520K Total Visitor" },
    { name: "Heatmap chart", icon: Grid3x3, status: "Working", employees: "Total in Stock" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Library Assignment</h2>
        <p className="text-gray-600 mb-6">
          Enable custom chart library and validate scheduled chart types for this client's dashboards.
        </p>

        <div className="mb-6">
          <Label className="text-sm font-medium">Select additional chart</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
            {chartTypes.map((chart, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <chart.icon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium text-sm">{chart.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                      {chart.status}
                    </Badge>
                  </div>

                  {chart.employees && <div className="text-xs text-gray-500">{chart.employees}</div>}

                  {/* Mock chart visualization */}
                  <div className="mt-3 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
                    <chart.icon className="h-8 w-8 text-blue-600 opacity-50" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-blue-600 mb-4">Chart render testing</h3>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="notifyDevTeam"
              checked={notifyDevTeam}
              onCheckedChange={(checked) => setValue("notifyDevTeam", checked)}
            />
            <Label htmlFor="notifyDevTeam">Notify Dev / QA Team</Label>
          </div>

          <div className="space-y-2">
            <Label>Select Team Member</Label>
            <Select
              value={watch("selectedTeamMember")}
              onValueChange={(value) => setValue("selectedTeamMember", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe - Senior Developer</SelectItem>
                <SelectItem value="jane-smith">Jane Smith - QA Engineer</SelectItem>
                <SelectItem value="mike-johnson">Mike Johnson - DevOps Engineer</SelectItem>
                <SelectItem value="sarah-wilson">Sarah Wilson - Frontend Developer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Library Status</h4>
        <p className="text-sm text-blue-700">
          All chart libraries are currently working and ready for deployment. The system will automatically validate
          chart rendering capabilities during the setup process.
        </p>
      </div>
    </div>
  )
}
