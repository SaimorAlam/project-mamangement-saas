/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import {
  Sparklines,
  SparklinesLine,
  SparklinesSpots,
  SparklinesReferenceLine,
} from "react-sparklines";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import { downloadCSVForModuleOne } from "@/utils/DownlaodChartCSV";
import ChartCardWrapper from "./CompletedCharts/Common/ChartCardWrapper";
import { useChartTools } from "./hooks/useChartTools";
import { useChartTiers } from "./hooks/useChartTiers";

/* ---------- TYPES ---------- */

export type TierChart = {
  id: string;
  name: string;
  xAxisValues: string[];
  children: TierChart[];
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
  isPreview?: boolean;
};

/* ---------- COMPONENT ---------- */

export default function SparkLinesChart({
  widgetTitle = "Trend Analysis",
  xAxisValues = [],
  startingRange,
  endingRange,
  onToggleWidget,
  tierLevel = 0,
  legendValues,
  chartId = "root",
  onDelete,
  isPreview = false,
}: Props) {
  /* ---------- HOOKS ---------- */
  const { isDownloading, handleCopy, handleDownloadWrapper } = useChartTools();

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

  const generateData = useMemo(
    () => () => {
      if (!xAxisValues.length) return [];
      // Randomize slightly for sparklines effect
      return xAxisValues.map(
        () =>
          Math.floor(Math.random() * (endingRange - startingRange + 1)) +
          startingRange,
      );
    },
    [xAxisValues, startingRange, endingRange],
  );

  /* ---------- SERIES ---------- */

  const series = useMemo(() => {
    if (legendValues?.length) {
      return legendValues.map((legend) => ({
        name: legend.label,
        color: legend.color,
        data: generateData(),
      }));
    }
    return [
      {
        name: widgetTitle,
        color: "#13A490",
        data: generateData(),
      },
    ];
  }, [legendValues, widgetTitle, generateData]);

  /* ---------- ACTIONS ---------- */

  const onCopy = () => {
    const dataToCopy = series[0]?.data || [];
    const copyData = xAxisValues.map((label, index) => ({
      label,
      value: dataToCopy[index],
    }));
    handleCopy(copyData);
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

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle={`${xAxisValues.length} points`}
        chartId={chartId}
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
        {xAxisValues?.length ? (
          <div className="w-full h-[350px] flex flex-col justify-center space-y-4">
            {series.map((s, i) => (
              <div key={i} className="flex-1">
                {series.length > 1 && (
                  <p className="text-xs text-gray-500 mb-1">{s.name}</p>
                )}
                <Sparklines data={s.data} height={20}>
                  <SparklinesLine
                    color={s.color}
                    style={{ strokeWidth: 2, fill: s.color }}
                  />
                  <SparklinesSpots />
                  <SparklinesReferenceLine type="avg" />
                </Sparklines>
              </div>
            ))}
          </div>
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
          {/* Recursive rendering logic remains same or can be improved */}
          <div className="p-4 bg-gray-50 rounded">
            <p className="text-center text-gray-500">
              Tier view for Sparklines
            </p>
          </div>
        </TierChartModal>
      )}
    </>
  );
}
