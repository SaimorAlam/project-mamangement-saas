/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { generateChartData } from "@/utils";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import useChartData from "./GetChartData";
import ChartCardWrapper from "./components/ChartCardWrapper";

/*       TYPES       */

export type ChartData = {
  name: string;
  [key: string]: number | string;
};

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
  allUploadedData?: { [key: string]: ChartData[] };
  isPreview?: boolean;
};

export default function StackedBarChart({
  newData,
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 3,
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

  const [localUploadedData, setLocalUploadedData] = useState<
    { [key: string]: ChartData[] } | undefined
  >(allUploadedData);
  
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

  const chartData: ChartData[] = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet")
      .replace(/[:\/?*\[\]\\]/g, " ")
      .trim()
      .substring(0, 31);

    const dataToUse =
      localUploadedData?.[sheetName] || allUploadedData?.[sheetName];

    if (dataToUse && dataToUse.length > 0) {
      return dataToUse;
    }

    if (!xAxisValues.length || !legendValues.length) return [];
    return generateChartData(
      xAxisValues,
      legendValues,
      numOfLegendDataSet,
      startingRange,
      endingRange,
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
        legends: LegendValue[],
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
              node.legendValues,
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

  const handleAddTierClick = () => {
    setShowAddTierModal(true);
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const row = payload[0].payload;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">{row.name}</p>
        {legendValues.map((l) => (
          <p key={l.field} style={{ color: l.color }} className="text-sm">
            {l.label}: {row[l.field]}
          </p>
        ))}
      </div>
    );
  };

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle="Stacked Performance View"
        chartId={chartId || "root"}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload: tierLevel === 0 ? handleDownload : undefined,
          onUpload: tierLevel === 0 ? () => document.getElementById(`upload-input-${chartId || widgetTitle}`)?.click() : undefined,
          onDelete: onDelete,
          onAddTier: !isCreationMode ? handleAddTierClick : undefined,
          onToggleWidget: onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        customHeaderContent={
          <div className="flex gap-4">
            {legendValues.slice(0, 3).map((l) =>
              l.label ? (
                <div key={l.field} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-xs text-gray-500 font-medium">{l.label}</span>
                </div>
              ) : null
            )}
            {legendValues.length > 3 && (
              <span className="text-xs text-gray-400">+{legendValues.length - 3} more</span>
            )}
          </div>
        }
        footer={
          childTiers?.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers?.length} child tier{childTiers?.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <div className="relative">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis domain={[startingRange, endingRange]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip content={<CustomTooltip />} />
              {legendValues?.map((l, i) => (
                <Bar
                  key={l.field}
                  dataKey={l.field}
                  stackId="a"
                  fill={l.color}
                  radius={i === legendValues.length - 1 ? [4, 4, 0, 0] : 0}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>

          {tierLevel === 0 && (
            <input
              id={`upload-input-${chartId || widgetTitle}`}
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleUpload}
            />
          )}

          {chartData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">
              No data available. Please configure the widget.
            </div>
          )}
        </div>
      </ChartCardWrapper>

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
              childTiers?.map((tier: any) => {
                return (
                  <StackedBarChart
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
                    isPreview={isPreview}
                  />
                );
              })}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
