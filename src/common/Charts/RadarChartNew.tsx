/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Radar,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./components/ChartCardWrapper";

/*     TYPES     */

type RadarDataPoint = {
  metric: string;
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
  tierLevel?: number;
  chartId?: string;
  onDelete?: () => void;
  isPreview?: boolean;
};

/*     COMPONENT     */

export default function RadarChartNew({
  widgetTitle = "Radar Chart",
  xAxisValues = [],
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange,
  endingRange,
  onToggleWidget,
  tierLevel = 0,
  chartId = "root",
  onDelete,
  isPreview = false,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);

  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /* ========= DATA ========= */

  const radarData: RadarDataPoint[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];

    return xAxisValues.filter(Boolean).map((metric, index) => {
      const dataPoint: RadarDataPoint = { metric };

      legendValues.forEach((legend) => {
        if (legend.label) {
          // Generate normalized values (0-1) for radar
          const normalizedValue =
            (startingRange +
              ((endingRange - startingRange) *
                ((index + legendValues.indexOf(legend) * 7) % 10)) /
                10) /
            endingRange;
          dataPoint[legend.field] = Math.min(Math.max(normalizedValue, 0), 1);
        }
      });

      return dataPoint;
    });
  }, [xAxisValues, legendValues, startingRange, endingRange]);

  /* ========= CENTER METRIC ========= */

  const centerMetric = useMemo(() => {
    if (!radarData.length || !legendValues.length) return null;

    // Calculate average of first legend's values
    const firstLegend = legendValues.find((l) => l.label);
    if (!firstLegend) return null;

    const sum = radarData.reduce(
      (acc, dp) => acc + Number(dp[firstLegend.field] || 0),
      0,
    );
    const avg = sum / radarData.length;

    return {
      label: xAxisValues[0] || "Average",
      value: (avg * 100).toFixed(0) + "%",
    };
  }, [radarData, legendValues, xAxisValues]);

  /* ========= ACTIONS ========= */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(radarData, null, 2));
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

  /* ========= TOOLTIP ========= */

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white p-3 border rounded shadow-lg">
        <p className="font-semibold mb-2">{payload[0].payload.metric}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.stroke }} className="text-sm">
            {p.name}: {(p.value * 100).toFixed(0)}%
          </p>
        ))}
      </div>
    );
  };

  /* ========= RENDER ========= */

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
          <div className="flex gap-4">
            {legendValues.map(
              (l) =>
                l.label && (
                  <div key={l.field} className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: l.color }}
                    />
                    <span className="text-xs text-gray-500 font-medium">
                      {l.label}
                    </span>
                  </div>
                ),
            )}
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
        <div className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <ReRadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 1]}
                tick={{ fill: "#6b7280", fontSize: 10 }}
                tickCount={5}
              />
              <Tooltip content={<CustomTooltip />} />

              {legendValues.map((l, index) =>
                l.label ? (
                  <Radar
                    key={l.field}
                    name={l.label}
                    dataKey={l.field}
                    stroke={l.color}
                    fill={l.color}
                    fillOpacity={index === 0 ? 0.5 : 0.2}
                  />
                ) : null,
              )}
            </ReRadarChart>
          </ResponsiveContainer>

          {/* CENTER METRIC */}
          {centerMetric && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-xs text-gray-500">{centerMetric.label}</div>
              <div className="text-lg font-semibold text-gray-800">
                {centerMetric.value}
              </div>
            </div>
          )}
        </div>
      </ChartCardWrapper>

      {/* TIER MODALS */}
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
              <RadarChartNew
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
