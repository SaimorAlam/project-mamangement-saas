/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import useChartData from "./GetChartData";
import ChartCardWrapper from "./components/ChartCardWrapper";

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
  isPreview?: boolean;
  allUploadedData?: { [key: string]: { [key: string]: BulletData } };
};

const BulletChartItem = ({
  title,
  value,
  target,
  min,
  max,
  color,
  plotBands,
}: {
  title: string;
  value: number;
  target: number;
  min: number;
  max: number;
  color: string;
  plotBands: PlotBand[];
}) => {
  const range = max - min;
  const getPercentage = (val: number) => {
    const p = ((val - min) / range) * 100;
    return Math.min(Math.max(p, 0), 100);
  };

  return (
    <div className="flex flex-col gap-1 mb-4 w-full group">
      <div className="flex justify-between items-center text-[13px] mb-1">
        <span className="font-semibold text-slate-700 tracking-tight">
          {title}
        </span>
        <div className="flex gap-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-1.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            Current: <span className="text-slate-900">{value}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-0.5 h-3 bg-slate-900 rounded-full" />
            Target: <span className="text-slate-900">{target}</span>
          </span>
        </div>
      </div>

      <div className="relative h-6 w-full bg-slate-100 rounded-md overflow-hidden shadow-inner border border-slate-200/50">
        {/* Plot Bands */}
        {plotBands.map((band, idx) => (
          <div
            key={idx}
            className="absolute h-full transition-all duration-500"
            style={{
              left: `${getPercentage(band.from)}%`,
              width: `${getPercentage(band.to) - getPercentage(band.from)}%`,
              backgroundColor: band.color,
              opacity: 0.15,
            }}
          />
        ))}

        {/* Feature Measure (The performance bar) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2.5 rounded-r-sm transition-all duration-1000 ease-in-out shadow-sm"
          style={{
            left: "0%",
            width: `${getPercentage(value)}%`,
            backgroundColor: color,
            zIndex: 10,
          }}
        />

        {/* Comparative Measure (The target marker) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-slate-800 rounded-full transition-all duration-1000 ease-in-out border-x border-white/20"
          style={{
            left: `${getPercentage(target)}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 20,
          }}
        />

        {/* Interaction/Tooltip Trigger Placeholder */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity"
          title={`${title} | Current: ${value} | Target: ${target}`}
        />
      </div>

      {/* Axis markers for simple reference */}
      <div className="flex justify-between text-[9px] text-slate-400 font-bold px-1 mt-0.5 uppercase tracking-tighter">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
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
  isPreview = false,
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
        opacity: 0.2,
      },
      {
        from: startingRange + segment,
        to: startingRange + segment * 2,
        color: "#37b400",
        opacity: 0.2,
      },
      {
        from: startingRange + segment * 2,
        to: startingRange + segment * 3,
        color: "#ffc000",
        opacity: 0.2,
      },
      {
        from: startingRange + segment * 3,
        to: endingRange,
        color: "#e62325",
        opacity: 0.2,
      },
    ];
  }, [startingRange, endingRange]);

  /*   DATA GENERATION   */
  const generatedData = useMemo(() => {
    return legendValues
      .filter((l: any) => l.label)
      .reduce(
        (acc, legend) => {
          const range = endingRange - startingRange;
          const current =
            startingRange + Math.floor(Math.random() * range * 0.6);
          const target =
            startingRange + Math.floor(Math.random() * range * 0.9);
          acc[legend.label] = [current, target];
          return acc;
        },
        {} as { [key: string]: BulletData },
      );
  }, [legendValues, startingRange, endingRange]);

  const bulletCharts = useMemo(() => {
    const sheetName = (widgetTitle || "Sheet")
      .replace(/[:/?*[\]\\]/g, " ")
      .trim()
      .substring(0, 31);

    const dataToUse =
      localUploadedData?.[sheetName] || allUploadedData?.[sheetName];

    if (dataToUse) {
      return legendValues
        .filter((l) => l.label && dataToUse[l.label])
        .map((l) => ({
          title: l.label,
          color: l.color,
          data: dataToUse[l.label],
        }));
    }

    if (!legendValues.length) return [];

    return legendValues
      .filter((l) => l.label)
      .map((legend) => ({
        title: legend.label,
        color: legend.color,
        data: generatedData[legend.label] || [0, 0],
      }));
  }, [
    legendValues,
    widgetTitle,
    localUploadedData,
    allUploadedData,
    generatedData,
  ]);

  /*   ACTIONS   */
  const handleCopy = useCallback(() => {
    const copyData = bulletCharts.map((chart) => ({
      title: chart.title,
      current: chart.data[0],
      target: chart.data[1],
    }));
    navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
    toast.success("Data copied to clipboard");
  }, [bulletCharts]);

  const handleDownload = useCallback(() => {
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
  }, [childTiers, legendValues, widgetTitle]);

  const handleAddTierClick = useCallback(() => {
    setShowAddTierModal(true);
  }, []);

  const handleChartClick = useCallback(() => {
    if (childTiers && childTiers.length > 0) {
      setShowChildrenModal(true);
    }
  }, [childTiers]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const menuActions = useMemo(
    () => ({
      onCopy: handleCopy,
      onDownload: handleDownload,
      onDelete: onDelete,
      onAddTier: handleAddTierClick,
      onToggleWidget: onToggleWidget,
      onUpload: tierLevel === 0 ? handleUpload : undefined,
    }),
    [
      handleCopy,
      handleDownload,
      onDelete,
      handleAddTierClick,
      onToggleWidget,
      handleUpload,
      tierLevel,
    ],
  );

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        chartId={chartId}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={menuActions}
        isDownloading={isDownloading}
        isPreview={isPreview}
        customHeaderContent={
          <div className="text-sm text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {bulletCharts.length} metrics
          </div>
        }
        footer={
          childTiers && childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium text-center hover:underline transition-all">
              Click chart to view {childTiers.length} child tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        {/* Bullet Charts Implementation */}
        <div className="space-y-6 max-h-[500px] overflow-y-auto px-1 custom-scrollbar">
          {bulletCharts.map((chart, index) => (
            <BulletChartItem
              key={`${chartId}-${index}`}
              title={chart.title}
              value={chart.data[0]}
              target={chart.data[1]}
              min={startingRange}
              max={endingRange}
              color={chart.color}
              plotBands={plotBands}
            />
          ))}

          {bulletCharts.length === 0 && (
            <div className="h-[200px] flex flex-col items-center justify-center text-gray-400 gap-2 border-2 border-dashed border-gray-100 rounded-xl">
              <div className="size-12 rounded-full bg-gray-50 flex items-center justify-center">
                <span className="text-2xl">📉</span>
              </div>
              <p className="text-sm font-medium">No metrics configured</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
            {childTiers &&
              childTiers.map((tier: any) => (
                <BulletChart
                  newData={tier?.children}
                  key={tier?.id}
                  widgetTitle={tier?.name || tier?.taskName}
                  legendValues={tier?.legendValues}
                  numOfLegendDataSet={tier?.legendValues?.length}
                  startingRange={startingRange}
                  endingRange={endingRange}
                  tierLevel={tierLevel + 1}
                  chartId={tier?.id}
                  allUploadedData={localUploadedData || allUploadedData}
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
