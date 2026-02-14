import React from "react";
import { ChevronRight, X } from "lucide-react";

interface TierChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  tierLevel: number;
  title?: string;
  breadcrumbs?: { name: string; id: string; level: number }[];
  onBreadcrumbClick?: (index: number) => void;
}

const TierChartModal: React.FC<TierChartModalProps> = ({
  isOpen,
  onClose,
  children,
  tierLevel,
  breadcrumbs = [],
  onBreadcrumbClick,
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.id || index}>
                {index > 0 && (
                  <ChevronRight size={14} className="text-gray-400 shrink-0" />
                )}
                <button
                  onClick={() => onBreadcrumbClick?.(index)}
                  className={`text-sm font-medium whitespace-nowrap transition-colors ${
                    index === breadcrumbs.length - 1
                      ? "text-gray-900 cursor-default"
                      : "text-blue-600 hover:text-blue-800"
                  }`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>
          <button onClick={onClose} className="text-red-500 hover:text-red-700 ml-4 shrink-0">
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
