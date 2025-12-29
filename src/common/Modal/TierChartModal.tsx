import React from "react";
import { X } from "lucide-react";

interface TierChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  tierLevel: number;
}

const TierChartModal: React.FC<TierChartModalProps> = ({
  isOpen,
  onClose,
  children,
  tierLevel,
}) => {
  if (!isOpen) return null;

  // Calculate z-index based on tier level to stack modals properly
  const zIndex = 50 + tierLevel * 10;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center"
      style={{ zIndex }}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto mx-4 my-4">
        {/* Header */}
        <div className="flex items-center justify-end px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default TierChartModal;
