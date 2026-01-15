import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";

type TreemapDataPoint = {
  x: string;
  y: number;
};

type Props = {
  widgetTitle: string;
  data: TreemapDataPoint[];
  onToggleWidget?: () => void;
  onDelete?: () => void;
};

export default function TreemapChart({
  widgetTitle,
  data,
  onToggleWidget,
  onDelete,
}: Props) {
  const [showPopover, setShowPopover] = useState(false);

  const options = {
    series: [{ data }],
    legend: { show: false },
    chart: { 
      height: 350, 
      type: 'treemap' as const, 
      toolbar: { show: false } 
    },
    title: { 
      text: widgetTitle, 
      align: 'left' as const,
      style: {
        fontSize: '20px',
        fontWeight: 600,
      }
    },
    dataLabels: { 
      enabled: true,
      style: {
        fontSize: '14px',
      }
    },
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: false,
      }
    },
    colors: ['#13A490', '#35B6EE', '#6F78F9', '#FF6B6B', '#FFA726', '#AB47BC', '#26A69A', '#EF5350'],
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setShowPopover(false);
  };

  const handleDownload = () => {
    const csvContent = [
      "Label,Value",
      ...data.map((d) => `${d.x},${d.y}`),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${widgetTitle}-treemap.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setShowPopover(false);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{widgetTitle}</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2 border-l pl-4 relative">
            <button
              onClick={() => setShowPopover(!showPopover)}
              className="p-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <BsThreeDots size={18} />
            </button>

            {showPopover && (
              <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-48 z-10">
                <button 
                  onClick={handleCopy} 
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                >
                  <Copy size={18} />
                  <span>Copy</span>
                </button>

                <button 
                  onClick={handleDownload} 
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                >
                  <Download size={18} />
                  <span>Download</span>
                </button>

                <button 
                  onClick={onDelete} 
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left text-red-600"
                >
                  <Trash2 size={18} />
                  <span>Delete</span>
                </button>

                {onToggleWidget && (
                  <button 
                    onClick={() => {
                      onToggleWidget();
                      setShowPopover(false);
                    }} 
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <MdOutlineWidgets size={18} />
                    <span>Widget</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Treemap Chart */}
      {data.length > 0 ? (
        <ReactApexChart 
          options={options} 
          series={options.series} 
          type="treemap" 
          height={350} 
        />
      ) : (
        <div className="flex items-center justify-center h-80 text-gray-400">
          No data available. Please configure the widget to generate data.
        </div>
      )}
    </div>
  );
}