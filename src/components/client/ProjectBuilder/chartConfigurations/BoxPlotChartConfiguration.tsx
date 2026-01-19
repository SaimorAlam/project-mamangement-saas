import React from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { BoxPlotData } from "../chartModules/BoxPlotChartModule";

const BoxPlotChartConfiguration = ({
  widgetTitle,
  setWidgetTitle,
  chartHeight,
  setChartHeight,
  data,
  setData,
  onClose,
}: {
  widgetTitle: string;
  setWidgetTitle: React.Dispatch<React.SetStateAction<string>>;
  chartHeight: number;
  setChartHeight: React.Dispatch<React.SetStateAction<number>>;
  data: BoxPlotData[];
  setData: React.Dispatch<React.SetStateAction<BoxPlotData[]>>;
  onClose?: () => void;
}) => {
  // Assigned By user info
  const assignedBy = {
    name: "Admin User",
    role: "Admin",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  const handleAddBox = () => {
    setData([
      ...data,
      { x: `Group ${data.length + 1}`, min: 0, q1: 10, median: 20, q3: 30, max: 40, outliers: [] },
    ]);
  };

  const handleRemoveBox = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleDataChange = (index: number, field: keyof BoxPlotData, rawValue: string) => {
    const updatedData = [...data];
    
    if (field === "outliers") {
      const outliers = rawValue
        .split(",")
        .map((v) => parseInt(v.trim()))
        .filter((v) => !isNaN(v));
      updatedData[index] = { ...updatedData[index], outliers };
    } else if (field === "x") {
      updatedData[index] = { ...updatedData[index], x: rawValue };
    } else {
      // Numeric fields
      const numValue = Number(rawValue);
      // If user clears the input, we might want to keep a default or wait for input
      // but for now let's allow 0 and prevent NaN updates
      if (rawValue === "") {
         updatedData[index] = { ...updatedData[index], [field]: 0 };
      } else if (!isNaN(numValue)) {
         updatedData[index] = { ...updatedData[index], [field]: numValue };
      }
    }
    setData(updatedData);
  };

  const handleSave = () => {
    if (!widgetTitle) return alert("Please enter widget title");
    onClose?.(); 
  };

  return (
    <div className="max-w-78 min-w-78 h-full bg-white border border-gray-100 rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Box Plot Configuration
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
        
        {/* Widget Title */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Widget Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none"
          />
        </div>

        {/* Data Points (Boxes) */}
        <div>
          <div className="flex items-center justify-between mb-3">
             <h3 className="text-xs font-semibold text-blue-600">
                Data Series (Boxes)
             </h3>
             <button 
                onClick={handleAddBox}
                className="p-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                title="Add Box"
             >
                <Plus size={14} />
             </button>
          </div>
          
          <div className="space-y-4">
            {data.map((box, index) => (
              <div key={index} className="p-3 border border-gray-100 rounded-md bg-gray-50/50 relative">
                <button 
                  onClick={() => handleRemoveBox(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={12} />
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                   <div className="col-span-2">
                      <label className="block text-[10px] text-gray-500 uppercase mb-0.5">Label</label>
                      <input 
                        type="text"
                        value={box.x}
                        onChange={(e) => handleDataChange(index, "x", e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none"
                        placeholder="Group Name"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] text-gray-500 uppercase mb-0.5">Min</label>
                      <input 
                        type="number"
                        value={box.min}
                        onChange={(e) => handleDataChange(index, "min", e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] text-gray-500 uppercase mb-0.5">Max</label>
                      <input 
                        type="number"
                        value={box.max}
                        onChange={(e) => handleDataChange(index, "max", e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] text-gray-500 uppercase mb-0.5">Q1 (25%)</label>
                      <input 
                        type="number"
                        value={box.q1}
                        onChange={(e) => handleDataChange(index, "q1", e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] text-gray-500 uppercase mb-0.5">Q3 (75%)</label>
                      <input 
                        type="number"
                        value={box.q3}
                        onChange={(e) => handleDataChange(index, "q3", e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] text-gray-500 uppercase mb-0.5 font-bold text-blue-600">Median</label>
                      <input 
                        type="number"
                        value={box.median}
                        onChange={(e) => handleDataChange(index, "median", e.target.value)}
                        className="w-full px-2 py-1 text-xs border-blue-200 border rounded focus:outline-none font-bold outline-blue-500"
                      />
                   </div>
                   <div className="col-span-2">
                       <label className="block text-[10px] text-gray-500 uppercase mb-0.5">Outliers (comma separated)</label>
                       <input 
                         type="text"
                         value={box.outliers?.join(", ") || ""}
                         onChange={(e) => handleDataChange(index, "outliers", e.target.value)}
                         className="w-full px-2 py-1 text-xs border rounded focus:outline-none"
                         placeholder="e.g. 5, 85"
                       />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Display Settings */}
        <div>
           <h3 className="text-xs font-semibold text-blue-600 mb-3">
             Display Settings
          </h3>
          <div className="flex items-center mb-2">
            <label className="text-xs text-gray-700 flex-1">
              Chart Height (px):
            </label>
            <input
              type="number"
              min={200}
              max={800}
              value={chartHeight}
              onChange={(e) => setChartHeight(Number(e.target.value))}
              className="w-20 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none"
            />
          </div>
        </div>
        
         {/* Assigned By */}
        <div className="pt-2">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Assigned by
          </label>
          <div className="flex items-center">
            <img
              src={assignedBy.image}
              alt={assignedBy.name}
              className="w-8 h-8 rounded-full mr-2 bg-gray-200"
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
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 mt-auto">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-medium border border-gray-200 rounded-md cursor-pointer text-gray-700 hover:text-gray-900"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default BoxPlotChartConfiguration;
