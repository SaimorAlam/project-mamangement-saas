/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useCallback } from "react";
import ReactApexChart from "react-apexcharts";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./components/ChartCardWrapper";

/*     TYPES     */
type RangeData = {
  x: string;
  y: [number, number];
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
  widgetTitle?: string;          // Title for root or tier name for children
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

export default function WaterfallChart({
  widgetTitle = "Waterfall Chart",
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

  /*   DATA GENERATION   */
  const generateRangeData = useCallback((xValues: string[], seed: number): RangeData[] => {
    const range = endingRange - startingRange;
    const rangeWidth = Math.floor(range / 4);

    return xValues.filter(Boolean).map((x, index) => {
      const baseValue = startingRange + ((seed * 17 + index * 23) % range);
      const lowerBound = Math.max(startingRange, baseValue - rangeWidth / 2);
      const upperBound = Math.min(endingRange, baseValue + rangeWidth / 2);

      return {
        x,
        y: [Math.round(lowerBound), Math.round(upperBound)] as [number, number],
      };
    });
  }, [startingRange, endingRange]);

  const series = useMemo(() => {
    if (!xAxisValues.length || !legendValues.length) return [];

    return legendValues.filter((l) => l.label).map((legend, index) => ({
      name: legend.label,
      data: generateRangeData(xAxisValues, index * 37),
    }));
  }, [xAxisValues, legendValues, generateRangeData]);

  /*   CHART OPTIONS   */
  const chartOptions: any = useMemo(
    () => ({
      chart: {
        type: "rangeBar",
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val[0] + " - " + val[1];
        },
      },
      colors: legendValues.map((l) => l.color),
      xaxis: {
        categories: xAxisValues.filter(Boolean),
        title: { text: "Categories" },
      },
      yaxis: {
        title: { text: "Range" },
        min: startingRange,
        max: endingRange,
      },
      legend: { position: "top", horizontalAlign: "left" },
    }),
    [xAxisValues, legendValues, startingRange, endingRange]
  );

  const totalRanges = useMemo(() => {
    return series.reduce((sum, s) => sum + s.data.length, 0);
  }, [series]);

  /*   ACTIONS   */
  const handleCopy = () => {
    const copyData = series.map((s) => ({ name: s.name, data: s.data }));
    navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
  };

  const handleDownload = async () => {
    const payload = {
      numberOfDataset: numOfLegendDataSet,
      firstFieldDataset: startingRange,
      lastFieldDAtaset: endingRange,
      showWidgets: legendValues.map((l) => ({
        legend_name: l.label,
        color: l.color,
      })),
      title: widgetTitle,
      status: "ACTIVE",
      category: "BAR",
      xAxis: JSON.stringify({ labels: xAxisValues, values: [] }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
    };

    setIsDownloading(true);
    await DownloadAndSaveCSVforModuleOneWidget(
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
          <p className="text-sm text-gray-500 font-medium">
            Total Ranges: {totalRanges}
          </p>
        }
        footer={
          childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium text-center">
              Click chart to view {childTiers.length} child tier{childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        {series.length > 0 && xAxisValues.filter(Boolean).length > 0 ? (
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="rangeBar"
            height={350}
          />
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-400">
            No data available.
          </div>
        )}
      </ChartCardWrapper>

      {/* MODALS */}
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
              <WaterfallChart
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
