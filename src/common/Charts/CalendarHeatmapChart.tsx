/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import "react-calendar-heatmap/dist/styles.css";

export type CalendarHeatmapValue = {
  date: string;
  count: number;
};

type Props = {
  widgetTitle: string;
  values: CalendarHeatmapValue[];
  startDate: Date;
  endDate: Date;
  onToggleWidget?: () => void;
  onDelete?: () => void;
};

export default function CalendarHeatmapChart({
  widgetTitle,
  values,
  startDate,
  endDate,
  onToggleWidget,
  onDelete,
}: Props) {
  const [showPopover, setShowPopover] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(values, null, 2));
    setShowPopover(false);
  };

  const handleDownload = () => {
    const csvContent = [
      "Date,Count",
      ...values.map((v) => `${v.date},${v.count}`),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${widgetTitle}-heatmap.csv`;
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

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ebedf0" }}></div>
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#9be9a8" }}></div>
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#40c463" }}></div>
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#30a14e" }}></div>
          <div className="w-4 h-4 rounded" style={{ backgroundColor: "#216e39" }}></div>
        </div>
        <span>More</span>
      </div>

      {/* Calendar Heatmap */}
      {values.length > 0 ? (
        <div className="calendar-heatmap-container">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={values}
            classForValue={(value: any) => {
              if (!value || value.count === 0) return "color-empty";
              if (value.count < 3) return "color-scale-1";
              if (value.count < 6) return "color-scale-2";
              if (value.count < 9) return "color-scale-3";
              return "color-scale-4";
            }}
            tooltipDataAttrs={(value: any) =>
              ({
                "data-tip": value.date
                  ? `${value.date}: ${value.count || 0} contributions`
                  : "No data",
              } as any)
            }
            showWeekdayLabels={true}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-80 text-gray-400">
          No data available. Please configure the widget to generate data.
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        .calendar-heatmap-container {
          overflow-x: auto;
        }
        .react-calendar-heatmap {
          min-width: 800px;
        }
        .react-calendar-heatmap .color-empty { 
          fill: #ebedf0; 
        }
        .react-calendar-heatmap .color-scale-1 { 
          fill: #9be9a8; 
        }
        .react-calendar-heatmap .color-scale-2 { 
          fill: #40c463; 
        }
        .react-calendar-heatmap .color-scale-3 { 
          fill: #30a14e; 
        }
        .react-calendar-heatmap .color-scale-4 { 
          fill: #216e39; 
        }
        .react-calendar-heatmap text {
          font-size: 10px;
          fill: #767676;
        }
        .react-calendar-heatmap rect:hover {
          stroke: #555;
          stroke-width: 1px;
        }
      `}</style>
    </div>
  );
}