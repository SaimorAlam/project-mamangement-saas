/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import useChartData from "./useChartData";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";

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
  isPreview?: boolean;
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
  isPreview = false,
}: Props) {
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
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  /*   DATA GENERATION   */
  const matrixData: number[][] = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet")
      .replace(/[:/?*[\]\\]/g, " ")
      .trim()
      .substring(0, 31);
    const dataToUse = allUploadedData?.[sheetName];

    if (dataToUse && dataToUse.length > 0) {
      return dataToUse;
    }

    if (!xAxisValues.length || !legendValues.length) return [];

    const data: number[][] = [];
    legendValues.forEach(() => {
      const row: number[] = [];
      xAxisValues.forEach(() => {
        row.push(
          Math.floor(Math.random() * (endingRange - startingRange + 1)) +
            startingRange,
        );
      });
      data.push(row);
    });
    return data;
  }, [
    xAxisValues,
    legendValues,
    startingRange,
    endingRange,
    widgetTitle,
    allUploadedData,
  ]);

  /*   OPACITY SCALE   */
  const getOpacity = (value: number) => {
    if (endingRange === startingRange) return 1;
    const normalized = (value - startingRange) / (endingRange - startingRange);
    const clamped = Math.max(0, Math.min(1, normalized));
    return 0.2 + clamped * 0.8;
  };

  /*   CELL COLOR FUNCTION   */
  const cellColorFunction = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    const opacity = getOpacity(numValue);
    const primaryColor = legendValues[0]?.color || "#3B93A5";

    const hex = primaryColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  /*   ROWS & COLUMNS   */
  const rows = useMemo(
    () => legendValues.map((l) => l.label || "").filter(Boolean),
    [legendValues],
  );
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
        let baseName = (name || "Sheet").replace(/[:/?*[\]\\]/g, " ").trim();
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
            const childRows = node.legendValues
              .map((l: LegendValue) => l.label || "")
              .filter(Boolean);
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

  const handleAddTierClick = () => {
    setShowAddTierModal(true);
  };

  const handleChartClick = () => {
    if (childTiers?.length > 0) {
      setShowChildrenModal(true);
    }
  };

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle={`${rows.length} rows × ${columns.length} columns`}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload: tierLevel === 0 ? handleDownload : undefined,
          onDelete: onDelete,
          onAddTier: !isCreationMode ? handleAddTierClick : undefined,
          onToggleWidget: onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        footer={
          childTiers?.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium text-center">
              Click chart to view {childTiers?.length} child tier
              {childTiers?.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        {rows.length > 0 && columns.length > 0 && matrixData.length > 0 ? (
          <div className="overflow-x-auto my-2">
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left text-gray-500 border-collapse">
                <thead className="text-[11px] text-gray-400 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-4 py-3 border-r border-gray-100 bg-gray-50/80 sticky left-0 z-10"></th>
                    {columns.map((col, i) => (
                      <th
                        key={i}
                        className="px-4 py-3 border-r border-gray-100 last:border-r-0 text-center font-bold tracking-wider"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((rowLabel, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-4 py-3 font-semibold text-gray-700 border-r border-gray-100 bg-gray-50/30 sticky left-0 z-10">
                        {rowLabel}
                      </td>
                      {matrixData[rowIndex]?.map((cellValue, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-2 py-3 border-r border-gray-100 last:border-r-0 text-center font-medium transition-all duration-200"
                          style={{
                            backgroundColor: cellColorFunction(cellValue),
                            color:
                              getOpacity(cellValue) > 0.6 ? "#fff" : "#374151",
                          }}
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
          <div className="h-[300px] flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-2xl">
            No data available. Please configure rows and columns.
          </div>
        )}
      </ChartCardWrapper>

      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        parentChartName={widgetTitle}
        onSave={() => {
          // refetch();
          setShowAddTierModal(false);
        }}
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
                  allUploadedData={allUploadedData}
                  isPreview={isPreview}
                  onDelete={onDelete}
                />
              ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
