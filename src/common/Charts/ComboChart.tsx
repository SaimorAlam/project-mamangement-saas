/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Chart } from "react-chartjs-2";
import { Copy, Trash2, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineWidgets } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { generateChartData } from "@/utils";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import useChartData from "./GetChartData";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

/*       TYPES       */

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

type LegendValue = {
  label: string;
  field: string;
  color: string;
  type?: "bar" | "line";
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
  allUploadedData?: { [key: string]: ChartData[] };
};

export default function ComboChart({
  newData,
  widgetTitle = "Combo Chart",
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
  const [localUploadedData, setLocalUploadedData] = useState<{ [key: string]: ChartData[] } | undefined>(allUploadedData);
  const { childTiers } = useChartData({
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

  const chartRef = useRef<ChartJS>(null);

  /*   CHART DATA   */
  const chartData: ChartData[] = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet").replace(/[:\/?*\[\]\\]/g, " ").trim().substring(0, 31);
    const dataToUse = localUploadedData?.[sheetName] || allUploadedData?.[sheetName];

    if (dataToUse && dataToUse.length > 0) {
      return dataToUse;
    }

    if (!xAxisValues.length || !legendValues.length) return [];
    return generateChartData(
      xAxisValues,
      legendValues,
      numOfLegendDataSet,
      startingRange,
      endingRange
    );
  }, [
    xAxisValues,
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
    widgetTitle,
    localUploadedData,
    allUploadedData,
  ]);

  /*   CHART.JS DATA   */
  const data = useMemo(() => {
    const labels = chartData.map((d) => d.name);
    const datasets = legendValues.map((legend) => {
      const dataValues = chartData.map((d) => Number(d[legend.field]) || 0);
      const isLine = legend.type === "line";

      return {
        label: legend.label,
        data: dataValues,
        borderColor: legend.color,
        backgroundColor: isLine
          ? "transparent"
          : `${legend.color}CC`, // Add transparency for bars
        type: isLine ? ("line" as const) : ("bar" as const),
        order: isLine ? 0 : 1, // Lines on top, bars behind
        borderWidth: isLine ? 2 : 0,
        pointRadius: isLine ? 3 : 0,
        pointBackgroundColor: isLine ? legend.color : undefined,
      };
    });

    return {
      labels,
      datasets,
    };
  }, [chartData, legendValues]);

  /*   CHART OPTIONS   */
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: widgetTitle,
          font: {
            size: 18,
            weight: 600,
          },
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
        },
      },
      scales: {
        y: {
          min: startingRange,
          max: endingRange,
          ticks: {
            stepSize: Math.ceil((endingRange - startingRange) / 10),
          },
        },
      },
    }),
    [widgetTitle, startingRange, endingRange]
  );

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
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

      const processNodeData = (
        name: string,
        xAxis: string[],
        legends: LegendValue[]
      ) => {
        const headers = ["Label", ...legends.map((l) => l.label)];
        const rows = xAxis.map((label) => [label, ...legends.map(() => "")]);
        const data = [headers, ...rows];

        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, getUniqueSheetName(name));
      };

      if (xAxisValues && legendValues) {
        processNodeData(widgetTitle, xAxisValues, legendValues);
      }

      const processChildren = (nodes: any[]) => {
        nodes.forEach((node) => {
          if (node.xAxisValues && node.legendValues) {
            processNodeData(
              node.name || node.taskName,
              node.xAxisValues,
              node.legendValues
            );
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
        const allData: { [key: string]: ChartData[] } = {};

        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          const rawData: any[] = XLSX.utils.sheet_to_json(ws);

          if (rawData.length > 0) {
            const processedData = rawData.map((row: any) => {
              const item: ChartData = { name: row["Label"] || "" };
              legendValues.forEach((l) => {
                if (row[l.label] !== undefined) {
                  item[l.field] = Number(row[l.label]);
                } else if (row[l.field] !== undefined) {
                  item[l.field] = Number(row[l.field]);
                }
              });
              return item;
            });
            allData[sheetName] = processedData;
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
    <div className="min-w-3xl">
      <div
        className={`bg-white border border-gray-200 rounded-lg p-6 relative ${
          childTiers.length > 0
            ? "cursor-pointer hover:shadow-lg transition-shadow"
            : ""
        }`}
        onClick={handleChartClick}
      >
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">{widgetTitle}</h2>
            <div className="flex gap-6 mt-3">
              {legendValues.map((l) =>
                l.label ? (
                  <div key={l.field} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: l.color }}
                    />
                    <span className="text-sm">
                      {l.label} ({l.type || "bar"})
                    </span>
                  </div>
                ) : null
              )}
            </div>
          </div>

          <div
            className="flex items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
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
                          document
                            .getElementById(
                              `upload-input-${chartId || widgetTitle}`
                            )
                            ?.click();
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

        <div style={{ height: "400px", width: "100%" }}>
          <Chart ref={chartRef} type="bar" data={data} options={options} />
        </div>

        {childTiers?.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers?.length} child tier
              {childTiers?.length > 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        chartId={chartId}
        parentChartName={widgetTitle}
      />

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
                <ComboChart
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
    </div>
  );
}