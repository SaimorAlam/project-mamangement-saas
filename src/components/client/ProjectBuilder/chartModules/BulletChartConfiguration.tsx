import React, { SetStateAction, Dispatch } from "react";
import { X, Plus, Trash2, Settings2, Palette, Ruler } from "lucide-react";
import { LegendValue } from "../../../../common/Charts/CompletedCharts/Widgets/WidgetForChartModuleOne";

interface BulletChartConfigurationProps {
  widgetTitle: string;
  setWidgetTitle: (title: string) => void;
  legendValues: LegendValue[];
  setLegendValues: Dispatch<SetStateAction<LegendValue[]>>;
  startingRange: number;
  setStartingRange: (val: number) => void;
  endingRange: number;
  setEndingRange: (val: number) => void;
  onClose: () => void;
}

const BulletChartConfiguration: React.FC<BulletChartConfigurationProps> = ({
  widgetTitle,
  setWidgetTitle,
  legendValues,
  setLegendValues,
  startingRange,
  setStartingRange,
  endingRange,
  setEndingRange,
  onClose,
}) => {
  const handleAddMetric = () => {
    setLegendValues((prev) => [
      ...prev,
      { label: `Metric ${prev.length + 1}`, field: "", color: "#3b82f6" },
    ]);
  };

  const handleDeleteMetric = (index: number) => {
    setLegendValues((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMetricChange = (
    index: number,
    field: keyof LegendValue,
    value: string,
  ) => {
    setLegendValues((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="w-full md:w-78 h-fit max-h-[calc(100vh-100px)] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col shrink-0 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-800">Configuration</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {/* Widget Title */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">
            Widget Title
          </label>
          <input
            type="text"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm font-medium"
            placeholder="Enter chart title"
          />
        </div>

        {/* Range Configuration */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Ruler className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Scale Range
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600 block mb-1">
                Minimum
              </label>
              <input
                type="number"
                value={startingRange}
                onChange={(e) => setStartingRange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold text-center"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600 block mb-1">
                Maximum
              </label>
              <input
                type="number"
                value={endingRange}
                onChange={(e) => setEndingRange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold text-center"
              />
            </div>
          </div>
        </div>

        {/* Metrics/Legends Configuration */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-900">
              <Palette className="w-4 h-4 text-gray-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Metrics
              </h3>
            </div>
            <button
              onClick={handleAddMetric}
              className="text-xs flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              <Plus className="w-3 h-3" /> Add Point
            </button>
          </div>

          <div className="space-y-2">
            {legendValues.map((legend, index) => (
              <div
                key={index}
                className="group flex items-center gap-2 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
              >
                <input
                  type="color"
                  value={legend.color || "#000000"}
                  onChange={(e) =>
                    handleMetricChange(index, "color", e.target.value)
                  }
                  className="w-10 h-8 rounded border border-gray-200 cursor-pointer outline-none shrink-0"
                />
                <input
                  type="text"
                  value={legend.label}
                  onChange={(e) =>
                    handleMetricChange(index, "label", e.target.value)
                  }
                  className="flex-1 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded focus:border-blue-500 outline-none font-medium truncate"
                  placeholder="Metric Name"
                />
                <button
                  onClick={() => handleDeleteMetric(index)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {legendValues.length === 0 && (
              <div className="py-8 border-2 border-dashed border-gray-100 rounded-lg text-center">
                <p className="text-xs text-gray-400 italic">
                  No metrics added yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Assigned By */}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Assigned by
          </label>
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Alexis Burg"
              className="w-8 h-8 rounded-full border border-gray-200"
            />
            <div>
              <p className="text-xs font-bold text-gray-900">Alexis Burg</p>
              <p className="text-[10px] text-gray-500 font-medium">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-md cursor-pointer text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer shadow-sm transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default BulletChartConfiguration;
