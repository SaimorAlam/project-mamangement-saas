/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./components/ChartCardWrapper";

/*       TYPES       */

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
  startingRange?: number;
  endingRange?: number;
  gaugeValue?: number;
  chartHeight?: number;
  startAngle?: number;
  endAngle?: number;
  trackColor?: string;
  strokeWidth?: string;
  fontSize?: number;
  shadeIntensity?: number;
  onToggleWidget?: () => void;
  onDelete?: () => void;
  tierLevel?: number;
  chartId?: string;
  isPreview?: boolean;
};

/*       HELPER FUNCTIONS       */

const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const deterministicRandom = (
  seed: number,
  min: number,
  max: number
): number => {
  const x = Math.sin(seed) * 10000;
  const random = x - Math.floor(x);
  return Math.floor(random * (max - min + 1)) + min;
};


/*       COMPONENT       */

export default function GaugeChart({
  widgetTitle = "My CSV",
  legendValues = [],
  numOfLegendDataSet = 1,
  startingRange = 0,
  endingRange = 100,
  gaugeValue,
  chartHeight = 300,
  startAngle = -90,
  endAngle = 90,
  trackColor = "#e7e7e7",
  strokeWidth = "97%",
  fontSize = 22,
  shadeIntensity = 0.4,
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

  /*   CHART DATA   */
  const calculatedGaugeValue = useMemo(() => {
    if (gaugeValue !== undefined) {
      return gaugeValue;
    }
    const seed = simpleHash(
      `${widgetTitle}-${startingRange}-${endingRange}`
    );
    return deterministicRandom(seed, startingRange, endingRange);
  }, [gaugeValue, widgetTitle, startingRange, endingRange]);

  const isAllLegendFieldEmpty = legendValues.filter(
    (l) => l.field !== ""
  );

  /*   APEX CHART STATE   */
  const chartOptions: any = useMemo(() => {
    const colors =
      legendValues.length > 0 && legendValues[0].color
        ? [legendValues[0].color]
        : ["#8D79F6"];

    return {
      chart: {
        type: "radialBar" as const,
        offsetY: -20,
        sparkline: {
          enabled: true,
        },
        toolbar: {
          show: false,
        },
        height: chartHeight,
      },
      plotOptions: {
        radialBar: {
          startAngle: startAngle,
          endAngle: endAngle,
          track: {
            background: trackColor,
            strokeWidth: strokeWidth,
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: "#444",
              opacity: 1,
              blur: 2,
            },
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              offsetY: -2,
              fontSize: fontSize,
              fontWeight: 600,
            },
          },
        },
      },
      grid: {
        padding: {
          top: -10,
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          shadeIntensity: shadeIntensity,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91],
        },
      },
      colors: colors,
      labels: [legendValues[0]?.label || "Average Results"],
    };
  }, [
    legendValues,
    chartHeight,
    startAngle,
    endAngle,
    trackColor,
    strokeWidth,
    fontSize,
    shadeIntensity,
  ]);

  /*   ACTIONS   */

  const handleCopy = () => {
    const data = {
      value: calculatedGaugeValue,
      label: legendValues[0]?.label || "Average Results",
      range: { min: startingRange, max: endingRange },
      settings: {
        chartHeight,
        startAngle,
        endAngle,
        trackColor,
        strokeWidth,
        fontSize,
        shadeIntensity,
      },
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
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
      category: "GAUGE",
      xAxis: JSON.stringify({
        labels: [],
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({
        gaugeValue: calculatedGaugeValue,
        chartHeight: chartHeight,
        startAngle: startAngle,
        endAngle: endAngle,
        trackColor: trackColor,
        strokeWidth: strokeWidth,
        fontSize: fontSize,
        shadeIntensity: shadeIntensity,
      }),
    };
    setIsDownloading(true);

    DownloadAndSaveCSVforModuleOneWidget(
      payload,
      getChartTitleId,
      widgetTitle,
      [],
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
        subtitle="Performance Intensity"
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
          legendValues.length > 0 && legendValues[0].label ? (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: legendValues[0].color }} />
              <span className="text-xs text-gray-500 font-medium">{legendValues[0].label}</span>
            </div>
          ) : undefined
        }
        footer={
          childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium">
              Click chart to view {childTiers.length} child tier{childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        <div className="relative">
          {isAllLegendFieldEmpty.length > 0 ? (
            <Chart
              options={chartOptions}
              series={[calculatedGaugeValue]}
              type="radialBar"
              height={chartHeight}
            />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">
              No data available.
            </div>
          )}
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
              <GaugeChart
                key={tier.id}
                widgetTitle={tier.name}
                legendValues={tier.legendValues}
                numOfLegendDataSet={tier.legendValues.length}
                startingRange={startingRange}
                endingRange={endingRange}
                gaugeValue={calculatedGaugeValue}
                chartHeight={chartHeight}
                startAngle={startAngle}
                endAngle={endAngle}
                trackColor={trackColor}
                strokeWidth={strokeWidth}
                fontSize={fontSize}
                shadeIntensity={shadeIntensity}
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
