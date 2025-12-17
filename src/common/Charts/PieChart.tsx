import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts"
import { Copy, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ChartData {
  name: string
  value: number
  color: string
  [key: string]: string | number
}

export default function PieChart() {
  const data: ChartData[] = [
    { name: "Figma", value: 90, color: "#7F56D9" },
    { name: "Sketch", value: 50, color: "#DFDBF9" },
  ]

  const title = "Pie Chart"

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data))
  }

  const handleDelete = () => {
    console.log("Delete action triggered!")
  }

  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const payload = props.payload as { name: string; value: number }
    return `${payload.name}: ${payload.value}%`
  }

  return (
    <Card className="w-full max-w-lg bg-white p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            aria-label="Copy chart data"
          >
            <Copy size={18} className="text-gray-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
            aria-label="Delete chart"
          >
            <Trash2 size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-8 mb-6 flex-wrap">
        {data.map((item) => (
          <div key={item.name} className="flex items-baseline gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <p className="text-sm font-medium text-gray-700">{item.name}</p>
              <p className="text-md font-semibold text-gray-900">
                {item.value}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
