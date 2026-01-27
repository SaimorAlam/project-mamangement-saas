/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import { generateLineChartData } from "@/utils";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
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

/*       COMPONENT       */

export default function MultiAxisLineChart({
  widgetTitle = "My CSV",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 3,
  startingRange,
  endingRange,
  onToggleWidget,
  onDelete,
  tierLevel = 0,
  chartId = "root",
  isPreview = false,
}: Props) {

  const [showLineOnly, setShowLineOnly] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Tier management states
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA   */
  const chartData: ChartData[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];
    return generateLineChartData(
      xAxisValues,
      legendValues,
      startingRange,
      endingRange
    );
  }, [xAxisValues, legendValues, startingRange, endingRange]);

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
      category: "LINE",
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">
          {payload[0].payload.name}
        </p>
        {payload.map((p: any) => (
          <p
            key={p.dataKey}
            style={{ color: p.color }}
            className="text-sm"
          >
            {p.name}: {p.value}
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
        subtitle="Multi-Axis Distribution"
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
          <div className="flex gap-4 items-center">
            <div className="flex gap-3">
              {legendValues.map((l) =>
                l.label ? (
                  <div key={l.field} className="flex items-center gap-1.5">
                    <div className="w-3 h-1 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-xs text-gray-500">{l.label}</span>
                  </div>
                ) : null
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLineOnly(!showLineOnly);
              }}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                showLineOnly 
                  ? "bg-blue-50 text-blue-600 border border-blue-100" 
                  : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
              }`}
            >
              Line Only {showLineOnly ? "✓" : ""}
            </button>
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
        {chartData.length ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <YAxis 
                domain={[startingRange, endingRange]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <Tooltip content={<CustomTooltip />} />

              {legendValues.map((l) => (
                <Line
                  key={l.field}
                  type="monotone"
                  dataKey={l.field}
                  stroke={l.color}
                  dot={!showLineOnly}
                  strokeWidth={2}
                  opacity={
                    hoveredLine === null || hoveredLine === l.field
                      ? 1
                      : 0.3
                  }
                  onMouseEnter={() => setHoveredLine(l.field)}
                  onMouseLeave={() => setHoveredLine(null)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">
             No data available. Please configure the chart.
          </div>
        )}
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
              <MultiAxisLineChart
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
              />
            ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
