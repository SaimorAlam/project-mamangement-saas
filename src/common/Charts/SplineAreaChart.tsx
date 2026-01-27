/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import { downloadCSVForModuleOne } from "@/utils/DownlaodChartCSV";
import ChartCardWrapper from "./components/ChartCardWrapper";

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

export default function SplineAreaChart({
  widgetTitle = "Performance Trend",
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  /* ---------- DATA ---------- */

  const generateData = useMemo(() => (index: number) => {
    if (!xAxisValues.length) return [];
    // Add small variation based on index
    const variation = index * 5; 
    const step = (endingRange - startingRange) / (xAxisValues.length - 1 || 1);

    return xAxisValues.map((_, i) =>
      Math.round(startingRange + step * i + variation)
    );
  }, [xAxisValues, startingRange, endingRange]);

  /* ---------- CHART CONFIG ---------- */

  const chartOptions: any = useMemo(
    () => ({
      chart: {
        type: "area",
        height: 350,
        toolbar: { show: false },
        dropShadow: {
          enabled: true,
          top: 3,
          left: 2,
          blur: 4,
          opacity: 0.15,
        },
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.6,
          opacityFrom: 0.6,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: legendValues?.length > 0 ? legendValues.map(l => l.color) : ["#00E396"],
      xaxis: {
        categories: xAxisValues?.map((v) => v || ""),
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          formatter: (val: number) => Math.round(val).toString(),
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right', 
      },
    }),
    [xAxisValues, legendValues]
  );

  const series = useMemo(() => {
    if (legendValues?.length) {
      return legendValues.map((legend, index) => ({
        name: legend.label,
        data: generateData(index)
      }));
    }
    // Fallback if no legends
    return [{
       name: widgetTitle,
       data: generateData(0)
    }];
  }, [legendValues, widgetTitle, generateData]);

  /* ---------- ACTIONS ---------- */

  const handleCopy = () => {
    const dataToCopy = series[0]?.data || [];
    const copyData = xAxisValues.map((label, index) => ({
      label,
      value: dataToCopy[index],
    }));
    navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
  };

  const handleDownload = () => {
    setIsDownloading(true);
    downloadCSVForModuleOne(widgetTitle, xAxisValues, legendValues && legendValues.length > 0 ? legendValues : [{ label: widgetTitle, field: 'val', color: '#000' }]);
    setIsDownloading(false);
  };

  const handleAddTier = (tierName: string) => {
    setChildTiers((prev) => [
      ...prev,
      {
        id: `${chartId}-tier-${Date.now()}`,
        name: tierName,
        xAxisValues,
        children: [],
      },
    ]);
    setShowAddTierModal(false);
  };

  const handleChartClick = () => {
    if (childTiers.length > 0) {
      setShowChildrenModal(true);
    }
  };

  /* ---------- RENDER ---------- */

  return (
    <>
      <ChartCardWrapper
        title={widgetTitle}
        subtitle={`${xAxisValues.length} points`}
        chartId={chartId}
        tierLevel={tierLevel}
        onHeaderClick={handleChartClick}
        menuActions={{
          onCopy: handleCopy,
          onDownload: handleDownload,
          onDelete: onDelete,
          onAddTier: () => setShowAddTierModal(true),
          onToggleWidget: onToggleWidget,
        }}
        isDownloading={isDownloading}
        isPreview={isPreview}
        footer={
          childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium text-center">
              Click chart to view {childTiers.length} tier{childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        {xAxisValues?.length ? (
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="area"
            height={350}
          />
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-400 font-medium">
            No data available
          </div>
        )}
      </ChartCardWrapper>

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
              <SplineAreaChart
                key={tier.id}
                widgetTitle={tier.name}
                xAxisValues={tier.xAxisValues}
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
