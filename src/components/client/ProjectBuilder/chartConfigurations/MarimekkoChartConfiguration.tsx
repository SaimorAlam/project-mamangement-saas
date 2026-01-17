import React from "react";
import { X } from "lucide-react";
// import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
// import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV"; // Uncomment if using API saving

export type LegendValue = {
  label: string;
  field: string;
  color: string;
};

const MarimekkoChartConfiguration = ({
  widgetTitle,
  setWidgetTitle,
  numOfXAxisDataSet,
  handleSetNumOfXAxisDataSet,
  xAxisValues,
  handleXAxisValueChange,
  numOfLegendDataSet,
  setNumOfLegendDataSet,
  legendValues,
  setLegendValues,
  chartHeight,
  setChartHeight,
  onClose,
}: {
  widgetTitle: string;
  setWidgetTitle: React.Dispatch<React.SetStateAction<string>>;
  numOfXAxisDataSet: number;
  handleSetNumOfXAxisDataSet: (e: React.ChangeEvent<HTMLInputElement>) => void;
  xAxisValues: string[];
  handleXAxisValueChange: (index: number, value: string) => void;
  numOfLegendDataSet: number;
  setNumOfLegendDataSet: React.Dispatch<React.SetStateAction<number>>;
  legendValues: LegendValue[];
  setLegendValues: React.Dispatch<React.SetStateAction<LegendValue[]>>;
  chartHeight: number;
  setChartHeight: React.Dispatch<React.SetStateAction<number>>;
  onClose?: () => void;
}) => {
  // const [showLegend, setShowLegend] = useState(true);
  // const [getChartTitleId, { isLoading }] = useGetChartTitleIdMutation();
  const isLoading = false; // Mock loading state since API hook is unused for now

  // Assigned By user info
  const assignedBy = {
    name: "Admin User",
    role: "Admin",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  const minLegend = 1;
  const maxLegend = 10;

  const handleSetNumOfLegendDataSet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < minLegend || value > maxLegend) {
      alert(`Please enter a number between ${minLegend} and ${maxLegend}`);
      return;
    }
    setNumOfLegendDataSet(value);
    setLegendValues((prev) => {
      const updated = [...prev];
      while (updated.length < value) {
        updated.push({ label: "", field: "", color: "#8D79F6" });
      }
      return updated.slice(0, value);
    });
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

  const handleSave = () => {
    // Basic validation
    if (!widgetTitle) return alert("Please enter widget title");
    if (xAxisValues.some(v => !v)) return alert("Please fill all X-Axis values");
    if (legendValues.some(l => !l.label)) return alert("Please fill all legend labels");

    // Logic to save CSV / Metadata would go here
    // For now we just close as the parent state is already updated
    onClose?.(); 
  };

  return (
    <div className="max-w-78 min-w-78 h-full bg-white border border-gray-100 rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Marimekko Configuration
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-4 overflow-y-auto flex-1">
        
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

        {/* X-Axis (Categories) */}
        <div>
          <h3 className="text-xs font-semibold text-blue-600 mb-3">
             Categories (Segments)
          </h3>
          <div className="flex items-center mb-3">
            <label className="text-xs text-gray-700 flex-1">
              Number of Categories:
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={numOfXAxisDataSet}
              onChange={handleSetNumOfXAxisDataSet}
              className="w-12 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            {Array.from({ length: numOfXAxisDataSet }).map((_, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Category ${index + 1}`}
                value={xAxisValues[index] || ""}
                onChange={(e) => handleXAxisValueChange(index, e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none"
              />
            ))}
          </div>
        </div>

        {/* Legends (Series) */}
        <div>
          <h3 className="text-xs font-semibold text-blue-600 mb-3">
             Series (Stacked Items)
          </h3>
           <div className="flex items-center mb-3">
            <label className="text-xs text-gray-700 flex-1">
              Number of Series:
            </label>
            <input
              type="number"
              min={minLegend}
              max={maxLegend}
              value={numOfLegendDataSet}
              onChange={handleSetNumOfLegendDataSet}
              className="w-12 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none"
            />
          </div>

           {Array.from({ length: numOfLegendDataSet }).map((_, index) => (
              <div key={index} className="mb-2 border-b border-gray-50 pb-2 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500 w-8">#{index+1}</span>
                      <input
                        type="text"
                        placeholder="Series Name"
                        value={legendValues[index]?.label || ""}
                        onChange={(e) => handleLegendLabelChange(index, e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded mr-2"
                      />
                       <input
                        type="color"
                        value={legendValues[index]?.color || "#8D79F6"}
                        onChange={(e) => handleLegendColorChange(index, e.target.value)}
                        className="w-6 h-6 rounded border border-gray-200 cursor-pointer p-0"
                      />
                  </div>
              </div>
           ))}
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
        <div>
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
          disabled={isLoading}
          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default MarimekkoChartConfiguration;
