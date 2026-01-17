import { useMemo, useState } from "react";
// import { scaleLinear } from "d3-scale"; // Removed to avoid dependency issue
// import ReactMatrixTable from "@paraboly/react-matrix-table"; // Removed to avoid crash
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

type LegendValue = {
  label: string;
  field: string;
  color: string;
};

export type TierChart = {
  id: string;
  name: string;
  xAxisValues: string[];
  legendValues: LegendValue[];
  children: TierChart[];
};

type Props = {
  newData?: any[];
  widgetTitle?: string;
  xAxisValues?: string[];
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  isCreationMode?: boolean;
  allUploadedData?: { [key: string]: number[][] };
};

export default function MatrixTableChart({
  newData,
  widgetTitle = "Matrix Table",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId,
  isCreationMode = false,
  allUploadedData,
}: Props) {
    console.log("mounted");
    
  const [localUploadedData, setLocalUploadedData] = useState<{ [key: string]: number[][] } | undefined>(allUploadedData);
  const { childTiers, refetch } = useChartData({
    newData,
    isCreationMode,
    chartId,
    xAxisValues,
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  /*   DATA GENERATION   */
  const matrixData: number[][] = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet").replace(/[:\/?*\[\]\\]/g, " ").trim().substring(0, 31);
    const dataToUse = localUploadedData?.[sheetName] || allUploadedData?.[sheetName];

    if (dataToUse && dataToUse.length > 0) {
      return dataToUse;
    }

    if (!xAxisValues.length || !legendValues.length) return [];

    // Generate random data for matrix
    const data: number[][] = [];
    legendValues.forEach(() => {
      const row: number[] = [];
      xAxisValues.forEach(() => {
        row.push(Math.floor(Math.random() * (endingRange - startingRange + 1)) + startingRange);
      });
      data.push(row);
    });
    return data;
  }, [xAxisValues, legendValues, startingRange, endingRange, widgetTitle, localUploadedData, allUploadedData]);

  /*   OPACITY SCALE   */
  const getOpacity = (value: number) => {
    if (endingRange === startingRange) return 1;
    const normalized = (value - startingRange) / (endingRange - startingRange);
    // Clamp between 0 and 1
    const clamped = Math.max(0, Math.min(1, normalized));
    return 0.2 + (clamped * 0.8); // Range [0.2, 1]
  };

  /*   CELL COLOR FUNCTION   */
  const cellColorFunction = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const opacity = getOpacity(numValue);
    const primaryColor = legendValues[0]?.color || "#3B93A5";
    
    // Convert hex to rgb
    const hex = primaryColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  /*   ROWS & COLUMNS   */
  const rows = useMemo(() => legendValues.map((l) => l.label || "").filter(Boolean), [legendValues]);
  const columns = useMemo(() => xAxisValues.filter(Boolean), [xAxisValues]);

  /*   ACTIONS   */
  const handleCopy = () => {
    const copyData = {
      rows,
      columns,
      data: matrixData,
    };
    navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
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

      const processNodeData = (name: string, cols: string[], rws: string[]) => {
        const headers = ["", ...cols];
        const rowData = rws.map((row) => [row, ...cols.map(() => "")]);
        const data = [headers, ...rowData];

        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, getUniqueSheetName(name));
      };

      if (columns && rows) {
        processNodeData(widgetTitle, columns, rows);
      }

      const processChildren = (nodes: any[]) => {
        nodes.forEach((node) => {
          if (node.xAxisValues && node.legendValues) {
            const childCols = node.xAxisValues.filter(Boolean);
            const childRows = node.legendValues.map((l: LegendValue) => l.label || "").filter(Boolean);
            processNodeData(node.name || node.taskName, childCols, childRows);
          }

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
        const allData: { [key: string]: number[][] } = {};

        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

          if (rawData.length > 1) {
            // Skip header row, process data rows
            const matrixData = rawData.slice(1).map((row) => {
              // Skip first column (row label), get numeric values
              return row.slice(1).map((cell) => Number(cell) || 0);
            });
            allData[sheetName] = matrixData;
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

  return (
    <>
      <div
        className={`w-full bg-white border border-gray-200 rounded-lg p-6 ${
          childTiers?.length > 0 ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
        }`}
        onClick={handleChartClick}
      >
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">{widgetTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {rows.length} rows × {columns.length} columns
            </p>
          </div>

          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
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

        {/* Matrix Table */}
        {rows.length > 0 && columns.length > 0 && matrixData.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 border-r"></th>
                    {columns.map((col, i) => (
                      <th key={i} className="px-4 py-3 border-r last:border-r-0 text-center font-semibold">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((rowLabel, rowIndex) => (
                    <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 border-r bg-gray-50">
                        {rowLabel}
                      </td>
                      {matrixData[rowIndex]?.map((cellValue, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-2 py-2 border-r last:border-r-0 text-center transition-colors hover:opacity-80"
                          style={{
                            backgroundColor: cellColorFunction(cellValue),
                            color: getOpacity(cellValue) > 0.6 ? "#fff" : "#000",
                          }}
                          title={`Value: ${cellValue}`}
                        >
                          {cellValue}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            No data available. Please configure rows and columns in the widget.
          </div>
        )}

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
        onSave={() => {
            refetch();
            setShowAddTierModal(false);
        }}
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
                <MatrixTableChart
                  newData={tier?.children || []}
                  key={tier?.id}
                  widgetTitle={tier?.name || tier?.taskName}
                  xAxisValues={tier?.xAxisValues}
                  legendValues={tier?.legendValues}
                  numOfLegendDataSet={tier?.legendValues?.length}
                  startingRange={startingRange}
                  endingRange={endingRange}
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