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
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import { downloadCSVForModuleOne } from "@/utils/DownlaodChartCSV";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";
import { useChartTools } from "./hooks/useChartTools";
import { useChartTiers } from "./hooks/useChartTiers";
import { generateLineChartData } from "@/utils";

/* ---------- TYPES ---------- */

export type TierChart = {
  id: string;
  name: string;
  xAxisValues: string[];
  children: TierChart[];
  legendValues?: LegendValue[];
};
type LegendValue = {
  label: string;
  field: string;
  color: string;
};

type Props = {
  widgetTitle?: string;
  xAxisValues?: string[];
  startingRange: number;
  endingRange: number;
  onToggleWidget?: () => void;
  tierLevel?: number;
  chartId?: string;
  onDelete?: () => void;
  legendValues?: LegendValue[];
  numOfLegendDataSet?: number;
  isPreview?: boolean;
};

/* ---------- COMPONENT ---------- */

export default function LogarithmicChart({
  widgetTitle = "Logarithmic Trends",
  xAxisValues = [],
  startingRange,
  endingRange,
  onToggleWidget,
  tierLevel = 0,
  legendValues = [],
  chartId = "root",
  onDelete,
  isPreview = false,
}: Props) {
  /* ---------- HOOKS ---------- */
  const { isDownloading, handleCopy, handleDownloadWrapper } = useChartTools();
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  const {
    childTiers,
    showAddTierModal,
    setShowAddTierModal,
    showChildrenModal,
    setShowChildrenModal,
    handleAddTier,
    openTierModal,
  } = useChartTiers(chartId, widgetTitle, xAxisValues);

  /* ---------- DATA ---------- */

  const chartData = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];
    // Ensure data is suitable for log scale (values > 0)
    const data = generateLineChartData(
      xAxisValues,
      legendValues,
      Math.max(1, startingRange), // Log scale requires positive values
      endingRange,
    );
    // Filter or adjust 0/negative values if necessary for log scale,
    // but generateLineChartData usually follows range.
    return data;
  }, [xAxisValues, legendValues, startingRange, endingRange]);

  /* ---------- ACTIONS ---------- */

  const onCopy = () => {
    handleCopy(chartData);
  };

  const onDownload = () => {
    handleDownloadWrapper(() => {
      downloadCSVForModuleOne(
        widgetTitle,
        xAxisValues,
        legendValues && legendValues.length > 0
          ? legendValues
          : [{ label: widgetTitle }],
      );
    });
  };

  /* ---------- RENDER ---------- */

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">{payload[0].payload.name}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="text-sm">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle="Logarithmic Scale"
        tierLevel={tierLevel}
        onHeaderClick={openTierModal}
        menuActions={{
          onCopy,
          onDownload,
          onDelete,
          onAddTier: () => setShowAddTierModal(true),
          onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        footer={
          childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} tier
              {childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        {/* Chart Content */}
        {chartData.length ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis scale="log" domain={["auto", "auto"]} allowDataOverflow />
              <Tooltip content={<CustomTooltip />} />

              {legendValues.map((l) => (
                <Line
                  key={l.field}
                  type="monotone"
                  dataKey={l.field}
                  stroke={l.color}
                  strokeWidth={2}
                  dot
                  opacity={
                    hoveredLine === null || hoveredLine === l.field ? 1 : 0.3
                  }
                  onMouseEnter={() => setHoveredLine(l.field)}
                  onMouseLeave={() => setHoveredLine(null)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-400">
            No data available
          </div>
        )}
      </ChartCardWrapper>

      {/* Modals */}
      <AddTierModal
        isOpen={showAddTierModal}
        onClose={() => setShowAddTierModal(false)}
        onSave={handleAddTier}
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
              <LogarithmicChart
                key={tier.id}
                widgetTitle={tier.name}
                xAxisValues={tier.xAxisValues}
                legendValues={legendValues} // Pass parent legends or specific ones? Usually parent for consistency if not overridden
                startingRange={startingRange}
                endingRange={endingRange}
                tierLevel={tierLevel + 1}
                chartId={tier.id}
              />
            ))}
          </div>
        </TierChartModal>
      )}
    </>
  );
}
