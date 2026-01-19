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

/*       HELPER FUNCTIONS       */

const generateCandlestickData = (
  count: number,
  yrange: { min: number; max: number }
) => {
  const seriesData = [];
  const baseTime = new Date("2024-01-01").getTime();
  const interval = 1800000; // 30 minutes in milliseconds

  for (let i = 0; i < count; i++) {
    const timestamp = baseTime + i * interval;
    
    // Generate OHLC values (Open, High, Low, Close)
    const open = Math.random() * (yrange.max - yrange.min) + yrange.min;
    const variance = (yrange.max - yrange.min) * 0.05; // 5% variance
    
    const high = open + Math.random() * variance;
    const low = open - Math.random() * variance;
    const close = low + Math.random() * (high - low);

    seriesData.push({
      x: new Date(timestamp),
      y: [
        Math.round(open * 100) / 100,
        Math.round(high * 100) / 100,
        Math.round(low * 100) / 100,
        Math.round(close * 100) / 100,
      ],
    });
  }

  return seriesData;
};

const generateId = () =>
  crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

/*       COMPONENT       */

export default function CandleChart({
  widgetTitle = "My CSV",
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

  // Tier management states
  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   APEX CHART STATE   */
  const chartData: any = useMemo(() => {
    if (!xAxisValues.length) {
      return { series: [], options: {} };
    }

    const yrange = { min: startingRange, max: endingRange };
    const seriesData = generateCandlestickData(xAxisValues.length, yrange);

    // Use first legend color for candlestick colors if available
    const upColor = legendValues.length > 0 && legendValues[0].color
      ? legendValues[0].color
      : "#00B746";
    const downColor = legendValues.length > 1 && legendValues[1].color
      ? legendValues[1].color
      : "#EF403C";

    return {
      series: [
        {
          data: seriesData,
        },
      ],
      options: {
        chart: {
          type: "candlestick" as const,
          height: 350,
          toolbar: { show: false },
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: upColor,
              downward: downColor,
            },
          },
        },
        xaxis: {
          type: "datetime",
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
        yaxis: {
          min: startingRange,
          max: endingRange,
          tooltip: {
            enabled: true,
          },
          labels: {
            style: {
              fontSize: "12px",
            },
          },
        },
      },
    };
  }, [xAxisValues, legendValues, startingRange, endingRange]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(chartData.series, null, 2));
  };

  const handleDownload = () => {
    const csvId = generateId();

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
      category: "CANDLESTICK",
      xAxis: JSON.stringify({
        labels: xAxisValues,
        values: [],
      }),
      yAxis: JSON.stringify({}),
      zAxis: JSON.stringify({}),
    };
    setIsDownloading(true);

    // For CSV export
    const header = "Timestamp,Open,High,Low,Close";
    const rows: string[] = [];
    if (chartData.series[0]?.data) {
      chartData.series[0].data.forEach((point: any) => {
        const timestamp = new Date(point.x).toISOString();
        rows.push(
          `${timestamp},${point.y[0]},${point.y[1]},${point.y[2]},${point.y[3]}`
        );
      });
    }
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${widgetTitle}-${csvId}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    // Also save to backend
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
          legendValues.length > 0 && (
            <div className="flex gap-4">
              {legendValues[0]?.label && (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: legendValues[0].color }}
                  />
                  <span className="text-xs text-gray-500 font-medium">Up: {legendValues[0].label}</span>
                </div>
              )}
              {legendValues[1]?.label && (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: legendValues[1].color }}
                  />
                  <span className="text-xs text-gray-500 font-medium">Down: {legendValues[1].label}</span>
                </div>
              )}
            </div>
          )
        }
        footer={
          childTiers.length > 0 ? (
            <p className="text-sm text-blue-600 font-medium text-center">
              Click chart to view {childTiers.length} child tier{childTiers.length > 1 ? "s" : ""}
            </p>
          ) : undefined
        }
      >
        {chartData.series.length > 0 ? (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="candlestick"
            height={350}
          />
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-400">
            No data available, Please fill the input field to generate the chart
            and then download the csv.
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
              <CandleChart
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
