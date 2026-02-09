import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { toast } from "sonner";
import { useCreateChartMutation } from "@/store/Api/ChartApi/ChartApi";

interface AddTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (tierName: string) => void;
  parentChartName?: string;
  chartId?: string;
}

const AddTierModal: React.FC<AddTierModalProps> = ({
  isOpen,
  onClose,
  onSave,
  parentChartName,
  chartId,
}) => {
  const { childPayload } = useAppSelector((state) => state.chartSlice);
  const [createChart] = useCreateChartMutation();
  const [tierName, setTierName] = useState("");

  const handleSave = async () => {
    const toastId = toast.loading("Creating Child Tier...");
    try {
      const payload = {
        ...childPayload,
        title: tierName,
      };
      const response = await createChart(
        chartId ? { ...payload } : payload,
      ).unwrap();
      if (response.success) {
        toast.success("Child Tier Created Successfully", { id: toastId });
        onClose();
      }
    } catch {
      toast.error("Cannot Create Child Tier", { id: toastId });
    }

    if (tierName.trim()) {
      onSave?.(tierName);
      setTierName("");
    } else {
      toast.error("Please enter a tier name", { id: toastId });
    }
  };

  const handleClose = () => {
    setTierName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-blue-600">Add New Tier</h2>
          <button
            onClick={handleClose}
            className="text-red-500 hover:text-red-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-900 mb-2">
              Parent Chart Name
            </label>
            <p className="text-gray-600">{parentChartName}</p>
          </div>

          <div>
            <input
              type="text"
              placeholder="New Tier name"
              value={tierName}
              onChange={(e) => setTierName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Save size={18} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTierModal;
