/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Chart,
  ChartTitle,
  ChartTooltip,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartValueAxis,
  ChartValueAxisItem,
  TooltipContext,
} from "@progress/kendo-react-charts";
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

type BulletData = [number, number]; // [current, target]

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

type PlotBand = {
  from: number;
  to: number;
  color: string;
  opacity: number;
};

type Props = {
  newData?: any[];
  widgetTitle?: string;
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  isCreationMode?: boolean;
  allUploadedData?: { [key: string]: { [key: string]: BulletData } };
};

const hidden = { visible: false };

const tooltipRender = (e: TooltipContext) => {
  const { value } = e.point;
  return (
    <span>
      Target: {value.target}
      <br />
      Current: {value.current}
    </span>
  );
};

export default function BulletChart({
  newData,
  widgetTitle = "Bullet Chart",
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
  const [localUploadedData, setLocalUploadedData] = useState<
    { [key: string]: { [key: string]: BulletData } } | undefined
  >(allUploadedData);
  const { childTiers } = useChartData({
    newData,
    isCreationMode,
    chartId,
    xAxisValues: [],
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);



  /*   PLOT BANDS   */
  const plotBands: PlotBand[] = useMemo(() => {
    const range = endingRange - startingRange;
    const segment = range / 4;

    return [
      {
        from: startingRange,
        to: startingRange + segment,
        color: "#5392ff",
        opacity: 1,
      },
      {
        from: startingRange + segment,
        to: startingRange + segment * 2,
        color: "#37b400",
        opacity: 1,
      },
      {
        from: startingRange + segment * 2,
        to: startingRange + segment * 3,
        color: "#ffc000",
        opacity: 1,
      },
      {
        from: startingRange + segment * 3,
        to: endingRange,
        color: "#e62325",
        opacity: 1,
      },
    ];
  }, [startingRange, endingRange]);

  /*   DATA GENERATION   */
  // Stable random data generation
  const generatedData = useMemo(() => {
    return legendValues

      .filter((l: any) => l.label)
      .reduce((acc, legend) => {
        const range = endingRange - startingRange;
        const current =
          startingRange + Math.floor(Math.random() * range * 0.6);
        const target = startingRange + Math.floor(Math.random() * range * 0.9);
        acc[legend.label] = [current, target];
        return acc;
      }, {} as { [key: string]: BulletData });
  }, [legendValues, startingRange, endingRange]);

  const bulletCharts = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet")
      .replace(/[:\/?*\[\]\\]/g, " ")
      .trim()
      .substring(0, 31);
    
    // Check if we have specific data for this sheet/title
    const dataToUse =
      localUploadedData?.[sheetName] || allUploadedData?.[sheetName];

    if (dataToUse) {
      return legendValues
        .filter((l) => l.label && dataToUse[l.label])
        .map((l) => ({
          title: l.label,
          color: l.color,
          data: [dataToUse[l.label]],
        }));
    }

    if (!legendValues.length) return [];

    // Fallback to stable generated data
    return legendValues
      .filter((l) => l.label)
      .map((legend) => {
        const data = generatedData[legend.label] || [0, 0];
        return {
          title: legend.label,
          color: legend.color,
          data: [data],
        };
      });
  }, [
    legendValues,
    widgetTitle,
    localUploadedData,
    allUploadedData,
    generatedData,
  ]);



  /*   ACTIONS   */

  const handleCopy = () => {
    const copyData = bulletCharts.map((chart) => ({
      title: chart.title,
      current: chart.data[0][0],
      target: chart.data[0][1],
    }));
    navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const wb = XLSX.utils.book_new();
      const usedNames = new Set<string>();

      const getUniqueSheetName = (name: string) => {
        let baseName = (name || "Sheet")
          .replace(/[:\/?*\[\]\\]/g, " ")
          .trim();
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

      const processNodeData = (name: string, legends: LegendValue[]) => {
        const headers = ["Metric", "Current", "Target"];
        const rows = legends.map((l) => [l.label, "", ""]);
        const data = [headers, ...rows];

        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, getUniqueSheetName(name));
      };

      if (legendValues) {
        processNodeData(widgetTitle, legendValues);
      }

      const processChildren = (nodes: any[]) => {
        nodes.forEach((node) => {
          if (node.legendValues) {
            processNodeData(node.name || node.taskName, node.legendValues);
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
        const allData: { [key: string]: { [key: string]: BulletData } } = {};

        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          const rawData: any[] = XLSX.utils.sheet_to_json(ws);

          if (rawData.length > 0) {
            const bulletData: { [key: string]: BulletData } = {};
            rawData.forEach((row) => {
              const metric = row["Metric"];
              const current = Number(row["Current"]) || 0;
              const target = Number(row["Target"]) || 0;
              if (metric) {
                bulletData[metric] = [current, target];
              }
            });
            allData[sheetName] = bulletData;
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
          childTiers?.length > 0
            ? "cursor-pointer hover:shadow-lg transition-shadow"
            : ""
        }`}
        onClick={handleChartClick}
      >
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">{widgetTitle}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {bulletCharts.length} metrics
            </p>
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

        {/* Bullet Charts */}
        <div className="space-y-2">
          {bulletCharts.map((chart, index) => (
            <Chart key={index} style={{ height: 120 }}>
              <ChartTitle text={chart.title} />
              <ChartLegend />
              <ChartSeries>
                <ChartSeriesItem
                  type="bullet"
                  name={chart.title}
                  color={chart.color}
                  data={chart.data}
                />
              </ChartSeries>
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  majorGridLines={hidden}
                  minorGridLines={hidden}
                />
              </ChartCategoryAxis>
              <ChartValueAxis>
                <ChartValueAxisItem
                  majorGridLines={hidden}
                  minorTicks={hidden}
                  min={startingRange}
                  max={endingRange}
                  plotBands={plotBands}
                />
              </ChartValueAxis>
              <ChartTooltip render={tooltipRender} />
            </Chart>
          ))}
        </div>

        {bulletCharts.length === 0 && (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            No data available. Please configure metrics in the widget.
          </div>
        )}

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
                <BulletChart
                  newData={tier?.children || []}
                  key={tier?.id}
                  widgetTitle={tier?.name || tier?.taskName}
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