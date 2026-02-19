import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { useCreateChartMutation } from "@/store/Api/ChartApi/ChartApi";
import { toast } from "sonner";
import { useGetUser } from "@/hooks/useGetUser";
import { useLocation } from "react-router-dom";

export type LegendValue = {
  label: string;
  field: string;
  color: string;
};

interface PieChartConfigurationProps {
  widgetTitle: string;
  setWidgetTitle: React.Dispatch<React.SetStateAction<string>>;
  numOfLegendDataSet: number;
  setNumOfLegendDataSet: React.Dispatch<React.SetStateAction<number>>;
  legendValues: LegendValue[];
  setLegendValues: React.Dispatch<React.SetStateAction<LegendValue[]>>;
  onClose?: () => void;
  onDelete?: () => void;
}

const PieChartConfiguration = ({
  widgetTitle,
  setWidgetTitle,
  numOfLegendDataSet,
  setNumOfLegendDataSet,
  legendValues,
  setLegendValues,
  onClose,
  onDelete,
}: PieChartConfigurationProps) => {
  const [projectId, setProjectId] = useState<string>("");
  const projectIdFromSlice = useAppSelector((state) => state.chartSlice.projectId);
  const location = useLocation();
  const projectIdFromState = location.state?.projectId;

  useEffect(() => {
    if (projectIdFromSlice) {
      setProjectId(projectIdFromSlice);
    } else if (projectIdFromState) {
      setProjectId(projectIdFromState);
    }
  }, [projectIdFromSlice, projectIdFromState]);

  const [createChart, { isLoading }] = useCreateChartMutation();
  const { name, role, profileImage } = useGetUser();

  const assignedBy = {
    name: name || "Admin User",
    role: role || "Analyst",
    image: profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  const minSlices = 1;
  const maxSlices = 10;

  const handleSetNumOfSlices = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < minSlices || value > maxSlices) {
      toast.error(`Please enter a number between ${minSlices} and ${maxSlices}`);
      return;
    }
    
    setNumOfLegendDataSet(value);
    setLegendValues((prev) => {
      const updated = [...prev];
      const colors = [
        "#13A490", "#35B6EE", "#6F78F9", "#F26419", "#F6AE2D",
        "#862BB0", "#D72638", "#3F88C5", "#44BBA4", "#FF9505"
      ];
      
      while (updated.length < value) {
        const i = updated.length;
        updated.push({
          label: `Slice ${i + 1}`,
          field: `slice${i + 1}`,
          color: colors[i % colors.length],
        });
      }
      return updated.slice(0, value);
    });
  };

  const handleSliceLabelChange = (index: number, value: string) => {
    setLegendValues((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        label: value,
        field: value.toLowerCase().replace(/\s+/g, ""),
      };
      return updated;
    });
  };

  const handleSliceColorChange = (index: number, color: string) => {
    setLegendValues((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        color: color,
      };
      return updated;
    });
  };

  const handleSave = async () => {
    if (!widgetTitle) {
      toast.error("Please enter a widget title");
      return;
    }

    const toastId = toast.loading("Creating Pie Chart...");
    
    // Create the xAxis structure for Pie Charts: ["Label", "Legend1", "Legend2"...] followed by ["Value", 0, 0...]
    // This follows Module One standard which is more reliable for backend validation
    const xAxisData = [
      ["Label", ...legendValues.map(l => l.label)],
      ["Value", ...Array(legendValues.length).fill(0)]
    ];

    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: 0,
      lastFieldDataset: 100,
      widgets: legendValues.map((l) => ({
        legendName: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "PIE",
      xAxis: JSON.stringify(xAxisData),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
      projectId: projectId,
      rootchart: true,
      roottitle: widgetTitle,
      grouptitle: widgetTitle,
    };

    try {
      const res = await createChart(payload).unwrap();
      if (res?.success) {
        toast.success("Pie Chart created successfully", { id: toastId });
        onDelete?.();
        onClose?.();
      }
    } catch (error) {
      console.error("Failed to create pie chart:", error);
      toast.error("Failed to create Pie Chart", { id: toastId });
    }
  };

  return (
    <div className="max-w-78 min-w-78 h-full bg-white border border-gray-100 rounded-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 bg-gray-50/50">
        <div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Pie Configuration</h2>
          <p className="text-[10px] text-gray-500 font-medium">Define your data slices</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-5 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
        {/* Widget Title */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider">
            Widget Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={widgetTitle}
            onChange={(e) => setWidgetTitle(e.target.value)}
            placeholder="e.g. Sales Distribution"
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300"
          />
        </div>

        {/* Slice Configuration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Data Slices
            </h3>
            <div className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
              <span className="text-[10px] font-semibold text-blue-700">Total:</span>
              <input
                type="number"
                min={minSlices}
                max={maxSlices}
                value={numOfLegendDataSet}
                onChange={handleSetNumOfSlices}
                className="w-10 bg-transparent text-xs font-bold text-blue-800 text-center outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            {legendValues.map((l, index) => (
              <div
                key={index}
                className="p-3 border border-gray-100 rounded-xl bg-gray-50/30 hover:bg-gray-50 transition-colors space-y-3 group"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                    style={{ backgroundColor: l.color }}
                  >
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    placeholder={`Slice ${index + 1} name`}
                    value={l.label}
                    onChange={(e) => handleSliceLabelChange(index, e.target.value)}
                    className="flex-1 bg-white px-2.5 py-1.5 text-xs border border-gray-200 rounded-md focus:border-blue-400 outline-none transition-all shadow-sm group-hover:border-gray-300"
                  />
                </div>
                
                <div className="flex items-center justify-between pl-9">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Hex Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={l.color}
                      onChange={(e) => handleSliceColorChange(index, e.target.value)}
                      className="w-16 text-[10px] font-mono text-gray-500 bg-transparent outline-none text-right"
                    />
                    <input
                      type="color"
                      value={l.color}
                      onChange={(e) => handleSliceColorChange(index, e.target.value)}
                      className="w-6 h-6 rounded-md cursor-pointer border-none p-0 outline-none shadow-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned By */}
        <div className="pt-6 border-t border-gray-100">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Accountable Owner
          </label>
          <div className="flex items-center p-2 rounded-xl bg-gray-50 border border-gray-100">
            <img
              src={assignedBy.image}
              alt={assignedBy.name}
              className="w-9 h-9 rounded-full mr-3 border-2 border-white shadow-sm ring-1 ring-gray-100"
            />
            <div>
              <p className="text-xs font-bold text-gray-900 leading-tight">
                {assignedBy.name}
              </p>
              <p className="text-[10px] text-gray-500 font-medium">
                {assignedBy.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/80 flex items-center gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-white transition-all active:scale-95"
        >
          Discard
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : null}
          {isLoading ? "Generating..." : "Save Chart"}
        </button>
      </div>
    </div>
  );
};

export default PieChartConfiguration;
