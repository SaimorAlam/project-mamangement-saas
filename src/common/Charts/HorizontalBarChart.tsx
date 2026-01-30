import { useMemo, useState } from "react";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import { generateChartData } from "@/utils";
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

export default function HorizontalBarChart({
  widgetTitle = "My CSV",
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

  // Tier management states
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA   */
  const chartData: ChartData[] = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];
    return generateChartData(
      xAxisValues,
      legendValues,
      numOfLegendDataSet,
      startingRange,
      endingRange
    );
  }, [
    xAxisValues,
    legendValues,
    numOfLegendDataSet,
    startingRange,
    endingRange,
  ]);

  // For horizontal bar chart, we'll use the first legend's data
  const barData = useMemo(() => {
    if (!chartData.length || !legendValues.length) return [];
    const firstLegend = legendValues[0];
    return chartData.map((row) => ({
      label: row.name,
      value: Number(row[firstLegend.field] || 0),
    }));
  }, [chartData, legendValues]);

  /*   TOTAL   */
  const totalValue = useMemo(() => {
    return barData.reduce((sum, item) => sum + item.value, 0);
  }, [barData]);

  const maxValue = endingRange || 110;

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
      category: "HORIZONTAL_BAR",
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

  // Generate scale ticks based on range
  const generateScaleTicks = () => {
    const tickCount = 12;
    const step = Math.ceil(maxValue / (tickCount - 1));
    return Array.from({ length: tickCount }, (_, i) => i * step);
  };

  const scaleTicks = generateScaleTicks();

  /*   RENDER   */

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle={
          legendValues.length > 0 && legendValues[0].label
            ? legendValues[0].label
            : "Data Distribution"
        }
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
          legendValues.length > 0 &&
          legendValues[0].label && (
            <div className="text-sm text-gray-600">
              Total <span className="font-semibold text-gray-900">{totalValue}</span>
            </div>
          )
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

        {/* Bar Chart */}
        {barData.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {barData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 text-right text-sm text-gray-600">
                    {item.label}
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-6 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all duration-500 ease-out"
                        style={{
                          width: `${(item.value / maxValue) * 100}%`,
                          backgroundColor:
                            legendValues.length > 0
                              ? legendValues[0].color
                              : "#6366f1",
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-700">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* X-Axis Scale */}
            <div className="relative ml-24 mr-16 h-6">
              <div className="absolute inset-0 flex justify-between text-xs text-gray-400">
                {scaleTicks.map((tick) => (
                  <div key={tick} className="relative">
                    <div className="absolute -top-1 left-0 w-px h-2 bg-gray-300" />
                    <div className="absolute top-2 left-0 -translate-x-1/2">
                      {tick}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-400">
            No data available, Please fill the input field to generate
            the chart and then download the csv.
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
              <HorizontalBarChart
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
