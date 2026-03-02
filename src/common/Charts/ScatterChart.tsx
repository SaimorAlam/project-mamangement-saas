/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  ScatterChart as ReScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleTwoWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";

/*       TYPES       */

type ScatterData = {
  x: number;
  y: number;
  z: number;
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
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  isPreview?: boolean;
  allUploadedData?: any;
};

/*       COMPONENT       */

export default function ScatterChart({
  widgetTitle = "3D Scatter Chart",
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId = "root",
  isPreview = false,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Tier management states
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA GENERATION   */
  const generateScatterData = (
    seed: number,
    count: number = 6,
  ): ScatterData[] => {
    const data: ScatterData[] = [];
    const range = endingRange - startingRange;

    for (let i = 0; i < count; i++) {
      const randomFactor = (seed * 7 + i * 13) % 100;
      data.push({
        x: startingRange + Math.floor((range * (randomFactor + i * 10)) / 100),
        y:
          startingRange +
          Math.floor((range * ((randomFactor * 2 + i * 15) % 100)) / 100),
        z:
          startingRange +
          Math.floor((range * ((randomFactor * 3 + i * 20) % 100)) / 100),
      });
    }
    return data;
  };

  const scatterDataSets = useMemo(() => {
    // Prioritize uploaded data if available
    const sheetName = (widgetTitle || "Sheet")
      .replace(/[:/?*[\\]\\]/g, " ")
      .trim()
      .substring(0, 31);
    const uploadedData = allUploadedData?.[sheetName];
    if (uploadedData && uploadedData.length > 0) {
      // Expect uploadedData to be an array of points {x,y,z}
      return [{
        name: widgetTitle || "Scatter",
        data: uploadedData,
        color: legendValues[0]?.color || "#8884d8",
      }];
    }

    if (!legendValues.length) return [];

    return legendValues
      .filter((l) => l.label)
      .map((legend, index) => ({
        name: legend.label,
        data: generateScatterData(index * 37, 6),
        color: legend.color,
      }));
  }, [legendValues, startingRange, endingRange, generateScatterData, allUploadedData, widgetTitle]);

  /*   TOTAL POINTS   */
  const totalPoints = useMemo(() => {
    return scatterDataSets.reduce(
      (sum, dataset) => sum + dataset.data.length,
      0,
    );
  }, [scatterDataSets]);

  /*   ACTIONS   */

  const handleCopy = () => {
    const copyData = scatterDataSets.map((dataset) => ({
      name: dataset.name,
      data: dataset.data,
    }));
    navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
  };

  const handleDownload = () => {
    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: startingRange,
      lastFieldDataset: endingRange,
      showWidgets: legendValues.map((l) => ({
        legend_name: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "BAR",
      xAxis: JSON.stringify({
        labels: [],
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
    };
    setIsDownloading(true);

    DownloadAndSaveCSVforModuleTwoWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      legendValues,
    );

    setIsDownloading(false);
  };

  const handleAddTierClick = () => {
    setShowAddTierModal(true);
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

  /*   TOOLTIP   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">{payload[0].name}</p>
        <p className="text-sm text-gray-600">X: {data.x}</p>
        <p className="text-sm text-gray-600">Y: {data.y}</p>
        <p className="text-sm text-gray-600">Z: {data.z}</p>
      </div>
    );
  };

  /*   RENDER   */

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle="3D Scatter Distribution"
        chartId={chartId}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload: handleDownload,
          onDelete: onDelete,
          onAddTier: handleAddTierClick,
          onToggleWidget: onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        customHeaderContent={
          <div className="text-sm text-gray-500">
            Total Points: {totalPoints}
          </div>
        }
        footer={
          childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} child tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        {scatterDataSets.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <ReScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name="X Axis"
                domain={[startingRange, endingRange]}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Y Axis"
                domain={[startingRange, endingRange]}
              />
              <ZAxis
                type="number"
                dataKey="z"
                range={[60, 400]}
                name="Z Axis"
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<CustomTooltip />}
              />
              <Legend />
              {scatterDataSets.map((dataset, index) => (
                <Scatter
                  key={index}
                  name={dataset.name}
                  data={dataset.data}
                  fill={dataset.color}
                  shape="circle"
                />
              ))}
            </ReScatterChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">
            No data available. Please configure legend values.
          </div>
        )}
      </ChartCardWrapper>

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
              <ScatterChart
                key={tier.id}
                widgetTitle={tier.name}
                legendValues={tier.legendValues}
                numOfLegendDataSet={tier.legendValues.length}
                startingRange={startingRange}
                endingRange={endingRange}
                tierLevel={tierLevel + 1}
                chartId={tier.id}
                isPreview={isPreview}
              />
            ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
