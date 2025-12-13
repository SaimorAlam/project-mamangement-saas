import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Copy, Trash2 } from "lucide-react"

interface ChartDataPoint {
  month: string
  acmeCorp: number
  globexInc: number
}

const initialData: ChartDataPoint[] = [
  { month: "Jan", acmeCorp: 100, globexInc: 240 },
  { month: "Feb", acmeCorp: 300, globexInc: 500 },
  { month: "Mar", acmeCorp: 200, globexInc: 350 },
  { month: "Apr", acmeCorp: 1200, globexInc: 600 },
  { month: "May", acmeCorp: 1000, globexInc: 800 },
  { month: "Jun", acmeCorp: 1100, globexInc: 900 },
  { month: "Jul", acmeCorp: 1600, globexInc: 1200 },
  { month: "Aug", acmeCorp: 1500, globexInc: 1400 },
  { month: "Sep", acmeCorp: 1300, globexInc: 1100 },
  { month: "Oct", acmeCorp: 1100, globexInc: 1300 },
  { month: "Nov", acmeCorp: 1200, globexInc: 1200 },
  { month: "Dec", acmeCorp: 1000, globexInc: 1400 },
]

export default function MultiAxisLineChart() {
  const [data, setData] = useState<ChartDataPoint[]>(initialData)
  const [showLineOnly, setShowLineOnly] = useState(false)
  const [hoveredLine, setHoveredLine] = useState<string | null>(null)

  const handleCopy = () => {
    const chartData = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(chartData)
  }


  const handleDelete = () => {
    setData([])
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-semibold text-gray-800">{payload[0].payload.month}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Multi-Axis Line Chart</h2>
          <div className="flex items-center gap-2">
            <Copy
              size={18}
              className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
              onClick={handleCopy}
            />
            <Trash2
              size={18}
              className="text-gray-500 cursor-pointer hover:text-red-600 transition"
              onClick={handleDelete}
            />
          </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-indigo-500"></div>
          <span className="text-sm text-gray-600">Acme Corp</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-cyan-500"></div>
          <span className="text-sm text-gray-600">Globex Inc</span>
        </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLineOnly(!showLineOnly)}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition cursor-pointer"
          >
            Show Line Only {showLineOnly ? "✓" : ""}
          </button>
        </div>
      </div>

      {/* Chart */}
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" domain={[0, 1750]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="acmeCorp"
              stroke="#6366f1"
              dot={!showLineOnly}
              strokeWidth={2}
              isAnimationActive={true}
              opacity={hoveredLine === null || hoveredLine === "acmeCorp" ? 1 : 0.3}
              onMouseEnter={() => setHoveredLine("acmeCorp")}
              onMouseLeave={() => setHoveredLine(null)}
            />
            <Line
              type="monotone"
              dataKey="globexInc"
              stroke="#06b6d4"
              dot={!showLineOnly}
              strokeWidth={2}
              isAnimationActive={true}
              opacity={hoveredLine === null || hoveredLine === "globexInc" ? 1 : 0.3}
              onMouseEnter={() => setHoveredLine("globexInc")}
              onMouseLeave={() => setHoveredLine(null)}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-96 flex items-center justify-center text-gray-400">No data available</div>
      )}
    </div>
  )
}
