/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Copy, Trash2, Download } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";

/*       TYPES       */

type CalendarValue = {
  date: string;
  count: number;
};

type LegendValue = {
  label: string;
  field: string;
  color: string;
};

export type TierChart = {
  id: string;
  name: string;
  legendValues: LegendValue[];
  children: TierChart[];
};

type Props = {
  widgetTitle?: string;
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  months?: string[];
  isCreationMode?: boolean;
};

/*       HELPER FUNCTIONS       */

const generateId = () =>
  crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

const getRandomCount = () => Math.floor(Math.random() * 15);

const generateCalendarData = (
  startDate: Date,
  endDate: Date
): CalendarValue[] => {
  const values: CalendarValue[] = [];
  const currentDate = new Date(startDate);
  // Ensure we don't go into infinite loop if dates are messed up
  const finalDate = new Date(endDate);
  
  // Clone to avoid modifying original
  const iterDate = new Date(currentDate);

  while (iterDate <= finalDate) {
    // Add random data for some days (not every day)
    if (Math.random() > 0.3) {
      values.push({
        date: iterDate.toISOString().split("T")[0],
        count: getRandomCount(),
      });
    }
    iterDate.setDate(iterDate.getDate() + 1);
  }

  return values;
};



/*       COMPONENT       */

export default function CalendarHeatmapChart({
  widgetTitle = "Activity Calendar",
  legendValues = [],
  numOfLegendDataSet = 1,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId = "root",
  months = [],
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  // Tier management states
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATE RANGE   */
  const { startDate, endDate, customMonthLabels } = useMemo(() => {
    // If specific months are provided
    if (months && months.length > 0 && months.some(m => m.trim() !== "")) {
      const currentYear = new Date().getFullYear();
      const validMonths = months.filter(m => m.trim() !== "");
      
      // Always start from January if custom labels are provided
      // This ensures our labels align with the displayed months (Jan = index 0)
      const start = new Date(currentYear, 0, 1);
      
      // End date is determined by how many labels we have
      // e.g., 3 labels -> Jan, Feb, Mar -> End date is end of Mar
      const end = new Date(currentYear, validMonths.length, 0); 

      // Create the 12-element array required by the library
      const labels = new Array(12).fill("");
      validMonths.forEach((m, i) => {
        if (i < 12) labels[i] = m;
      });

      return { 
        startDate: start, 
        endDate: end, 
        customMonthLabels: labels as [string, string, string, string, string, string, string, string, string, string, string, string] 
      };
    }

    // Default behavior
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 3); // 3 months back
    return { startDate: start, endDate: end, customMonthLabels: undefined };
  }, [months]);

  /*   DATA GENERATION   */
  const calendarValues = useMemo(() => {
    return generateCalendarData(startDate, endDate);
  }, [startDate, endDate]);

  const totalActiveDays = calendarValues.length;
  const totalCount = calendarValues.reduce((sum, v) => sum + v.count, 0);

  const isAllLegendFieldEmpty = legendValues.filter((l) => l.label !== "");

  /*   PRIMARY COLOR   */
  const primaryColor = useMemo(() => {
    const firstLegend = legendValues.find((l) => l.label);
    return firstLegend?.color || "#216e39";
  }, [legendValues]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(calendarValues, null, 2));
  };

  const handleDownload = () => {
    const csvId = generateId();

    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFiledDataset: 0,
      lastFiledDAtaset: 100,
      showWidgets: legendValues.map((l) => ({
        legend_name: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "CALENDAR",
      xAxis: JSON.stringify({
        labels: [],
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
    };
    setIsDownloading(true);

    // For CSV export
    const header = "Date,Count";
    const rows = calendarValues.map((item) => `${item.date},${item.count}`);

    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${widgetTitle}-${csvId}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    // Also save to backend
    DownloadAndSaveCSVforModuleOneWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      [],
      legendValues
    );

    setIsDownloading(false);
  };

  const handleWidgetClick = () => {
    if (onToggleWidget) {
      onToggleWidget();
    }
    setShowPopover(false);
  };

  const handleAddTierClick = () => {
    setShowAddTierModal(true);
    setShowPopover(false);
  };

  const handleSaveTier = (tierName: string) => {
    const newTier: TierChart = {
      id: `${chartId}-tier-${Date.now()}`,
      name: tierName,
      legendValues: legendValues,
      children: [],
    };
    setChildTiers([...childTiers, newTier]);
    setShowAddTierModal(false);
  };

  const handleChartClick = () => {
    if (childTiers.length > 0) {
      setShowChildrenModal(true);
    }
  };

  /*   RENDER   */

  return (
    <>
      <div
        className={`w-full bg-white border border-gray-200 rounded-lg p-6 relative ${
          childTiers.length > 0
            ? "cursor-pointer hover:shadow-lg transition-shadow"
            : ""
        }`}
        onClick={handleChartClick}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {widgetTitle}
          </h2>

          <div
            className="flex items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm text-gray-500">
              {totalActiveDays} days • {totalCount} total
            </div>

            <div className="flex gap-2 border-l pl-4 relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPopover(!showPopover);
                }}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                <BsThreeDots size={18} />
              </button>

              {showPopover && (
                <div className="absolute right-0 top-12 bg-white border border-gray-300 rounded-lg shadow-lg p-2 w-48 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                      setShowPopover(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <Copy size={18} />
                    <span>Copy</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload();
                      setShowPopover(false);
                    }}
                    disabled={isDownloading}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDelete) onDelete();
                      setShowPopover(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left text-red-600"
                  >
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>

                  {onToggleWidget && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWidgetClick();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                    >
                      <MdOutlineWidgets size={18} />
                      <span>Widget</span>
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddTierClick();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                  >
                    <GoPlus size={18} />
                    <span>Add Tier</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Heatmap */}
        <div className="calendar-heatmap-container">
          <style>{`
            .calendar-heatmap-container .react-calendar-heatmap {
              width: 100%;
              height: auto;
            }
            .calendar-heatmap-container .react-calendar-heatmap-month-label {
              font-size: 12px;
              fill: #6b7280;
            }
            .calendar-heatmap-container .react-calendar-heatmap-weekday-label {
              font-size: 10px;
              fill: #9ca3af;
            }
            .calendar-heatmap-container .react-calendar-heatmap .color-empty {
              fill: #ebedf0;
            }
            .calendar-heatmap-container .react-calendar-heatmap .color-scale-1 {
              fill: ${primaryColor}33;
            }
            .calendar-heatmap-container .react-calendar-heatmap .color-scale-2 {
              fill: ${primaryColor}66;
            }
            .calendar-heatmap-container .react-calendar-heatmap .color-scale-3 {
              fill: ${primaryColor}99;
            }
            .calendar-heatmap-container .react-calendar-heatmap .color-scale-4 {
              fill: ${primaryColor};
            }
          `}</style>
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={calendarValues}
            classForValue={(value: any) : any => {
              if (!value) {
                return "color-empty";
              }
              if (value.count < 3) return "color-scale-1";
              if (value.count < 6) return "color-scale-2";
              if (value.count < 10) return "color-scale-3";
              return "color-scale-4";
            }}
            tooltipDataAttrs={(value: any) : any => {
              if (!value || !value.date) {
                return {};
              }
              return {
                "data-tip": `${value.date}: ${value.count || 0} activities`,
              };
            }}
            showWeekdayLabels
            monthLabels={customMonthLabels}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <span className="text-xs text-gray-500">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor:
                    level === 0
                      ? "#ebedf0"
                      : level === 1
                      ? `${primaryColor}33`
                      : level === 2
                      ? `${primaryColor}66`
                      : level === 3
                      ? `${primaryColor}99`
                      : primaryColor,
                }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">More</span>
        </div>

        {isAllLegendFieldEmpty.length === 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-center">
            No data available. Configure color in the widget settings.
          </div>
        )}

        {/* Indicator if chart has children */}
        {childTiers.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} child tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Add Tier Modal */}
      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        onSave={handleSaveTier}
        parentChartName={widgetTitle}
      />

      {/* Children Grid Modal */}
      {showChildrenModal && (
        <TierChartModal
          isOpen={showChildrenModal}
          onClose={() => setShowChildrenModal(false)}
          tierLevel={tierLevel + 1}
          title={widgetTitle}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {childTiers.map((tier) => (
              <CalendarHeatmapChart
                key={tier.id}
                widgetTitle={tier.name}
                legendValues={tier.legendValues}
                numOfLegendDataSet={tier.legendValues.length}
                tierLevel={tierLevel + 1}
                chartId={tier.id}
              />
            ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}