/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Copy, Trash2, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import useChartData from "./GetChartData";

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
  newData?: any[];
  widgetTitle?: string;
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  isCreationMode?: boolean;
  allUploadedData?: { [key: string]: CalendarValue[] };
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

  while (currentDate <= endDate) {
    if (Math.random() > 0.3) {
      values.push({
        date: currentDate.toISOString().split("T")[0],
        count: getRandomCount(),
      });
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return values;
};

/*       COMPONENT       */

export default function CalendarHeatmapChart({
  newData,
  widgetTitle = "Activity Calendar",
  legendValues = [],
  numOfLegendDataSet = 1,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId,
  isCreationMode = false,
  allUploadedData,
}: Props) {
  const [localUploadedData, setLocalUploadedData] = useState<{ [key: string]: CalendarValue[] } | undefined>(allUploadedData);
  const { childTiers } = useChartData({
    newData,
    isCreationMode,
    chartId,
    xAxisValues: [],
    legendValues,
    numOfLegendDataSet,
    startingRange: 0,
    endingRange: 100,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  /*   DATE RANGE   */
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 3);
    return { startDate: start, endDate: end };
  }, []);

  /*   DATA GENERATION   */
  const calendarValues = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet").replace(/[:\/?*\[\]\\]/g, " ").trim().substring(0, 31);
    const dataToUse = localUploadedData?.[sheetName] || allUploadedData?.[sheetName];

    if (dataToUse && dataToUse.length > 0) {
      return dataToUse;
    }

    return generateCalendarData(startDate, endDate);
  }, [startDate, endDate, widgetTitle, localUploadedData, allUploadedData]);

  const totalActiveDays = calendarValues.length;
  const totalCount = calendarValues.reduce((sum, v) => sum + v.count, 0);

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
    setIsDownloading(true);
    try {
      const wb = XLSX.utils.book_new();
      const usedNames = new Set<string>();

      const getUniqueSheetName = (name: string) => {
        let baseName = (name || "Sheet").replace(/[:\/?*\[\]\\]/g, " ").trim();
        if (baseName.length > 25) baseName = baseName.substring(0, 25);
        if (!baseName) baseName = "Sheet";

        let uniqueName = baseName;
        let counter = 1;
        while (usedNames.has(uniqueName.toLowerCase())) {
          uniqueName = `${baseName}_${counter}`;
          counter++;
        }
        usedNames.add(uniqueName.toLowerCase());
        return uniqueName;
      };

      const processNodeData = (name: string) => {
        const headers = ["Date", "Count"];
        const rows = [headers, ...Array(30).map(() => ["", ""])];

        const ws = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, getUniqueSheetName(name));
      };

      processNodeData(widgetTitle);

      const processChildren = (nodes: any[]) => {
        nodes.forEach((node) => {
          processNodeData(node.name || node.taskName);

          if (node.children && node.children.length > 0) {
            processChildren(node.children);
          }
        });
      };

      if (childTiers && childTiers.length > 0) {
        processChildren(childTiers);
      }

      XLSX.writeFile(wb, `${widgetTitle}.xlsx`);
      toast.success("Excel downloaded successfully");
    } catch (error) {
      console.error("Excel download failed", error);
      toast.error("Failed to download Excel");
    } finally {
      setIsDownloading(false);
    }
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

  const handleChartClick = () => {
    if (childTiers?.length > 0) {
      setShowChildrenModal(true);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result as string;
        const wb = XLSX.read(bstr, { type: "binary" });
        const allData: { [key: string]: CalendarValue[] } = {};

        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          const rawData: any[] = XLSX.utils.sheet_to_json(ws);

          if (rawData.length > 0) {
            const calendarData = rawData
              .map((row) => ({
                date: row.Date || "",
                count: Number(row.Count) || 0,
              }))
              .filter((item) => item.date);
            
            allData[sheetName] = calendarData;
          }
        });

        setLocalUploadedData(allData);
        toast.success("Data uploaded successfully");
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Failed to parse Excel file");
      }
    };
    reader.readAsBinaryString(file);
  };

  /*   RENDER   */

  return (
    <>
      <div
        className={`w-full bg-white border border-gray-200 rounded-lg p-6 relative ${
          childTiers?.length > 0
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

                  {tierLevel === 0 && (
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
                  )}

                  {tierLevel === 0 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById(`upload-input-${chartId || widgetTitle}`)?.click();
                          setShowPopover(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded text-left"
                      >
                        <Upload size={18} />
                        <span>Upload Data</span>
                      </button>
                      <input
                        id={`upload-input-${chartId || widgetTitle}`}
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={handleUpload}
                      />
                    </>
                  )}

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

                  {!isCreationMode && (
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
                  )}
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
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }
              if (value.count < 3) return "color-scale-1";
              if (value.count < 6) return "color-scale-2";
              if (value.count < 10) return "color-scale-3";
              return "color-scale-4";
            }}
            tooltipDataAttrs={(value: any) => {
              if (!value || !value.date) {
                return {};
              }
              return {
                "data-tip": `${value.date}: ${value.count || 0} activities`,
              };
            }}
            showWeekdayLabels
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

        {/* Indicator if chart has children */}
        {childTiers?.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers?.length} child tier
              {childTiers?.length > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Add Tier Modal */}
      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        chartId={chartId}
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
            {childTiers &&
              childTiers?.map((tier: any) => (
                <CalendarHeatmapChart
                  newData={tier?.children || []}
                  key={tier?.id}
                  widgetTitle={tier?.name || tier?.taskName}
                  legendValues={tier?.legendValues}
                  numOfLegendDataSet={tier?.legendValues?.length}
                  tierLevel={tierLevel + 1}
                  chartId={tier?.id}
                  allUploadedData={localUploadedData || allUploadedData}
                />
              ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}