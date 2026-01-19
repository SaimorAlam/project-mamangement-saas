/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect, useRef } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import { useGetChartTitleIdMutation } from "@/store/Api/ProgramApi/ProgramApi";
import { DownloadAndSaveCSVforModuleOneWidget } from "@/utils/Download&SaveCSV";
import AddTierModal from "../Modal/AddTierModal";
import TierChartModal from "../Modal/TierChartModal";
import ChartCardWrapper from "./components/ChartCardWrapper";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

/*       TYPES       */

type DataPoint = {
  label: string;
  y: number;
};

export type TierChart = {
  id: string;
  name: string;
  xAxisValues: string[];
  children: TierChart[];
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
  isPreview?: boolean;
};

/*       COMPONENT       */

export default function ParetoChart({
  widgetTitle = "Customer Complaints",
  xAxisValues = [],
  startingRange,
  endingRange,
  onToggleWidget,
  tierLevel = 0,
  chartId = "root",
  onDelete,
  isPreview = false,
}: Props) {
  const [isDownloading, setIsDownloading] = useState(false);
  const chartRef = useRef<any>(null);

  const [showAddTierModal, setShowAddTierModal] = useState(false);
  const [childTiers, setChildTiers] = useState<TierChart[]>([]);
  const [showChildrenModal, setShowChildrenModal] = useState(false);

  const [getChartTitleId] = useGetChartTitleIdMutation();

  /*   DATA GENERATION   */
  const dataPoints: DataPoint[] = useMemo(() => {
    if (!xAxisValues.length) return [];

    const range = endingRange - startingRange;
    const step = range / xAxisValues.length;

    return xAxisValues
      .filter(Boolean)
      .map((label, index) => ({
        label,
        y: Math.round(endingRange - step * index),
      }))
      .sort((a, b) => b.y - a.y);
  }, [xAxisValues, startingRange, endingRange]);

  /*   TOTAL VALUE   */
  const totalValue = useMemo(() => {
    return dataPoints.reduce((sum, dp) => sum + dp.y, 0);
  }, [dataPoints]);

  /*   CREATE PARETO LINE   */
  const createParetoLine = (chart: any) => {
    if (!chart || !chart.data || !chart.data[0]) return;

    const dps: any[] = [];
    let yTotal = 0;
    let yPercent = 0;

    for (let i = 0; i < chart.data[0].dataPoints.length; i++) {
      yTotal += chart.data[0].dataPoints[i].y;
    }

    for (let i = 0; i < chart.data[0].dataPoints.length; i++) {
      const yValue = chart.data[0].dataPoints[i].y;
      yPercent += (yValue / yTotal) * 100;
      dps.push({
        label: chart.data[0].dataPoints[i].label,
        y: yPercent,
      });
    }

    chart.addTo("data", {
      type: "line",
      yValueFormatString: "0.##'%'",
      dataPoints: dps,
    });

    chart.data[1].set("axisYType", "secondary", false);
    chart.axisY[0].set("maximum", Math.round(yTotal / 20) * 20);
    chart.axisY2[0].set("maximum", 100);
  };

  /*   CHART OPTIONS   */
  const chartOptions = useMemo(
    () => ({
      title: {
        text: "", // Title handled by ChartCardWrapper
      },
      axisX: {
        title: "Categories",
        labelAngle: -45,
      },
      axisY: {
        title: "Count",
        lineColor: "#4F81BC",
        tickColor: "#4F81BC",
        labelFontColor: "#4F81BC",
      },
      axisY2: {
        title: "Cumulative %",
        suffix: "%",
        lineColor: "#C0504E",
        tickColor: "#C0504E",
        labelFontColor: "#C0504E",
      },
      data: [
        {
          type: "column",
          color: "#4F81BC",
          dataPoints: dataPoints,
        },
      ],
    }),
    [dataPoints]
  );

  /*   EFFECT TO CREATE PARETO   */
  useEffect(() => {
    if (chartRef.current && dataPoints.length > 0) {
      createParetoLine(chartRef.current);
    }
  }, [dataPoints]);

  /*   ACTIONS   */

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(dataPoints, null, 2));
  };

  const handleDownload = () => {
    const payload = {
      numberOfDataset: 1,
      firstFiledDataset: startingRange,
      lastFiledDAtaset: endingRange,
      showWidgets: [{ legend_name: "Pareto", color: "#4F81BC" }],
      title: widgetTitle,
      status: "ACTIVE",
      category: "PARETO",
      xAxis: JSON.stringify({
        labels: xAxisValues,
        values: dataPoints.map((dp) => dp.y),
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
      [{ label: "Pareto", field: "pareto", color: "#4F81BC" }]
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
        subtitle={`${dataPoints.length} categories`}
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
          <p className="text-sm text-gray-500">Total: {totalValue}</p>
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
        {dataPoints.length > 0 ? (
          <div style={{ height: "400px", width: "100%" }}>
            <CanvasJSChart
              options={chartOptions}
              onRef={(ref: any) => (chartRef.current = ref)}
            />
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center text-gray-400">
            No data available. Please add categories in the widget
            configuration.
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
              <ParetoChart
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
