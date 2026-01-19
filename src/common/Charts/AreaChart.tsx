/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import { generateAreaChartData } from "@/utils";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./components/ChartCardWrapper";

/*     TYPES     */

type ChartData = {
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
  isPreview?: boolean;
};

/*     COMPONENT     */

export default function AreaChart({
  widgetTitle = "Area Chart",
  xAxisValues = [],
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

  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA   */
  const chartData: ChartData[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];
    return generateAreaChartData(
      xAxisValues,
      legendValues,
      startingRange,
      endingRange
    );
  }, [xAxisValues, legendValues, startingRange, endingRange]);

  /*   TOTAL   */
  const totalValue = useMemo(() => {
    return chartData.reduce((sum, row) => {
      return (
        sum +
        legendValues.reduce(
          (inner, l) => inner + Number(row[l.field] || 0),
          0
        )
      );
    }, 0);
  }, [chartData, legendValues]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData, null, 2));
  };

  const handleDownload = () => {
    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFiledDataset: startingRange,
      lastFiledDAtaset: endingRange,
      showWidgets: legendValues.map((l) => ({
        legend_name: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "BAR",
      xAxis: JSON.stringify({
        labels: xAxisValues,
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
    };
    setIsDownloading(true);

    DownloadAndSaveCSVforModuleOneWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      xAxisValues,
      legendValues
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
      xAxisValues: xAxisValues,
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

  /*   RENDER   */

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
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        customHeaderContent={
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">Total {totalValue}</p>
            <div className="flex gap-4">
              {legendValues.map(
                (l) =>
                  l.label && (
                    <div key={l.field} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: l.color }}
                      />
                      <span className="text-xs text-gray-500 font-medium">{l.label}</span>
                    </div>
                  )
              )}
            </div>
          </div>
        }
        footer={
          childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} child tier{childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ReAreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis domain={[startingRange, endingRange]} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              {legendValues.map((l) => (
                <Area
                  key={l.field}
                  dataKey={l.field}
                  type="monotone"
                  stackId="1"
                  stroke={l.color}
                  fill={l.color}
                  fillOpacity={0.3}
                />
              ))}
            </ReAreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCardWrapper>

      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        onSave={handleSaveTier}
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
            {childTiers.map((tier) => (
              <AreaChart
                key={tier.id}
                widgetTitle={tier.name}
                xAxisValues={tier.xAxisValues}
                legendValues={tier.legendValues}
                numOfLegendDataSet={tier.legendValues.length}
                startingRange={startingRange}
                endingRange={endingRange}
                tierLevel={tierLevel + 1}
                chartId={tier.id}
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