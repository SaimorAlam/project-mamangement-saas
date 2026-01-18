import React, { SetStateAction, Dispatch } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { RagDataPoint, RagThresholds } from "@/common/Charts/RagChart";

interface RagConfigurationProps {
  widgetTitle: string;
  setWidgetTitle: (title: string) => void;
  data: RagDataPoint[];
  setData: Dispatch<SetStateAction<RagDataPoint[]>>;
  thresholds: RagThresholds;
  setThresholds: Dispatch<SetStateAction<RagThresholds>>;
  onClose: () => void;
}

const RagConfiguration: React.FC<RagConfigurationProps> = ({
  widgetTitle,
  setWidgetTitle,
  data,
  setData,
  thresholds,
  setThresholds,
  onClose,
}) => {
  const handleThresholdChange = (key: keyof RagThresholds, value: string) => {
    const numValue = parseInt(value) || 0;
    setThresholds((prev) => ({
      ...prev,
      [key]: numValue,
    }));
  };

  const handleDataChange = (index: number, field: keyof RagDataPoint, value: string) => {
    const newData = [...data];
    if (field === "name") {
      newData[index].name = value;
    } else {
      newData[index].value = parseInt(value) || 0;
    }
    setData(newData);
  };

  const handleAddDataPoint = () => {
    setData([...data, { name: "New Point", value: 0 }]);
  };

  const handleDeleteDataPoint = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  return (
    <div className="w-[400px] h-fit max-h-[calc(100vh-100px)] bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden flex flex-col shrink-0">
      <div className="flex justify-between items-center p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Chart Configuration</h3>
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
          <label className="text-sm font-semibold text-gray-700">Widget Title</label>
          <input
            type="text"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter chart title"
          />
        </div>

        {/* Thresholds Configuration */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Zone Thresholds</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Poor Zone (0 - X)</label>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#ff7875]" />
                <input
                  type="number"
                  value={thresholds.poor}
                  onChange={(e) => handleThresholdChange("poor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Average Zone (Poor - X)</label>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#ffd666]" />
                <input
                  type="number"
                  value={thresholds.average}
                  onChange={(e) => handleThresholdChange("average", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 outline-none"
                />
              </div>
            </div>
            {/* Good zone is automatic above average, but we can set a max if needed for scale, 
                but using 'good' threshold as a visual max guide or upper bound */}
            <div>
              <label className="text-xs text-gray-600 block mb-1">Good Zone Target (Upper Bound)</label>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[#95de64]" />
                <input
                  type="number"
                  value={thresholds.good}
                  onChange={(e) => handleThresholdChange("good", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Points Configuration */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Data Points</h3>
            <button
              onClick={handleAddDataPoint}
              className="text-xs flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700"
            >
              <Plus className="w-3 h-3" /> Add Point
            </button>
          </div>
          
          <div className="space-y-2">
            {data.map((point, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg group">
                <input
                  type="text"
                  value={point.name}
                  onChange={(e) => handleDataChange(index, "name", e.target.value)}
                  className="w-1/3 px-2 py-1 text-sm bg-white border border-gray-200 rounded focus:border-blue-500 outline-none"
                  placeholder="Label"
                />
                <input
                  type="number"
                  value={point.value}
                  onChange={(e) => handleDataChange(index, "value", e.target.value)}
                  className="w-1/3 px-2 py-1 text-sm bg-white border border-gray-200 rounded focus:border-blue-500 outline-none"
                  placeholder="Value"
                />
                <button
                  onClick={() => handleDeleteDataPoint(index)}
                  className="ml-auto p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Assigned By */}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Assigned by
          </label>
          <div className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Alexis Burg"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <p className="text-xs font-medium text-gray-900">
                Alexis Burg
              </p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>

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

export default RagConfiguration;
