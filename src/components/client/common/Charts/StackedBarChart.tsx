import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Copy, Trash2 } from "lucide-react"

interface TaskData {
  name: string
  completed: number
  remaining: number
  overdue: number
}

const initialData: TaskData[] = [
  { name: "Mike Smith", completed: 12, remaining: 5, overdue: 2 },
  { name: "Jennifer Jones", completed: 11, remaining: 6, overdue: 2 },
  { name: "Sam Watson", completed: 9, remaining: 4, overdue: 2 },
  { name: "Theresa Webb", completed: 8, remaining: 5, overdue: 2 },
  { name: "Jane Cooper", completed: 6, remaining: 3, overdue: 2 },
  { name: "Ronald Richards", completed: 4, remaining: 2, overdue: 1 },
]

export default function StackedChart() {
  const [data, setData] = useState<TaskData[]>(initialData)

  const totalEmployees = data.reduce((sum, item) => sum + item.completed + item.remaining + item.overdue, 0)

  const handleCopy = () => {
    const chartData = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(chartData)
  }

  const handleReset = () => {
    setData(initialData)
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const total = data.completed + data.remaining + data.overdue
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-blue-600">Completed: {data.completed}</p>
          <p className="text-orange-500">Remaining: {data.remaining}</p>
          <p className="text-red-500">Overdue: {data.overdue}</p>
          <p className="font-semibold text-gray-800 mt-1">Total: {total}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Stacked Bar Chart</h2>
          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-600">Remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Overdue</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total employees</p>
            <p className="text-2xl font-bold text-gray-800">{totalEmployees}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Copy chart data"
            >
              <Copy size={20} className="text-gray-600" />
            </button>
            <button
              onClick={handleReset}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Reset to default"
            >
              <Trash2 size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 150, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="completed" stackId="a" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          <Bar dataKey="remaining" stackId="a" fill="#f97316" radius={[0, 4, 4, 0]} />
          <Bar dataKey="overdue" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
