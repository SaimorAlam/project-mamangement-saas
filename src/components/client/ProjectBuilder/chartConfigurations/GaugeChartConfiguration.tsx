import React, { useState } from "react";
import { X } from "lucide-react";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";

export type LegendValue = {
  label: string;
  field: string;
  color: string;
};

const GaugeChartConfiguration = ({
  widgetTitle,
  setWidgetTitle,
  numOfLegendDataSet,
  legendValues,
  setLegendValues,
  startingRange,
  setStartingRange,
  endingRange,
  setEndingRange,
  onClose,
}: {
  widgetTitle: string;
  setWidgetTitle: React.Dispatch<React.SetStateAction<string>>;
  numOfLegendDataSet: number;
  setNumOfLegendDataSet: React.Dispatch<React.SetStateAction<number>>;
  legendValues: LegendValue[];
  setLegendValues: React.Dispatch<
    React.SetStateAction<LegendValue[]>
  >;
  startingRange: number;
  setStartingRange: React.Dispatch<React.SetStateAction<number>>;
  endingRange: number;
  setEndingRange: React.Dispatch<React.SetStateAction<number>>;
  onClose?: () => void;
}) => {
  const [showLegend, setShowLegend] = useState(true);

  // Assigned By user info
  const assignedBy = {
    name: "Alexis Burg",
    role: "Admin",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  };

  const handleLegendLabelChange = (index: number, value: string) => {
    setLegendValues((prev) => {
      const updated = [...prev];
      updated[index].label = value;

      // auto-generate field (camelCase)
      updated[index].field = value.toLowerCase().replace(/\s+/g, "");

      return updated;
    });
  };

  const handleLegendColorChange = (index: number, color: string) => {
    setLegendValues((prev) => {
      const updated = [...prev];
      updated[index].color = color;
      return updated;
    });
  };

  const [getChartTitleId, { isLoading }] =
    useGetChartTitleIdMutation();

  const downloadCSV = () => {
    // Validate legend label
    if (!legendValues[0]?.label) {
      alert("Please fill in the legend label");
      return;
    }

    // Validate range values
    if (startingRange >= endingRange) {
      alert("Starting range must be less than ending range");
      return;
    }

    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFiledDataset: startingRange,
      lastFiledDAtaset: endingRange,
      showWidgets: legendValues.map((l) => ({
        legend_name: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "GAUGE",
      xAxis: JSON.stringify({
        labels: [],
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
    };

    DownloadAndSaveCSVforModuleOneWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      [],
      legendValues
    );
  };

  return (
    <div className="max-w-78 min-w-78 h-full bg-white border border-gray-100 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Widget Configuration
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Gauge Chart Widget Details Link */}
        <a href="#" className="text-xs text-blue-600 hover:underline">
          Gauge Chart Widget Details
        </a>

        {/* Widget Title */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5 mt-5">
            Widget Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none"
          />
        </div>

        {/* Data Range Section */}
        <div>
          <h3 className="text-xs font-semibold text-blue-600 mb-3">
            Data Range Configuration
          </h3>

          {/* Starting Range */}
          <div className="flex items-center mb-2">
            <label className="text-xs text-gray-700 flex-1">
              Starting Range:
            </label>
            <input
              type="number"
              onChange={(e) =>
                setStartingRange(Number(e.target.value))
              }
              value={startingRange}
              className="w-20 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none"
            />
          </div>

          {/* Ending Range */}
          <div className="flex items-center mb-2">
            <label className="text-xs text-gray-700 flex-1">
              Ending Range:
            </label>
            <input
              type="number"
              onChange={(e) => setEndingRange(Number(e.target.value))}
              value={endingRange}
              className="w-20 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none"
            />
          </div>

          <p className="text-xs text-gray-500 mt-2">
            The gauge will display a random value between{" "}
            {startingRange} and {endingRange}
          </p>
        </div>

        {/* Display Settings Section */}
        <div>
          <h3 className="text-xs font-semibold text-blue-600 mb-3">
            Display Settings
          </h3>

          {/* Show Legend */}
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-medium text-gray-700">
              Show Legend
            </label>
            <div className="flex items-center gap-2">
              <div className="relative inline-block w-10 h-5">
                <input
                  type="checkbox"
                  checked={showLegend}
                  onChange={(e) => setShowLegend(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  onClick={() => setShowLegend(!showLegend)}
                  className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${
                    showLegend ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                      showLegend ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {showLegend && (
            <div>
              {/* Legend Name */}
              <div className="flex items-center justify-between mb-2">
                <label
                  className="text-xs text-gray-700"
                  style={{ width: "110px" }}
                >
                  Legend Name:
                </label>

                <input
                  type="text"
                  placeholder="Enter name here"
                  value={legendValues[0]?.label || ""}
                  onChange={(e) =>
                    handleLegendLabelChange(0, e.target.value)
                  }
                  className="w-[50%] px-2 py-1 text-xs border border-gray-300 rounded"
                />
              </div>

              {/* Legend Color */}
              <div className="flex items-center mb-3">
                <label
                  className="text-xs text-gray-700"
                  style={{ width: "110px" }}
                >
                  Legend Color:
                </label>

                <div className="flex items-center justify-end gap-2 flex-1">
                  <input
                    type="text"
                    value={legendValues[0]?.color || "#8D79F6"}
                    onChange={(e) =>
                      handleLegendColorChange(0, e.target.value)
                    }
                    className="text-xs px-2 py-1 border border-gray-200 rounded w-22"
                  />

                  <input
                    type="color"
                    value={legendValues[0]?.color || "#8D79F6"}
                    onChange={(e) =>
                      handleLegendColorChange(0, e.target.value)
                    }
                    className="w-14 h-6 rounded border border-gray-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assigned By */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Assigned by
          </label>
          <div className="flex items-center">
            <img
              src={assignedBy.image}
              alt={assignedBy.name}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="text-xs font-medium text-gray-900">
                {assignedBy.name}
              </p>
              <p className="text-xs text-gray-500">
                {assignedBy.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-medium border border-gray-200 rounded-md cursor-pointer text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
          onClick={downloadCSV}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default GaugeChartConfiguration;
