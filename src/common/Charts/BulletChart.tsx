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
      <ChartCardWrapper
        title={widgetTitle}
        chartId={chartId}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload: handleDownload,
          onDelete: onDelete,
          onAddTier: handleAddTierClick,
          onToggleWidget: onToggleWidget,
          onUpload: tierLevel === 0 ? handleUpload : undefined,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        customHeaderContent={
          <div className="text-sm text-gray-500 font-medium">
            {bulletCharts.length} metrics
          </div>
        }
        footer={
          childTiers?.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium text-center">
              Click chart to view {childTiers?.length} child tier
              {childTiers?.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
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
            No data available.
          </div>
        )}
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
