import React from "react";
import { X } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { useCreateChartMutation } from "@/store/Api/ChartApi/ChartApi";
import { toast } from "sonner";

export type LegendValue = {
  label: string;
  field: string;
  color: string;
};

const CohortAnalysisConfiguration = ({
  widgetTitle,
  setWidgetTitle,
  xAxisValues,
  handleXAxisValueChange,
  numOfXAxisDataSet,
  setNumOfXAxisDataSet,
  numOfLegendDataSet,
  setNumOfLegendDataSet,
  legendValues,
  setLegendValues,
  onClose,
}: {
  widgetTitle: string;
  setWidgetTitle: React.Dispatch<React.SetStateAction<string>>;
  xAxisValues: string[];
  handleXAxisValueChange: (index: number, value: string) => void;
  numOfXAxisDataSet: number;
  setNumOfXAxisDataSet: React.Dispatch<React.SetStateAction<number>>;
  numOfLegendDataSet: number;
  setNumOfLegendDataSet: React.Dispatch<React.SetStateAction<number>>;
  legendValues: LegendValue[];
  setLegendValues: React.Dispatch<React.SetStateAction<LegendValue[]>>;
  onClose?: () => void;
}) => {
  const projectId = useAppSelector((state) => state.chartSlice.projectId);
  const [createChart, { isLoading }] = useCreateChartMutation();

  const assignedBy = {
    name: "Admin User",
    role: "Analyst",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  };

  const minCohorts = 1;
  const maxCohorts = 5;
  const minPeriods = 1;
  const maxPeriods = 8;

  const handleSetNumOfCohorts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < minCohorts || value > maxCohorts) {
      alert(`Please enter a number between ${minCohorts} and ${maxCohorts}`);
      return;
    }
    setNumOfLegendDataSet(value);
    setLegendValues((prev) => {
      const updated = [...prev];
      const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
      while (updated.length < value) {
        const i = updated.length;
        updated.push({
          label: `Cohort ${i + 1}`,
          field: `cohort${i + 1}`,
          color: colors[i % colors.length]
        });
      }
      return updated.slice(0, value);
    });
  };

  const handleSetNumOfPeriods = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < minPeriods || value > maxPeriods) {
      alert(`Please enter a number between ${minPeriods} and ${maxPeriods}`);
      return;
    }
    setNumOfXAxisDataSet(value);
  };

  const handleSave = async () => {
    const toastId = toast.loading("Saving configuration...");
    if (!widgetTitle) {
      toast.error("Please enter widget title", { id: toastId });
      return;
    }

    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: 0,
      lastFieldDAtaset: 100,
      widgets: legendValues.map((l) => ({
        legendName: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "COHORT",
      xAxis: JSON.stringify({
        labels: xAxisValues,
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
      projectId,
    };

    try {
      const res = await createChart(payload).unwrap();
      if (res?.success) {
        toast.success("Cohort Analysis configuration saved", { id: toastId });
        onClose?.();
      }
    } catch {
      toast.error("Failed to save configuration", { id: toastId });
    }
  };

  return (
    <div className="max-w-78 min-w-78 h-full bg-white border border-gray-100 rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Cohort Settings
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-6 overflow-y-auto flex-1">

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

        {/* Periods Mapping */}
        <div>
          <h3 className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">
            Time Periods (X-Axis)
          </h3>
          <div className="flex items-center mb-3">
            <label className="text-xs text-gray-700 flex-1">
              Number of Periods:
            </label>
            <input
              type="number"
              min={minPeriods}
              max={maxPeriods}
              value={numOfXAxisDataSet}
              onChange={handleSetNumOfPeriods}
              className="w-12 px-2 py-1 text-xs text-center border border-gray-300 rounded"
            />
          </div>
          <div className="space-y-2">
            {Array.from({ length: numOfXAxisDataSet }).map((_, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Period ${idx} label`}
                value={xAxisValues[idx] || ""}
                onChange={(e) => handleXAxisValueChange(idx, e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded"
              />
            ))}
          </div>
        </div>

        {/* Cohorts Mapping */}
        <div>
          <h3 className="text-xs font-semibold text-blue-600 mb-3 uppercase tracking-wider">
            Cohort Groups (Series)
          </h3>
          <div className="flex items-center mb-3">
            <label className="text-xs text-gray-700 flex-1">
              Number of BatchGroups:
            </label>
            <input
              type="number"
              min={minCohorts}
              max={maxCohorts}
              value={numOfLegendDataSet}
              onChange={handleSetNumOfCohorts}
              className="w-12 px-2 py-1 text-xs text-center border border-gray-300 rounded"
            />
          </div>

          <div className="space-y-3">
            {legendValues.map((l, index) => (
              <div key={index} className="p-3 border border-gray-100 rounded bg-gray-50 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400">#{index + 1}</span>
                  <input
                    type="text"
                    placeholder="Cohort Name"
                    value={l.label}
                    onChange={(e) => {
                      const newL = [...legendValues];
                      newL[index].label = e.target.value;
                      newL[index].field = e.target.value.toLowerCase().replace(/\s+/g, "");
                      setLegendValues(newL);
                    }}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] text-gray-500 font-medium">Visualization Color</label>
                  <input
                    type="color"
                    value={l.color}
                    onChange={(e) => {
                      const newL = [...legendValues];
                      newL[index].color = e.target.value;
                      setLegendValues(newL);
                    }}
                    className="w-8 h-5 rounded cursor-pointer border-none p-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned By */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Analysis Assigned To
          </label>
          <div className="flex items-center">
            <img
              src={assignedBy.image}
              alt={assignedBy.name}
              className="w-8 h-8 rounded-full mr-2 bg-gray-200 shadow-sm"
            />
            <div>
              <p className="text-xs font-semibold text-gray-900">
                {assignedBy.name}
              </p>
              <p className="text-[10px] text-gray-500">
                {assignedBy.role}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50/50">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-medium border border-gray-200 rounded-md bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50 shadow-md transition-all active:scale-95"
        >
          {isLoading ? "Analyzing..." : "Save Analysis"}
        </button>
      </div>
    </div>
  );
};

export default CohortAnalysisConfiguration;
